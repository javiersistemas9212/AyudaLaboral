import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  islogin:boolean;
  typeusu:string;

  private _subscription:Subscription;
 
  constructor(private _loginService: LoginService) {      
  }

  ngOnDestroy(): void {
     this._subscription.unsubscribe();    
  }

  ngOnInit(): void { 

    this.islogin = this._loginService.loggedIn;
  
    this._subscription = this._loginService.isLoggedIn() 
            .subscribe(valor=>{ 
              this.islogin = valor;
              if (this.islogin) {
                this.validarIngresoActual(localStorage.getItem('user'), "col")
             }else{
              this._loginService.setSubtype("col");        
            }
    });     

    if (this.islogin) {
       this.validarIngresoActual(localStorage.getItem('user'), "col");      
    }else{
       this._loginService.setSubtype("col");        
    }  

  }

  validarIngresoActual(user: string, type: string){
    let valido:string;
  
     this._loginService.validarIngreso(user, type)
       .subscribe((val: any) => {
        valido = val.body.status;
     
        if(valido == "true"){
            this._loginService.setSubtype("col");  
            this.typeusu = "col";
        }else{      
          this._loginService.setSubtype("usu");  
        }
      });
  }
  
}