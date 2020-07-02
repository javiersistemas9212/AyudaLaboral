import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Params} from '@angular/router';
import { ColaboradorService } from '../services/colaborador.service';

@Injectable({
    providedIn:'root'
})

export class DetallesPersonaResolve implements Resolve<any> {

  constructor(private _Service: ColaboradorService) {}

  resolve(route: ActivatedRouteSnapshot) {
   
  	return 	this._Service.ConsultarUsuarioxId(route.paramMap.get('id'),localStorage.getItem('user'));
	
  }
}