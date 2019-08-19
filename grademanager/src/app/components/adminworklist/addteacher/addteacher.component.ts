import { Component, OnInit,ElementRef } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,ValidationErrors, Validators} from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { RegisterService } from '../../../services/register.service';
import { LoginService } from '../../../services/login.service';
import { NzModalService } from 'ng-zorro-antd';
import { Router} from '@angular/router';

@Component({
  selector: 'app-addteacher',
  templateUrl: './addteacher.component.html',
  styleUrls: ['./addteacher.component.css']
})
export class AddteacherComponent implements OnInit {

  public isSpinning:boolean = false; //注册加载

  validateForm: FormGroup;

  ngOnInit(){
    this.loginService.goAdmin();
  }
  
  submitForm = ($event, value) => {
    $event.preventDefault();
    this.isSpinning = true;
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
    let registerStr = JSON.stringify(this.validateForm.value);
    this.validateForm.reset();
    this.rService.doRegister("/GradeManager/register",registerStr).then(
      (data:any)=>{
        setTimeout(()=>{
          this.isSpinning = false;
          this.modalService.success({
            nzTitle: '添加成功...',
            nzContent: '该教师已存入数据库!',
          });
        },2000);
      }
    );
  };

  //清空所有输入框以及绑定的数据
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  }

  //验证两次密码是否一致
  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNumberAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    setTimeout(() => {
      if(control.value!=null){
        this.rService.doIsIdNumer("/GradeManager/isNumber",control.value).then(
          (data)=>{
            if(data==false){
              observer.next({ error: true, exist: true });
            }else{
              observer.next(null);
            }
            observer.complete();
          }
        );
      }
    }, 1000);
  });

  validatePhoneNumber = ( control:FormControl): { [ s: string ]: boolean } => {
    let phoneHeader:string[]=[
      "139","138","137","136","135","134","159","158","157","150","151","182"
      ,"152","188","130","131","132","156","155","133","153","189","177"
    ];
    let value = control.value;
    let flag :boolean = false;
    let headerStr:string = '';
    if(value!=null){
      if(value.length>=3){
        headerStr = value.substring(0,3);
      }
      for(let i=0;i<phoneHeader.length;i++){
        if(headerStr==phoneHeader[i]){
          flag = true;
          break;
        }
      }
      let valueNum = parseInt(value);
      let valueNumStr = valueNum.toString();
      if((value==valueNumStr)&&flag&&(valueNumStr.length==11)){
        return null;
      }else{
        return { phoneNumber: true, error: true };
      }
    }else{
      return { phoneNumber: true, error: true };
    }
  }

  confirmValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  };


  validateName = (control: FormControl):{ [ s: string ]: boolean } => {
    let regex = /^[\u4e00-\u9fa5 ]{2,4}$/;
    let value = control.value;
    if(regex.test(value)){
      return null;
    }else{
      return { username: true, error: true };
    }
  };

  constructor(public fb: FormBuilder,public rService:RegisterService,public registeService:RegisterService,
    public el:ElementRef,public loginService:LoginService,public modalService:NzModalService ,public router:Router) {
    this.validateForm = this.fb.group({
      userNumber: [ '', [ Validators.required ], [ this.userNumberAsyncValidator ] ],
      email   : [ '', [ Validators.email, Validators.required ] ],
      password: [ '', [ Validators.required ] ],
      confirm : [ '', [ this.confirmValidator ] ],
      username: [ '', [this.validateName]],
      phoneNumber : [ '', [ this.validatePhoneNumber ]],
      sex:['0',[Validators.required]]
    });
  }
  
}
