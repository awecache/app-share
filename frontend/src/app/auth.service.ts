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
    this.loginData = { ...loginData };

    return this.http.post('/login', loginData);
  }

  setLoginData(loginData: LoginData) {
    this.loginData = loginData;
  }

  getLoginData(): LoginData {
    return this.loginData;
  }
}
