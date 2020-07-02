import { Component, OnInit, Host, Optional, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../login/services/login.service';

@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.css']
})
export class MenuNavComponent implements OnInit {
  
  islogin: boolean;
  private _subscription:Subscription;
  private _subscription2:Subscription;
  typelog:string;
  usuario:string;

  constructor(private _router: Router, private _userservice: LoginService ) { }
 
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._subscription2.unsubscribe();
 }

  ngOnInit(): void {

   this.usuario = localStorage.getItem('user')
   this.islogin = this._userservice.loggedIn;
   this._subscription = this._userservice.isLoggedIn() 
   .subscribe(valor=>{ 
     this.islogin = valor;
     this.usuario = localStorage.getItem('user')
  
   });

   this.typelog = this._userservice.typeusu; 
   
   this._subscription2 = this._userservice.subtypeUsu() 
    .subscribe(valor=>{ 
       this.typelog = valor;       
   });      

  }

 CerrarSesion(){
   this._userservice.logOut();
  
 }
 
}
