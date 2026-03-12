import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { AuthPageComponent } from './auth-page.component';
import { TokenResponse } from 'services';

describe('AuthPageComponent', () => {
  let component: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeAll(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, AuthPageComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup localStorage spies once
    localStorageSpy = jasmine.createSpyObj('Storage', [
      'setItem',
      'removeItem',
      'getItem',
    ]);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageSpy.removeItem);
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
  });

  beforeEach(() => {
    // Reset spies
    routerSpy.navigate.calls.reset();
    localStorageSpy.setItem.calls.reset();
    localStorageSpy.removeItem.calls.reset();
    localStorageSpy.getItem.calls.reset();

    fixture = TestBed.createComponent(AuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject Router', () => {
    expect(component.router).toBeTruthy();
  });

  it('should have default values initialized', () => {
    expect(component.email).toBe('exemplo@email.com');
    expect(component.password).toBe('123456');
    expect(component.loginSuccess).toBe(false);
    expect(component.token).toBe('');
  });

  describe('login', () => {
    const mockTokenResponse: TokenResponse = {
      access_token: 'test-token-123',
      token_type: 'Bearer',
      expires_in: 3600,
    };

    it('should call simulateAuthCall() when login() is called', () => {
      spyOn(component, 'simulateAuthCall').and.returnValue(
        of(mockTokenResponse),
      );

      component.login();

      expect(component.simulateAuthCall).toHaveBeenCalled();
    });

    it('should save token to localStorage on successful login', () => {
      spyOn(component, 'simulateAuthCall').and.returnValue(
        of(mockTokenResponse),
      );

      component.login();
      fixture.detectChanges(); // Trigger change detection

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'access_token',
        mockTokenResponse.access_token,
      );
      expect(component.token).toBe(mockTokenResponse.access_token);
      expect(component.loginSuccess).toBe(true);
    });

    it('should have router injected for navigation', () => {
      expect(component.router).toBeTruthy();
      expect(routerSpy.navigate).toBeDefined();
    });

    it('should handle login error', () => {
      spyOn(component, 'simulateAuthCall').and.returnValue(
        throwError(() => new Error('Auth error')),
      );

      console.error = jasmine.createSpy('console.error');
      component.login();

      expect(console.error).toHaveBeenCalledWith(
        'Erro na autenticação:',
        jasmine.any(Error),
      );
      expect(component.loginSuccess).toBe(false);
    });

    it('should log token to console on successful login', () => {
      spyOn(component, 'simulateAuthCall').and.returnValue(
        of(mockTokenResponse),
      );
      console.log = jasmine.createSpy('console.log');

      component.login();

      expect(console.log).toHaveBeenCalledWith(
        'TOKEN SALVO:',
        mockTokenResponse.access_token,
      );
    });
  });

  describe('form binding', () => {
    it('should have email input', () => {
      const emailInput = fixture.debugElement.query(
        By.css('input[type="email"]'),
      );
      expect(emailInput).toBeTruthy();
    });

    it('should have password input', () => {
      const passwordInput = fixture.debugElement.query(
        By.css('input[type="password"]'),
      );
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('UI states', () => {
    it('should show login success message when loginSuccess is true', () => {
      component.loginSuccess = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const successMessage = compiled.querySelector('.text-green-800');

      expect(successMessage).toBeTruthy();
      expect(successMessage.textContent).toContain(
        'Login realizado com sucesso!',
      );
    });

    it('should show token display when token is available', () => {
      component.token = 'test-token-123';
      component.loginSuccess = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const tokenDisplay = compiled.querySelector('.text-gray-700');

      expect(tokenDisplay).toBeTruthy();
      expect(tokenDisplay.textContent).toContain('test-token-123');
    });

    it('should disable form when loginSuccess is true', () => {
      component.loginSuccess = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');

      expect(form).toBeFalsy(); // Form is hidden when loginSuccess is true
    });

    it('should show form when loginSuccess is false', () => {
      component.loginSuccess = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      const successDiv = compiled.querySelector('.bg-green-50');

      expect(form).toBeTruthy();
      expect(successDiv).toBeFalsy();
    });
  });
});
