export class Paciente {
  uid: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  obraSocial: string;
  foto1: string;
  foto2: string;

  constructor( uid: string, nombre: string, apellido: string, edad: number, dni: number, obraSocial: string, foto1: string, foto2: string) {
    this.uid = uid;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.obraSocial = obraSocial;
    this.foto1 = foto1;
    this.foto2 = foto2;
  }
}
