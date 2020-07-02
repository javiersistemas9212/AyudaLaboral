import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { profilePerson } from '../models/profilePerson';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { opportunityxser } from '../models/opportunityxser';


const httpOptions: any = {
  observe: "response",
  headers: new HttpHeaders({
    "Accept":  "application/json",
    "Content-Type":"application/x-www-form-urlencoded"
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public rutaApi: string;
 
  constructor(private _http: HttpClient) { 
    this.rutaApi = environment.rutaApi; 
 }
  UsuarioPorUserName(username:string){    
 
    return this._http.get(this.rutaApi + "ConsultarUsuario/"+ username, httpOptions);
 }
  
  ActualizarUsuario(perfil: profilePerson){

    let json = JSON.stringify(perfil);
		let params = "json="+json;
  	return this._http.post(this.rutaApi + "Actualizar-Usuario/" + perfil.id, 
				params, httpOptions);   
  
  }
  DescargarCV(cv: string){
   	return this._http.get(this.rutaApi + "download-file/" + cv, {responseType: "blob"});     
  }

  ListaOportunidades(){    
 
    return this._http.get(this.rutaApi + "ConsultarOportunidades", httpOptions);
 }

 ListaActividadesXUsuario(usuario:string){    
 
  return this._http.get(this.rutaApi + "ConsultarActividadesXUsuario/" + usuario, httpOptions);
}

 inscribirseOportunidad(perfil: opportunityxser, user:string){

  let json = JSON.stringify(perfil);
  let params = "json="+json;
  return this._http.post(this.rutaApi + "InteresOportunidad/"+ user, 
      params, httpOptions);   

}

  
BloquearUsuario(bloquear: number, id: number){

  let bloqUs ={
      activo:bloquear
  };

  let json = JSON.stringify(bloqUs);
  let params = "json="+json;
  
  return this._http.post(this.rutaApi + "BloquearUsuario/" + id, 
      params, httpOptions);   

}


}
