import { Component, OnInit } from '@angular/core';
import { colaborador } from '../models/colaborador';
import { ciudad } from 'src/app/models/ciudad';
import { ColaboradorService } from '../services/colaborador.service';
import { MatDialog } from '@angular/material/dialog';
import { msjresponse } from 'src/app/models/msjResponse';
import { MsjConfirmComponent } from 'src/app/msj-confirm/msj-confirm.component';
import { LoginService } from 'src/app/login/services/login.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-info-colaborador',
    templateUrl: './info-colaborador.component.html',
    styleUrls: ['./info-colaborador.component.css']
})
export class InfoColaboradorComponent implements OnInit {
    profileColaborador: colaborador;

    ciudades: ciudad[] = [
        { value: 'Barranquilla', viewValue: 'Barranquilla' },
        { value: 'Bogotá', viewValue: 'Bogota' },
        { value: 'Bucaramanga', viewValue: 'Bucaramanga' },
        { value: 'Cali', viewValue: 'Cali' },
        { value: 'Cartagena', viewValue: 'Cartagena' },
        { value: 'Medellin', viewValue: 'Medellin' }
    ]

    usuario: string;
    mensaje: string;
    Sendmsj: msjresponse;

    myForm: FormGroup;
    private _subscription: Subscription;
    private _subscription2: Subscription;

    constructor(
        private _router: Router,
        private _colaboradorService: ColaboradorService,
        public DialogConfirm: MatDialog,
        private _loginservice: LoginService,
        private fb: FormBuilder
    ) {
        this.myForm = this.createOrUpdateForm();
    }

    ngOnInit(): void {
        this.profileColaborador = {
            id: 0, ciudad: '', nombreContacto: '', userName: '', password: '', cargo: '',
            celular: '', empresa: ''
        };
        this.Sendmsj = { correct: false, msg: '' };
        this.usuario = localStorage.getItem('user');
        this.obtenerPerfil();
    }

    ngOnDestroy(): void {
        if(this._subscription != undefined){
           this._subscription.unsubscribe();    
         }
        if(this._subscription2 != undefined){  
         this._subscription2.unsubscribe(); 
        }   
       }

    createOrUpdateForm(data?: any): FormGroup {
        return this.fb.group({
            id: [0],
            ciudad: [''],
            nombreContacto: [data?.nombreContacto, Validators.required],
            userName: [''],
            password: [''],
            cargo: [''],
            celular: [''],
            empresa: ['Openix']
        });
    }

    obtenerPerfil() {
        this._subscription = this._colaboradorService.ColaboradorPorUserName(this.usuario)
            .subscribe((res: any) => {

                if (res.body.status == "success") {
                    this.profileColaborador = res.body.data[0];
                }

            });
    }

    ActualizarColaborador() {
        this.mensaje = '';
        if (this.profileColaborador.ciudad == '') {
            this.mensaje = '  El campo ciudad es obligatorio.  ';
        }
        if (this.profileColaborador.cargo == '') {
            this.mensaje = '  El campo Cargo es obligatorio.  ';
        }
        if (this.profileColaborador.nombreContacto == '') {
            this.mensaje = '  El campo Nombres es obligatorio.  ';
        }
        if (this.profileColaborador.empresa == '') {
            this.mensaje = '  El campo Empresa es obligatorio.  ';
        }
        if (this.profileColaborador.userName == '') {
            this.mensaje = '  El campo Correo Electronico es obligatorio.  ';
        }

        if (this.mensaje != '') {
            this.Sendmsj.correct = false;
            this.Sendmsj.msg = this.mensaje;
            this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });
            return;
        }

        this._subscription2 = this._colaboradorService.ActualizarColaborador(this.profileColaborador)
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

            }, err => {
                this.Sendmsj.correct = false;
                this.Sendmsj.msg = err;
                this.DialogConfirm.open(MsjConfirmComponent, { data: { Modelmsj: this.Sendmsj } });
        
            });
    }

    CerrarSesion() {
        this._loginservice.logOut();
        this._router.navigateByUrl('/Colaborador/');

    }

}
