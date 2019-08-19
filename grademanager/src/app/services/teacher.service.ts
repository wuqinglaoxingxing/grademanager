import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  // public domain:string =  'http://www.huanliu.xyz';
  public domain:string = 'http://localhost:8080';

  public header = {
    headers:new HttpHeaders({'Content-type': 'application/json;charset=utf-8'})
  }

  constructor(public http:HttpClient) { }

  updateTeacher(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  updatePwd(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  getTeachers(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();  
  }

  getTeachersByName(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();  
  }

}
