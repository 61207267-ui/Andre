import { Component, inject, signal } from '@angular/core';
import { Persona } from '../../interfaces/persona';
import { form, min, required, FormField } from '@angular/forms/signals';
import { PersonaService } from '../../services/persona.service';
import Swal from 'sweetalert2';

@Component({
  imports: [FormField],
  selector: 'app-persona-componente',
  styleUrl: './persona-componente.css',
  templateUrl: './persona-componente.html',
})
export class PersonaComponente {

  private personaService = inject(PersonaService);

  listaPersonas: Persona[] = [];

  personaModelo = signal<Persona>({id: 1, nombre: '', apellido: '', edad: 0, email: '', rol: '' });

  personaFormulario = form(this.personaModelo, (esquema) => {
    required(esquema.nombre, {
      message: 'El nombre es obligatorio'
    });

    required(esquema.apellido, {
      message: 'El apellido es obligatorio'
    });

    required(esquema.edad, {
      message: 'La edad es obligatoria'
    });

    min(esquema.edad, 10, {
      message: 'La edad mínima es de 10 años'
    });

    required(esquema.email, {
      message: 'El email es obligatorio'
    });

    required(esquema.rol, {
      message: 'El rol es obligatorio'
    });
  });

  constructor() {
    this.mostrar();
  }

  guardar(evento: Event) {
    evento.preventDefault();

    const persona: Persona = {
      id : this.personaModelo().id,
      nombre: this.personaModelo().nombre,
      apellido: this.personaModelo().apellido,
      edad: this.personaModelo().edad,
      email: this.personaModelo().email,
      rol: this.personaModelo().rol
    };

    this.personaService.guardar(persona);

    Swal.fire({
      title: '¡Excelente!',
      text: 'La persona se ha guardado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd'
    });

    this.limpiar();
    this.mostrar();
  }

  eliminar(id_eliminar: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaService.eliminar(id_eliminar);
        this.mostrar();
        Swal.fire('¡Eliminado!', 'La persona ha sido eliminada.', 'success');
      }
    });
  }

  async editar(persona: Persona) {
  // 1. Desplegamos el modal con la lista desplegable de los 5 campos
  const { value: campoSeleccionado } = await Swal.fire({
    title: '¿Qué campo quieres actualizar?',
    input: 'select',
    inputOptions: {
      nombre: 'Nombre',
      apellido: 'Apellido',
      edad: 'Edad',
      email: 'Email',
      rol: 'Rol'
    },
    inputPlaceholder: 'Selecciona un campo...',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Siguiente',
    confirmButtonColor: '#0d6efd',
    inputValidator: (value: string) => {
      if (!value) {
        return 'Debes seleccionar un campo para continuar';
      }
      return null;
    }
  });

  // Si el usuario da clic en Cancelar o cierra el modal, no hacemos nada
  if (!campoSeleccionado) return;

  // 2. Pedimos el nuevo valor para el campo elegido
  const { value: nuevoValor } = await Swal.fire({
    title: `Actualizar ${campoSeleccionado}`,
    input: campoSeleccionado === 'edad' ? 'number' : 'text',
    inputValue: persona[campoSeleccionado as keyof Persona],
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Guardar cambios',
    confirmButtonColor: '#0d6efd',
    inputValidator: (value : string) => {
      if (!value) {
        return 'El campo no puede estar vacío';
      }
      return null;
    }
  });

  // 3. Si ingresó un valor, armamos el objeto modificado y llamamos al servicio
  if (nuevoValor) {
    const personaEditada: Persona = {
      ...persona,
      [campoSeleccionado]: campoSeleccionado === 'edad' ? Number(nuevoValor) : nuevoValor
    };

    // Enviamos el ID y la persona editada a tu servicio
    this.personaService.actualizar(persona.id, personaEditada);

    // Refrescamos la lista en pantalla
    this.mostrar();

    Swal.fire({
      title: '¡Actualizado!',
      text: `El campo ${campoSeleccionado} ha sido modificado.`,
      icon: 'success',
      confirmButtonColor: '#0d6efd'
    });
  }
}

  
  
  limpiar() {
    this.personaModelo.set({ id: 0, nombre: '', apellido: '', edad: 0, email: '', rol: '' });
  }

  mostrar() {
    this.listaPersonas = this.personaService.mostrar();
  }
}