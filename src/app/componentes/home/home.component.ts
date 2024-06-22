import { Component } from '@angular/core';
import { BarranavComponent } from '../barranav/barranav.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BarranavComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  usuarioConectado: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.obtenerUsuarioConectado().subscribe(usuario => {
      this.usuarioConectado = usuario;
    });
  }

}
