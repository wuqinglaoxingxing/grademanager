import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isLogin:boolean = false;
  public isAdmin:boolean = false;
  public person :any;
  public isIndex:boolean = true;
  public confirmModal: NzModalRef; // 消息对话框

  constructor(public router:Router,public loginService:LoginService,public modal: NzModalService,
    public registerService:RegisterService){
    this.isLogin = this.loginService.isLogin;
    this.isAdmin = this.loginService.isAdmin;
  }

  ngOnInit() {
  }

  logout(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: '确定注销吗?',
      nzContent: '点击确定将会注销',
      nzOnOk: () => new Promise((resolve, reject) => {
        setTimeout(()=>{
          this.loginService.isLogin = false;
          this.loginService.isAdmin = false;
          this.isIndex = true;
          this.router.navigate(["/home"]);
          this.loginService.set(null);
          resolve('');
        }, 1000);
      }).catch(() => console.log('Oops errors!'))
    });
  }

  ngAfterContentChecked(): void {
    this.isLogin =  this.loginService.isLogin;
    this.isAdmin = this.loginService.isAdmin;
    this.person = this.loginService.get();
  }

  changeIndex(){
    this.loginService.isIndex = false;
  }
  changeIsIndex(){
    this.loginService.isIndex = true;
  }

  loginShow(){
    this.loginService.loginFlag = true;
  }

  // registerShow(){
  //   this.registerService.registerFlag = true;
  // }

  adminShow(){
    this.loginService.loginAdmin = true;
  }
}
