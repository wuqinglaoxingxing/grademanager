import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  public index = 0;
  public tabs = [ {id:"notice","name":"公告",'path':'/owner/notice'}];

  public isLogin:boolean;
  public isIndex:boolean = true;

  ngAfterContentChecked(): void {
    this.isLogin =  this.loginService.isLogin;
    this.isIndex = this.loginService.isIndex;
  }


  constructor(public loginService:LoginService,public router:Router) { }

  ngOnInit() {
    this.loginService.goHome();
  }

  closeTab(tab: any): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
  }

  newTab(newTable:any): void {
    if(!this.InArray(this.tabs,newTable)){
      this.tabs.push(newTable);
      this.index = this.tabs.length - 1;
    }else{
      this.index = this.getIndex(this.tabs,newTable);
    }
  }
  
  tabSelect(tab:any){
    this.router.navigate([tab.path]);
  }

  InArray(arr:any,key){
    for(let i=0;i<arr.length;i++){
        if(arr[i].name==key.name){
          return true;
        }
    }
    return false;
  }

  getIndex(arr:any,key){
    for(let i=0;i<arr.length;i++){
      if(arr[i].name==key.name){
        return i;
      }
    }
  }
}
