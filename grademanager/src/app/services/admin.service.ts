import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // public domain:string = 'http://www.huanliu.xyz';
  public domain:string = 'http://localhost:8080';
  public header = {headers: new HttpHeaders({'Content-type': 'application/json;charset=utf-8'})}

  constructor(public http:HttpClient) { }

  addNotice(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  addyear(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  addmajor(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  addCourse(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  addClazz(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  updateStudent(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  isStudentNum(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  addStudent(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  downStudents(url:string){
    return this.http.post(this.domain+url,null,
      {headers: new HttpHeaders({'Content-type': 'application/vnd.ms-excel;charset=utf-8'}),responseType:"blob"}
    ).toPromise();
  }

  studentUploading(url:string,params:any){
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    return this.http.post(this.domain+url,params,{headers:headers}).toPromise();
  }
}

 
