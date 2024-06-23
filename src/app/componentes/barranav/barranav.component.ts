import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../clases/paciente';
import { Especialista } from '../../clases/especialista';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barranav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './barranav.component.html',
  styleUrl: './barranav.component.css'
})
export class BarranavComponent implements OnInit {
  loggedUser = this.authService.obtenerUsuarioConectado();
  esPaciente: boolean = false;
  usuario: Especialista | Paciente | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.esPaciente = localStorage.getItem('esPaciente') === 'true';
    this.user();
  }

  async user() {
    let user = this.authService.obtenerUsuarioActual();
    if (user) {
      const especialista = await this.authService.getUserByUidAndType(
        user.uid,'especialistas'
      );
      const paciente = await this.authService.getUserByUidAndType(user.uid,'pacientes');
      if (especialista) {
        this.esPaciente = false;
        this.usuario = especialista;
        localStorage.setItem('esPaciente', 'false');
      }
      if (paciente) {
        this.esPaciente = true;
        this.usuario = paciente;
        localStorage.setItem('esPaciente', 'true');
      }
    }
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
        this.router.navigate(['/login']);
      }
    });
  }
}
