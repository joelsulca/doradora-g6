import { Routes } from '@angular/router';

import { NosotrosComponent } from './paginas/nosotros/nosotros.component';
import { ContactosComponent } from './paginas/contactos/contactos.component';
import { LoginComponent } from './paginas/login/login.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { CheckoutComponent } from './paginas/checkout/checkout.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { ProductosComponent } from './paginas/productos/productos.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { ProductosdetalleComponent } from './paginas/productosdetalle/productosdetalle.component';


export const routes: Routes = [
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'contactos', component: ContactosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'producto/:id', component: ProductosdetalleComponent },
  { path:'registro',component:RegistroComponent },
  { path: '', redirectTo: '/nosotros', pathMatch: 'full' },
];