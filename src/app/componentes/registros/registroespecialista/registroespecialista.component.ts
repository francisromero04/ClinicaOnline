import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Especialidad } from '../../../clases/especialidad';
import { Especialista } from '../../../clases/especialista';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registroespecialista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule],
  templateUrl: './registroespecialista.component.html',
  styleUrl: './registroespecialista.component.css',
})
export default class RegistroespecialistaComponent {
  imagenSeleccionada: any = null;
  imagenURL: string = '';
  formulario: FormGroup;
  existenciaErrores: boolean = false;
  mensaje: string = '';
  usuario: any;
  especialidadesSeleccionadas: Especialidad[] = [];
  nuevaEspecialidad: string = '';
  especialidades: Especialidad[] = [];
  captcha: string = '';
  captchaResuelto: boolean = false;  // Variable para controlar la visibilidad del mensaje

  constructor(private autenticacion: AuthService, private ruta: Router) {
    this.captcha = '';
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.captchaResuelto = true;  // Marcar que el captcha ha sido resuelto
    // console.log('captcha resuelto con response: ' + this.captcha);
  }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      especialistaNombre: new FormControl('', [Validators.required]),
      especialistaApellido: new FormControl('', [Validators.required]),
      especialistaEdad: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      especialistaDni: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000000),
      ]),
      OtraEspecialidad: new FormControl(''),
      agregarOtraEspecialidad: new FormControl(''),
      especialistaEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      especialistaClave: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      fotoespecialista: new FormControl('', [Validators.required]),
    });

    this.cargarEspecialidades();
  }

  enImagenSeleccionada(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      const lector = new FileReader();

      lector.onload = (e: any) => {
        this.imagenSeleccionada = e.target.result;

        this.imagenURL = lector.result as string;
      };

      lector.readAsDataURL(archivo);
    }
  }

  restablecerInputImagen() {
    const elementoDeEntrada = document.getElementById(
      'fotoespecialista'
    ) as HTMLInputElement;
    elementoDeEntrada.value = '';
  }

  async cargarEspecialidades() {
    const especialidadesData = await this.autenticacion.obtenerEspecialidades();
    this.especialidades = especialidadesData.map((especialidadData: any) => {
      const especialidad = new Especialidad(
        especialidadData.id,
        especialidadData.nombre,
        especialidadData.foto
      );
      this.formulario.addControl(
        `especialidad_${especialidad.uid}`,
        new FormControl(false)
      );
      return especialidad;
    });
  }

  async agregarEspecialidad() {
    const especialidadNombre =
      this.formulario.controls['OtraEspecialidad'].value.trim();
    if (especialidadNombre !== '') {
      await this.autenticacion.guardarEspecialidad(especialidadNombre);
      this.formulario.controls['OtraEspecialidad'].setValue('');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'La especialidad ya existe en la lista.',
        timer: 4000,
      });
    }
    this.cargarEspecialidades();
  }

  onSubmit() {
    const especialidadesSeleccionadas = this.especialidades.filter(
      (especialidad) =>
        this.formulario.get(`especialidad_${especialidad.uid}`)?.value
    );
    console.log(especialidadesSeleccionadas);
    if (this.formulario.valid) {
      this.cargarUsuario();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error, debe completar los datos requeridos.',
        timer: 2500,
      });
    }
  }

  async cargarUsuario() {
    try {
      const especialidadesSeleccionadas = this.especialidades.filter(
        (especialidad) =>
          this.formulario.get(`especialidad_${especialidad.uid}`)?.value
      );
      let data = {
        email: this.formulario.controls['especialistaEmail'].value,
        password: this.formulario.controls['especialistaClave'].value,
        nick: this.formulario.controls['especialistaNombre'].value,
      };
      this.usuario = await this.autenticacion.registrar(data);

      let usuario = new Especialista(
        this.usuario.uid,
        this.formulario.controls['especialistaNombre'].value,
        this.formulario.controls['especialistaApellido'].value,
        this.formulario.controls['especialistaEdad'].value,
        this.formulario.controls['especialistaDni'].value,
        especialidadesSeleccionadas.map((especialidad) => especialidad.uid),
        this.imagenURL,
        'false'
      );
      await this.autenticacion.guardarEspecialistaBD(usuario);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Bienvenido!',
        showConfirmButton: false,
        timer: 1500,
      });
      this.ruta.navigate(['/login']);
    } catch (error: any) {
      this.existenciaErrores = true;
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.mensaje = 'Ya se encuentra un usuario registrado con ese email';
          break;
        default:
          this.mensaje = 'Hubo un problema al registrar.';
          break;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: this.mensaje,
        timer: 4000,
      });
    }
  }
}
