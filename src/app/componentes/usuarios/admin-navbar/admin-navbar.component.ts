import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent{
  constructor(private authService: AuthService, private router: Router) {}

  usuarioConectado = this.authService.obtenerUsuarioConectado();
  nombreUsuario: string | null = null; // Cambia el tipo de nombreUsuario
  mostrarNombre: boolean = false;

  ngOnInit() {
    this.usuarioConectado.subscribe(user => {
      if (user) {
        this.nombreUsuario = user.displayName;
        this.mostrarNombre = true;
      } else {
        this.mostrarNombre = false;
      }
    });
  }

  logOut() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, cerramos la sesión
        this.authService.cerrarSesion();
        localStorage.removeItem('logueado');
        localStorage.removeItem('admin');
        this.router.navigate(['/login']);
      }
    });
  }
}
