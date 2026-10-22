import { Injectable } from '@angular/core';
import { Persona } from '../interfaces/persona';

@Injectable({
    providedIn: 'root',
})
export class PersonaService {
    private personaDB: Persona[] = [];
    private contador_id: number = 0;

    guardar(persona: Persona): void {

    this.contador_id++;


    persona.id = this.contador_id;

    this.personaDB.push(persona);
    }

    mostrar(): Persona[] {
    return this.personaDB;
    }

    eliminar(id: number): void {

    this.personaDB = this.personaDB.filter((persona) => persona.id !== id);
    }

    actualizar(id: number, personaEditada: Persona): void {
    const index = this.personaDB.findIndex((persona) => persona.id === id);
    if (index !== -1) {
        this.personaDB[index] = personaEditada;
    }
    }
}
