import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../login/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  islogin: boolean;
  private _subscription: Subscription;
  private _subscription2: Subscription;

  constructor(private _service: LoginService) { }

  
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    if(this._subscription2 != undefined){
      this._subscription2.unsubscribe();    
    }
  }

  ngOnInit(): void {

    this.islogin = this._service.loggedIn;

    this._subscription = this._service.isLoggedIn()
      .subscribe(valor => {
        this.islogin = valor;
        if (this.islogin) {
           this.validarIngresoActual(localStorage.getItem('user'), "usu")
         
        }else{
          this._service.setSubtype("usu");        
        }
      });

    if (this.islogin) {      
      this.validarIngresoActual(localStorage.getItem('user'), "usu");       
    }else{
      this._service.setSubtype("usu");        
    }    
  }
  
  validarIngresoActual(user: string, type: string){
    let valido:string;
  
    this._subscription2 =  this._service.validarIngreso(user, type)
       .subscribe((val: any) => {
        valido = val.body.status;
      
        if(valido == "true"){
          this._service.setSubtype("usu");  
        }else{      
          this._service.setSubtype("col");  
        }
      });
  }
  

}
