import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegistroService } from '../../shared/services/registro.service';
import { UsuarioRegistroPayload } from '../../shared/interfaces/usuario-registro.interface';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  departamentos: string[] = ['Lima', 'Arequipa', 'Cusco', 'Piura', 'La Libertad', 'Junín', 'Ancash'];
  distritosPorDepartamento: { [key: string]: string[] } = {
    'Lima': ['Miraflores', 'San Isidro', 'Surco', 'La Molina'],
    'Arequipa': ['Cercado', 'Yanahuara', 'Cayma', 'Paucarpata'],
    'Cusco': ['Cusco', 'San Sebastián', 'San Jerónimo', 'Wanchaq'],
    'Piura': ['Piura', 'Castilla', 'Sullana', 'Catacaos'],
    'La Libertad': ['Trujillo', 'El Porvenir', 'Florencia de Mora', 'Huanchaco'],
    'Junín': ['Huancayo', 'El Tambo', 'Chilca', 'San Jerónimo'],
    'Ancash': ['Huaraz', 'Carhuaz', 'Yungay', 'Chimbote']
  };
  distritos: string[] = [];
  formularioValido = false;
  mensaje: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registroService: RegistroService
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        direccion: ['', Validators.required],
        departamento: ['', Validators.required],
        distrito: ['', Validators.required],
        referencia: [''],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
        fechaNacimiento: ['', Validators.required],
        aceptaTerminos: [false, Validators.requiredTrue]
        // role: ['cliente']
      },
      { updateOn: 'blur' }
    );

    this.registroForm.valueChanges.subscribe(() => {
      this.formularioValido = this.registroForm.valid;
    });

    this.registroForm.get('departamento')?.valueChanges.subscribe(departamento => {
      this.distritos = this.distritosPorDepartamento[departamento] || [];
      this.registroForm.get('distrito')?.setValue('');
    });
  }

  registrarUsuario(): void {
    this.mensaje = '';
    this.error = '';
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.registroForm.updateValueAndValidity();
      return;
    }

    const form = this.registroForm.value;
    const payload: UsuarioRegistroPayload = {
      nombre: form.nombres,
      apellido: form.apellidos,
      correoElectronico: form.email,
      password: form.password,
      telefono: form.telefono,
      fechaNacimiento: form.fechaNacimiento,
      direccion: form.direccion,
      activo: true,
      correoConfirmado: true,
      referencia: form.referencia,
      rolId: 2
    };

    this.registroService.registrarUsuario(payload).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.mensaje = response.mensaje || 'Registro exitoso';
          this.registroForm.reset();
          this.formularioValido = false;
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.error = response.mensaje || 'Error en el registro';
        }
      },
      error: (err) => {
        this.error = err?.error?.mensaje || 'Error de conexión o datos inválidos';
      }
    });
  }

  campoInvalido(campo: string): boolean {
    const field = this.registroForm.get(campo);
    return !!(field && field.invalid && field.touched);
  }
}
