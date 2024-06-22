import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barranav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './barranav.component.html',
  styleUrl: './barranav.component.css'
})
export class BarranavComponent implements OnInit {
  constructor(private authService: AuthService, private ruta: Router) {}
  usuarioConectado = this.authService.obtenerUsuarioConectado();
  nombreUsuario: string | null = null; // Cambia el tipo de nombreUsuario
  mostrarCorreo: boolean = false;
  mostrarChat: boolean = false;

  ngOnInit() {
    this.usuarioConectado.subscribe(user => {
      if (user) {
        this.nombreUsuario = user.displayName;
        this.mostrarCorreo = true; // Mostrar el correo cuando el usuario esté conectado
        this.mostrarChat = true;
      } else {
        this.mostrarCorreo = false; // Ocultar el correo cuando el usuario no esté conectado
        this.mostrarChat = false;
      }
    });
  }

  logout() {
    this.authService.cerrarSesion();
    this.nombreUsuario = null; // Limpiar el correo cuando el usuario cierre sesión
    this.mostrarCorreo = false; // Ocultar el correo al cerrar sesión
    this.mostrarChat = false;
    this.ruta.navigate(['/login']);
  }
}
