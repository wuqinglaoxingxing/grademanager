import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ExamService } from '../../../services/exam.service';
import { NzMessageService} from "ng-zorro-antd"
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-addyear',
  templateUrl: './addyear.component.html',
  styleUrls: ['./addyear.component.css']
})
export class AddyearComponent implements OnInit {

  constructor(public adminService:AdminService,public examService:ExamService,public message:NzMessageService,public cd: ChangeDetectorRef,public loginService:LoginService) {}

  ngOnInit() {
    this.loginService.goAdmin();
  }
 
  public data = [
    {
      title: '年级管理',
      photo:"assets/num/num1.png",
      description:"对学校每年年级的更新和删减",
    },
    {
      title: '专业管理',
      photo:"assets/num/num2.png",
      description:"对学校专业的更新和删减"
    },
    {
      title: '课程管理',
      photo:"assets/num/num3.png",
      description:"对学校固定专业所匹配的课程的更新和删减"
    },
    {
      title: '班级管理',
      photo:"assets/num/num4.png",
      description:"对学校每年班级的更新和删减"
    },
  ];

  public title:any;
  public year:any;
  public yearDisabled:boolean = true;
  public isVisibleGrade:boolean = false;
  public taglist:any;
  
  public isVisibleMajor:boolean = false;
  public major:any;
  
  public isVisibleCourse:boolean = false;
  public selectedValue:any;
  public courses:any;
  public course:any;

  public isVisibleClazz:boolean = false;
  public gradeMajorValue:any;
  public optionValues:any=[];
  public clazzlist:any;
  public tagVisible:boolean = false;
  public tagValue:any;
  
  ngAfterViewChecked(){
      this.cd.detectChanges();
  }
  
  openmanager(title){
    this.title = title;
    if(title=="年级管理"){
      this.isVisibleGrade = true;
      this.examService.initGradeList("/GradeManager/initGradeList").then(
        (data:any)=>{
          data.forEach(element => {
            element.color = this.getColor();
          });
          this.taglist = data;
        }
      );
    }else if(title=="专业管理"){
      this.isVisibleMajor = true;
      this.examService.initMajorList("/GradeManager/initMajorList").then(
        (data:any)=>{
          data.forEach(element => {
            element.color = this.getColor();
          });
          this.taglist = data;
        }
      );
    }else if(title=="课程管理"){
      this.isVisibleCourse = true;
      this.examService.initMajorList("/GradeManager/initMajorList").then(
        (data1:any)=>{
          data1.forEach(element => {
            this.examService.initCourseList("/GradeManager/initCourseList",element.id).then(
              (data2:any)=>{
                element.courseList = data2;
              }
            );
          });
          this.taglist = data1;
        }
      );
    }else if(title=="班级管理"){
      this.isVisibleClazz = true;
      this.examService.initGradeList("/GradeManager/initGradeList").then(
        (data1:any)=>{
          this.optionValues = [];
          data1.forEach(element => {
            let temp={
              value: element.id+'',
              label: element.gradename
            }
            this.optionValues.push(temp);
          });
          this.examService.initMajorList("/GradeManager/initMajorList").then(
            (data2:any)=>{
              let tempArr = [];
              data2.forEach(element => {
                let temp={
                  value: element.id+"",
                  label: element.mname,
                  isLeaf: true
                }
                tempArr.push(temp);
              });
              this.optionValues.forEach(element => {
                element.children = tempArr;
              });
            }
          );
        }
      );
    }
  }

  handleCancel(): void {
    this.isVisibleGrade = false;
    this.isVisibleMajor = false;
    this.isVisibleCourse = false;
    this.isVisibleClazz = false;
    this.tagVisible = false;
  }

  onChange(){
    if(this.year!=""&&this.year!=undefined){
      this.yearDisabled = false;
    }else{
      this.yearDisabled = true;
    }
  }

  selectChange(){
    if(this.selectedValue!=undefined){
      this.selectedValue.courseList.forEach(element => {
        element.color = this.getColor();
      });
      this.courses = this.selectedValue.courseList;
    }
  }

