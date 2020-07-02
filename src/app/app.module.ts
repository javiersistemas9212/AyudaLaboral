import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import  localeEs from '@angular/common/locales/es';
import { SharedModule  } from './shared/shared.module';
import { LoginModule } from './login/login.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuNavComponent } from './menu-nav/menu-nav.component';
import { InfoPersonComponent } from './info-person/info-person.component';
import { HomeComponent } from './home/home.component';
import { UserService } from './services/user.service';
import { MsjConfirmComponent } from './msj-confirm/msj-confirm.component';
import { DetallesCvComponent } from './detalles-cv/detalles-cv.component';
import { registerLocaleData } from '@angular/common';
import { InfoPageComponent } from './info-page/info-page.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { LoginService } from './login/services/login.service';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    MenuNavComponent,
    InfoPersonComponent,
    HomeComponent,
    MsjConfirmComponent,
    DetallesCvComponent,
    InfoPageComponent,
    OpportunityComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    MsjConfirmComponent
  ],
  providers: [
    UserService,
    { provide:  LOCALE_ID, useValue:'es'} 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
