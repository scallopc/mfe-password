import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  constructor(private http: HttpClient) {}

  validatePassword(password: string) {
    return this.http.post('http://localhost:3002/validate-password', {
      password,
    });
  }
}