  getClazzList(){
    this.tagValue = null;
    this.tagVisible = false;
    if(this.gradeMajorValue!=undefined&&this.gradeMajorValue!=""){
      let clazzObj={
        selectedGradeValue:this.gradeMajorValue[0],
        selectedMajorValue:this.gradeMajorValue[1]
      }
      this.examService.initClazzList("/GradeManager/initClazzList",JSON.stringify(clazzObj)).then(
        (data:any)=>{
          data.forEach(element => {
            element.color = this.getColor()
          });
          this.clazzlist = data;
        }
      );
    }else{
      this.clazzlist=null;
    }
  }
  
  addcourse(){
    if(this.course!=''&&this.course!=undefined){
      if(this.isCourseFlag(this.courses,this.course.trim())){
        let courseObj={
          majorId:this.selectedValue.id,
          courseStr:this.course.trim()
        }
        this.adminService.addCourse("/GradeManager/addCourse",JSON.stringify(courseObj)).then(
          (data:any)=>{
            this.selectedValue.courseList = data;
            this.selectedValue.courseList.forEach(element => {
              element.color = this.getColor();
            });
            this.courses = this.selectedValue.courseList;
          }
        );
      }else{
        this.message.error("该课程已经存在")
      }
    }else{
      this.message.info("课程名不能为空!")
    }
  }

  addYear(){
    let yyyy = new Date(this.year).getFullYear();
    let yearStr = yyyy+"级";
    if(this.isYearFlag(this.taglist,yearStr)){
      this.adminService.addyear("/GradeManager/addYear",yearStr).then(
        (data:any)=>{
          data.forEach(element => {
            element.color = this.getColor();
          });
          this.taglist = data;
          this.message.success("添加成功");
          this.year = null;
          this.yearDisabled = true;
        }
      );
    }else{
      this.message.info("该年级已存在!")
    }
  }

  addmajor(){
    if(this.major!=undefined&&this.major!=""){
      if(this.isMajorFlag(this.taglist,this.major.trim())){
        this.adminService.addmajor("/GradeManager/addMajor",this.major.trim()).then(
          (data:any)=>{
            data.forEach(element => {
              element.color = this.getColor();
            });
            this.taglist = data;
            this.message.success("添加成功");
            this.major = null;
          }
        );
      }else{
        this.message.info("该专业已经存在!")
      }
    }else{
      this.message.info("专业不能为空！！！")
    }
  }

  handleInputConfirm(){
    if(this.tagValue!=undefined&&this.tagValue.trim()!=""){
      if(this.isClazzFlag(this.clazzlist,this.tagValue)){
        let clazzObj={
          gradeId:this.gradeMajorValue[0],
          majorId:this.gradeMajorValue[1],
          tagValue:this.tagValue
        }
        this.adminService.addClazz("/GradeManager/addClazz",JSON.stringify(clazzObj)).then(
          (data:any)=>{
            this.tagValue = undefined;
            this.tagVisible = false;
          }
        )
        this.clazzlist.push({
          color:this.getColor(),
          cname:this.tagValue
        })
      }else{
        this.message.info("该班级已经存在!");
      }
    }else{
      this.tagValue = undefined;
      this.tagVisible = false;
    }
  }

  showTag(){
    let tagInput:any = document.getElementById("tagInput");
    this.tagVisible = true;
    setTimeout(()=>{
      tagInput.focus();
    },10)
   
  }

  getColor(){
    let str = "#";
    let strArr = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    for(let i=0;i<6;i++){
      let colorStr = parseInt(Math.random()*16+"");
      let key = strArr[colorStr];
      str += key;
    }
    return str;
  }

  isYearFlag(yearArr:Array<any>,yearStr){
    for(let i=0;i<yearArr.length;i++){
      if(yearArr[i].gradename==yearStr){
        return false;
      }
    }
    return true;
  }

  isMajorFlag(majorArr:Array<any>,majorStr:string){
    for(let i=0;i<majorArr.length;i++){
      if(majorArr[i].mname==majorStr.trim()){
        return false;
      }
    }
    return true;
  }

  isCourseFlag(courseList:any,courseStr:string){
    for(let i=0;i<courseList.length;i++){
      if(courseList[i].cname==courseStr.trim()){
        return false;
      }
    }
    return true;
  }

  isClazzFlag(clazzlist:any,tagValue:string){
    for (let i = 0; i < clazzlist.length; i++) {
      if(clazzlist[i].cname==tagValue.trim()){
        return false;
      }
    }
    return true;
  }

  cancel(): void {}
}
