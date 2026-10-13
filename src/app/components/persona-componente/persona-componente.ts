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

  personaModelo = signal<Persona>({ nombre: '', edad: 0 });

  personaFormulario = form(this.personaModelo, (esquema) => {
    required(esquema.nombre, {
      message: 'El nombre es obligatorio'
    });

    required(esquema.edad, {
      message: 'La edad es obligatoria'
    });

    min(esquema.edad, 10, {
      message: 'La edad mínima es de 10 años'
    });
  });

  constructor() {
    this.mostrar();
  }

  guardar(evento: Event) {
    evento.preventDefault();

    const persona: Persona = {
      nombre: this.personaModelo().nombre,
      edad: this.personaModelo().edad
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

  limpiar() {
    this.personaModelo.set({ nombre: '', edad: 0 });
  }

  mostrar() {
    this.listaPersonas = this.personaService.mostrar();
  }
}