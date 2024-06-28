import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Turno } from '../../clases/turno';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-listaturnosdisponibles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listaturnosdisponibles.component.html',
  styleUrl: './listaturnosdisponibles.component.css'
})
export class ListaturnosdisponiblesComponent implements OnInit, OnChanges{
  @Input() especialista: string | undefined;
  @Input() especialidad: string | undefined;
  @Output() turnoSeleccionado = new EventEmitter<{ dia: string; hora: string }>();
  especialistaData: any;
  diasDisponibles: { dia: Date; horarios: string[] }[] = [];
  spinnerDeCarga: boolean = false;
  diaSeleccionado: string | undefined;
  horaSeleccionada: string | undefined;

  constructor(private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.spinnerDeCarga = true;
    if (this.especialista) {
      this.especialistaData = await this.auth.getUserByUidAndType(
        this.especialista,
        'especialistas'
      );
      console.log(this.especialistaData);
    }
    this.diasDisponibles = await this.obtenerDiasDisponibles();
    if (this.diasDisponibles.length == 0) {
      this.turnoSeleccionado.emit({
        dia: '',
        hora: '',
      });
    }
    this.spinnerDeCarga = false;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['especialista']) {
      // const previo = changes['especialista'].previousValue;
      const actual = changes['especialista'].currentValue;
      this.especialista = actual;
      this.spinnerDeCarga = true;
      if (this.especialista) {
        this.especialistaData = await this.auth.getUserByUidAndType(
          this.especialista,
          'especialistas'
        );
      }
      this.diasDisponibles = await this.obtenerDiasDisponibles();
      this.spinnerDeCarga = false;
    }
  }

  seleccionarTurno() {
    if (this.diaSeleccionado && this.horaSeleccionada) {
      this.turnoSeleccionado.emit({
        dia: this.diaSeleccionado,
        hora: this.horaSeleccionada,
      });
    }
  }

  obtenerFechaFormateada(fecha: Date): string {
    const opcionesFecha = {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    } as any;
    return fecha.toLocaleDateString('es-ES', opcionesFecha);
  }

  seleccionarHora(dia: Date, hora: string): void {
    let fecha =  this.obtenerFechaFormateada(dia);
    this.diaSeleccionado = fecha;
    this.horaSeleccionada = hora;
    this.seleccionarTurno();
  }

  async obtenerDiasDisponibles(): Promise<{ dia: Date; horarios: string[] }[]> {
    const today = new Date();
    const diasDisponibles = [];
    // Obtener todos los turnos del especialista a la vez
    const todosLosTurnos = this.especialista
      ? await this.auth.obtenerTurnos(this.especialista)
      : [];

    for (let i = 0; i < 16; i++) {
      const dia = new Date(today);
      dia.setDate(today.getDate() + i);

      if (dia.getDay() === 0) {
        continue;
      }

      // Si el día es sábado, ajustar los horarios disponibles
      let horariosPosibles;
      if (dia.getDay() === 6) {
        horariosPosibles = this.obtenerHorariosDisponibles('sabado');
      } else {
        const horariosManana = this.obtenerHorariosDisponibles('mañana');
        const horariosTarde = this.obtenerHorariosDisponibles('tarde');
        horariosPosibles = horariosManana.concat(horariosTarde);
      }

      // Filtrar los turnos del especialista para el día actual
      const turnosDelDia = todosLosTurnos.filter((turno) =>
        this.mismoDia(turno.fecha, dia)
      );

      // Convertir los horarios tomados en un Set para acelerar las búsquedas
      const horariosTomados = new Set(turnosDelDia.map((turno) => turno.hora));

      // Filtrar los horarios que ya están tomados
      const horariosDisponibles = horariosPosibles.filter(
        (horario) => !horariosTomados.has(horario)
      );

      // Solo agregar el día a la lista si hay al menos un horario disponible
      if (horariosDisponibles.length > 0) {
        diasDisponibles.push({ dia, horarios: horariosDisponibles });
      }
    }
    return diasDisponibles;
  }

  mismoDia(timestamp: any, dia: Date): boolean {
    const turnoFecha = this.convertirTimestampADate(timestamp);
    return (
      turnoFecha.getDate() === dia.getDate() &&
      turnoFecha.getMonth() === dia.getMonth() &&
      turnoFecha.getFullYear() === dia.getFullYear()
    );
  }

  convertirTimestampADate(timestamp: any): Date {
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }

  async obtenerTurnosDelEspecialista(dia: Date): Promise<Turno[]> {
    if (!this.especialista) {
      return [];
    }
    const turnos = await this.auth.obtenerTurnos(this.especialista);
    return turnos.filter((turno) => {
      const turnoFecha = this.convertirTimestampADate(turno.fecha);
      return (
        turnoFecha.getDate() === dia.getDate() &&
        turnoFecha.getMonth() === dia.getMonth() &&
        turnoFecha.getFullYear() === dia.getFullYear()
      );
    });
  }

  /// MAÑANA 8 A 13 HS Y TARDE 14 A 19 HS
  obtenerHorariosDisponibles(periodo: string): string[] {
    let horariosDisponibles: string[] = [];
    if (this.especialistaData && this.especialistaData.turnos) {
      const turnoEspecialista = this.especialistaData.turnos.find(
        (turno: any) => turno.especialidad === this.especialidad
      );
      if (turnoEspecialista?.turno === periodo) {
        if (periodo === 'mañana') {
          horariosDisponibles = Array.from({ length: 6 }, (_, index) => {
            const hora = 8 + index;
            return `${hora}:00`;
          });
        } else if (periodo === 'tarde') {
          horariosDisponibles = Array.from({ length: 6 }, (_, index) => {
            const hora = 14 + index;
            return `${hora}:00`;
          });
        }
      }
      if (periodo === 'sabado' && turnoEspecialista?.turno === 'mañana') {
        horariosDisponibles = Array.from({ length: 7 }, (_, index) => {
          const hora = 8 + index;
          return `${hora}:00`;
        });
      }
    }
    return horariosDisponibles;
  }
}
