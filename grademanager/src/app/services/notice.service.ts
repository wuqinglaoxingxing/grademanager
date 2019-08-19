import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  // public domain:string =  'http://www.huanliu.xyz';
  public domain:string = 'http://localhost:8080';

  public header = {headers: new HttpHeaders({'Content-type': 'application/json;charset=utf-8'})}

  constructor(public http:HttpClient) { }

  getNoticeList(url:string){
    return new Observable((observer)=>{
      this.http.post(this.domain+url,null,this.header)
      .subscribe((data)=>{
        observer.next(data);
      })
    });
  }

  getNotice(url:string,id:string){
    return new Observable((observer)=>{
      this.http.post(this.domain+url,id,this.header)
      .subscribe((data)=>{
        observer.next(data);
      })
    });
  }

}
