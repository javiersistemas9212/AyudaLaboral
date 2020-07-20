import { Component, OnInit } from '@angular/core';
import { opportunity } from '../models/opportunity';
import { MatDialog } from '@angular/material/dialog';
import { ColaboradorService } from '../services/colaborador.service';
import { msjresponse } from 'src/app/models/msjResponse';
import { MsjConfirmComponent } from 'src/app/msj-confirm/msj-confirm.component';
import { Subscription } from 'rxjs';
import { ConsultasService } from '../services/consultas.service';
import { element } from 'protractor';
import { persona } from '../models/persona';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  
  //displayedColumns: string[] = ['id', 'areaTrabajo', 'especialidad', 'ciudad','profesion','experiencia','colaborador','fecha','empresa','activo','descripcion'];    
  dataSource: opportunity[];
  dataSource2: persona[];
 
  Sendmsj: msjresponse; 
  private _subscription2: Subscription;
  usuario: string;
  RecomendacionesxOportunidad:any;
  ActividadesxColaborador:any;

  constructor(public DialogConfirm: MatDialog,
     private _colaboradorService: ColaboradorService,
     private exportar:ConsultasService) { }

  ngOnInit(): void {
    this.usuario = localStorage.getItem('user');  
    this.listaOportunidades();
    this.listaRecomendacionesxOportunidad();
    this.listaActividadesxColaborador();
    this.listaUsuarios();
  }

  ngOnDestroy(): void {
  this._subscription2.unsubscribe();
  this.dataSource = [];
  this.dataSource2 = [];
  this.RecomendacionesxOportunidad=[];
  this.ActividadesxColaborador=[];

  
  }

  listaOportunidades() {

    this._subscription2 = this._colaboradorService.ListaOportunidades(this.usuario)
      .subscribe((res: any) => {
        if (res.body.status == "success") {
          this.dataSource = res.body.data;
        }

      }, err => {
        this.Sendmsj.correct = false;
        this.Sendmsj.msg = 'error ' + err;
        this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });

      }      );
  }

  listaUsuarios() {

    this._colaboradorService.ConsultarUsuarios(this.usuario)
      .subscribe((res: any) => {
        if (res.status == "success") {
          this.dataSource2 = res.data;
        }

      }, err => {
        this.Sendmsj.correct = false;
        this.Sendmsj.msg = 'error ' + err;
        this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });

      }
      );
  }

  listaRecomendacionesxOportunidad() {

    this._subscription2 = this._colaboradorService.ConsultarRecomendacionesReporte(this.usuario)
      .subscribe((res: any) => {
        if (res.body.status == "success") {
          this.RecomendacionesxOportunidad = res.body.data;
           
        }

      }, err => {
        this.Sendmsj.correct = false;
        this.Sendmsj.msg = 'error ' + err;
        this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });

      });
  }

  listaActividadesxColaborador() {

    this._colaboradorService.ConsultarColaboradorReporte(this.usuario)
      .subscribe((res: any) => {
        if (res.body.status == "success") {
          this.ActividadesxColaborador = res.body.data;           
        }
      }, err => {
        this.Sendmsj.correct = false;
        this.Sendmsj.msg = 'error ' + err;
        this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });

      });
  }

  
  exportExcel(NombreConsulta:string){
    let nombrehoja1:string;
    let nombrehoja2:string;
    
    if(NombreConsulta =="oportunidades" && this.dataSource != undefined ){
      nombrehoja1 = "Data oportunidades";
      nombrehoja2 = "Data Actividades";
      this.exportar.exporttoExcel(NombreConsulta,this.dataSource,nombrehoja1,this.RecomendacionesxOportunidad,nombrehoja2);
 
    }

    
    if(NombreConsulta =="colaboradores" && this.dataSource2 != undefined){
      nombrehoja1 = "Data usuarios";
      nombrehoja2 = "Data Actividades";
      this.exportar.exporttoExcel(NombreConsulta,this.dataSource2,nombrehoja1,this.ActividadesxColaborador,nombrehoja2);
 
    }
    

   }
}
