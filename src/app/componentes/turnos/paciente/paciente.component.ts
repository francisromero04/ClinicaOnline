import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { Turno } from '../../../clases/turno';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BarranavComponent } from '../../barranav/barranav.component';
//enc

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, BarranavComponent],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export default class PacienteComponent {
  turnos: any[] = [];
  turnoA: Turno | null = null;
  comentario: boolean = false;
  resena: boolean = false;
  calificar: boolean = false;
  encuesta: boolean = false;
  motivoCancelacion: string = '';
  turnoCalificado: string = '';
  datoResena: string = '';
  datoComentario: string = '';
  @Input() pacienteId: string = '';
  loading : boolean = false;

  @ViewChild('filtro') filtro!: ElementRef;

  private _turnos = new BehaviorSubject<any[]>([]);
  turnosFiltrados = this._turnos
  .asObservable()
  .pipe(
    map((turnos) => {
      if (this.filtro && this.filtro.nativeElement) {
        const filtro = this.filtro.nativeElement.value.toLowerCase();
        return turnos.filter((turno) => {
          return Object.keys(turno).some((key) => {
            const val = turno[key];
            if (key === 'historiaClinica' && val !== null && typeof val === 'object') {
              // Buscar dentro del objeto de historial clínico
              return Object.values(val).some((clinicaVal: any) => {
                if (clinicaVal && typeof clinicaVal === 'object') {
                  // Si es un objeto (clave-valor), buscar dentro de los valores
                  return Object.values(clinicaVal).some((nestedVal: any) =>
                    nestedVal.toString().toLowerCase().includes(filtro)
                  );
                } else {
                  // Si no es un objeto, buscar normalmente
                  return clinicaVal.toString().toLowerCase().includes(filtro);
                }
              });
            } else {
              // Buscar en otros valores del turno
              return val && val.toString().toLowerCase().includes(filtro);
            }
          });
        });
      } else {
        return turnos;
      }
    })
  );

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.spinner.show();
    await this.cargarTurnos();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.loading = false;
  }

  async cargarTurnos() {
    if (this.pacienteId !== '') {
      let turnos = await this.authService.obtenerTurnosDelUsuario(
        this.pacienteId,
        'paciente'
      );
      let especialidades = await this.authService.obtenerEspecialidades();

      for (let turno of turnos) {
        let especialidad = especialidades.find(
          (especialidad) => especialidad.id === turno.idEspecialidad
        );
        turno.Especialidad = especialidad.nombre;
        turno.idEspecialidad = especialidad.id;
        let especialista = await this.authService.getUserByUidAndType(
          turno.idEspecialista,
          'especialistas'
        );

        turno.Especialista = especialista.nombre;
        turno.idEspecialista = especialista.uid;
      }
      this._turnos.next(turnos);
    }
  }

  filtrarTurnos() {
    this._turnos.next(this._turnos.value);
  }

  obtenerFechaHoraFormateada(fecha: any, hora: string): string {
    const fechaFormateada = fecha.toDate().toLocaleDateString('es-AR');
    return `${fechaFormateada} ${hora}`;
  }

  async cancelarTurno() {
    if (this.turnoA && this.motivoCancelacion != '') {
      console.log(this.motivoCancelacion);
      this.turnoA.estado = 'cancelado';
      this.turnoA.comentario = this.motivoCancelacion;
      try {
        console.log(this.turnoA);
        await this.authService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Turno cancelado',
          text: 'El turno fue cancelado con éxito.',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un problema',
          text: 'El turno NO pudo ser cancelado con éxito.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.turnoA = null;
      this.comentario = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un problema',
        text: 'El turno NO pudo ser cancelado con éxito.',
        showConfirmButton: false,
        timer: 1500,
      });
      this.turnoA = null;
      this.comentario = false;
    }
  }

  cargarComentario(turno: Turno) {
    this.comentario = false;
    this.resena = false;
    this.calificar = false;
    this.encuesta = false;

    this.motivoCancelacion = '';
    this.comentario = true;
    this.turnoA = turno;
  }


  cargarAtencion(turno: Turno) {
    this.comentario = false;
    this.resena = false;
    this.calificar = false;
    this.encuesta = false;

    this.turnoCalificado = '';
    this.calificar = true;
    this.turnoA = turno;
  }

  verResena(turno: Turno) {
    this.comentario = false;
    this.resena = false;
    this.calificar = false;
    this.encuesta = false;

    this.turnoA = null;
    this.turnoA = turno;
    this.resena = true;
    this.datoResena = turno.resena;
    this.datoComentario = turno.comentario;
  }
  ocultarResena() {
    this.resena = false;
  }

  async manejarEncuestaEnviada(id: string) {
    console.log('Encuesta enviada:', id);
    if (this.turnoA) {
      this.turnoA.encuesta = id;
      try {
        console.log(this.turnoA);
        await this.authService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Encuesta enviada',
          text: 'La encuesta fue enviada con éxito.',
          showConfirmButton: false,
          timer: 1500,
        });
        this.encuesta = false;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un problema',
          text: 'La encuesta NO pudo enviarse con éxito.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  }

  completarEncuesta(turno: Turno) {
    this.comentario = false;
    this.resena = false;
    this.calificar = false;
    this.encuesta = false;

    this.encuesta = true;
    this.turnoA = turno;
  }
TEST(turno:Turno){
  console.log(turno);
}
  async calificarAtencion() {
    if (this.turnoA && this.turnoCalificado != '') {
      console.log(this.turnoCalificado);
      this.turnoA.atencion = this.turnoCalificado;
      try {
        console.log(this.turnoA);
        await this.authService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Calificacion guardada',
          text: 'La calificacion ha sido guardada con éxito.',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un problema',
          text: 'NO se ha podido calificar con éxito.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.turnoA = null;
      this.calificar = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un problema',
        text: 'La atención no ha sido calificada.',
        showConfirmButton: false,
        timer: 1500,
      });
      this.turnoA = null;
      this.calificar = false;
    }
  }
}
