import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from './../../services/auth.service';
import { SwalService } from '../../services/swal.service';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BarranavinicialComponent } from '../barranavinicial/barranavinicial.component';
import { slideInFromBottomAnimation, fadeScaleAnimation } from '../../animacion';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, BarranavinicialComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [slideInFromBottomAnimation, fadeScaleAnimation]
})
export default class LoginComponent implements OnInit {
  formulario: FormGroup;
  huboError: boolean = false;
  mensajeError: string = '';
  admins: any[] = [];
  pacientes: any[] = [];
  especialistas: any[] = [];
  cargandoImagenes: boolean = false;
  registroActivo: boolean = false;

  usuariosAccesoRapido = [
    { email: 'pacake7525@apn7.com', password: 'paciente1', tipo: 'Paciente Juan', imagen: 'assets/img/paciente.png' },
    { email: 'jaxale2608@bsidesmn.com', password: 'paciente2', tipo: 'Paciente Maria', imagen: 'assets/img/paciente.png' },
    { email: 'naxit88876@apn7.com', password: 'paciente3', tipo: 'Paciente Carlos', imagen: 'assets/img/paciente.png' },
    { email: 'literiv375@bacaki.com', password: 'especialista1', tipo: 'Especialista Laura', imagen: 'assets/img/especialista.png' },
    { email: 'ketoyil643@bsidesmn.com', password: 'especialista2', tipo: 'Especialista Miguel', imagen: 'assets/img/especialista.png' },
    { email: 'mimado9373@atebin.com', password: 'admin1', tipo: 'Administrador Francis', imagen: 'assets/img/admin.png' }
  ];

  constructor(
    public autenticacion: AuthService,
    public ruta: Router,
    public inicializador: FormBuilder,
    private mensajesEmergentes: SwalService,
  ) {
    this.formulario = this.inicializador.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Método para mostrar el panel de registro
  mostrarPanelRegistro() {
    this.registroActivo = true;
  }

  // Método para mostrar el panel de inicio de sesión
  mostrarPanelInicioSesion() {
    this.registroActivo = false;
  }

  async ngOnInit(): Promise<void> {
    this.formulario = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    await this.cargarAccesos();
  }

  async guardarLogueos(id: any) {
    const ahora = new Date();
    const dia = `${String(ahora.getDate()).padStart(2, '0')}/${String(
      ahora.getMonth() + 1
    ).padStart(2, '0')}/${ahora.getFullYear()}`;
    const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(
      ahora.getMinutes()
    ).padStart(2, '0')}`;

    const log = {
      dia: dia,
      hora: hora,
      usuario: id,
    };
    await this.autenticacion.guardarLog(log);
  }

  async verificarCorreos(usuario: any) {
    try {
      const admin = await this.autenticacion.getUserByUidAndType(
        usuario.user.uid,
        'admins'
      );
      const especialista = await this.autenticacion.getUserByUidAndType(
        usuario.user.uid,
        'especialistas'
      );
      if (admin !== null) {
        await this.guardarLogueos(usuario.user.email);
        this.mensajesEmergentes.mostrarMensajeExitosoYNavegar([
          '/homeAdmin/admin/',
        ]);
        return;
      }
      if (especialista !== null) {
        if (especialista.verificado === 'true' && usuario.user.emailVerified) {
          await this.guardarLogueos(usuario.user.email);
          this.mensajesEmergentes.mostrarMensajeExitosoYNavegar([
            '/home',
          ]);
          return;
        }
        if (especialista.verificado === 'null') {
          this.mensajesEmergentes.mostrarMensajeRechazado();
        } else if (especialista.verificado === 'false') {
          await this.autenticacion.cerrarSesion();
          this.mensajesEmergentes.mostrarMensajeNoAprobado();
        } else {
          this.mensajesEmergentes.mostrarMensajeVerificarEmail();
        }
      } else if (usuario.user.emailVerified) {
        await this.guardarLogueos(usuario.user.email);
        this.mensajesEmergentes.mostrarMensajeExitosoYNavegar(['/home']);
      } else {
        await this.autenticacion.cerrarSesion();
        this.mensajesEmergentes.mostrarMensajeVerificarEmail();
      }
    } catch (error: any) {
      this.mensajesEmergentes.mostrarMensajeError(error.text);
    }
  }

  onButtonClick(evento: any): void {
    this.formulario.controls['email'].setValue(evento.email);
    this.formulario.controls['password'].setValue(evento.password);
  }

  async cargarAccesos() {
    let adminSnapshot = await this.autenticacion.getWhere(
      'users',
      'tipo',
      'admins'
    );
    this.admins = adminSnapshot.docs.map((doc) => doc.data());
    let pacientesSnapshot = await this.autenticacion.getWhere(
      'users',
      'tipo',
      'pacientes'
    );
    this.pacientes = pacientesSnapshot.docs.map((doc) => doc.data());
    let especialistasSnapshot = await this.autenticacion.getWhere(
      'users',
      'tipo',
      'especialistas'
    );
    this.especialistas = especialistasSnapshot.docs.map((doc) => doc.data());
  }

  async onSubmit() {
    if (this.formulario.valid) {
      try {
        let usuario = await this.autenticacion.iniciarSesion(this.formulario.value);
        localStorage.setItem('logueado', usuario.user.uid);
        await this.verificarCorreos(usuario);
      } catch (error: any) {
        this.huboError = true;
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/internal-error':
          case 'auth/too-many-requests':
          case 'auth/invalid-login-credentials':
            this.mensajeError = `Credenciales inválidas`;
            break;
          default:
            this.mensajeError = error.message;
            break;
        }
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error en el inicio de sesión',
          text: this.mensajeError,
          timer: 3000,
        });
      }
    }
  }
}
