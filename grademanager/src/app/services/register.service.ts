import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  // public domain:string =  'http://www.huanliu.xyz';
  public domain:string = 'http://localhost:8080';
   
  public registerFlag:boolean = false;

  public header = {headers: new HttpHeaders({'Content-type': 'application/json;charset=utf-8'})}

  constructor(public http:HttpClient) { }


  doRegister(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  doIsIdNumer(url:string,params:any){
    return this.http.get(this.domain+url+"?number="+params).toPromise();
  }
 
}
