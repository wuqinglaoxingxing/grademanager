import { Component, OnInit,Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  @Input() parent:any;

  constructor(public loginService:LoginService) { }

  ngOnInit() {
    this.loginService.goHome();
  }

  // public openMap = {
  //   sub1: true,
  //   sub2: false,
  //   sub3: false,
  //   sub4: false,
  //   sub5: false
  // };

  // openHandler(value: string): void {
  //   for (const key in this.openMap) {
  //     if (key !== value) {
  //       this.openMap[ key ] = false;
  //     }
  //   }
  // }

  personSetting(){
    this.parent.newTab({id:"perSetting",'name':'个人设置','path':'/owner/perSetting'});
  }

  teacherlist(){
    this.parent.newTab({id:"teacherlist",'name':"教师通讯录",'path':'/owner/teacherlist'})
  }


  studentList(){
    this.parent.newTab({id:"studentList",'name':'学生列表','path':'/owner/studentlist'});
  }

  grademanager(){
    this.parent.newTab({id:"grademanager",'name':'成绩管理','path':'/owner/grademanager'}); 
  }

  addexam(){
    this.parent.newTab({id:"addexam",'name':'考试添加','path':'/owner/addexam'}); 
  }

}
