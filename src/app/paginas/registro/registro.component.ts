import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../clasess/usuario';
import { Router } from '@angular/router';

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
  formularioValido = false; // Variable para controlar el estado del botón

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        direccion: ['', Validators.required],
        departamento: ['', Validators.required],
        //provincia: ['', Validators.required],
        distrito: ['', Validators.required],
        referencia: [''],
        role: ['cliente']
      },
      { updateOn: 'blur' } // ✅ Se validará cuando el usuario salga del campo
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
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.registroForm.updateValueAndValidity(); // 🔹 Forzar actualización de validación
      return;
    }

    const nuevoUsuario: Usuario = this.registroForm.value;
    console.log('Usuario registrado:', nuevoUsuario);
    alert('Registro exitoso');

    this.registroForm.reset();
    this.formularioValido = false; // 🔹 Resetear la variable para deshabilitar el botón después del registro
    // ✅ Guardamos el usuario en localStorage para auto-logueo
    localStorage.setItem('user', JSON.stringify(nuevoUsuario));

    // ✅ Redirigir al perfil después de registrarse
    this.router.navigate(['/perfil']);
  }

  campoInvalido(campo: string): boolean {
    const field = this.registroForm.get(campo);
    return !!(field && field.invalid && field.touched);
  }
}
