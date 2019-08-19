import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ExamService } from '../../../services/exam.service';
import { StudentService } from '../../../services/student.service';
import {NzModalService} from 'ng-zorro-antd';
import { NzMessageService,UploadFile } from 'ng-zorro-antd';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.component.html',
  styleUrls: ['./addstudent.component.css']
})
export class AddstudentComponent implements OnInit {

  public clazzlist:any = [];
  public pageIndex:any;
  public isVisible:boolean = false;
  public isVisibleStudent:boolean = false;
  public studentList:any;
  public student:any;
  public clazz:any;

  public newStudent:any={};
  public isVisibleAddStudent:boolean = false;
  public isVisibleAddStudents:boolean = false;
  public studentDisabled:boolean = true;
  public studentPageIndex:any;
  public uploading:boolean = true;

  public url:any
  public fileList:any[];

  constructor(public adminService:AdminService,public examService:ExamService,public message:NzMessageService,
    public studentService:StudentService,public modalService: NzModalService,public loginService:LoginService) { }

  ngOnInit() {
    this.loginService.goAdmin();
    this.url = this.adminService.domain;
    let clazzObj={
      selectedGradeValue:-1,
      selectedMajorValue:-1
    }
    this.examService.initClazzList("/GradeManager/initClazzList",JSON.stringify(clazzObj)).then(
      (data:any)=>{
        this.clazzlist = this.sortArr(data);
      }
    );
  }

  checkClazz(clazz){
    this.clazz = clazz;
    this.isVisible = true;
    this.studentService.getStudentListByClazz("/GradeManager/getStudentListByClazz",{id:clazz.id}).then(
      (data:any)=>{
        this.studentList = data;
      }
    );
  }

  showStu(student:Object){
    this.student = student;
    this.isVisibleStudent = true;
  }

  saveStu(){
    let stuDiv:any = document.getElementById("stuDiv");
    let stuName = stuDiv.getElementsByTagName("input")[1].value;
    let stuPhone = stuDiv.getElementsByTagName("input")[2].value;
    if(this.checkName(stuName)&&this.checkPhone(stuPhone)){
      this.student.sname = stuName;
      this.student.phone = stuPhone;
      let stuObj={
        studentId:this.student.sid,
        stuName:stuName,
        stuPhone:stuPhone
      }
      this.adminService.updateStudent("/GradeManager/updateStudent",JSON.stringify(stuObj));
      this.isVisibleStudent = false;
    }else{
      this.modalService.error({
        nzTitle: '修改失败',
        nzContent: "姓名或号码不正确!",
      });
    }
  }

  addStudent(){ 
    this.newStudent.clazzid = this.clazz.id;
    this.adminService.addStudent("/GradeManager/addStudent",JSON.stringify(this.newStudent)).then(
      ()=>{
        this.studentList.push(this.newStudent);
        this.newStudent={};
        this.isVisibleAddStudent = false;
        this.studentPageIndex = 1;
      }
    );
  }

  studentChange(){
    if(this.newStudent.sid!=undefined&&this.newStudent.sid.length>=10&&this.newStudent!=""&&this.newStudent.sname!=""&&this.newStudent.sname!=undefined&&this.newStudent.phone!=""&&this.newStudent.phone!=undefined){
      this.studentDisabled = false;
    }else{
      this.studentDisabled = true;
    }
  }

  handleCancel(){
    if(this.isVisibleStudent==false&&this.isVisibleAddStudent==false&&this.isVisibleAddStudents==false){
      this.isVisible = false;
    }
    if(this.uploading){
      this.isVisibleStudent = false;
      this.isVisibleAddStudent=false;
      this.isVisibleAddStudents=false;
      this.studentDisabled = true;
    }
  }

  openStudent(){
    this.isVisibleAddStudent = true;
  }

  openStudents(){
    this.isVisibleAddStudents = true;
  }

  pageChange(key){
    this.pageIndex = key;
  }

