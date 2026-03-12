import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { TokenResponse } from 'services';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {
  router = inject(Router);
  email = 'exemplo@email.com';
  password = '123456';
  loginSuccess = false;
  token = '';

  login() {
    this.simulateAuthCall().subscribe({
      next: (res: TokenResponse) => {
        localStorage.setItem('access_token', res.access_token);
        this.token = res.access_token;
        this.loginSuccess = true;
        console.log('TOKEN SALVO:', res.access_token);
      },
      error: (err: any) => {
        console.error('Erro na autenticação:', err);
        this.loginSuccess = false;
      },
    });
  }

  // Simulate the auth service method for testing
  simulateAuthCall(): Observable<TokenResponse> {
    return of({
      access_token: 'mock-token-123',
      token_type: 'Bearer',
      expires_in: 3600,
    });
  }

  logout() {
    console.log('Iniciando logout...');
    localStorage.removeItem('access_token');
    this.loginSuccess = false;
    this.token = '';
    console.log('Logout realizado, loginSuccess definido como false');
  }
}
