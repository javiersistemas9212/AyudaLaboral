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
import { NgForm } from '@angular/forms';
import { register } from 'src/app/login/models/register';
import { LoginService } from 'src/app/login/services/login.service';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  
  //displayedColumns: string[] = ['id', 'areaTrabajo', 'especialidad', 'ciudad','profesion','experiencia','colaborador','fecha','empresa','activo','descripcion'];    
  dataSource: opportunity[];
  dataSource2: persona[];
 
  mensajeresponse: string;
  Sendmsj: msjresponse; 
  private _subscription2: Subscription;
  usuario: string;
  RecomendacionesxOportunidad:any;
  ActividadesxColaborador:any;
  registerModel:register;
  typelog: string;

  constructor(public DialogConfirm: MatDialog,
     private _colaboradorService: ColaboradorService,
     private exportar:ConsultasService,
     private _userservice: LoginService) { }

  ngOnInit(): void {
    this.usuario = localStorage.getItem('user');  
    this.registerModel = {      Nombres: '', UserNameR: '', PasswordR: '', ConfirmPassword: '', type: ''   };
    this.mensajeresponse = "Ingrese los datos correctos";
    this.typelog = this._userservice.typeusu;
    this.registerModel.type = this.typelog;
    this.Sendmsj = {correct: false, msg:'' };
  
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

   onRegister(form: NgForm){


    if (this.registerModel.ConfirmPassword.length == 0){
        this.mensajeresponse = "El campo confirmar contraseña es requerido.";
        return;     
    }
    if (this.registerModel.PasswordR.length == 0){
      this.mensajeresponse = "El campo contraseña es requerido.";
      return;     
   }
   if (this.registerModel.UserNameR.length == 0){
     this.mensajeresponse = "El campo correo es requerido.";
     return;     
  }
  if (this.registerModel.Nombres.length == 0){
     this.mensajeresponse = "El campo nombres es requerido.";
     return;     
  }
  if (this.registerModel.PasswordR.length < 6){
     this.mensajeresponse = "La contraseña debe tener una longitud minima de 6 caracteres.";
     return;     
  }

    this._subscription2 = this._userservice.registroPatrocinador(form.value)
    .subscribe((res: any) => {
      
      if(res.body.status == "success"){
        this.Sendmsj.correct = true;
        this.Sendmsj.msg = "Registro correcto";
        this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
        
       }else{
        this.mensajeresponse = res.body.message;
      }      
       },err => {
      if (err.status == 400)
        this.mensajeresponse ='Error en el registro.';
      else
      this.mensajeresponse = err;
    });
  }
}
