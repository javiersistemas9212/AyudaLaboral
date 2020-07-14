import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ColaboradorService } from '../services/colaborador.service';
import { persona } from '../models/persona';
import { ValueTransformer } from '@angular/compiler/src/util';
import { opportunity } from '../models/opportunity';
import { recomendacion } from '../models/recomendacion';
import { MatTableDataSource } from '@angular/material/table';


export interface opcionPersona {
  value:number,
  text:string,
  afectado:string 
}

@Component({
  selector: 'app-recomendaciones-oportunidad',
  templateUrl: './recomendaciones-oportunidad.component.html',
  styleUrls: ['./recomendaciones-oportunidad.component.css']
})
export class RecomendacionesOportunidadComponent implements OnInit {

  myControl = new FormControl();
  options: string[] =[]; 
  optionsList: opcionPersona[] =[];
  filteredOptions: Observable<string[]>;
  @Input() oportunidadModel: opportunity;  
  oportunidadModelActual: opportunity;  
  personas:persona[];
  ListapersonasRecomendadas:persona[];
  private _subscription: Subscription;
  private _subscription2: Subscription;
  private _subscription3: Subscription;
  displayedColumns: string[] =[];
  dataSource:any;
  mensaje:string;
  tipoFiltro: string


  constructor(private _colaboradorService: ColaboradorService) { }

  ngOnInit() {
     
    this.tipoFiltro="N";
    this.personas = [];
    this.ListapersonasRecomendadas = [];
    this.ListaPersonas();
    this.personasRecomendadas();
    this.mensaje="";

  }

  ngOnChanges(changes: SimpleChanges): void{
     this.oportunidadModelActual = this.oportunidadModel;
  }

  ngOnDestroy(): void {
    if(this._subscription != undefined){
       this._subscription.unsubscribe();    
     }
     if(this._subscription2 != undefined){
      this._subscription2.unsubscribe();    
     }
     if(this._subscription3 != undefined){
      this._subscription3.unsubscribe();    
     }
   }
   cambiarTipoFiltro(tipo:string){
         this.tipoFiltro = tipo;
          this.ListaPersonas();
   }
  ListaPersonas(){
    this._subscription = this._colaboradorService.ConsultarUsuariosActivos(localStorage.getItem('user'))
    .subscribe((res:any) => {
      this.optionsList = [];   
      this.options = [];
      if(res.status == "success"){
        this.personas = res.data;
     
      if (this.tipoFiltro=="N"){
          this.personas.forEach(element => {
          this.optionsList.push({text: element.nombres + ' - ' +  
          element.userName + ' - ' +  element.profesion, value:element.id, afectado: element.userName});
          this.options.push(element.nombres + ' - ' +  element.userName + ' - ' +  element.profesion);
        });
      }
      if (this.tipoFiltro=="P"){
        this.personas.forEach(element => {
         this.optionsList.push({text: element.profesion + ' - ' +  
         element.userName + ' - ' +  element.nombres, value:element.id, afectado: element.userName});
         this.options.push(element.profesion + ' - ' +  element.userName + ' - ' +  element.nombres);
       });
     }


        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );

       }
    });
  
  }

  private _filter(value: string): string[] {
   
    const filterValue = value.toLowerCase();
  
   return  this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  
  }

cargarRecomendacion(idpersona:string){

  if(idpersona == ""){    
    this.mensaje ="Por favor seleccione a una persona.";
    return;
  }

  let fechaActual = new Date();
  let personafiltrada:opcionPersona[]=[];
  personafiltrada = this.optionsList.filter(persona => persona.text.toLowerCase() == idpersona.toLowerCase());
  
  if(personafiltrada.length == 0){
    this.mensaje ="Selección no valida.";
    return;
  }

  let Nuevarecomendacion: recomendacion ={
    id:0,
    oportunidadid: this.oportunidadModelActual.id,
    usuarioid: personafiltrada[0].value,
    areaTrabajo: this.oportunidadModelActual.areaTrabajo,
    empresa: this.oportunidadModelActual.empresa,
    afectado:personafiltrada[0].afectado,
    ciudad:this.oportunidadModelActual.ciudad,
    fecha:fechaActual.getFullYear() + "/" + (fechaActual.getMonth() + 1)  + "/" + fechaActual.getDate()
  }
  this._subscription2 = this._colaboradorService.AgregarRecomendacion(Nuevarecomendacion)
  .subscribe((res:any) => {
  
    if(res.body.status == "success"){
       this.personasRecomendadas();
       this.mensaje = "La persona ha sido recomendada a esta oferta.";
     }else{
      this.mensaje = res.body.message;  
     }

  },err => {     
    this.mensaje =err;
 });
}

personasRecomendadas(){
  
  this._subscription3 = this._colaboradorService.ConsultarRecomendacionesXidOportunidad(this.oportunidadModelActual.id)
  .subscribe((res:any) => {
  
    if(res.body.status == "success"){
      this.ListapersonasRecomendadas = res.body.data;
      
      this.displayedColumns = ['profesion', 'nombres', 'areaTrabajo', 'ciudad'];
      this.dataSource = new MatTableDataSource(this.ListapersonasRecomendadas);
    
     }
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

}
