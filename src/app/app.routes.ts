import { Routes } from '@angular/router';

import { NosotrosComponent } from './paginas/nosotros/nosotros.component';
import { ContactosComponent } from './paginas/contactos/contactos.component';
import { LoginComponent } from './paginas/login/login.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { CheckoutComponent } from './paginas/checkout/checkout.component';
import { RegistroComponent } from './paginas/registro/registro.component';


export const routes: Routes = [
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contactos', component: ContactosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'checkout', component: CheckoutComponent },
  {path:'registro',component:RegistroComponent},
  { path: '', redirectTo: '/nosotros', pathMatch: 'full' },
];