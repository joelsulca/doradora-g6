import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactosComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+ ]{9,15}$')]],
      message: ['', Validators.required],
      recaptcha: ['']
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log("Datos del Formulario:", this.contactForm.value);
      
      // Simular un envío con retraso de 2 segundos
      setTimeout(() => {
        alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
        this.contactForm.reset();
      }, 1000);
    }
  }
  campoInvalido(campo: string): boolean {
    const field = this.contactForm.get(campo);
    return !!(field && field.invalid && field.touched);
  }
}
