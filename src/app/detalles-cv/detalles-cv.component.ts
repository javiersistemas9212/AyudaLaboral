import { Component, OnInit } from '@angular/core';
import { profilePerson } from '../models/profilePerson';
import { UserService } from '../services/user.service';
import { actividad } from '../models/actividad';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalles-cv',
  templateUrl: './detalles-cv.component.html',
  styleUrls: ['./detalles-cv.component.css']
})
export class DetallesCvComponent implements OnInit {
  profilePersonModel: profilePerson;
  usuario:string;
  Listconocimientos: Array<string>;
  Listcompetencias: Array<string>; 
  listaActividades:actividad[];
  private _subscription: Subscription;
  private _subscription2: Subscription;

  constructor(private _userservice: UserService) { }

  ngOnInit(): void {
    this.profilePersonModel = {id: 0,areaTrabajo: '',campoEspecialidad: '',ciudad: '',
    comentarios: '',competencias: '', conocimientos: '', especializacion:'',fechaDisponibilidad: null
    ,nombres: '', password: '',profesion: '',userName: '', CV:'',activo:0};
    this.listaActividades =[];
    this.usuario = localStorage.getItem('user');
    this.obtenerPerfil();
    this.obtenerActividades();
  }

  ngOnDestroy(): void {
    if(this._subscription != undefined){
       this._subscription.unsubscribe();    
     }
     if(this._subscription2 != undefined){
      this._subscription2.unsubscribe();    
    }
   }

  obtenerPerfil(){
    
    this._subscription = this._userservice.UsuarioPorUserName(this.usuario)
     .subscribe((res: any) => {
      
      if(res.body.status == "success"){
        this.profilePersonModel =res.body.data[0];

        if(this.profilePersonModel.conocimientos != undefined){
            this.Listconocimientos = this.profilePersonModel.conocimientos.split(';');
            this.Listconocimientos.splice(this.Listconocimientos.indexOf(""),1);
        }

       if(this.profilePersonModel.competencias != undefined){
         this.Listcompetencias = this.profilePersonModel.competencias.split(';');
         this.Listcompetencias.splice(this.Listcompetencias.indexOf(""),1);
       }
       }      
       });
 }

 obtenerActividades(){

  this._subscription2 = this._userservice.ListaActividadesXUsuario(this.usuario)
  .subscribe((res: any) => {
   
   if(res.body.status == "success"){
     this.listaActividades =res.body.data;
    }
   
    });
 }


}
