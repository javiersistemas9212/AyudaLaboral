import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  options: FormGroup;
   islogin: boolean;
   typelog:string;

  private _subscription:Subscription;
  private _subscription2:Subscription;
 
  constructor(fb: FormBuilder, private _userservice: LoginService,private _router: Router   ) { 
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0});
  } 
 
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._subscription2.unsubscribe();
 }

  ngOnInit(): void {

   this.islogin = this._userservice.loggedIn;
   this._subscription = this._userservice.isLoggedIn() 
   .subscribe(valor=>{ 
     this.islogin = valor;
    });

   this.typelog = this._userservice.typeusu; 
   this._subscription2 = this._userservice.subtypeUsu() 
    .subscribe(valor=>{ 
       this.typelog = valor;
   });    

  }

  CerrarSesion(){
    this._userservice.logOut();   
    this._router.navigateByUrl('/Colaborador/');

  }
}
