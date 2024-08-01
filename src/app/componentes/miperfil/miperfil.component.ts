import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Turno } from '../../clases/turno';
import { Especialista } from '../../clases/especialista';
import { Horario } from '../../clases/horario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import { BarranavComponent } from '../barranav/barranav.component';
import { AdminNavbarComponent } from '../usuarios/admin-navbar/admin-navbar.component';
import { EspecialistaNavbarComponent } from '../especialista-navbar/especialista-navbar.component';
import { fadeScaleAnimation } from './../../animacion';

@Component({
  selector: 'app-miperfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarranavComponent,
    EspecialistaNavbarComponent,
    AdminNavbarComponent,
    RouterOutlet,
  ],
  templateUrl: './miperfil.component.html',
  styleUrl: './miperfil.component.css',
  animations: [fadeScaleAnimation]
})
export default class MiPerfilComponent implements OnInit {
  identidad: string | null = '';
  usuario: any = null;
  horario: { [key: string]: string } = {};
  mostrarHorarios = false;
  estadoInicialHorarios: any;
  filtrar: boolean = false;
  especialistaSeleccionado: boolean = false;
  historiasClinicas: Turno[] = [];
  especialistasT: Especialista[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.user();
    this.identidad = localStorage.getItem('identidad');
    if (this.identidad == 'paciente') {
      await this.cargar();
    }
    this.loading = false;
  }

  async cargar() {
    let historiasClinicasA = await this.authService.obtenerTurnosDelUsuario(
      this.usuario.uid,
      'paciente'
    );
    let especialidades = await this.authService.obtenerEspecialidades();
    let especialistas = await this.authService.obtenerEspecialistas();
    for (const historia of historiasClinicasA) {
      historia.Especialista =
        especialistas.find((e) => e.uid === historia.idEspecialista)?.nombre ||
        'Desconocido';
      historia.Especialidad =
        especialidades.find((e) => e.id === historia.idEspecialidad)?.nombre ||
        'Desconocido';
      historia.Paciente = this.usuario.nombre;
    }

    this.historiasClinicas = historiasClinicasA.filter(
      (historia) => historia.historiaClinica !== null
    );

    for (const historia of this.historiasClinicas) {
      let especialistaObj =
        especialistas.find((e) => e.uid === historia.idEspecialista) || null;

      if (especialistaObj && !this.especialistasT.includes(especialistaObj)) {
        this.especialistasT.push(especialistaObj);
      }
    }
  }

  async filtrarEspecialistas(especialistaUid: string) {
    let filtro = this.historiasClinicas.filter(
      (historia) => historia.idEspecialista == especialistaUid
    );
    console.log(filtro);
    await this.createPDF(filtro);
  }

  guardar() {
    this.usuario.turnos = [];
    for (let especialidadId in this.horario) {
      let turno = this.horario[especialidadId];
      let nuevoHorario = {
        especialidad: especialidadId,
        especialista: this.usuario.uid,
        turno: turno,
      };
      this.usuario.turnos.push(nuevoHorario);
    }
    this.authService.actualizarHorariosEspecialista(
      this.usuario.uid,
      this.usuario.turnos
    );
    this.estadoInicialHorarios = { ...this.horario };
  }

