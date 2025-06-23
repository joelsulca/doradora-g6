import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [CommonModule,ReactiveFormsModule]
})

export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  total: number = 0;
  totalFinal: number = 0;
  descuento: number = 0;
  usuarioLogueado: any;
  metodoSeleccionado: string = "";
  metodosPago: string[] = ["Efectivo", "Tarjeta de Crédito", "Transferencia Bancaria"];
  cuponesDisponibles: any[] = [];
  descuentoAplicado: boolean = false;
  errorCupon: string = "";
  minFechaEntrega: string = "";
  errorFecha: string = "";

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    
    this.checkoutForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      referencia: ['', Validators.required],
      metodoPago: ['', Validators.required],
      tarjeta: [''],
      expiracion: [''],
      cvv: [''],
      cupon:[''],
      programarEnvio: [false],
      fechaEntrega: ['']
    });
  }
  carrito: any[] = [];
  ngOnInit() {

    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.total = this.carrito.reduce((total: number, p: any) => total + (p.precio * p.cantidad), 0);
    this.totalFinal = this.total;
    

    const userData = localStorage.getItem('user');
    if (userData) {
      this.usuarioLogueado = JSON.parse(userData);
      this.checkoutForm.patchValue({
        nombre: `${this.usuarioLogueado.nombres} ${this.usuarioLogueado.apellidos}`,
        direccion: this.usuarioLogueado.direccion,
        departamento: this.usuarioLogueado.departamento,
        provincia: this.usuarioLogueado.provincia,
        distrito: this.usuarioLogueado.distrito,
        referencia: this.usuarioLogueado.referencia
      });
    }
    this.http.get<any[]>('/json/cupones.json').subscribe(cupones => {
      this.cuponesDisponibles = cupones;
    });
    // Configurar la fecha mínima de entrega (48 horas después del momento actual)
    this.setMinFechaEntrega();
  }
  setMinFechaEntrega() {
    let fecha = new Date();
    fecha.setDate(fecha.getDate() + 2); // 48 horas después
    this.minFechaEntrega = fecha.toISOString().split('T')[0];
  }

  toggleProgramacion() {
    if (!this.checkoutForm.value.programarEnvio) {
      this.checkoutForm.patchValue({ fechaEntrega: '' });
      this.errorFecha = "";
    }
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }

  validarCupon() {
    const codigoCupon = this.checkoutForm.value.cupon.trim();
    this.errorCupon = "";
    this.descuento = 0;
    this.descuentoAplicado = false;

    if (!codigoCupon) {
      this.errorCupon = "❌ Ingresa un código de cupón.";
      return;
    }

    const cupon = this.cuponesDisponibles.find(c => c.codigo === codigoCupon && c.activo);
    
    if (cupon) {
      this.descuento = cupon.tipo === "porcentaje" ? (this.total * cupon.descuento / 100) : cupon.descuento;
      this.totalFinal = this.total - this.descuento;
      this.descuentoAplicado = true;
    } else {
      this.errorCupon = "❌ Cupón inválido o expirado.";
    }
  }

  procesarPedido() {
    if (this.checkoutForm.valid) {
      const fechaSeleccionada = this.checkoutForm.value.fechaEntrega;
      const programarEnvio = this.checkoutForm.value.programarEnvio;

      // Validar fecha si se ha programado el envío
      if (programarEnvio) {
        let fechaEntrega = new Date(fechaSeleccionada);
        let fechaMinima = new Date();
        fechaMinima.setDate(fechaMinima.getDate() + 2); // 48 horas después

        if (fechaEntrega < fechaMinima) {
          this.errorFecha = "❌ La fecha seleccionada debe ser al menos dentro de 48 horas.";
          return;
        }
      }
      const pedido = {
        id: Math.floor(Math.random() * 1000000),
        usuario: this.usuarioLogueado ? this.usuarioLogueado.username : "Invitado",
        idusuario: this.usuarioLogueado ? this.usuarioLogueado.id : 0,
        fecha: new Date().toISOString().split('T')[0],
        total: this.totalFinal,
        estado: "Pendiente",
        metodoPago: this.checkoutForm.value.metodoPago,
        programarEnvio: programarEnvio,
        fechaEntrega: programarEnvio ? fechaSeleccionada : "Entrega en 48 horas",
        datosEnvio: this.checkoutForm.value
      };

      this.http.get<any[]>('json/pedidos.json').subscribe(pedidos => {
        pedidos.push(pedido);
        this.http.post('json/pedidos.json', pedidos).subscribe(() => {
          localStorage.removeItem('carrito'); // Vaciar carrito después de la compra
          alert("✅ ¡Pedido realizado con éxito!");
          this.router.navigate(['/perfil']);
        });
      });
    } else {
      alert("❌ Por favor, completa todos los campos.");
    }
  }
}
