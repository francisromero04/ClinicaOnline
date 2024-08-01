import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especialista-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './especialista-navbar.component.html',
  styleUrl: './especialista-navbar.component.css'
})
export class EspecialistaNavbarComponent implements OnInit {
  loggedUser = this.authService.obtenerUsuarioConectado();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

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
        this.authService.cerrarSesion();
        localStorage.removeItem('logueado');
        this.router.navigate(['/login']);
      }
    });
  }
}