  sonIguales(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  verhistorias() {
    this.createPDF(this.historiasClinicas);
  }

  verhistoriasFiltrada() {
    this.filtrar = !this.filtrar;
  }

  convertImageToBase64(imagen: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(imagen, { responseType: 'blob' }).subscribe((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data as string);
        };
        reader.onerror = () => {
          reject('Error al leer la imagen');
        };
        reader.readAsDataURL(blob);
      }, reject);
    });
  }

  async createPDF(historiasPruebaPdf: Turno[]) {
    let imagen = await this.convertImageToBase64('assets/img/fotoclinica.jpg');
    let now = new Date();
    let fechaEmision = `${now.getDate()}/${
      now.getMonth() + 1
    }/${now.getFullYear()} a las ${now.getHours()}:${now.getMinutes()} hs`;

    // Ordenar las historias clínicas por fecha
    historiasPruebaPdf.sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
    let historiasClinicasArray = historiasPruebaPdf.map((historiaPruebaPdf) => {
      // Crear un objeto con solo los datos que quieres incluir

      let historiaClinicaSeleccionada: any = {
        Especialidad: historiaPruebaPdf.Especialidad,
        Especialista: historiaPruebaPdf.Especialista,
        Paciente: historiaPruebaPdf.Paciente,
        fecha: historiaPruebaPdf.fecha,
        altura: historiaPruebaPdf.historiaClinica?.altura,
        peso: historiaPruebaPdf.historiaClinica?.peso,
        presion: historiaPruebaPdf.historiaClinica?.presion,
        temperatura: historiaPruebaPdf.historiaClinica?.temperatura,
        datosDinamicos: historiaPruebaPdf.historiaClinica?.datosDinamicos,
      };
      return historiaClinicaSeleccionada;
    });

    let pdfDefinition: any = {
      content: [
        {
          image: imagen,
          width: 100,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Historia Clínica',
          fontSize: 24,
          bold: true,
          alignment: 'center',
          color: '#2E7D32',
          margin: [0, 10, 0, 10],
        },
        {
          text: `Fecha de emisión: ${fechaEmision}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        ...historiasClinicasArray.map((historiaClinica) => [
          {
            text: `Especialista: ${historiaClinica.Especialista}`,
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Especialidad: ${historiaClinica.Especialidad}`,
            fontSize: 14,
            margin: [0, 5, 0, 5],
          },
          {
            text: `Paciente: ${historiaClinica.Paciente}`,
            fontSize: 14,
            margin: [0, 5, 0, 5],
          },
          {
            text: `Fecha: ${historiaClinica.fecha}`,
            fontSize: 14,
            margin: [0, 5, 0, 5],
          },
          {
            text: `Altura: ${historiaClinica.altura} cm`,
            fontSize: 14,
            margin: [0, 5, 0, 5],
          },
          {
            text: `Peso: ${historiaClinica.peso} kg`,
            fontSize: 14,
            margin: [0, 5, 0, 5],
          },
          {
            text: `Presión: ${historiaClinica.presion}`,
            fontSize: 14,
            margin: [0, 5, 0, 5],
          },
          {
            text: `Temperatura: ${historiaClinica.temperatura} °C`,
            fontSize: 14,
            margin: [0, 5, 0, 5],
          },
          ...(historiaClinica.datosDinamicos
            ? Object.entries(historiaClinica.datosDinamicos).map(
                ([key, value]) => ({
                  text: `${key}: ${value}`,
                  fontSize: 14,
                  margin: [0, 5, 0, 5],
                })
              )
            : []),
            {
              text: `------------------------------------------------------------------------------------------------------------------------------------`,
              fontSize: 14,
            },
        ]),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 15,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        quote: {
          italics: true,
          alignment: 'center',
          margin: [0, 10, 0, 10],
        },
      },
      defaultStyle: {
        fontSize: 12,
        columnGap: 20,
      },
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download('HistoriasClinicas');
  }

  async user() {
    let user = localStorage.getItem('logueado');
    if (user) {
      const especialista = await this.authService.getUserByUidAndType(
        user,
        'especialistas'
      );
      if (especialista) {
        const especialidades = await this.authService.obtenerEspecialidades();
        this.identidad = 'especialista';
        this.usuario = {
          ...especialista,
          especialidades: especialista.especialidades.map(
            (especialidadId: string) => {
              const especialidad = especialidades.find(
                (esp: any) => esp.id === especialidadId
              );
              return especialidad
                ? especialidad.nombre
                : 'Especialidad Desconocida';
            }
          ),
          especialidadesMap: especialista.especialidades.reduce(
            (map: any, especialidadId: string) => {
              const especialidad = especialidades.find(
                (esp: any) => esp.id === especialidadId
              );
              if (especialidad) {
                map[especialidad.nombre] = especialidadId;
              }
              return map;
            },
            {}
          ),
        };

        this.horario = this.usuario.turnos.reduce(
          (map: any, turno: Horario) => {
            map[turno.especialidad] = turno.turno;
            return map;
          },
          {}
        );

        this.estadoInicialHorarios = { ...this.horario };

        localStorage.setItem('identidad', 'especialista');
      } else {
        const paciente = await this.authService.getUserByUidAndType(
          user,
          'pacientes'
        );
        if (paciente !== null) {
          this.identidad = 'paciente';
          this.usuario = paciente;
          localStorage.setItem('identidad', 'paciente');
        } else {
          const admin = await this.authService.getUserByUidAndType(
            user,
            'admins'
          );
          this.identidad = 'admin';
          this.usuario = admin;
          localStorage.setItem('identidad', 'admin');
        }
      }
    }
  }
}
