import { Component, OnInit } from '@angular/core';
import { persona } from '../models/persona';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cv-personas',
  templateUrl: './cv-personas.component.html',
  styleUrls: ['./cv-personas.component.css']
})
export class CvPersonasComponent implements OnInit {
  
  ListaPersonas:persona[];
  respuesta:any;

  constructor(private _route:ActivatedRoute) {}

  ngOnInit(): void {

    this.respuesta =  this._route.snapshot.data.DetallesListaP; 

    if(this.respuesta.status == "success"){
      this.ListaPersonas=this.respuesta.data;     
    }  
  }

  
}
