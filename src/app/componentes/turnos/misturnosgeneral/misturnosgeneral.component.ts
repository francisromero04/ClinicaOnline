import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import PacienteComponent from '../paciente/paciente.component';
import EspecialistaComponent from '../especialista/especialista.component';

@Component({
  selector: 'app-misturnosgeneral',
  standalone: true,
  imports: [CommonModule, PacienteComponent, EspecialistaComponent],
  templateUrl: './misturnosgeneral.component.html',
  styleUrl: './misturnosgeneral.component.css'
})
export default class MisturnosgeneralComponent {
  user: any;
  id: string = '';
  esPaciente: boolean = false;

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    let id = localStorage.getItem('logueado');
    this.esPaciente = localStorage.getItem('esPaciente') === 'true';
    if (id) {
      this.id = id;
      let pac = await this.authService.getUserByUidAndType(id, 'pacientes');
      if (pac != null) {
        this.esPaciente = true;
        localStorage.setItem('esPaciente', 'true');
      }
    }
  }
}
