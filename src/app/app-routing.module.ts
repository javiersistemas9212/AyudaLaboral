import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { InfoPersonComponent } from './info-person/info-person.component';
import { AuthGuard } from './auth/auth-guard';
import { DetallesCvComponent } from './detalles-cv/detalles-cv.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { OpportunityComponent } from './opportunity/opportunity.component';


const routes: Routes = [ 
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'Perfil', component: InfoPersonComponent, pathMatch: 'full' , canActivate:[AuthGuard]  },
  { path: 'cv', component: DetallesCvComponent, pathMatch: 'full' , canActivate:[AuthGuard]  },
  { path: 'Oportunidades', component: OpportunityComponent, pathMatch: 'full' , canActivate:[AuthGuard]  },
  { path: 'Informacion', component: InfoPageComponent, pathMatch: 'full' },
  { path: 'Colaboradores', loadChildren:()=> import('./colaboradores/colaboradores.module').then(m => m.ColaboradoresModule) },

  { path: '**', redirectTo: '' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
