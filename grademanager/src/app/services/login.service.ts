import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class LoginService{

  public loginFlag:boolean = false;
  public loginAdmin:boolean = false;
  public isLogin:boolean = false;
  public isAdmin:boolean = false;
  public isIndex:boolean = true;

  public domain:string =  'http://www.huanliu.xyz';
  // public domain:string = 'http://localhost:8080';
  public person:any;
 
  public header = {headers: new HttpHeaders({'Content-type': 'application/json;charset=utf-8'})}

  constructor(public http:HttpClient,public router:Router) { }
  
  changeIsAdmin(){
    this.isAdmin = !this.isAdmin;
  }

  changIsLogin(){
    this.isLogin = !this.isLogin;
  }

  doLogin(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  set(person:any){
    this.person = person;
  }
  get(){
    return this.person;
  }

  setLocalStorage(params:any){
    localStorage.setItem("loginer",params);
  }

  getLocalStorage(){
    return localStorage.getItem("loginer");
  }

  setLocalStorageAdmin(params:any){
    localStorage.setItem("admin",params);
  }

  getLocalStorageAdmin(){
    return localStorage.getItem("admin");
  }

  getAvatar(url:string,params:any){
    return this.http.post(this.domain+url,params,this.header).toPromise();
  }

  goHome(){
    if(this.get()==undefined){
      this.router.navigate(["/home"])
    }
  }

  goAdmin(){
    if(this.get()==undefined){
      this.router.navigate(["/admin/login"])
    }
  }
 
}
