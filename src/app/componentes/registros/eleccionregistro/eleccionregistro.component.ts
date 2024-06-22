import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import RegistroespecialistaComponent from '../registroespecialista/registroespecialista.component';
import RegistropacienteComponent from '../registropaciente/registropaciente.component';

@Component({
  selector: 'app-eleccionregistro',
  standalone: true,
  imports: [CommonModule,RegistroespecialistaComponent, RegistropacienteComponent],
  templateUrl: './eleccionregistro.component.html',
  styleUrl: './eleccionregistro.component.css'
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
