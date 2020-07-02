import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { InfoColaboradorComponent } from './info-colaborador/info-colaborador.component';
import { AddOpportunityComponent } from './add-opportunity/add-opportunity.component';
import { LoginModule } from '../login/login.module';
import { LoginService } from '../login/services/login.service';
import { DetallesOportunidadComponent } from './detalles-oportunidad/detalles-oportunidad.component';
import { DetallesResolve } from './resolvers/resolveDetallesOport';
import { AuthGuard } from '../auth/auth-guard';
import { PersonasInscritasComponent } from './personas-inscritas/personas-inscritas.component';
import { PersonasOportunidadesComponent } from './personas-oportunidades/personas-oportunidades.component';
import { DetallesPersonaResolve } from './resolvers/resolveDetallesPerson';
import { CvPersonasComponent } from './cv-personas/cv-personas.component';
import { DetallesListaPersonaResolve } from './resolvers/resolveDetallesListPerson';
import { RecomendacionesOportunidadComponent } from './recomendaciones-oportunidad/recomendaciones-oportunidad.component';


const routes: Routes = [

  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'Colaborador', component: InfoColaboradorComponent, canActivate:[AuthGuard] },
      { path: 'CrearOportunidad', component: AddOpportunityComponent, canActivate:[AuthGuard]},
      { path: 'Detalles/:id', component: DetallesOportunidadComponent,
      resolve: {
        DetallesO: DetallesResolve 
      }, canActivate:[AuthGuard] },
      { path: 'InfoPersona/:id', component: PersonasOportunidadesComponent,
      resolve: {
        DetallesP: DetallesPersonaResolve 
      }, canActivate:[AuthGuard] },
      { path: 'ListaPersonas', component: CvPersonasComponent,
      resolve: {
        DetallesListaP: DetallesListaPersonaResolve 
      }, canActivate:[AuthGuard] }

]
  },

{ path: '**', redirectTo: '' }

];


@NgModule({
  declarations: [
    HomeComponent,
    MainComponent,
    InfoColaboradorComponent,
    AddOpportunityComponent,
    DetallesOportunidadComponent,
    PersonasInscritasComponent,
    PersonasOportunidadesComponent,
    CvPersonasComponent,
    RecomendacionesOportunidadComponent

  ],
  providers: [],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    LoginModule
  ]
})
export class ColaboradoresModule { }
