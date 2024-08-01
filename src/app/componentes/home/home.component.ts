import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BarranavComponent } from '../barranav/barranav.component';
import { EspecialistaNavbarComponent } from '../especialista-navbar/especialista-navbar.component';
import { AuthService } from '../../services/auth.service';
import { fadeScaleAnimation } from '../../animacion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BarranavComponent, EspecialistaNavbarComponent, RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [fadeScaleAnimation, ],
})
export default class HomeComponent {
  id: string = '';
  esPaciente: boolean = false;
  cargando: boolean = true; // Nueva variable para controlar el estado de carga

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    let id = localStorage.getItem('logueado');
    this.esPaciente = localStorage.getItem('esPaciente') === 'true';

    if (id) {
      this.id = id;
      let pac = await this.authService.getUserByUidAndType(id, 'pacientes');
      if (pac != null) {
        this.esPaciente = true;
        localStorage.setItem('esPaciente', 'true');
      }
    }

    this.cargando = false; // Se establece a false después de cargar la identidad
  }
}
