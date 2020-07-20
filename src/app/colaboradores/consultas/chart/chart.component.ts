import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { ConsultasService } from '../../services/consultas.service';

interface cantidadxfecha{
  fecha:string,
  cant:string
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {
  usuario: string;
  chartdata:any[];
  retVal = [];
  cantxfecha:cantidadxfecha[];
  cantxfechaVer:cantidadxfecha[]=[];

  constructor(private _consultasService:ConsultasService) { }

  ngOnInit(): void {
    this.usuario = localStorage.getItem('user');  
   
    this.dateRange();
    this.consultarDataChartColaboradores();
  
  }

  dateRange(){     
  
     let startDate = new Date();
     let endDate = new Date().setDate(startDate.getDate() - 6);   
    
    var current = startDate;
   
    while (new Date(this.organizarFecha(new Date(endDate))) <= new Date(this.organizarFecha(current))) {
     this.retVal.push(this.organizarFecha(new Date(current)));
     current = new Date(new Date().setDate(current.getDate() - 1));
    }
  
    this._consultasService.ChartActividades(this.usuario, this.organizarFecha(startDate), this.organizarFecha(new Date(endDate)))
    .subscribe((res: any) => {
      if (res.body.status == "success") {
        
        this.cantxfecha = res.body.data;
     
        let encontrado:boolean;
        this.retVal.forEach(element => {        
          encontrado = false;

          this.cantxfecha.forEach(element2 => {
           if(this.organizarFecha(new Date(element)) == this.organizarFecha(new Date(element2.fecha.replace('-','/')))){
             encontrado = true;
              this.cantxfechaVer.push({cant: element2.cant, fecha: element })       
           }
          });

            if (encontrado == false){
                  this.cantxfechaVer.push({cant: "0", fecha: element })   
            }
          });

          this.cargarChartActividades();
      }
    });
  }

  organizarFecha(fechaActual: Date):string{
   return fechaActual.getFullYear() + "/" + (fechaActual.getMonth() + 1)  + "/" + fechaActual.getDate()
  
  }

  consultarDataChartColaboradores(){
   
    this._consultasService.ChartColaboradores(this.usuario)
    .subscribe((res: any) => {
      if (res.body.status == "success") {
        this.chartdata = res.body.data;       
        this.cargarChartColaboradores(this.chartdata.find(element => element.activo == 1),this.chartdata.find(element => element.activo == 0));
      }

    });
  }

  cargarChartColaboradores(Activos:any, Inactivos:any){
      let cantactivos;
      let cantinactivos;

      if (Inactivos == undefined){
        cantinactivos = 0;
      }else{
        cantinactivos = Inactivos.cant;
      }
      
      if (Activos == undefined){
        cantactivos = 0;
      }else{
        cantactivos = Activos.cant;
      }
   
      var myDoughnutChart = new Chart("chartCol", {
        type: 'doughnut',
        data : {
          datasets: [{
              data: [cantinactivos, cantactivos],
            backgroundColor: ['rgb(255, 99, 132)','rgb(78, 247, 64)']
          }],
      
          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: [
              'Inactivos',
              'Activos'
          ]
      }
      
    });
  }

  cargarChartActividades(){
    
    var myDoughnutChart = new Chart("chartAct", {
      type: 'line',
      data : {
          labels: [this.cantxfechaVer[0].fecha, this.cantxfechaVer[1].fecha, this.cantxfechaVer[2].fecha, this.cantxfechaVer[3].fecha, this.cantxfechaVer[4].fecha, this.cantxfechaVer[5].fecha, this.cantxfechaVer[6].fecha],
          datasets: [{
          label: "Actividad por día",
          data: [this.cantxfechaVer[0].cant,this.cantxfechaVer[1].cant, this.cantxfechaVer[2].cant, this.cantxfechaVer[3].cant, this.cantxfechaVer[4].cant, this.cantxfechaVer[5].cant, this.cantxfechaVer[6].cant],
        }]
      },
      options:{
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 80,
            fontColor: 'black'
          }
        }
      }
    
  });
}

}
