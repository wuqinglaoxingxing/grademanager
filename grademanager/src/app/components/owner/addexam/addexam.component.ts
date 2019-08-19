import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-addexam',
  templateUrl: './addexam.component.html',
  styleUrls: ['./addexam.component.css']
})
export class AddexamComponent implements OnInit {

  public teacherNumber:any;

  public selectedGradeValue:string;
  public selectedMajorValue:string;
  public selectedClazzValue:string;
  public selectedCourseValue:string;
  public selectedTypeValue:string;
  public selectedTimeValue:string;
  public selectInputValue:string;
  public examFlag:boolean = true;
  public isLoading:boolean = false;

  public gradelist:any = [];
  public majorlist:any = [];
  public clazzlist:any = [];
  public courselist:any = [];
  public examtype:any = ["平时考试","期中考试","期末考试"];
  
  constructor(public examService:ExamService,public message:NzMessageService,public loginService:LoginService) { }

  ngOnInit() {
    this.loginService.goHome();
    if(this.loginService.get()){
      this.teacherNumber = this.loginService.get().userNumber;
    }
    this.examService.initGradeList("/GradeManager/initGradeList").then(
      (data:any)=>{
        this.gradelist = data;
      }
    );
    this.examService.initMajorList("/GradeManager/initMajorList").then(
      (data:any)=>{
        this.majorlist = data;
      }
    );
  }

  gradeChange(){
    this.clazzlist = [];
    this.selectedClazzValue = null;
    if(this.selectedGradeValue!=undefined&&this.selectedGradeValue!=null&&this.selectedMajorValue!=null&&this.selectedMajorValue!=undefined){
      let valueObj={
        selectedGradeValue:this.selectedGradeValue,
        selectedMajorValue:this.selectedMajorValue
      }
      this.examService.initClazzList("/GradeManager/initClazzList",JSON.stringify(valueObj)).then(
        (data:any)=>{
          this.clazzlist = data;
        }
      );
    }
    this.examBtn();
  }

  majorChange(){
    this.clazzlist = [];
    this.courselist = [];
    this.selectedClazzValue = null;
    this.selectedCourseValue = null;
    if(this.selectedGradeValue!=undefined&&this.selectedGradeValue!=null&&this.selectedMajorValue!=null&&this.selectedMajorValue!=undefined){
      let valueObj={
        selectedGradeValue:this.selectedGradeValue,
        selectedMajorValue:this.selectedMajorValue
      }
      this.examService.initClazzList("/GradeManager/initClazzList",JSON.stringify(valueObj)).then(
        (data:any)=>{
          this.clazzlist = data;
        }
      );
    }
    if(this.selectedMajorValue!=undefined&&this.selectedMajorValue!=null){
      this.examService.initCourseList("/GradeManager/initCourseList",JSON.stringify(this.selectedMajorValue)).then(
        (data:any)=>{
          this.courselist = data;
        }
      );
    }
    this.examBtn();
  }

  examBtn(){
    if(this.selectedGradeValue!=null&&this.selectedMajorValue!=null&&this.selectedClazzValue!=null&&this.selectedCourseValue!=null&&this.selectedTypeValue!=null&&this.selectedTimeValue!=null){
      this.examFlag = false;
    }else{
      this.examFlag = true;
    }
  }

  addExam(){
    this.isLoading = true;
    let examObj={
      teacherNumber:this.teacherNumber,
      clazzid:this.selectedClazzValue,
      coursename:this.selectedCourseValue,
      type:this.selectedTypeValue,
      time:this.examService.dataFormat(this.selectedTimeValue),
      input:this.selectInputValue
    }
    setTimeout(
      ()=>{
        this.examService.addExam("/GradeManager/addExam",JSON.stringify(examObj)).then(
          (data:any)=>{
            if(data=="success"){
              this.isLoading = false;
              this.message.success("添加成功");
              this.selectedGradeValue = this.selectedMajorValue = this.selectedClazzValue = this.selectedCourseValue = this.selectedTypeValue = this.selectedTimeValue = this.selectInputValue = null;
              this.examFlag = true;
            }
          }
        ).catch(
          ()=>{
            this.isLoading = false;
            this.message.error("服务器出错,添加失败");
          }
        );
      },1500
    )
  }

}
