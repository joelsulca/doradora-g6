import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CuponService } from '../../shared/services/cupon.service';
import { Cupon } from '../../shared/interfaces/cupon.interface';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from '../../shared/services/pedido.service';
import { PedidoCrearPayload } from '../../shared/interfaces/pedido-crear.interface';
import { UsuarioLogin } from '../../shared/interfaces/usuario-login.interface';

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
  usuarioLogueado!: UsuarioLogin;
  metodoSeleccionado: string = "";
  metodosPago: string[] = ["Efectivo", "Tarjeta de Crédito", "Transferencia Bancaria"];
  cuponesDisponibles: Cupon[] = [];
  descuentoAplicado: boolean = false;
  errorCupon: string = "";
  minFechaEntrega: string = "";
  errorFecha: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cuponService: CuponService,
    private toastr: ToastrService,
    private pedidoService: PedidoService
  ) {
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

    // Validadores condicionales para los campos de tarjeta
    this.checkoutForm.get('metodoPago')?.valueChanges.subscribe((metodo) => {
      const tarjetaCtrl = this.checkoutForm.get('tarjeta');
      const expiracionCtrl = this.checkoutForm.get('expiracion');
      const cvvCtrl = this.checkoutForm.get('cvv');
      if (metodo === 'Tarjeta de Crédito') {
        tarjetaCtrl?.setValidators([Validators.required]);
        expiracionCtrl?.setValidators([Validators.required]);
        cvvCtrl?.setValidators([Validators.required]);
      } else {
        tarjetaCtrl?.clearValidators();
        expiracionCtrl?.clearValidators();
        cvvCtrl?.clearValidators();
      }
      tarjetaCtrl?.updateValueAndValidity();
      expiracionCtrl?.updateValueAndValidity();
      cvvCtrl?.updateValueAndValidity();
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
        nombre: `${this.usuarioLogueado.nombre} ${this.usuarioLogueado.apellido}`,
        direccion: this.usuarioLogueado.direccion,
        departamento: this.usuarioLogueado.ciudad,
        provincia: this.usuarioLogueado.ciudad,
        distrito: this.usuarioLogueado.distrito,
        referencia: this.usuarioLogueado.referencia
      });
    }
    // Obtener cupones desde la API
    this.cuponService.listarCupones().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.cuponesDisponibles = response.data;
        } else {
          this.cuponesDisponibles = [];
        }
      },
      error: () => {
        this.cuponesDisponibles = [];
      }
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
      this.errorCupon = "Ingresa un código de cupón.";
      return;
    }

    const cupon = this.cuponesDisponibles.find(c => c.codigo === codigoCupon && c.activo);
    if (cupon) {
      if (cupon.tipoDescuento.toLowerCase() === "porcentaje") {
        this.descuento = this.total * (cupon.valorDescuento / 100);
      } else {
        this.descuento = cupon.valorDescuento;
      }
      this.totalFinal = this.total - this.descuento;
      this.descuentoAplicado = true;
    } else {
      this.errorCupon = "Cupón inválido o expirado.";
    }
  }

  campoInvalido(campo: string): boolean {
    const field = this.checkoutForm.get(campo);
    return !!(field && field.invalid && field.touched);
  }

  procesarPedido() {
    if (this.checkoutForm.valid) {
      const fechaSeleccionada = this.checkoutForm.value.fechaEntrega;
      const programarEnvio = this.checkoutForm.value.programarEnvio;
      if (programarEnvio) {
        let fechaEntrega = new Date(fechaSeleccionada);
        let fechaMinima = new Date();
        fechaMinima.setDate(fechaMinima.getDate() + 2);
        if (fechaEntrega < fechaMinima) {
          this.errorFecha = "La fecha seleccionada debe ser al menos dentro de 48 horas.";
          return;
        }
      }

      const payload: any = {
        usuario_id: this.usuarioLogueado?.usuarioId,
        direccion_envio_id: 51,
        direccion_facturacion_id: 52,
        estado_id: 1,
        notas: this.checkoutForm.value.referencia,
        carrito: this.carrito.map((p: any) => ({
          producto_id: p.productoId,
          cantidad: p.cantidad,
          precio_unitario: p.precio
        }))
      };
      if (this.descuentoAplicado) {
        const cupon = this.cuponesDisponibles.find(c => c.codigo === this.checkoutForm.value.cupon && c.activo);
        if (cupon) {
          payload.cupon_id = cupon.cuponId;
          payload.descuento_monto = this.descuento;
        }
      }
      if (this.checkoutForm.value.programarEnvio && this.checkoutForm.value.fechaEntrega) {
        payload.fecha_entrega = this.checkoutForm.value.fechaEntrega + " 10:00:00";
      }
      this.pedidoService.crearPedido(payload).subscribe({
        next: (response) => {
          if (response.success) {
            localStorage.removeItem('carrito');
            this.toastr.success("¡Pedido realizado con éxito!", "Éxito");
            this.router.navigate(['/perfil']);
          } else {
            this.toastr.error(response.mensaje || "Error al crear el pedido", "Error");
          }
        },
        error: () => {
          this.toastr.error("Error de conexión al crear el pedido", "Error");
        }
      });
    } else {
      this.toastr.error("Por favor, completa todos los campos.", "Error");
    }
  }
}
