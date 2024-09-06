# Clínica Online - Sistema de Gestión de Turnos y Usuarios

## Descripción del Proyecto

Este sistema ha sido desarrollado para cubrir las necesidades de la Clínica OnLine, la cual se especializa en salud y cuenta con consultorios, laboratorios y una sala de espera general. A través de este sistema, los pacientes pueden solicitar turnos con profesionales de diversas especialidades, quienes tienen la capacidad de administrar sus horarios y especialidades. Además, el sistema permite gestionar usuarios (Pacientes, Especialistas y Administradores), así como la visualización y gestión de turnos.

---

## Características Generales

- **Registro de Usuarios**: Pacientes, Especialistas y Administradores.
- **Gestión de Turnos**: Solicitud, cancelación, aceptación y finalización de turnos.
- **Perfiles de Usuario**: Visualización de datos personales y la gestión de horarios en el caso de los Especialistas.
- **Historia Clínica**: Registro y visualización de las atenciones realizadas a los pacientes.
- **Estadísticas**: Gráficos y reportes descargables para Administradores.
- **Captcha**: Verificación de captcha en el registro y operaciones críticas.
- **Transiciones Animadas**: Navegación con animaciones entre componentes.

---

## Estructura del Sistema

### 1. Página de Bienvenida

- Acceso al login y registro.
- Interfaz intuitiva para que los usuarios accedan al sistema.

### 2. Registro de Usuarios

Permite el registro de Pacientes y Especialistas con los siguientes datos:

- **Pacientes**:
  - Nombre, Apellido, Edad, DNI, Obra Social, Email, Contraseña, Imágenes de perfil.
- **Especialistas**:
  - Nombre, Apellido, Edad, DNI, Especialidad (pueden tener más de una), Email, Contraseña, Imagen de perfil.

> **Validación**: Todos los campos se validan adecuadamente y los Especialistas deben ser aprobados por un Administrador antes de poder ingresar al sistema.

### 3. Login de Usuarios

Acceso al sistema mediante Email y Contraseña. Los perfiles de Especialistas deben estar aprobados y ambos (Pacientes y Especialistas) deben verificar su Email.

### 4. Gestión de Usuarios (Solo Administrador)

El Administrador puede:

- Ver información detallada de los usuarios.
- Habilitar/Inhabilitar Especialistas.
- Crear nuevos usuarios, incluidos Administradores.
- Acceder a las estadísticas de uso del sistema.

### 5. Gestión de Turnos

#### Pacientes

- **Mis Turnos**: Los pacientes pueden visualizar los turnos que solicitaron, filtrarlos por Especialidad y Especialista, y realizar las siguientes acciones:
  - **Cancelar Turno**: Si el turno no ha sido realizado.
  - **Ver Reseña**: Si hay una reseña cargada.
  - **Completar Encuesta**: Si el turno fue realizado.
  - **Calificar Atención**: Si el turno fue completado.

#### Especialistas

- **Mis Turnos**: Los especialistas pueden visualizar los turnos asignados, filtrarlos por Especialidad y Paciente, y realizar las siguientes acciones:
  - **Aceptar/Rechazar Turno**.
  - **Finalizar Turno**: Con la posibilidad de cargar una reseña y diagnóstico.

#### Administrador

- **Turnos**: El Administrador puede gestionar todos los turnos de la clínica, filtrarlos y cancelarlos si es necesario.

### 6. Solicitar Turno

Disponible tanto para Pacientes como para el Administrador. Los pacientes seleccionan la especialidad, especialista, y el horario disponible dentro de los próximos 15 días.

### 7. Mi Perfil

Cada usuario puede ver y editar sus datos personales. Los Especialistas pueden además gestionar su disponibilidad horaria y especialidades.

### 8. Historia Clínica

- **Pacientes**: Los pacientes pueden ver sus historias clínicas desde su perfil.
- **Especialistas**: Solo tienen acceso a las historias clínicas de los pacientes que hayan atendido.
- **Administradores**: Pueden visualizar todas las historias clínicas.

Cada historia clínica incluye:

- Altura, Peso, Temperatura, Presión.
- Datos dinámicos clave-valor (e.g., "Caries: 4").

### 9. Estadísticas y Gráficos

Accesibles solo para los Administradores, quienes pueden ver informes detallados sobre:

- Logs de acceso al sistema.
- Cantidad de turnos por especialidad, día y médico en un intervalo de tiempo.
- Descarga de informes en formato PDF o Excel.

---

## Funcionalidades Adicionales

### Captcha
Incorporación de un captcha en el registro y operaciones críticas del sistema, con la opción de deshabilitarlo si es necesario.

### Animaciones de Transición
El sistema cuenta con animaciones de transición en al menos 6 componentes para mejorar la experiencia del usuario al navegar entre las secciones.

### Descargas
- **Administradores**: Pueden descargar un archivo Excel con los datos de todos los usuarios desde la sección Usuarios.
- **Pacientes**: Pueden descargar un archivo PDF con su historia clínica desde su perfil.

---
