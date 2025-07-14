import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
  captchaPregunta = '';
  captchaRespuesta = '';
  captchaCorrecto = false;
  private captchaValor = 0;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      captcha: ['', Validators.required]
    });
    this.generarCaptcha();
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/perfil']);
    }
  }

  generarCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    this.captchaValor = a + b;
    this.captchaPregunta = `¿Cuánto es ${a} + ${b}?`;
    this.captchaRespuesta = '';
    this.captchaCorrecto = false;
    this.loginForm.get('captcha')?.reset();
  }

  validarCaptcha() {
    this.captchaCorrecto = Number(this.loginForm.value.captcha) === this.captchaValor;
  }

  onSubmit() {
    this.errorMessage = '';
    this.validarCaptcha();
    if (!this.captchaCorrecto) {
      this.errorMessage = 'Captcha incorrecto. Inténtalo de nuevo.';
      this.generarCaptcha();
      return;
    }
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.data));
            this.router.navigate(['/perfil']);
          } else {
            this.errorMessage = response.mensaje || 'Usuario o contraseña incorrectos.';
            this.generarCaptcha();
          }
        },
        error: () => {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          this.generarCaptcha();
        }
      });
    }
  }

  forgotPassword() {
    const username = this.loginForm.value.username;
    if (!username) {
      this.toastr.warning('Ingrese su correo electrónico para recuperar la contraseña.', 'Atención');
      return;
    }
    if (this.loginForm.get('username')?.invalid) {
      this.toastr.error('Ingrese un correo electrónico válido.', 'Error');
      return;
    }
    this.toastr.success('Se ha enviado un correo para recuperar su contraseña.', 'Recuperación de contraseña');
  }

  toggleAuthMode() {
    this.router.navigate(['/registro']);
  }
}
