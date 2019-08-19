import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  
  // public domain:string = 'http://www.huanliu.xyz';
  public domain:string = 'http://localhost:8080';
  public header = {headers: new HttpHeaders({'Content-type': 'application/json;charset=utf-8'})}

  constructor(public http:HttpClient) { }

  initGradeList(url:string){
    return this.http.post(this.domain+url,null,this.header).toPromise();
  }  

  initMajorList(url:string){
    return this.http.post(this.domain+url,null,this.header).toPromise();
  }  

  initClazzList(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }  

  initCourseList(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }  

  dataFormat(value:any){
        let date =new Date(value);
        let seperator1 = "-";
        let seperator2 = ":";
        let month:any = date.getMonth() + 1;
        let strDate:any= date.getDate();
        let strHours :any= date.getHours();
        let strMinutes:any = date.getMinutes();
        let strSeconds:any = date.getSeconds();
        
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strHours >= 0 && strHours <= 9) {
            strHours = "0" + strHours;
        }
        if (strMinutes >= 0 && strMinutes <= 9) {
            strMinutes = "0" + strMinutes;
        }
        if (strSeconds >= 0 && strSeconds <= 9) {
            strSeconds = "0" + strSeconds;
        }
        
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + strHours + seperator2 + strMinutes
                + seperator2 + strSeconds;
        return currentdate;
      
  }
    
  addExam(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }  

  initExamList(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

}
