import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import RegistroespecialistaComponent from '../registroespecialista/registroespecialista.component';
import RegistropacienteComponent from '../registropaciente/registropaciente.component';
import { RouterOutlet } from '@angular/router';
import { BarranavinicialComponent } from '../../barranavinicial/barranavinicial.component';
import { slideInAnimation, slideInAnimation2, fadeScaleAnimation } from '../../../animacion';

@Component({
  selector: 'app-eleccionregistro',
  standalone: true,
  imports: [CommonModule, RegistroespecialistaComponent, RegistropacienteComponent, RouterOutlet, BarranavinicialComponent],
  templateUrl: './eleccionregistro.component.html',
  styleUrls: ['./eleccionregistro.component.css'],
  animations: [slideInAnimation, slideInAnimation2, fadeScaleAnimation]
})
export default class EleccionregistroComponent {
  mostrarRegistroPacientes: boolean = false;
  mostrarRegistroEspecialistas: boolean = false;

  mostrarRegistro(tipo: string) {
    if (tipo === 'paciente') {
      this.mostrarRegistroPacientes = true;
      this.mostrarRegistroEspecialistas = false;
    } else if (tipo === 'especialista') {
      this.mostrarRegistroEspecialistas = true;
      this.mostrarRegistroPacientes = false;
    }
  }
}
