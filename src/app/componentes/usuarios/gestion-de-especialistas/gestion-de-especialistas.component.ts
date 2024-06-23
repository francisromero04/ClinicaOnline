import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Especialista } from '../../../clases/especialista';
import { AuthService } from '../../../services/auth.service';
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-gestion-de-especialistas',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminNavbarComponent],
  templateUrl: './gestion-de-especialistas.component.html',
  styleUrl: './gestion-de-especialistas.component.css'
})
export default class GestionDeEspecialistasComponent {
  especialistas: Especialista[] = [];
  loading: boolean = false;
  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.cargarEspecialistas();
    this.loading = false;
  }

  async cargarEspecialistas() {
    const especialistasData = await this.authService.obtenerEspecialistas();
    const especialidades = await this.authService.obtenerEspecialidades();

    this.especialistas = especialistasData.map((especialistaData: any) => {
      const especialidadesDelEspecialista = Array.isArray(
        especialistaData.especialidades
      )
        ? especialistaData.especialidades.map((especialidadId: string) => {
            const especialidad = especialidades.find(
              (esp: any) => esp.id === especialidadId
            );
            return especialidad
              ? especialidad.nombre
              : 'Especialidad Desconocida';
          })
        : [];

      return new Especialista(
        especialistaData.uid,
        especialistaData.nombre,
        especialistaData.apellido,
        especialistaData.edad,
        especialistaData.dni,
        especialidadesDelEspecialista,
        especialistaData.foto1,
        especialistaData.verificado
      );
    });
  }

  async aceptarEspecialista(especialista: Especialista): Promise<void> {
    try {
      await this.authService.actualizarVerificadoEspecialista(
        especialista.uid,
        'true'
      );
      especialista.verificado = 'true';
    } catch (error) {
      console.error('Error al aceptar al especialista: ', error);
      throw error;
    }
  }

  async rechazarEspecialista(especialista: Especialista) {
    try {
      await this.authService.actualizarVerificadoEspecialista(
        especialista.uid,
        'null'
      );
      especialista.verificado = 'null';
    } catch (error) {
      console.error('Error al rechazar al especialista: ', error);
      throw error;
    }
  }
}
