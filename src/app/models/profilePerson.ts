import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

export interface profilePerson {
    id:number,
    nombres: string,
    userName: string,        
    password: string,
    fechaDisponibilidad: Date,
    ciudad:string,
    areaTrabajo:string,
    campoEspecialidad:string,
    conocimientos:string,
    profesion:string,
    especializacion:string,
    competencias:string,
    comentarios:string,
    CV:string,
    activo:number
  
}