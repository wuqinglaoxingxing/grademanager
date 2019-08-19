import { Component, OnInit,ElementRef } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, ValidationErrors,Validators} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public btnIsLoading = false; //按钮初始化不加载

  public validateForm: FormGroup;

  submitForm(): void {
    this.btnIsLoading = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    this.loginService.isIndex = true;
    let value = this.validateForm.value
    let peoStr:string = JSON.stringify(value);

    if(value){
      if(value.remember==true){
        this.loginService.setLocalStorage(peoStr);
      }
    }
 
    setTimeout(()=>{
      this.loginService.doLogin("/GradeManager/login",peoStr).then(
        (data:any)=>{
          if(data){
            this.loginService.set(data);
            this.loginService.getAvatar("/GradeManager/avatar",data.userNumber).then(
              (data:any)=>{
                this.loginService.person.avatar = data.address;
              }
            );
            this.loginService.changIsLogin();
            this.btnIsLoading = false;
            this.router.navigate(["/owner"]);
          }else if(data==false){
            this.btnIsLoading = false;
            this.message.create("error", `用户名或密码出错!!!`);
          }
        }
      ).catch(
        ()=>{
          this.btnIsLoading = false;
          this.message.create("error", `服务器出错!!!`);
        }
      );
    },1500);

  }

  constructor(public fb: FormBuilder,public loginService:LoginService,public router:Router,public el:ElementRef,
    public registerService:RegisterService,public message:NzMessageService) {
  }

  ngOnInit(): void {
    let obj = JSON.parse(this.loginService.getLocalStorage());
    if(obj){
      this.validateForm = this.fb.group({
        usernumber: [ obj.usernumber, [ Validators.required ] ],
        password: [ obj.password, [ Validators.required ] ],
        remember: [ true ]
      });
    }else{
      this.validateForm = this.fb.group({
        usernumber: [ null, [ Validators.required ] ],
        password: [ null, [ Validators.required ] ],
        remember: [ true ]
      });
    }
    
  }

  ngAfterViewChecked(): void {
    let login_form = this.el.nativeElement.querySelector('.login-form');
    if(this.loginService.loginFlag){
      setTimeout(
        ()=>{
          login_form.style.opacity="0.5";
        }
      ,0);
    }
  }
}