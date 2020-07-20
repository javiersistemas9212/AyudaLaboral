import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { colaborador } from '../models/colaborador';
import { opportunity } from '../models/opportunity';
import { recomendacion } from '../models/recomendacion';

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
export class ColaboradorService {
  public rutaApi: string;
 
  constructor(private _http: HttpClient) { 
    this.rutaApi = environment.rutaApi; 
 }

  ColaboradorPorUserName(username:string){    
 
    return this._http.get(this.rutaApi + "ConsultarColaborador/"+ username, httpOptions);
 }
  
  ActualizarColaborador(perfil: colaborador){

    let json = JSON.stringify(perfil);
		let params = "json="+json;
    
   	return this._http.post(this.rutaApi + "Actualizar-Colaborador/" + perfil.id, 
				params, httpOptions);   
  
  }

  CrearOportunidad(oportunidad: opportunity){

    let json = JSON.stringify(oportunidad);
		let params = "json="+json;
    
   	return this._http.post(this.rutaApi + "CrearOportunidad", 
				params, httpOptions);   
  }
  
  ListaOportunidades(username:string){    
 
    return this._http.get(this.rutaApi + "ConsultarOportunidades/"+ username, httpOptions);
 }

 ListaOportunidadxId(id:string){    
 
  return this._http.get(this.rutaApi + "ConsultarOportunidadesXId/"+ id, httpOptions);
}
  
ActualizarOportunidad(perfil: opportunity){

  let json = JSON.stringify(perfil);
  let params = "json="+json;
  
  return this._http.post(this.rutaApi + "Actualizar-Oportunidad/" + perfil.id, 
      params, httpOptions);   

}

  
BloquearOportunidad(bloquear: string, id: number){

  let bloqOportunida ={
      activo:bloquear
  };

  let json = JSON.stringify(bloqOportunida);
  let params = "json="+json;
  
  return this._http.post(this.rutaApi + "BloquearOportunidad/" + id, 
      params, httpOptions);   

}

ListaPersonaXOportunidad(id:number){    
 
  return this._http.get(this.rutaApi + "ConsultarPersonasOportunidades/"+ id, httpOptions);
}

ConsultarUsuarioxId(id:string, user: string){     
  return this._http.get(this.rutaApi + "ConsultarUsuarioxId/"+ id + "/" + user);
}

ConsultarUsuarios(user: string){    
  return this._http.get(this.rutaApi + "ConsultarUsuarios/" + user);
}

ConsultarUsuariosActivos(user: string){    
  return this._http.get(this.rutaApi + "ConsultarUsuariosActivos/" + user);
}
  
ConsultarRecomendacionesXidOportunidad(id: number){    
  return this._http.get(this.rutaApi + "ConsultarRecomendaciones/" + id, httpOptions);
}

DescargarCV(cv: string){
  return this._http.get(this.rutaApi + "download-file/" + cv, {responseType: "blob"});     
}

AgregarRecomendacion(Nrecomendacion: recomendacion){

  let json = JSON.stringify(Nrecomendacion);
  let params = "json="+json;
  
  return this._http.post(this.rutaApi + "CrearRecomendacion", 
      params, httpOptions);   

}

ConsultarRecomendacionesReporte(user: string){    
  return this._http.get(this.rutaApi + "ConsultarRecomendacionesReportes/" + user, httpOptions);
}

ConsultarColaboradorReporte(user: string){    
  return this._http.get(this.rutaApi + "ConsultarActividadesReportes/" + user, httpOptions);
}


}