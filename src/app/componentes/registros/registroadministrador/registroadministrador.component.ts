import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Admin } from '../../../clases/admin';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../../usuarios/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-registroadministrador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminNavbarComponent, RouterOutlet],
  templateUrl: './registroadministrador.component.html',
  styleUrl: './registroadministrador.component.css',
})
export default class RegistroadministradorComponent {
  imagenSeleccionada: any = null;
  imagenURL: string = '';
  usuario: any;
  formulario: FormGroup;
  verificacionDeError: boolean = false;
  mensaje: string = '';

  constructor(
    private servicioDeAutenticacion: AuthService,
    private enrutador: Router
  ) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombreAdmin: new FormControl('', [Validators.required]),
      apellidoAdmin: new FormControl('', [Validators.required]),
      edadAdmin: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(110),
      ]),
      dniAdmin: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000000),
      ]),
      emailAdmin: new FormControl('', [Validators.required, Validators.email]),
      claveAdmin: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      fotoAdmin: new FormControl(''),
    });
  }

  enImagenSeleccionada(evento: any) {
    const archivo = evento.target.files[0];
    if (archivo) {
      const lector = new FileReader();

      lector.onload = (e: any) => {
        this.imagenSeleccionada = e.target.result;

        this.imagenURL = lector.result as string;
      };

      lector.readAsDataURL(archivo);
    }
  }

  resetearInputDeImagen() {
    const elementoInput = document.getElementById('fotoadmin') as HTMLInputElement | null;
    if (elementoInput) {
      elementoInput.value = '';
    } else {
      console.error('El elemento de entrada de imagen no se encontró');
    }
  }


  onSubmit() {
    if (this.formulario.valid) {
      this.cargarUsuario();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error, complete los datos correctamente',
        timer: 2500,
      });
    }
  }

  async cargarUsuario() {
    try {
      let datos = {
        email: this.formulario.controls['emailAdmin'].value,
        password: this.formulario.controls['claveAdmin'].value,
        nick: this.formulario.controls['nombreAdmin'].value,
      };

      console.log(this.servicioDeAutenticacion.obtenerUsuarioConectado());
      this.usuario = await this.servicioDeAutenticacion.registrarAdministrador(
        datos
      );

      let usuario = new Admin(
        this.usuario.uid,
        this.formulario.controls['nombreAdmin'].value,
        this.formulario.controls['apellidoAdmin'].value,
        this.formulario.controls['edadAdmin'].value,
        this.formulario.controls['dniAdmin'].value,
        this.imagenURL
      );
      await this.servicioDeAutenticacion.guardarAdministradorEnBD(usuario);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Bienvenido!',
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(this.servicioDeAutenticacion.obtenerUsuarioConectado());
    } catch (error: any) {
      this.verificacionDeError = true;
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
