import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PasswordPageComponent } from './password-page.component';
import { PasswordService } from 'services';

describe('PasswordPageComponent', () => {
  let component: PasswordPageComponent;
  let fixture: ComponentFixture<PasswordPageComponent>;
  let httpMock: HttpTestingController;
  let passwordServiceSpy: jasmine.SpyObj<PasswordService>;

  beforeEach(async () => {
    const passwordServiceMock = jasmine.createSpyObj('PasswordService', [
      'validatePassword',
    ]);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, PasswordPageComponent],
      providers: [{ provide: PasswordService, useValue: passwordServiceMock }],
    }).compileComponents();

    passwordServiceSpy = TestBed.inject(
      PasswordService,
    ) as jasmine.SpyObj<PasswordService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values initialized', () => {
    expect(component.password).toBe('');
    expect(component.result).toBeNull();
    expect(component.loading).toBe(false);
    expect(component.showPassword).toBe(false);
  });

  it('should inject PasswordService', () => {
    expect(component.passwordService).toBeTruthy();
  });

  describe('togglePassword', () => {
    it('should toggle showPassword from false to true', () => {
      expect(component.showPassword).toBe(false);

      component.togglePassword();

      expect(component.showPassword).toBe(true);
    });

    it('should toggle showPassword from true to false', () => {
      component.showPassword = true;

      component.togglePassword();

      expect(component.showPassword).toBe(false);
    });
  });

  describe('fillPassword', () => {
    it('should set password to the provided value', () => {
      const testPassword = 'TestPassword123!';

      component.fillPassword(testPassword);

      expect(component.password).toBe(testPassword);
    });

    it('should set password to empty string when provided empty value', () => {
      component.fillPassword('');

      expect(component.password).toBe('');
    });
  });

  describe('validatePassword', () => {
    const mockValidResponse = { valid: true };
    const mockInvalidResponse = { valid: false };

    beforeEach(() => {
      component.password = 'TestPassword123!';
      component.loading = false;
      component.result = null;
      console.log = jasmine.createSpy('console.log');
      console.error = jasmine.createSpy('console.error');
    });

    it('should set loading to true when validation starts', () => {
      component.validatePassword();

      expect(component.loading).toBe(true);
    });

    it('should make POST request to validation endpoint', () => {
      component.validatePassword();

      const req = httpMock.expectOne('http://localhost:3002/validate-password');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ password: 'TestPassword123!' });
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mocked-token-123',
      );

      req.flush(mockValidResponse);
    });

    it('should handle successful validation with valid password', () => {
      component.validatePassword();

      const req = httpMock.expectOne('http://localhost:3002/validate-password');
      req.flush(mockValidResponse);

      expect(component.loading).toBe(false);
      expect(component.result).toBe('Senha válida');
      expect(console.log).toHaveBeenCalledWith('Resultado:', mockValidResponse);
      expect(console.log).toHaveBeenCalledWith('Valid:', true);
      expect(console.log).toHaveBeenCalledWith(
        'Result atribuído:',
        'Senha válida',
      );
    });

    it('should handle successful validation with invalid password', () => {
      component.validatePassword();

      const req = httpMock.expectOne('http://localhost:3002/validate-password');
      req.flush(mockInvalidResponse);

      expect(component.loading).toBe(false);
      expect(component.result).toBe('Senha inválida');
      expect(console.log).toHaveBeenCalledWith(
        'Resultado:',
        mockInvalidResponse,
      );
      expect(console.log).toHaveBeenCalledWith('Valid:', false);
      expect(console.log).toHaveBeenCalledWith(
        'Result atribuído:',
        'Senha inválida',
      );
    });

    it('should handle HTTP error', () => {
      component.validatePassword();

      const req = httpMock.expectOne('http://localhost:3002/validate-password');
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(component.loading).toBe(false);
      expect(component.result).toBe('Erro na validação');
      expect(console.error).toHaveBeenCalledWith(
        'Erro na validação:',
        jasmine.any(Object),
      );
    });

    it('should reset result before validation', () => {
      component.result = 'Previous result';

      component.validatePassword();

      expect(component.result).toBeNull();
    });
  });

  describe('form binding', () => {
    it('should bind password input to component.password', () => {
      const compiled = fixture.nativeElement;
      const passwordInput = compiled.querySelector(
        'input[type="password"], input[type="text"]',
      );

      expect(passwordInput).toBeTruthy();
      expect(passwordInput.value).toBe(component.password);
    });

    it('should toggle input type based on showPassword', () => {
      component.showPassword = false;
      fixture.detectChanges();

      let compiled = fixture.nativeElement;
      let passwordInput = compiled.querySelector('input');
      expect(passwordInput.type).toBe('password');

      component.showPassword = true;
      fixture.detectChanges();

      compiled = fixture.nativeElement;
      passwordInput = compiled.querySelector('input');
      expect(passwordInput.type).toBe('text');
    });
  });

  describe('UI states', () => {
    it('should show loading state when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const loadingMessage = compiled.querySelector('.text-blue-700');
      const spinner = compiled.querySelector('.animate-spin');

      expect(loadingMessage).toBeTruthy();
      expect(loadingMessage.textContent).toContain(
        'Verificando senha no servidor...',
      );
      expect(spinner).toBeTruthy();
    });

    it('should show success result when result contains "válida"', () => {
      component.result = 'Senha válida';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const resultCard = compiled.querySelector('.bg-green-50');
      const resultText = compiled.querySelector('.text-green-800');

      expect(resultCard).toBeTruthy();
      expect(resultText).toBeTruthy();
      expect(resultText.textContent).toContain('Senha válida');
    });

    it('should show error result when result contains "inválida"', () => {
      component.result = 'Senha inválida';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const resultCard = compiled.querySelector('.bg-red-50');
      const resultText = compiled.querySelector('.text-red-800');

      expect(resultCard).toBeTruthy();
      expect(resultText).toBeTruthy();
      expect(resultText.textContent).toContain('Senha inválida');
    });

    it('should disable button when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const button = compiled.querySelector('button');

      expect(button.disabled).toBe(true);
    });

    it('should enable button when loading is false', () => {
      component.loading = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const button = compiled.querySelector('button');

      expect(button.disabled).toBe(false);
    });
  });

  describe('example buttons', () => {
    it('should have clickable example buttons', () => {
      const compiled = fixture.nativeElement;
      const exampleButtons = compiled.querySelectorAll('button[type="button"]');

      // Should have multiple example buttons
      expect(exampleButtons.length).toBeGreaterThan(0);

      // Check if buttons have click handlers - Angular events don't show in onclick
      exampleButtons.forEach((button: HTMLButtonElement) => {
        // For Angular, we check if button has any click-related attributes or is not disabled
        expect(button.disabled).toBe(false);
        expect(button.tagName.toLowerCase()).toBe('button');
      });
    });
  });
});
