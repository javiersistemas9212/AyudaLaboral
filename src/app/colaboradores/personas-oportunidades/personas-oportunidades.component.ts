import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColaboradorService } from '../services/colaborador.service';
import { persona } from '../models/persona';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { msjresponse } from 'src/app/models/msjResponse';
import { MsjConfirmComponent } from 'src/app/msj-confirm/msj-confirm.component';

@Component({
  selector: 'app-personas-oportunidades',
  templateUrl: './personas-oportunidades.component.html',
  styleUrls: ['./personas-oportunidades.component.css']
})
export class PersonasOportunidadesComponent implements OnInit {

  profilePersonModel:persona;
  Listconocimientos: Array<string>;
  Listcompetencias: Array<string>; 
  respuesta:any;
  private _subscription: Subscription;
  bloquear: boolean;  
  Sendmsj: msjresponse;
  private _subscription4: Subscription;

  constructor(private _route:ActivatedRoute, 
    public DialogConfirm: MatDialog,
    private _userservice: UserService,
    private _colaboradorService: ColaboradorService) {
  }

  ngOnInit(): void {

    this.respuesta =  this._route.snapshot.data.DetallesP; 
    this.Sendmsj = { correct: false,  msg:""};
    if(this.respuesta.status == "success"){
      this.profilePersonModel=this.respuesta.data[0];
      if(this.profilePersonModel.conocimientos != undefined){
         this.Listconocimientos = this.profilePersonModel.conocimientos.split(';');
         this.Listconocimientos.splice(this.Listconocimientos.indexOf(""),1);   
      }
      if(this.profilePersonModel.competencias != undefined){
        this.Listcompetencias = this.profilePersonModel.competencias.split(';');
        this.Listcompetencias.splice(this.Listcompetencias.indexOf(""),1);
       }
       if (this.profilePersonModel.activo == 1){
        this.bloquear= true;
       }else{
         this.bloquear= false;
       }
    }else{      
      this.bloquear= false;
    }  

   }

   ngOnDestroy(): void {
    if(this._subscription != undefined){
       this._subscription.unsubscribe();    
     }
     if(this._subscription4 != undefined){
      this._subscription4.unsubscribe();    
    }    
   }

   downloadCV(){
    this._subscription = this._colaboradorService.DescargarCV(this.profilePersonModel.CV)
      .subscribe((result: any) => {
          
          var blob = new Blob([result], {type: result.type});
      
          var url = window.URL.createObjectURL(blob);
          var pwa = window.open(url);
          if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
              alert( 'Please disable your Pop-up blocker and try again.');
          }
          
        });
    }

    bloquearUsuario(){

      this.bloquear = !this.bloquear;
   
      if(this.bloquear){
        this.profilePersonModel.activo = 1;
        this.Sendmsj.msg = "Este usuario se ha activado.";
        
      }else{
        this.profilePersonModel.activo = 0; 
        this.Sendmsj.msg = "Este usuario se ha inactivado.";      
      }
  
      this._subscription4 = this._userservice.BloquearUsuario(this.profilePersonModel.activo, this.profilePersonModel.id)
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
    
}
