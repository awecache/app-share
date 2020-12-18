import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginData } from './models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginData: LoginData;

  constructor(private http: HttpClient) {}

  login(loginData: LoginData) {
    return this.http.post('/login', loginData);
  }

  getLoginData(): LoginData {
    return this.loginData;
  }
}
