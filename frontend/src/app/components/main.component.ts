import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CameraService } from '../camera.service';
import { LoginData } from '../models';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  imagePath = '/assets/cactus.png';
  form: FormGroup;
  loginData: LoginData;

  constructor(
    private cameraSvc: CameraService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.cameraSvc.hasImage()) {
      const img = this.cameraSvc.getImage();
      this.imagePath = img.imageAsDataUrl;
    }
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    });
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    this.loginData = { username, password };
  }

  share() {
    const formData = new FormData();
    formData.set('title', this.form.get('title').value);
    formData.set('comments', this.form.get('comments').value);
    formData.set('username', this.loginData.username);
    formData.set('password', this.loginData.password);
    formData.set('image-file', this.cameraSvc.getImage().imageData);

    try {
      this.http.post('/upload', formData).subscribe(
        (data) => {
          console.log('successful upload', data);
          this.clear();
          this.form.reset();
        },
        (error) => {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
          this.clear();
          this.router.navigate(['/login']);
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error);
      this.clear();
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
  }

  clear() {
    this.imagePath = '/assets/cactus.png';
    this.form.reset();
  }
}
