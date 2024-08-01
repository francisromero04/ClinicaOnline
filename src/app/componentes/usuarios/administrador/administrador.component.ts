import { Component } from '@angular/core';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { RouterOutlet } from '@angular/router';
import { fadeScaleAnimation } from '../../../animacion';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [AdminNavbarComponent, RouterOutlet],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css',
  animations: [fadeScaleAnimation],
})
export class AdministradorComponent {

}
