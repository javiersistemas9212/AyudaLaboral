import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColaboradorService } from '../services/colaborador.service';
import { persona } from '../models/persona';

@Component({
  selector: 'app-personas-inscritas',
  templateUrl: './personas-inscritas.component.html',
  styleUrls: ['./personas-inscritas.component.css']
})
export class PersonasInscritasComponent implements OnInit {
  

  private _subscription:Subscription;
  @Input() idO: number;  
  personasinscritas:persona[];
  mostrardivinscritos:boolean;

  constructor(private _colaboradorService: ColaboradorService) { }

  ngOnInit(): void {
    
    this.personasinscritas = [];
    this.ListaPersonasInscritas();
    this.mostrardivinscritos = false;

  }
  
ngOnDestroy(): void {
  if(this._subscription != undefined){
     this._subscription.unsubscribe();    
   }
 }

  ListaPersonasInscritas(){
   
    this._subscription = this._colaboradorService.ListaPersonaXOportunidad(this.idO)
    .subscribe((res: any) => {
    
      if(res.body.status == "success"){
        this.personasinscritas = res.body.data;
       }
    });
  
  }
}
