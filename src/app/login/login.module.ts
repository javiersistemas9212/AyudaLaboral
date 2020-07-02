import { NgModule } from '@angular/core';
import { SharedModule  } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';



@NgModule({
  declarations: [
    LoginComponent
  ],
  providers: [
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    CommonModule
   ],
  exports:[    
    LoginComponent
  ]
})
export class LoginModule { }
