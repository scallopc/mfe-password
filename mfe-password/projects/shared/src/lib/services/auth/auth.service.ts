import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getToken(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('http://localhost:3000/oauth/token', {
      client_id: 'frontend',
      client_secret: '123',
      grant_type: 'client_credentials',
    });
  }
}
