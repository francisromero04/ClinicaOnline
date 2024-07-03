import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Turno } from '../../../clases/turno';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-seccionturnosadmin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent, RouterOutlet],
  templateUrl: './seccionturnosadmin.component.html',
  styleUrl: './seccionturnosadmin.component.css'
})
export default class SeccionturnosadminComponent {
  turnos: any[] = [];
  turnoA: Turno | null = null;
  comentario: boolean = false;
  motivoCancelacion: string = '';
  loading : boolean = false;
  @ViewChild('filtro') filtro!: ElementRef;

  private _turnos = new BehaviorSubject<any[]>([]);
  turnosFiltrados!: Observable<any[]>;

  ngAfterViewInit() {
    this.spinner.show();
    setTimeout(() => {
      this.turnosFiltrados = this._turnos.asObservable().pipe(
        map((turnos) => {
          let filtro = this.filtro.nativeElement.value.toLowerCase();
          return turnos.filter((turno) => {
            let especialidad = turno.Especialidad.toLowerCase();
            let especialista = turno.Especialista.toLowerCase();
            return (
              especialidad.includes(filtro) || especialista.includes(filtro)
            );
          });
        })
      );
      this.spinner.hide();
    }, 4500);
  }

  constructor(
    private firestoreService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    this.loading = true;
    await this.cargarTurnos();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.loading = false;
  }

  async cargarTurnos() {
    let turnos = await this.firestoreService.obtenerTodosLosTurnos();
    let especialidades = await this.firestoreService.obtenerEspecialidades();
    let especialistas = await this.firestoreService.obtenerEspecialistas();
    let pacientes = await this.firestoreService.getAllPacientes();
    let mapEspecialistas: { [key: string]: any } = {};
    let mapPacientes: { [key: string]: any } = {};

    especialistas.forEach((especialista) => {
      mapEspecialistas[especialista.uid] = especialista;
    });

    pacientes.forEach((paciente: any) => {
      mapPacientes[paciente.uid] = paciente;
    });

    for (let turno of turnos) {
      let especialidad = especialidades.find(
        (especialidad) => especialidad.id === turno.idEspecialidad
      );
      turno.Especialidad = especialidad.nombre;
      turno.idEspecialidad = especialidad.id;

      let especialista = mapEspecialistas[turno.idEspecialista];
      turno.Especialista = especialista.nombre + ' ' + especialista.apellido;
      turno.idEspecialista = especialista.uid;

      let paciente = mapPacientes[turno.idPaciente];
      turno.Paciente = paciente.nombre + ' ' + paciente.apellido;
      turno.idPaciente = paciente.uid;
    }

    this._turnos.next(turnos);
  }

  filtrarTurnos() {
    this._turnos.next(this._turnos.value);
  }

  // obtenerFechaHoraFormateada(fecha: any, hora: string): string {
  //   const fechaFormateada = fecha.toDate().toLocaleDateString('es-AR');
  //   return `${fechaFormateada} ${hora}`;
  // }

  async cancelarTurno() {
    if (this.turnoA && this.motivoCancelacion != '') {
      console.log(this.motivoCancelacion);
      this.turnoA.estado = 'cancelado';
      this.turnoA.comentario = this.motivoCancelacion;
      try {
        console.log(this.turnoA);
        await this.firestoreService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Turno cancelado',
          text: 'el turno ha sido cancelado..',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema',
          text: 'el turno no ha sido cancelado..',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.turnoA = null;
      this.comentario = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema',
        text: 'el turno no ha sido cancelado..',
        showConfirmButton: false,
        timer: 1500,
      });
      this.turnoA = null;
      this.comentario = false;
    }
  }

  cargarComentario(turno: Turno) {
    this.motivoCancelacion = '';
    this.comentario = true;
    this.turnoA = turno;
  }
}
