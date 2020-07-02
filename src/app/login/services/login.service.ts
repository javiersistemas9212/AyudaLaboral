import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subject, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { login } from '../models/login';
import { register } from '../models/register';


const httpOptions: any = {
  observe: "response",
  headers: new HttpHeaders({
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded"
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public rutaApi: string;
  private logger = new Subject<boolean>();
  public loggedIn: boolean;
  private subtype = new Subject<string>();
  public typeusu: string;

  constructor(private _http: HttpClient) {
    this.rutaApi = environment.rutaApi;
    this.loggedIn = !!localStorage.getItem('user');
    this.typeusu =  "usu";     
    this.tipoEstadoInicial(localStorage.getItem('user'),'usu');
  
  }

  loginUser(usuario: login, type: string) {
    return this._http.get(this.rutaApi + "Login/" + usuario.UserName + "/" + usuario.Password + "/" + type, httpOptions);

  }

  registroUsuario(registro: register) {

    let json = JSON.stringify(registro);
    let params = "json=" + json;
    return this._http.post(this.rutaApi + "Registro",
      params, httpOptions);
  }

  isLoggedIn(): Observable<boolean> {
    return this.logger.asObservable();
  }

  subtypeUsu(): Observable<string> {
    return this.subtype.asObservable();
  }

  setSubtype(providerResponse: string) {
    this.typeusu = providerResponse;
    this.subtype.next(this.typeusu);
  }

  logIn(providerResponse: string) {
    localStorage.setItem('user', providerResponse);
    this.loggedIn = true;
    this.logger.next(this.loggedIn);
  }

  logOut() {
    localStorage.removeItem('user');
    this.loggedIn = false;
    this.logger.next(this.loggedIn);

  }

  validarIngreso(user: string, type: string) {
    return this._http.get(this.rutaApi + "ValidarIngreso/" + user + "/" + type, httpOptions);
  }

  async tipoEstadoInicial(user: string, type: string){
    let valido: string;
    
    if (this.loggedIn) {

      await this.validarIngreso(user, type)
      .toPromise().then((val: any) => {
        valido = val.body.status;
        if (valido == "true") {
          this.typeusu =  "usu";
        } else {
          this.typeusu =  "col";
         }
      });

    } else {
       this.typeusu =  "usu";
    }
  }

}
