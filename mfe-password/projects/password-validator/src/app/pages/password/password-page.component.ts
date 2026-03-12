import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordService } from 'services';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface PasswordValidationResponse {
  valid: boolean;
}

@Component({
  selector: 'app-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-page.component.html',
})
export class PasswordPageComponent {
  password = '';
  result: string | null = null;
  loading = false;
  showPassword = false;
  passwordService = inject(PasswordService);

  constructor(@Inject(HttpClient) private http: HttpClient) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  fillPassword(examplePassword: string) {
    this.password = examplePassword;
  }

  validatePassword() {
    this.loading = true;
    this.result = null;

    const headers = new HttpHeaders({
      Authorization: 'Bearer mocked-token-123',
    });

    this.http
      .post<PasswordValidationResponse>(
        'http://localhost:3002/validate-password',
        { password: this.password },
        { headers },
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.result =
            response.valid === true ? 'Senha válida' : 'Senha inválida';
          console.log('Resultado:', response);
          console.log('Valid:', response.valid);
          console.log('Result atribuído:', this.result);
        },
        error: (err) => {
          this.loading = false;
          console.error('Erro na validação:', err);
          this.result = 'Erro na validação';
        },
      });
  }
}

//Senha válida exemplo: AbTp9!fok
//Senha inválida exemplo (menos de 9 caracteres): AbTp9!
//Senha inválida exemplo (repetição): AbTp9!foo
//Senha inválida exemplo (sem caractere especial): AbTp9foki
