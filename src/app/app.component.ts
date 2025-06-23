import { Component } from '@angular/core';
import { MenumainComponent } from "./tools/menumain/menumain.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./tools/footer/footer.component";


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, MenumainComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LaDorada';
}
