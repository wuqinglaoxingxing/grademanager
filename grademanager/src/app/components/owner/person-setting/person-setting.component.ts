import { Component, OnInit,ElementRef } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { FormBuilder,FormControl,FormGroup,ValidationErrors, Validators} from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { RegisterService } from '../../../services/register.service';
import { NzModalService,NzMessageService } from 'ng-zorro-antd';
import { Router} from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-person-setting',
  templateUrl: './person-setting.component.html',
  styleUrls: ['./person-setting.component.css']
})
export class PersonSettingComponent implements OnInit {

  public sexFlag:boolean = true; 
  public photoList:string[] = [];
  public changeFlag:boolean = false;

  public validateForm: FormGroup;
  
  public person:any = {};
  public oldPerson:any = {};
  public oldAvatar:string;

  public isVisible:boolean = false;
  public loading:boolean=false;
  public password1:string = "";
  public password2:string = "";
  public pwdFlag:boolean = true;
  public pwdBtn:boolean = true;

  ngOnInit() {
    this.loginService.goHome();
    for(let i=0;i<42;i++){
      this.photoList.push("/assets/avatar/"+i+".png")
    }
    this.oldPerson = this.loginService.get();
    this.oldAvatar = this.loginService.get().avatar;
  } 
  
  constructor(public fb: FormBuilder,public loginService:LoginService,public teacherService:TeacherService,public modalService: NzModalService,public message:NzMessageService,public router:Router) {
    this.person = this.loginService.get();
    this.validateForm = this.fb.group({
      username: [ ""+this.person.username, [this.validateName,] ],
      userNumber:[ ""+this.person.userNumber, []],
      sex:[ ''+this.person.sex,[]],
      phoneNumber : [ ""+this.person.phoneNumber, [ this.validatePhoneNumber ] ],
      email:[ ''+this.person.email, [ Validators.email, Validators.required ] ],
    });
  }

  validateName = (control: FormControl):{ [ s: string ]: boolean } => {
    let regex = /^[\u4e00-\u9fa5 ]{2,4}$/;
    let value = control.value;
    if(regex.test(value)){
      return null;
    }else{
      return { username: true, error: true };
    }
  };

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

  edit(){
    let disabledClass:any = document.getElementsByClassName("disabledClass");
    this.changeFlag = true;
    this.sexFlag = false;
    for(let i=1;i<disabledClass.length;i++){
      disabledClass[i].classList.add("undisabledClass");
      disabledClass[i].removeAttribute('disabled');
    }
  }

  submit(){
    let flag = !this.validateForm.valid;
    let sub = document.getElementById("sub");
    if(this.changeFlag){
      if(flag){
        this.modalService.error({
          nzTitle: 'error',
          nzContent: '有错误,不能保存'
        });
      }else{
        this.modalService.success({
          nzTitle: 'success',
          nzContent: '信息已保存'
        });
        let teacherStr = JSON.stringify(this.validateForm.value);
        this.person.username = this.validateForm.value.username;
        this.person.sex = this.validateForm.value.sex;
        this.person.phoneNumber = this.validateForm.value.phoneNumber;
        this.person.email = this.validateForm.value.email;
        this.loginService.set(this.person);
        this.oldAvatar = this.loginService.get().avatar;
        this.teacherService.updateTeacher("/GradeManager/updateTeacher",JSON.stringify(this.person)).then(
          (data:any)=>{
            let disabledClass:any = document.getElementsByClassName("disabledClass");
            this.changeFlag = false;
            this.sexFlag = true;
            for(let i=1;i<disabledClass.length;i++){
              disabledClass[i].classList.remove("undisabledClass");
              disabledClass[i].classList.add("disabledClass");
              disabledClass[i].setAttribute('disabled',"disabled");
            }
          }
        );
      }
    }else{
      this.modalService.info({
        nzTitle: 'info',
        nzContent: '无法保存,需要编辑',
      });
  
    }
   
  }

  reset(){
    this.validateForm.reset();
    if(this.oldAvatar!=undefined&&this.oldAvatar!=""){
      this.oldPerson.avatar = this.oldAvatar;
    }
    this.person = this.oldPerson;
    this.validateForm = this.fb.group({
      username: [ ""+this.person.username, [this.validateName,] ],
      userNumber:[ ""+this.person.userNumber, []],
      sex:[ ''+this.person.sex,[]],
      phoneNumber : [ ""+this.person.phoneNumber, [ this.validatePhoneNumber ] ],
      email:[ ''+this.person.email, [ Validators.email, Validators.required ] ],
    });
  }

  change(photo:any){
    if(this.changeFlag){
      this.person.avatar = photo;
    }else{
      this.modalService.warning({
        nzTitle: 'warning',
        nzContent: '无法更改,需要编辑',
      });
    }
  }

  editPassword(){
    this.isVisible = true;
  }
  handleOk(): void {
    let flag:boolean = false;
    this.loading = true;
    if(this.password1==this.password2&&this.password2.length>5){
      let tempPerson = {
        userNumber:this.person.userNumber,
        password1:this.password1,
        password2:this.password2
      }
      this.teacherService.updatePwd("/GradeManager/updatePwd",JSON.stringify(tempPerson)).then(
        (data:any)=>{
          if(data=="success"){
            flag = true;
          }else{
            flag = false;
          }
        }
      );
    }
    setTimeout(()=>{
      if(flag){
        this.message.success("Successful password modification");
      }else{
        this.message.error("Password modification failed");
      }
      this.loading = false;
      this.isVisible = false;
      this.password1 = this.password2 = "";
      this.pwdFlag = this.pwdBtn = true;
    },2000)
   
  }
  handleCancel(): void {
    this.isVisible = false;
    this.password1 = this.password2 = "";
    this.pwdFlag = this.pwdBtn = true;
  }

  modelkeyUp(e){
    if(e.keyCode==13&&!this.pwdBtn){
      this.handleOk();
    }
  }
  pwd1(){
    if(this.password2!=""){
      if(this.password1!=this.password2||this.password1.length<6){
        this.pwdFlag = false;
        this.pwdBtn = true;
      }else{
        this.pwdFlag = true;
        this.pwdBtn = false;
      }
    }
  }
  pwd2(){
    if(this.password1!=""){
      if(this.password1!=this.password2||this.password2.length<6){
        this.pwdFlag = false;
        this.pwdBtn = true;
      }else{
        this.pwdFlag = true;
        this.pwdBtn = false;
      }
    }
  }

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  };
}
