import { Component, OnInit, SimpleChange } from '@angular/core';
import { login } from './models/login';
import { NgForm } from '@angular/forms';
import { register } from './models/register';
import { LoginService } from './services/login.service';
import { msjresponse } from '../models/msjResponse';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MsjConfirmComponent } from '../msj-confirm/msj-confirm.component';
import { Subscription } from 'rxjs';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formModel: login;
  registerModel: register;
  mensajeresponse: string;
  Sendmsj: msjresponse;
  primary:string = 'primary';
  islogin:boolean;
  typelog:string;
  private _subscription:Subscription;
  private _subscription2:Subscription;
 
  constructor(public DialogConfirm: MatDialog,  
		private _router: Router, private _userservice: LoginService) { }

  ngOnInit(): void {
    
    this.formModel = {      UserName: '',      Password: ''    };
    this.registerModel = {      Nombres: '', UserNameR: '', PasswordR: '', ConfirmPassword: '', type: ''   };
    this.Sendmsj = {correct: false, msg:'' };
    this.mensajeresponse = "Ingrese los datos correctos";

      this.islogin =  this._userservice.loggedIn;;      
      this.typelog = this._userservice.typeusu;
      this.registerModel.type = this.typelog;

      this._subscription = this._userservice.subtypeUsu() 
              .subscribe(valor=>{ 
                this.typelog = valor;
                this.registerModel.type = this.typelog;   
              });      
  }

  ngOnDestroy(): void {
    if(this._subscription != undefined){
       this._subscription.unsubscribe();    
     }
   }

  onSubmit(form: NgForm){

    this._subscription = this._userservice.loginUser(form.value, this.typelog)
      .subscribe((res: any) => {

        if(res.body.status == "success"){
              this.Sendmsj.correct = true;
              this.Sendmsj.msg = "Bienvenido " + res.body.data.userName;
              this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
              this._userservice.logIn(res.body.data.userName);
              
              if(this.typelog=="usu"){
                this._router.navigateByUrl('/Perfil');
              }else{
                this._router.navigateByUrl('/Colaboradores/Colaborador');        
              }
            
            }else{
          this.mensajeresponse = res.body.message;
        }},
      err => {
        if (err.status == 400)
          this.mensajeresponse ='Usuario o contraseña incorrecta.';
        else
        this.mensajeresponse = err;
      }
    );

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

    this._subscription2 = this._userservice.registroUsuario(form.value)
    .subscribe((res: any) => {
      
      if(res.body.status == "success"){
        this.Sendmsj.correct = true;
        this.Sendmsj.msg = "Registro correcto, Bienvenido";
        this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
        this._userservice.logIn(res.body.message);        
       
        if(this.typelog=="usu"){
          this._router.navigateByUrl('/Perfil');
        }else{
          this._router.navigateByUrl('/Colaboradores/Colaborador');        
        }
       }else{
        this.mensajeresponse = res.body.message;
      }      
       },err => {
      if (err.status == 400)
        this.mensajeresponse ='Error en el registro.';
      else
      this.mensajeresponse = err;
    }
  );
  }
}

