import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { msjresponse } from '../models/msjResponse';

@Component({
  selector: 'app-msj-confirm',
  templateUrl: './msj-confirm.component.html',
  styleUrls: ['./msj-confirm.component.css']
})
export class MsjConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  
  }

}
