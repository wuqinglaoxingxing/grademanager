import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alogin',
  templateUrl: './alogin.component.html',
  styleUrls: ['./alogin.component.css']
})
export class AloginComponent implements OnInit {

  public username:string;
  public password:string;

  public passwordVisible = false;
  public btnIsLoading = false;

  constructor(public loginService:LoginService,public message:NzMessageService,public router:Router) { 
  }

  ngOnInit() {
    
    let adminObj:any = JSON.parse(this.loginService.getLocalStorageAdmin());
    if(adminObj){
      this.username = adminObj.username;
      this.password = adminObj.password;
    }
  }

  ngAfterViewChecked(): void {
    let adminFlag = this.loginService.loginAdmin;
    if(adminFlag){
      let login_form:any = document.getElementsByClassName("login-form")[0];
      setTimeout(
        ()=>{
          login_form.style.opacity="0.5";
        }
      ,0);
    }
  }

  login(){
    this.btnIsLoading = true;
    let adminObj:any={
      username:this.username,
      password:this.password
    }
    if(this.username!=undefined&&this.password!=undefined&&this.username!=""&&this.password!=""){
      setTimeout(
        ()=>{
          this.loginService.doLogin("/GradeManager/adminLogin",JSON.stringify(adminObj)).then(
            (data:any)=>{
              this.btnIsLoading = false;
              if(data.msg=="true"){
                this.loginService.setLocalStorageAdmin(JSON.stringify(adminObj));
                this.loginService.changIsLogin();
                this.loginService.changeIsAdmin();
                adminObj.avatar = "/assets/avatar/admin.png";
                this.loginService.set(adminObj);
                this.router.navigate(["/aworklist"])
              }else{
                this.message.error("用户名或密码出错!")
              }
            }
          ).catch(
            ()=>{
              this.btnIsLoading = false;
              this.message.error("服务器响应失败,请稍后再试!")
            }
          );
      },1500)
    }else{
      this.btnIsLoading = false;
      this.message.error("用户名或密码不能为空!");
    }
  }

}
