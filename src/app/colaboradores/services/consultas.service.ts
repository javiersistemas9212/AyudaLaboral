import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const EXCEL_TYPE =
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT ='.xlsx'


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
export class ConsultasService {
  public rutaApi: string;
 
  constructor(private _http: HttpClient) { 
    this.rutaApi = environment.rutaApi; 
 }
  exporttoExcel(excelfileName: string, json: any[],strSheetName: string, json2?: any[],strSheetName2?: string): void{
 
      if(json2 != undefined){

      const worksheet: xlsx.WorkSheet= xlsx.utils.json_to_sheet(json); 
      const worksheet2: xlsx.WorkSheet= xlsx.utils.json_to_sheet(json2);
      const workbook:xlsx.WorkBook= { Sheets:{[strSheetName +'']: worksheet, [strSheetName2 + '']: worksheet2 },
            SheetNames:[strSheetName + '',strSheetName2 + ''] };

     const excelbuffer:any = xlsx.write(workbook,{bookType:'xlsx', type:'array'});
     this.saveExcel(excelbuffer,excelfileName);
        
    }else{
      
      const worksheet: xlsx.WorkSheet= xlsx.utils.json_to_sheet(json); 
      const workbook:xlsx.WorkBook= { Sheets:{[strSheetName +'']: worksheet },
      SheetNames:[strSheetName +''] };

      const excelbuffer:any = xlsx.write(workbook,{bookType:'xlsx', type:'array'});
      this.saveExcel(excelbuffer,excelfileName);  

    }
   }

  private saveExcel(buffer:any, fileName:string) {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getDate() + EXCEL_EXT);
  }

  ChartColaboradores(user: string){    
    return this._http.get(this.rutaApi + "ChartColaborador/" + user, httpOptions);
  }

  ChartActividades(user: string, fechai: string, fechaf:string){   
  
    let dateRange ={
      fechai:fechai,
      fechaf:fechaf
    };
    let json = JSON.stringify(dateRange);
		let params = "json="+json;
  
    return this._http.post(this.rutaApi + "ChartActividades/" + user, params, httpOptions );
  }
  

}
