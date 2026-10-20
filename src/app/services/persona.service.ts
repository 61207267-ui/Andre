import { Injectable } from '@angular/core';
import { Persona } from '../interfaces/persona';

@Injectable({
    providedIn: 'root',
})
export class PersonaService {
    private personaDB: Persona[] = [];
    private contador_id: number = 0;

    guardar(persona: Persona): void {
    // 1. Autoincrementamos el ID interno
    this.contador_id++;

    // 2. Le asignamos el nuevo ID a la persona antes de guardarla
    persona.id = this.contador_id;

    // 3. La guardamos en nuestro arreglo
    this.personaDB.push(persona);
    }

    mostrar(): Persona[] {
    return this.personaDB;
    }

    eliminar(id: number): void {
    // Filtramos usando el ID único de la persona
    this.personaDB = this.personaDB.filter((persona) => persona.id !== id);
    }

    actualizar(id: number, personaEditada: Persona): void {
    // Buscamos la posición exacta usando el ID real
    const index = this.personaDB.findIndex((persona) => persona.id === id);
    if (index !== -1) {
        this.personaDB[index] = personaEditada;
    }
    }
}
