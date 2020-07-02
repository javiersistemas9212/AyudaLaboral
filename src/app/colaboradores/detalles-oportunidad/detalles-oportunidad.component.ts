import { Component, OnInit } from '@angular/core';
import { opportunity } from '../models/opportunity';
import { ColaboradorService } from '../services/colaborador.service';
import { MatDialog } from '@angular/material/dialog';
import { msjresponse } from 'src/app/models/msjResponse';
import { ActivatedRoute } from '@angular/router';
import { MsjConfirmComponent } from 'src/app/msj-confirm/msj-confirm.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalles-oportunidad',
  templateUrl: './detalles-oportunidad.component.html',
  styleUrls: ['./detalles-oportunidad.component.css']
})
export class DetallesOportunidadComponent implements OnInit {

  Addoportunity:opportunity;
  usuario:string;
  Sendmsj: msjresponse;
  detalles:any;
  bloquear:boolean;
  private _subscription:Subscription;
  private _subscription2:Subscription;
 
  constructor(private _route:ActivatedRoute, public DialogConfirm: MatDialog,private _colaboradorService: ColaboradorService) {
  }

  ngOnInit(): void {

    this.detalles =  this._route.snapshot.data.DetallesO; 
  
    if(this.detalles.body.status == "success"){
      this.Addoportunity =this.detalles.body.data[0];
    }

    this.usuario = localStorage.getItem('user');
    this.Sendmsj = {correct: false, msg:'' };   
   
    if (this.Addoportunity.activo == '1'){
     this.bloquear= false;
    }else{
      this.bloquear= true;
    }
}

ngOnDestroy(): void {
 if(this._subscription != undefined){
    this._subscription.unsubscribe();    
  }
 if(this._subscription2 != undefined){  
  this._subscription2.unsubscribe(); 
 }   
}

bloquearOportunidad(){
  this.bloquear = !this.bloquear;
 
  if(this.bloquear){
    this.Addoportunity.activo = "0";
    this.Sendmsj.msg = "La oportunidad se ha bloqueado.";
    
  }else{
    this.Addoportunity.activo = "1"; 
    this.Sendmsj.msg = "La oportunidad se ha desbloqueado.";
    
  }

  this._subscription2 = this._colaboradorService.BloquearOportunidad(this.Addoportunity.activo, this.Addoportunity.id)
  .subscribe((res: any) => {
  
    if(res.body.status == "success"){
      this.Sendmsj.correct = true;
      this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
    }else{
      this.Sendmsj.correct = false;
      this.Sendmsj.msg = res.body.message;
      this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
    }
  },err => {     
    this.Sendmsj.correct = false;
    this.Sendmsj.msg = err;
    this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
 
 });  
}

  ActualizarOportunidad(){
    let fechaActual = new Date();

    this.Addoportunity.fecha = fechaActual.getFullYear() + "/" + fechaActual.getMonth() + "/" + fechaActual.getDate()  ;
    
    this._subscription = this._colaboradorService.ActualizarOportunidad(this.Addoportunity)
    .subscribe((res: any) => {
      if(res.body.status == "success"){
        this.Sendmsj.correct = true;
        this.Sendmsj.msg = "Información Guardada";
        this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
       
       }else{
        this.Sendmsj.correct = false;
        this.Sendmsj.msg = res.body.message;
        this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
     
      }},err => {     
      this.Sendmsj.correct = false;
      this.Sendmsj.msg = err;
      this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
   
    });
  
  }
 

}
