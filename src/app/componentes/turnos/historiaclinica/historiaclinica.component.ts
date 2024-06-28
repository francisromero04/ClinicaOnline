import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HistoriaClinica } from '../../../clases/historiaClinica';
import { Turno } from '../../../clases/turno';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historiaclinica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historiaclinica.component.html',
  styleUrl: './historiaclinica.component.css'
})
export class HistoriaclinicaComponent  {
  historiaClinica = new HistoriaClinica();
  form: FormGroup;
  @Input() turno: Turno | null = null;

  constructor(
    private firestoreService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      altura: [
        '',
        [Validators.required, Validators.min(100), Validators.max(230)],
      ],
      peso: ['', [Validators.required, Validators.min(1), Validators.max(200)]],
      temperatura: [
        '',
        [Validators.required, Validators.min(34), Validators.max(42)],
      ],
      presion: ['', Validators.required],
      datosDinamicos: this.fb.array([]),
    });
  }

  agregarDatoDinamico() {
    const datosDinamicos = this.form.get('datosDinamicos') as FormArray;

    if (datosDinamicos && datosDinamicos.length < 3) {
      const nuevoDato = this.fb.group({
        clave: [null, Validators.required],
        valor: [null, Validators.required],
      });
      datosDinamicos.push(nuevoDato);
    }
  }

  quitarDatoDinamico(index: number) {
    const datosDinamicos = this.form.get('datosDinamicos') as FormArray;

    if (datosDinamicos) {
      datosDinamicos.removeAt(index);
    }
  }

  isFormArray(control: AbstractControl | null): control is FormArray {
    return control instanceof FormArray;
  }

  getDatosDinamicosControls(): AbstractControl[] {
    const formArray = this.form.get('datosDinamicos') as FormArray;
    return formArray ? formArray.controls : [];
  }

  async onSubmit() {
    if (this.form.valid && this.turno) {
      this.historiaClinica = this.form.value;

      const datosDinamicosObj: any = {};
      for (const dato of (this.form.get('datosDinamicos') as FormArray)
        .controls) {
        const { clave, valor } = dato.value;
        datosDinamicosObj[clave] = valor;
      }

      this.historiaClinica.datosDinamicos = datosDinamicosObj;

      console.log(this.historiaClinica);
      let id = await this.firestoreService.guardarHistoriaClinica(
        this.historiaClinica
      );
      if (id) {
        try {
          this.turno.historiaClinica = this.historiaClinica;
          console.log(this.turno);
          await this.firestoreService.modificarTurno(this.turno);
          Swal.fire({
            icon: 'success',
            title: 'Historia clinica cargada',
            text: 'Historia clinica..',
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Hubo un problema',
            text: 'no se pudo enviar la historia clinica..',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    }
  }
}
