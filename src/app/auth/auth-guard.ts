import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { msjresponse } from '../models/msjResponse';
import { MsjConfirmComponent } from '../msj-confirm/msj-confirm.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  Sendmsj: msjresponse;
 
  constructor(public DialogConfirm: MatDialog, private router: Router) {
    this.Sendmsj = {correct: false, msg:'' };
 
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('user') != null)
      return true;
    else {
      this.router.navigate(['/']);
      this.Sendmsj.correct = false;
      this.Sendmsj.msg = "Por favor inicie sesión oara ingresar a esta opción.";
      this.DialogConfirm.open(MsjConfirmComponent,{data:{Modelmsj : this.Sendmsj}});
  
      return false;
    }

  }
}
