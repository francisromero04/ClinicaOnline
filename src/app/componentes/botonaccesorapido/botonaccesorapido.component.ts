import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-botonaccesorapido',
  standalone: true,
  imports: [],
  templateUrl: './botonaccesorapido.component.html',
  styleUrl: './botonaccesorapido.component.css'
})
export class BotonaccesorapidoComponent implements OnInit {
  @Input() email: string = '';
  @Input() tipo: string = '';
  @Output() buttonClick: EventEmitter<{ email: string; password: string }> =
    new EventEmitter<{ email: string; password: string }>();
  foto: any;
  nombre: any;

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  onButtonClick(): void {
    this.buttonClick.emit({ email: this.email, password: '123456' });
  }

  async cargar() {
    let email = this.email;
    let password = '123456';
    let usuario = await this.authService.iniciarSesion({ email, password });
    let usuarioBD = await this.authService.getUserByUidAndType(
      usuario.user.uid,
      this.tipo
    );
    this.foto = usuarioBD?.foto1;
    this.nombre = usuarioBD?.nombre + ' - ' + this.tipo;

    await this.authService.cerrarSesion();
  }
}
