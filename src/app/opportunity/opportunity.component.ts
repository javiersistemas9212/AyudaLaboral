import { Component, OnInit } from '@angular/core';
import { opportunity } from '../colaboradores/models/opportunity';
import { UserService } from '../services/user.service';
import { DetallesOportunidadComponent } from '../colaboradores/detalles-oportunidad/detalles-oportunidad.component';
import { MatDialog } from '@angular/material/dialog';
import { msjresponse } from '../models/msjResponse';
import { MsjConfirmComponent } from '../msj-confirm/msj-confirm.component';
import { opportunityxser } from '../models/opportunityxser';
import { profilePerson } from '../models/profilePerson';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {

  ListaOportunidades: opportunity[]; 
  DetalleOportunidad:opportunity;
  Sendmsj: msjresponse;
  inscripcion:opportunityxser;
  profilePersonModel: profilePerson;
  usuario:string;
  private _subscription:Subscription;
  private _subscription2: Subscription;
  private _subscription3: Subscription;
 
  constructor(public DialogConfirm: MatDialog, private _userservice: UserService) { }

  ngOnInit(): void {
    
    this.profilePersonModel = {id: 0,areaTrabajo: '',campoEspecialidad: '',ciudad: '',
    comentarios: '',competencias: '', conocimientos: '', especializacion:'',fechaDisponibilidad: ''
    ,nombres: '', password: '',profesion: '',userName: '', CV:'null', activo:0};
     this.usuario = localStorage.getItem('user');
    
    this.ListaOportunidades =[];
    this.ConsultarOportunidades();
    this.DetalleOportunidad={id:0,areaTrabajo:"",colaborador:"",especialidad:"",experiencia:"",
    profesion:"",ciudad:"",fecha:"",activo:'1',empresa:'',descripcion:''};
    this.Sendmsj = {correct: false, msg:'' };
    this.inscripcion={id:0,fecha:'',oportunidadid:0,usuarioid:0};
    this.obtenerPerfil();
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

  ConsultarOportunidades(){
    
    this._subscription = this._userservice.ListaOportunidades()
     .subscribe((res: any) => {
      
      if(res.body.status == "success"){
        this.ListaOportunidades =res.body.data;
      
       }      
       });
 }

 
 inscribirseOportunidad(){

  let fechaActual = new Date();

  this.inscripcion = {
    id:0,
    oportunidadid: this.DetalleOportunidad.id,
    usuarioid: this.profilePersonModel.id,
    fecha:fechaActual.getFullYear() + "/" + fechaActual.getMonth() + "/" + fechaActual.getDate()
  };

  this._subscription2 = this._userservice.inscribirseOportunidad(this.inscripcion, this.usuario)
   .subscribe((res: any) => {
    
    if(res.body.status == "success"){
      this.Sendmsj.correct = true;
      this.Sendmsj.msg = "Te has inscrito en esta oportunidad." ;
      this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});

     }else{

      this.Sendmsj.correct = false;
      this.Sendmsj.msg = res.body.message ;
      this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
      }    
     },err=>{
      this.Sendmsj.correct = false;
      this.Sendmsj.msg = err;
      this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
  
     });
}

obtenerPerfil(){
    
  this._subscription3 = this._userservice.UsuarioPorUserName(this.usuario)
   .subscribe((res: any) => {
    
      if(res.body.status == "success"){
        this.profilePersonModel =res.body.data[0];  
      }
     });
}

 Detalles(oport: opportunity){
     this.DetalleOportunidad = oport;
 }

}
