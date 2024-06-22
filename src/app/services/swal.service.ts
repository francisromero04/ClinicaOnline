import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor(public ruta: Router) { }

  mostrarMensajeExitosoYNavegar(ruta: string[]) {
    Swal.fire({
      icon: 'success',
      title: 'Sesión iniciada exitosa',
      text: '¡Bienvenido!',
      showConfirmButton: false,
      timer: 1200,
    });
    this.ruta.navigate(ruta);
  }

  mostrarMensajeRechazado() {
    Swal.fire({
      icon: 'error',
      title: 'Su cuenta ha sido rechazada',
      text: 'Por favor, comuníquese con administración.',
      timer: 3000,
    });
  }

  mostrarMensajeNoAprobado() {
    Swal.fire({
      icon: 'warning',
      title: 'Su cuenta aún no ha sido aprobada',
      text: 'Por favor, comuníquese con administración.',
      timer: 3000,
    });
  }

  mostrarMensajeVerificarEmail() {
    Swal.fire({
      icon: 'warning',
      title: 'Verificacion de correo electrónico',
      text: 'Para poder avanzar, debe verificar el correo electrónico registrado.',
      timer: 3000,
    });
  }

  mostrarMensajeError(mensajeError: string) {
    Swal.fire({
      icon: 'error',
      title: 'Ha ocurrido un error',
      text: mensajeError,
      timer: 3000,
    });
  }
}
