import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginData } from '../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  login() {
    const loginData: LoginData = {
      username: this.form.get('username').value,
      password: this.form.get('password').value,
    };

    this.authService.login(loginData).subscribe(
      () => {
        // this.authService.setLoginData(loginData);
        this.router.navigate(['main']);
        // localStorage.setItem('username', loginData.username);
        // localStorage.setItem('password', loginData.password);
      },
      (err) => {
        console.log('error', err.error.errorMessage);
        this.errorMessage = err.error.errorMessage;
      }
    );
  }
}
