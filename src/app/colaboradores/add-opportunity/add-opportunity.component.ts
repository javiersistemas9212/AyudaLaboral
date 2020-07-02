import { Component, OnInit } from '@angular/core';
import { opportunity } from '../models/opportunity';
import { ColaboradorService } from '../services/colaborador.service';
import { MatDialog } from '@angular/material/dialog';
import { msjresponse } from 'src/app/models/msjResponse';
import { MsjConfirmComponent } from 'src/app/msj-confirm/msj-confirm.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-opportunity',
  templateUrl: './add-opportunity.component.html',
  styleUrls: ['./add-opportunity.component.css']
})
export class AddOpportunityComponent implements OnInit {

  Addoportunity: opportunity;
  Listoportunity: opportunity[];
  Sendmsj: msjresponse;
  usuario: string;
  private _subscription: Subscription;
  private _subscription2: Subscription;

  constructor(public DialogConfirm: MatDialog, private _colaboradorService: ColaboradorService) { }

  ngOnInit(): void {

    let fechaActual = new Date();

    this.usuario = localStorage.getItem('user');
    this.Sendmsj = { correct: false, msg: '' };
    this.Addoportunity = {
      id: 0, areaTrabajo: '', ciudad: '', especialidad: '', experiencia: '',
      profesion: '', colaborador: this.usuario, fecha: fechaActual.getFullYear() + "/" + fechaActual.getMonth() + "/" + fechaActual.getDate()
      , activo: '1', descripcion: '', empresa: ''
    };
    this.Listoportunity = [];
    this.listaOportunidades();

  }

  ngOnDestroy(): void {
    if (this._subscription != undefined) {
      this._subscription.unsubscribe();
    }
    if (this._subscription2 != undefined) {
      this._subscription2.unsubscribe();
    }
  }


  CrearOportunidad() {
    let mensaje: string
    let fechaActual = new Date();

    mensaje = "";

    if (this.Addoportunity.areaTrabajo == "") {
      mensaje = mensaje + '. El campo Área de Trabajo es obligatorio'
    }
    if (this.Addoportunity.ciudad == "") {
      mensaje = mensaje + '. El campo Ciudad es obligatorio'
    }
    if (this.Addoportunity.empresa == "") {
      mensaje = mensaje + '. El campo Empresa es obligatorio'
    }
    if (this.Addoportunity.especialidad == "") {
      mensaje = mensaje + '. El campo Especialidad es obligatorio'
    }
    if (this.Addoportunity.profesion == "") {
      mensaje = mensaje + '. El campo Profesión es obligatorio'
    }

    if(mensaje != ""){
      this.Sendmsj.correct = false;
      this.Sendmsj.msg = mensaje;
      this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });

    }

    this._subscription = this._colaboradorService.CrearOportunidad(this.Addoportunity)
      .subscribe((res: any) => {

        if (res.body.status == "success") {
          this.Sendmsj.correct = true;
          this.Sendmsj.msg = "Información Guardada";
          this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });
          this.listaOportunidades();
         
          this.Addoportunity = {
            id: 0, areaTrabajo: '', ciudad: '', especialidad: '', experiencia: '',
            profesion: '', colaborador: this.usuario, fecha: fechaActual.getFullYear() + "/" + fechaActual.getMonth() + "/" + fechaActual.getDate()
            , activo: '1', descripcion: '', empresa: ''
          };

        } else {
          this.Sendmsj.correct = false;
          this.Sendmsj.msg = res.body.message;
          this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });

        }
      }, err => {
        this.Sendmsj.correct = false;
        this.Sendmsj.msg = err;
        this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });

      });
  }

  listaOportunidades() {

    this._subscription2 = this._colaboradorService.ListaOportunidades(this.usuario)
      .subscribe((res: any) => {
        if (res.body.status == "success") {
          this.Listoportunity = res.body.data;
        }

      }, err => {
        this.Sendmsj.correct = false;
        this.Sendmsj.msg = 'error ' + err;
        this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });

      }
      );
  }
}
