import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {
    // Si ya hay un usuario logueado, redirigir al perfil
    if (localStorage.getItem('user')) {
      this.router.navigate(['/perfil']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.get<any[]>('json/user.json').subscribe(users => {
        const user = users.find(u =>
          u.username === this.loginForm.value.username &&
          u.password === this.loginForm.value.password
        );

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/perfil']);
        } else {
          this.errorMessage = "Usuario o contraseña incorrectos.";
        }
      });
    }
  }

  forgotPassword() {
    const username = this.loginForm.value.username;
    if (!username) {
      alert("Ingrese su usuario para recuperar la contraseña.");
      return;
    }

    this.http.get<any[]>('json/user.json').subscribe(users => {
      const user = users.find(u => u.username === username);

      if (user) {
        alert(`Se ha enviado un enlace de recuperación al correo: ${user.email}`);
      } else {
        alert("Usuario no encontrado.");
      }
    });
  }

  toggleAuthMode() {
    this.router.navigate(['/registro']);
  }
}
