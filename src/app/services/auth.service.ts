import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, User, sendEmailVerification, getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { Admin } from '../clases/admin.js';
import { Paciente } from '../clases/paciente.js';
import { Especialista } from '../clases/especialista.js';
import { Turno } from '../clases/turno.js';
import { Horario } from '../clases/horario.js';
import { HistoriaClinica } from '../clases/historiaClinica.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  db : Firestore;
  usuario : User | null = null;

  constructor(private autenticacion: AngularFireAuth, public auth: Auth) {
    this.db = getFirestore();
    onAuthStateChanged(this.auth, (user) => {
    this.usuario = user;
    });
  }

  obtenerUsuarioConectado(){
    return this.autenticacion.authState;
  }

  obtenerUsuarioActual(): User | null {
    return this.usuario;
  }

  async registrar({ email, password, nick }: any) {
    try {
      const credencialesUsuario = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const usuario = credencialesUsuario.user;
      await updateProfile(usuario, { displayName: nick });
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Bienvenido!',
        showConfirmButton: false,
        timer: 1500,
      });
      await sendEmailVerification(usuario);
      return usuario;
    } catch (error) {
      throw error;
    }
  }

  iniciarSesion({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  cerrarSesion() {
    return signOut(this.auth);
  }

  public async guardarLog(logueo: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'logueos'), logueo);
      console.log('LOGUEO GUARDADO: Documento escrito con ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
      return false;
    }
  }

  public async guardarPacienteBD(paciente: Paciente) {
    try {
      const docRef = await addDoc(collection(this.db, 'pacientes'), {
        uid: paciente.uid,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        edad: paciente.edad,
        dni: paciente.dni,
        obraSocial: paciente.obraSocial,
        foto1: paciente.foto1,
        foto2: paciente.foto2,
      });
      console.log('Documento escrito con ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
      return false;
    }
  }

  async getUserByUidAndType(uid: string, type: string): Promise<any> {
    try {
      const q = query(collection(this.db, type), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        console.log(`No se encontró ningún ${type} con el UID proporcionado`);
        return null;
      }

      const userData = querySnapshot.docs[0].data();
      let user = null;

      switch (type) {
        case 'admins':
          user = new Admin(
            userData['uid'],
            userData['nombre'],
            userData['apellido'],
            userData['edad'],
            userData['dni'],
            userData['foto1']
          );
          break;
        case 'pacientes':
          user = new Paciente(
            userData['uid'],
            userData['nombre'],
            userData['apellido'],
            userData['edad'],
            userData['dni'],
            userData['obraSocial'],
            userData['foto1'],
            userData['foto2']
          );
          break;
        case 'especialistas':
          user = new Especialista(
            userData['uid'],
            userData['nombre'],
            userData['apellido'],
            userData['edad'],
            userData['dni'],
            userData['especialidades'],
            userData['foto1'],
            userData['verificado']
          );
          user.turnos = userData['turnos'];
          break;
      }

      return user;
    } catch (error) {
      // console.error(`Error al buscar el ${type} por UID: `, error);
      return null;
    }
  }

  async getWhere(path: string, condicion: string, condicion2: string) {
    const Collection = collection(this.db, path);
    const Query = query(Collection, where(condicion, '==', condicion2));
    const Snapshot = await getDocs(Query);
    return Snapshot;
  }

  async obtenerEspecialidades(): Promise<any[]> {
    try {
      const especialidadesRef = collection(this.db, 'especialidades');
      const querySnapshot = await getDocs(especialidadesRef);

      const especialidades = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      return especialidades;
    } catch (error) {
      console.error('Error al obtener las especialidades: ', error);
      return [];
    }
  }

  async obtenerEspecialistas(): Promise<any[]> {
    try {
      const especialistasRef = collection(this.db, 'especialistas');
      const querySnapshot = await getDocs(especialistasRef);

      const especialistas = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      return especialistas;
    } catch (error) {
      console.error('Error al obtener los especialistas: ', error);
      return [];
    }
  }

  public async guardarEspecialistaBD(especialista: Especialista) {
    try {
      const docRef = await addDoc(collection(this.db, 'especialistas'), {
        uid: especialista.uid,
        nombre: especialista.nombre,
        apellido: especialista.apellido,
        edad: especialista.edad,
        dni: especialista.dni,
        especialidades: especialista.especialidades,
        foto1: especialista.foto1,
        verificado: 'false',
      });
      console.log('Documento escrito con ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
      return false;
    }
  }

  async guardarEspecialidad(especialidadNombre: string): Promise<void> {
    const especialidades = await this.obtenerEspecialidades();
    const especialidadExistente = especialidades.find(
      (especialidad) => especialidad.nombre === especialidadNombre
    );
    if (!especialidadExistente) {
      try {
        const docRef = await addDoc(collection(this.db, 'especialidades'), {
          nombre: especialidadNombre,
        });
        console.log('Nueva especialidad guardada con ID: ', docRef.id);
      } catch (error) {
        console.error('Error al guardar la especialidad: ', error);
      }
    }
  }

  async registrarAdministrador({ email, password, nick }: any) {
    const auth = getAuth();
    const currentUser = auth.currentUser; // Guarda el usuario actual

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: nick });

      if (currentUser) {
        // Vuelve a establecer el usuario original como el usuario actual
        await auth.updateCurrentUser(currentUser);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async guardarAdministradorEnBD(admin: Admin) {
    try {
      const docRef = await addDoc(collection(this.db, 'admins'), {
        uid: admin.uid,
        nombre: admin.nombre,
        apellido: admin.apellido,
        edad: admin.edad,
        dni: admin.dni,
        foto1: admin.foto1,
      });
      console.log('Document written with ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error adding document: ', e);
      return false;
    }
  }

  async actualizarVerificadoEspecialista(
    uid: string,
    valor: string
  ): Promise<void> {
    try {
      const especialistasCollection = collection(this.db, 'especialistas');
      const querys = query(especialistasCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(querys);

      if (querySnapshot.size === 0) {
        console.log(
          'No se encontró ningún especialista con el UID interno proporcionado'
        );
        return;
      }

      querySnapshot.forEach((docSnapshot) => {
        const especialistaRef = doc(this.db, 'especialistas', docSnapshot.id);
        updateDoc(especialistaRef, { verificado: valor });
      });
    } catch (error) {
      console.error(
        'Error al actualizar el campo verificado del especialista: ',
        error
      );
      throw error;
    }
  }

  public async obtenerTurnos(especialistaId: string): Promise<Turno[]> {
    const q = query(
      collection(this.db, 'turnos'),
      where('especialista', '==', especialistaId)
    );
    const querySnapshot = await getDocs(q);
    const turnos: Turno[] = [];

    querySnapshot.forEach((doc) => {
      const turnoData = doc.data();
      const turno = new Turno(
        doc.id,
        turnoData['especialidad'],
        turnoData['especialista'],
        turnoData['paciente'],
        turnoData['estado'],
        turnoData['fecha'],
        turnoData['hora']
      );
      turnos.push(turno);
    });

    return turnos;
  }

  async obtenerPacientes(): Promise<Paciente[]> {
    try {
      const q = query(collection(this.db, 'pacientes'));
      const querySnapshot = await getDocs(q);

      const pacientes: Paciente[] = [];

      querySnapshot.forEach((doc) => {
        const pacienteData = doc.data();
        const paciente = new Paciente(
          pacienteData['uid'],
          pacienteData['nombre'],
          pacienteData['apellido'],
          pacienteData['edad'],
          pacienteData['dni'],
          pacienteData['obraSocial'],
          pacienteData['foto1'],
          pacienteData['foto2']
        );
        pacientes.push(paciente);
      });

      return pacientes;
    } catch (error) {
      console.error('Error al obtener todos los pacientes: ', error);
      return [];
    }
  }

  public async obtenerTurnosDelUsuario(
    uid: string,
    tipo: string
  ): Promise<Turno[]> {
    let condicion = 'especialista';
    if (tipo == 'paciente') {
      condicion = 'paciente';
    }
    const q = query(collection(this.db, 'turnos'), where(condicion, '==', uid));
    const querySnapshot = await getDocs(q);
    const turnos: Turno[] = [];

    querySnapshot.forEach((doc) => {
      const turnoData = doc.data();
      const turno = new Turno(
        doc.id,
        turnoData['especialista'],
        turnoData['especialidad'],
        turnoData['paciente'],
        turnoData['estado'],
        turnoData['fecha'],
        turnoData['hora']
      );
      if (turnoData['comentario']) {
        turno.comentario = turnoData['comentario'];
      }
      if (turnoData['resena']) {
        turno.resena = turnoData['resena'];
      }
      if (turnoData['historiaClinica']) {
        turno.historiaClinica = turnoData['historiaClinica'];
      }
      if (turnoData['encuesta']) {
        turno.encuesta = turnoData['encuesta'];
      }
      if (turnoData['atencion']) {
        turno.encuesta = turnoData['atencion'];
      }
      turnos.push(turno);
    });

    return turnos;
  }

  public async almacenarTurno(turno: Turno) {
    try {
      const docRef = await addDoc(collection(this.db, 'turnos'), {
        especialidad: turno.idEspecialidad,
        especialista: turno.idEspecialista,
        paciente: turno.idPaciente,
        estado: turno.estado,
        fecha: turno.fecha,
        hora: turno.hora,
      });
      console.log('Document written with ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error adding document: ', e);
      return false;
    }
  }

  public async modificarTurno(turno: Turno): Promise<void> {
    const turnoRef = doc(this.db, 'turnos', turno.uid);

    await updateDoc(turnoRef, {
      especialidad: turno.idEspecialidad,
      especialista: turno.idEspecialista,
      paciente: turno.idPaciente,
      estado: turno.estado,
      fecha: turno.fecha,
      hora: turno.hora,
      resena: turno.resena,
      comentario: turno.comentario,
      atencion: turno.atencion,
      encuesta: turno.encuesta,
      historiaClinica: turno.historiaClinica,
    });
  }

  async actualizarHorariosEspecialista(
    uid: string,
    turnos: Horario[]
  ): Promise<void> {
    try {
      const especialistasCollection = collection(this.db, 'especialistas');
      const querys = query(especialistasCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(querys);

      if (querySnapshot.size === 0) {
        console.log(
          'No se encontró ningún especialista con el UID interno proporcionado'
        );
        return;
      }

      querySnapshot.forEach((docSnapshot) => {
        const especialistaRef = doc(this.db, 'especialistas', docSnapshot.id);
        updateDoc(especialistaRef, { turnos: turnos });
      });
    } catch (error) {
      console.error(
        'Error al actualizar los horarios del especialista: ',
        error
      );
      throw error;
    }
  }

  public async guardarHistoriaClinica(historia: HistoriaClinica) {
    try {
      const docRef = await addDoc(collection(this.db, 'historiasClinicas'), {
        altura: historia.altura,
        peso: historia.peso,
        temperatura: historia.temperatura,
        presion: historia.presion,
        datosDinamicos: historia.datosDinamicos,
      });
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
      return false;
    }
  }

  async getAllPacientes(): Promise<Paciente[]> {
    try {
      const q = query(collection(this.db, 'pacientes'));
      const querySnapshot = await getDocs(q);

      const pacientes: Paciente[] = [];

      querySnapshot.forEach((doc) => {
        const pacienteData = doc.data();
        const paciente = new Paciente(
          pacienteData['uid'],
          pacienteData['nombre'],
          pacienteData['apellido'],
          pacienteData['edad'],
          pacienteData['dni'],
          pacienteData['obraSocial'],
          pacienteData['foto1'],
          pacienteData['foto2']
        );
        pacientes.push(paciente);
      });

      return pacientes;
    } catch (error) {
      console.error('Error al obtener todos los pacientes: ', error);
      return [];
    }
  }

  public async obtenerTodosLosTurnos(): Promise<Turno[]> {
    const querySnapshot = await getDocs(collection(this.db, 'turnos'));
    const turnos: Turno[] = [];

    querySnapshot.forEach((doc) => {
      const turnoData = doc.data();
      const turno = new Turno(
        doc.id,
        turnoData['especialista'],
        turnoData['especialidad'],
        turnoData['paciente'],
        turnoData['estado'],
        turnoData['fecha'],
        turnoData['hora']
      );
      if (turnoData['comentario']) {
        turno.comentario = turnoData['comentario'];
      }
      if (turnoData['resena']) {
        turno.resena = turnoData['resena'];
      }
      if (turnoData['historiaClinica']) {
        turno.historiaClinica = turnoData['historiaClinica'];
      }
      turnos.push(turno);
    });

    return turnos;
  }
}
