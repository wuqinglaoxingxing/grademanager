import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  // public domain:string =  'http://www.huanliu.xyz';
  public domain:string = 'http://localhost:8080';

  public header = {headers: new HttpHeaders({'Content-type': 'application/json;charset=utf-8'})}

  constructor(public http:HttpClient) { }

  getStudentListByClazz(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }  

  addStudentGrade(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }  

  selectStudentGrade(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }  
  
  updateStudentGrade(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }  

  downGrade(url:string,params:any){
    return this.http.post(this.domain+url,params,
      {headers: new HttpHeaders({'Content-type': 'application/vnd.ms-excel;charset=utf-8'}),responseType:"blob"}
    ).toPromise();
  }

  downTemplate(url:string,params:any){
    return this.http.post(this.domain+url,params,
      {headers: new HttpHeaders({'Content-type': 'application/vnd.ms-excel;charset=utf-8'}),responseType:"blob"}
    ).toPromise();
  }

  uploading(url:string,params:any){
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    return this.http.post(this.domain+url,params,{headers:headers}).toPromise();
  }

  noticeMsg(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

}
