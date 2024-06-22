export class Admin {
  uid: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  foto1: string;

  constructor(uid: string, nombre: string, apellido: string, edad: number, dni: number, foto1: string) {
    this.uid = uid;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.foto1 = foto1;
  }
}
