import { Horario } from "./horario";

export class Especialista {
  uid: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  especialidades: string[];
  foto1: string;
  verificado:string;
  turnos:Horario[];

  constructor(uid: string, nombre: string, apellido: string, edad: number, dni: number, especialidades: string[], foto1: string, verificado:string) {
    this.uid = uid;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.especialidades = especialidades;
    this.foto1 = foto1;
    this.verificado = verificado;
    this.turnos = [];
  }
}
