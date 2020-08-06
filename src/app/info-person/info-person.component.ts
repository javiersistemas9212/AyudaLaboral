import { Component, OnInit } from '@angular/core';
import { profilePerson } from '../models/profilePerson';
import { ciudad } from '../models/ciudad';
import { UserService } from '../services/user.service';
import { msjresponse } from '../models/msjResponse';
import { MatDialog } from '@angular/material/dialog';
import { MsjConfirmComponent } from '../msj-confirm/msj-confirm.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/services/login.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-info-person',
  templateUrl: './info-person.component.html',
  styleUrls: ['./info-person.component.css']

})

export class InfoPersonComponent implements OnInit {

  profilePersonModel: profilePerson;
  Listconocimientos: Array<string>;
  Listcompetencias: Array<string>;
  terminos: boolean;
  usuario: string;
  mensaje: string;
  sConocimientos: string;
  sCompetencias: string;
  Sendmsj: msjresponse;
  resultUpload: any;
  filesToUpload: Array<File>;
  bloquear:boolean;


  ciudades: ciudad[] = [
    { value: 'Barranquilla', viewValue: 'Barranquilla' },
    { value: 'Bogotá', viewValue: 'Bogota' },
    { value: 'Bucaramanga', viewValue: 'Bucaramanga' },
    { value: 'Cali', viewValue: 'Cali' },
    { value: 'Cartagena', viewValue: 'Cartagena' },
    { value: 'Medellin', viewValue: 'Medellin' }
  ]
  private _subscription: Subscription;
  private _subscription2: Subscription;
  private _subscription4: any;
  private _subscription3: Subscription;

  constructor(private _router: Router, public DialogConfirm: MatDialog, private _userservice: UserService
    , private _loginservice: LoginService) { }

  ngOnInit(): void {
    this.profilePersonModel = {
      id: 0, areaTrabajo: '', campoEspecialidad: '', ciudad: '',
      comentarios: '', competencias: '', conocimientos: '', especializacion: '', fechaDisponibilidad: ''
      , nombres: '', password: '', profesion: '', userName: '', CV: 'null',activo:0
    };
    this.Listconocimientos = [];
    this.Listcompetencias = [];
    this.terminos = false;

    this.usuario = localStorage.getItem('user');
    this.obtenerPerfil();
    this.mensaje = '';
    this.sConocimientos = '';
    this.Sendmsj = { correct: false, msg: '' };

  }

  ngOnDestroy(): void {
    if (this._subscription != undefined) {
      this._subscription.unsubscribe();
    }
    if (this._subscription2 != undefined) {
      this._subscription2.unsubscribe();
    }
    if (this._subscription3 != undefined) {
      this._subscription3.unsubscribe();
    }
    if (this._subscription4 != undefined) {
      this._subscription4.unsubscribe();
    }
  }

  Addconocimientos(conocimiento: string) {
    this.Listconocimientos.push(conocimiento);

  }
  Addcompetencias(competencia: string) {
    this.Listcompetencias.push(competencia);

  }

  BorrarConocimiento(conocimiento: string) {
    this.Listconocimientos.splice(this.Listconocimientos.indexOf(conocimiento), 1);
  }
  BorrarCompetencia(competencia: string) {
    this.Listcompetencias.splice(this.Listcompetencias.indexOf(competencia), 1);
  }

  obtenerPerfil() {

    this._subscription = this._userservice.UsuarioPorUserName(this.usuario)
      .subscribe((res: any) => {

        if (res.body.status == "success") {
          this.profilePersonModel = res.body.data[0];

          if (this.profilePersonModel.conocimientos != null) {
            this.Listconocimientos = this.profilePersonModel.conocimientos.split(';');
            this.Listconocimientos.splice(this.Listconocimientos.indexOf(""), 1);
          }
          if (this.profilePersonModel.competencias != null) {
            this.Listcompetencias = this.profilePersonModel.competencias.split(';');
            this.Listcompetencias.splice(this.Listcompetencias.indexOf(""), 1);
          }
           
          if (this.profilePersonModel.activo == 1){
            this.bloquear= true;
           }else{
             this.bloquear= false;
           }
        }
      });
  }

  ActualizarPersona() {

    this.mensaje = '';
    if (this.profilePersonModel.ciudad == "") {
      this.mensaje = '  El campo ciudad es obligatorio.  ';
    }
    if (this.profilePersonModel.fechaDisponibilidad == null || this.profilePersonModel.fechaDisponibilidad =='0000-00-00' ) {
      this.mensaje = '  El campo Fecha Disponibilidad es obligatorio.  ';
    }
    if (this.profilePersonModel.nombres == "") {
      this.mensaje = '  El campo Nombres es obligatorio.  ';
    }
    if (this.profilePersonModel.profesion == "") {
      this.mensaje = '  El campo Profesion es obligatorio.  ';
    }
    if (this.profilePersonModel.userName == "") {
      this.mensaje = '  El campo Correo Electronico es obligatorio.  ';
    }
    if (this.Listconocimientos.length == 0) {
      this.mensaje = '  Porfavor ingresa tus conocimientos.  ';
    } else {

      this.sConocimientos = '';
      this.Listconocimientos.forEach(element => {
        this.sConocimientos = this.sConocimientos + element + ';';
      });
    }
    this.sCompetencias = '';
    this.Listcompetencias.forEach(element => {
      this.sCompetencias = this.sCompetencias + element + ';';
    });

    if (this.mensaje != '') {
      this.Sendmsj.correct = false;
      this.Sendmsj.msg = this.mensaje;
      this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });
      return;
    }

    this.profilePersonModel.conocimientos = this.sConocimientos;
    this.profilePersonModel.competencias = this.sCompetencias;
  
    let fechaSinFormato = this.profilePersonModel.fechaDisponibilidad;
    let fechaActual = new Date(this.profilePersonModel.fechaDisponibilidad);
  
    this.profilePersonModel.fechaDisponibilidad = fechaActual.getFullYear() + "/" + (fechaActual.getMonth() + 1)  + "/" + fechaActual.getDate()
   
    this._subscription2 =  this._userservice.ActualizarUsuario(this.profilePersonModel)
      .subscribe((res: any) => {
     
        if (res.body.status == "success") {
          this.Sendmsj.correct = true;
          this.Sendmsj.msg = "Datos Actualizados.";
          this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });
     
        } else {
          this.Sendmsj.correct = false;
          this.Sendmsj.msg = "Error al actualizar los datos en el servidor.";
          this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });
        }
             this.profilePersonModel.fechaDisponibilidad = fechaSinFormato;
   
      });
  }

  CerrarSesion() {
    this._loginservice.logOut();
    this._router.navigateByUrl('/');

  }

  fileChangeEvent(fileInput: any) {

    this.filesToUpload = <Array<File>>fileInput.target.files;

    this.makeFileRequest(environment.rutaApi + "upload-file", [], this.filesToUpload)
    .then((result) => {

      this.resultUpload = result;
      this.profilePersonModel.CV = this.resultUpload.filename;

    });

  }


  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      for (var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  downloadCV() {
    this._subscription3 = this._userservice.DescargarCV(this.profilePersonModel.CV)
      .subscribe((result: any) => {
        var blob = new Blob([result], { type: result.type });

        var url = window.URL.createObjectURL(blob);
        var pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert('Please disable your Pop-up blocker and try again.');
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