  sortArr(anyArr:Array<any>){
    let sortArr:Array<any> = [];
    let keyArr:Array<any>=[];
    let reArr:Array<any>=[];
    for(let i=0;i<anyArr.length;i++){
      if(!keyArr.includes(anyArr[i].grade.gradename)){
        keyArr.push(anyArr[i].grade.gradename);
      }
    }
    for(let i=0;i<keyArr.length;i++){
      let temp:any = [];
      for(let j=0;j<anyArr.length;j++){
        if(keyArr[i]==anyArr[j].grade.gradename){
          temp.push(anyArr[j]);
        }
      }
      sortArr.push(temp);
    }
    for(let i=0;i<sortArr.length;i++){
      reArr = reArr.concat(sortArr[i]);
    }
    return reArr;
  }

  checkName(name){
    let regex = /^[\u4e00-\u9fa5 ]{2,4}$/;
    if(regex.test(name)){
      return true;
    }else{
      return false;
    }
  }

  checkPhone(phone){
    let phoneHeader:string[]=[
      "139","138","137","136","135","134","159","158","157","150","151","182"
      ,"152","188","130","131","132","156","155","133","153","189","177"
    ];
    let flag :boolean = false;
    let headerStr:string = '';
    if(phone.length>=3){
      headerStr = phone.substring(0,3);
    }
    for(let i=0;i<phoneHeader.length;i++){
      if(headerStr==phoneHeader[i]){
        flag = true;
        break;
      }
    }
    let valueNum = parseInt(phone);
    let valueNumStr = valueNum.toString();
    if((phone==valueNumStr)&&flag&&(valueNumStr.length==11)){
      return true;
    }else{
      return false;
    }
  }

  checkStudentId(){
    let id = parseInt(this.newStudent.sid);
    if(id==this.newStudent.sid&&this.newStudent.sid.length>=10){
      if(this.checkPhone(this.newStudent.phone)&&this.checkName(this.newStudent.sname)){
        this.adminService.isStudentNum("/GradeManager/isStudentNum",this.newStudent.sid).then(
          (data:any)=>{
            if(data==true){
              this.modalService.error({
                nzTitle: '添加失败',
                nzContent: "学号已经存在!",
              });
            }else{
              this.addStudent();
            }
          }
        );  
      }else{
        this.modalService.error({
          nzTitle: '增加失败',
          nzContent: "姓名或号码不正确!",
        });
      }
    }else{
      this.modalService.error({
        nzTitle: '添加失败',
        nzContent: "学号应该为纯数字并且大于10位!",
      });
    }
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList=[];
    if(file.type!=null&&file.type!=undefined){
      if(file.type!="application/vnd.ms-excel"&&file.type!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        this.message.error("包含文件格式不正确，只支持 .xls,.xlsx 格式")
        this.fileList = [];
        return false;
      }else{
        this.fileList = this.fileList.concat(file);
        return true;
      }
    }
    return false;
  }
  removeFile = (file: UploadFile):boolean =>{
    this.fileList = [];
    return false;
  } 

  downStudents(){
    let a = document.createElement("a");
    this.adminService.downStudents("/GradeManager/downStudents").then(
      (data)=>{
        a.setAttribute("href", window.URL.createObjectURL(data));
        a.setAttribute("download", this.studentService.guid()+'.xlsx');
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    )
  }

  studentUpload(){
    this.uploading = false;
    var formData = new FormData();
    let clazzId = JSON.stringify(this.clazz.id);
    formData.append("clazzId",clazzId);
    formData.append("file",  this.fileList[0]);
    let headers = new Headers();
    headers.set('Content-Type', 'multipart/form-data');
    if(this.fileList!=null&&this.fileList.length>0){
      this.adminService.studentUploading("/GradeManager/uploadStudents",formData).then(
        (data:any)=>{
          if(data=="success"){
            this.message.success("添加成功");
            this.studentService.getStudentListByClazz("/GradeManager/getStudentListByClazz",{id:this.clazz.id}).then(
              (data:any)=>{
                this.studentList = data;
                this.fileList = [];
                this.isVisibleAddStudents = false;
                this.uploading = true;
              }
            );
          }else{
            this.message.error(data);
            this.uploading = true;
          }
        }
      ).catch(
        ()=>{
          this.message.error("添加失败");
          this.uploading = true;
        }
      )
    }
  }

  getChange(info : { file: UploadFile }){
  }

}
