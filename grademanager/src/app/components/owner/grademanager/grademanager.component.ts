import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { LoginService } from '../../../services/login.service';
import { StudentService } from '../../../services/student.service';
import { NzMessageService,UploadFile } from 'ng-zorro-antd';
import * as G2 from '@antv/g2';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-grademanager',
  templateUrl: './grademanager.component.html',
  styleUrls: ['./grademanager.component.css']
})
export class GrademanagerComponent implements OnInit {

  public examlist:any=[];
  public tnumber:any;
  public isVisibleRegister:boolean = false;
  public isConfirmLoading:boolean = false;

  public studentList:any = [];
  public students:any = [];
  public total:any;
  public loading:boolean = true;
  public pageIndex:any = 1;
  public pageSize:number = 8;
  public grade:number = 0;
  public isDisabled:boolean = true;
  public examid:any;
  public flag:number;

  public isVisibleAnalysis:boolean = false;
  public analysisList:any = [];
  public isSpinning:boolean = false;
  
  public appHidden:boolean = true;
  public data = {};
  public chart:G2.Chart ;
  public chart2:G2.Chart;
  public chart3:G2.Chart;
  public chart4:G2.Chart;
  public graph;

  public isVisibeUpload:boolean = false;
  public fileList:any[];
  public btnFlag:any = 1;
  public checkDisabled:boolean = true;
  public uploadDisable:boolean = false;
  public examCheck:any;
  public progressFlag:boolean = true;
  public progressPrecent:number = 0;
  public progress:any;
  public progressStatus:string = 'active';
  public isUploading:boolean = true;

  public examEname:any;
  public url:any;


  constructor(public examService:ExamService,public loginService:LoginService,public studentService:StudentService,public message:NzMessageService) {
    this.loginService.goHome();
    if(this.loginService.get()){
      this.tnumber = this.loginService.get().userNumber;
      this.url = this.loginService.domain;
      this.initExam();
    }
    // this.tnumber = "018042"
  }

  initExam(){
    this.examService.initExamList("/GradeManager/initExamList",this.tnumber).then(
      (data:any)=>{
        this.examlist = data;
      }
    );
  }

  ngOnInit() {
    this.initExam();
  }

  register(exam,flag){
    this.flag = flag;
    this.examid = exam.id;
    this.isVisibleRegister = true;
    this.loading = true;
    this.studentService.getStudentListByClazz("/GradeManager/getStudentListByClazz",exam.clazz).then(
      (data:any)=>{
        this.loading = false;
        this.total = data.length;
        this.studentList =[]
        this.studentList = data;
        this.students=[];
        this.pageIndex = 1;
        if(data[0]==undefined){
          let o:any={
            grade:1111
          }
          this.studentList[0]=0;
          this.students[0] = o;
        }else{
          for(let i=0;i<=7;i++){
            if(i<this.total){
              this.students.push(data[i]);
            }else{
              return;
            }
          }
        }
        setTimeout(
          ()=>{
            this.loading = false;
        },1000)
      }
    ).catch(
      ()=>{
        this.loading = false;
        this.message.error("加载失败,请重试!");
        this.isVisibleRegister = false;
      }
    )
  }

  alreadyregister(exam,flag){
    this.flag = flag;
    this.examid = exam.id;
    this.examEname = exam.ename;
    this.isVisibleRegister = true;
    this.loading = true;
    this.studentService.selectStudentGrade("/GradeManager/selectStudentGrade",exam.id).then(
      (data:any)=>{
        let jsonobj=eval('('+data+')');
        this.total = jsonobj.length;
        this.studentList =[]
        this.students=[];
        this.pageIndex = 1;
        for(let i=0;i<jsonobj.length;i++){
          let sObj = {
            clazz:"",
            id:"",
            sid:"",
            sname:"",
            phone:"",
            grade:""
          }
          sObj.clazz = jsonobj[i].exam.clazz;
          sObj.grade = jsonobj[i].grade;
          sObj.phone = jsonobj[i].student.phone;
          sObj.sid = jsonobj[i].student.sid;
          sObj.sname = jsonobj[i].student.sname;
          sObj.id = jsonobj[i].id;
          this.studentList.push(sObj);
        }
        for(let i=0;i<=7;i++){
          if(i<this.total){
            this.students.push(this.studentList[i])
          }else{
            return;
          }
        }
      }
    ).catch(
      ()=>{
        this.loading = false;
        this.message.error("加载失败,请重试!");
        this.isVisibleRegister = false;
      }
    )
    setTimeout(
      ()=>{
        this.loading = false;
    },1000);
  }

  analysis(exam){
    this.isSpinning = true;
    this.examid = exam.id;
    this.isVisibleAnalysis = true;
    this.analysisList = [];
    this.studentService.selectStudentGrade("/GradeManager/selectStudentGrade",this.examid).then(
      (data:any)=>{
        let jsonObj = eval("("+data+")");
        jsonObj.forEach(element => {
          let grade = element.grade;
          let student:any = element.student;
          delete student.clazz;
          student.grade = grade;
          this.analysisList.push(student);
        });
        this.histogramWork(this.analysisList);
        this.piePassWork(this.analysisList);
        this.pieAvgWork(this.analysisList);
        this.pointWork(this.analysisList);
      }
    ).catch(
      ()=>{
        this.message.error("服务器响应失败")
      }
    );
  
    setTimeout(
      ()=>{
        this.appHidden = false;
        this.isSpinning = false;
    },1000);
  }

  iKown(){
    this.appHidden = true;
    this.isVisibleAnalysis = false;
    this.chart.destroy();
    this.chart2.destroy();
    this.chart3.destroy();
    this.chart4.destroy();
  }  

  handleCancel(): void {
    this.isVisibleRegister = false;
    this.isDisabled = true;
  }

  handleCancelAnalysis(): void {
    this.appHidden = true;
    this.isVisibleAnalysis = false;
    this.chart.destroy();
    this.chart2.destroy();
    this.chart3.destroy();
    this.chart4.destroy();
  }

  handleCancelUpload():void{
    if(this.isUploading){
      this.isVisibeUpload = false;
      this.progressFlag = true;
      this.checkDisabled = true;
      this.btnFlag = 1;
      this.fileList = [];
    }else{
      this.isVisibeUpload = true;
      this.message.info("正在上传,请勿操作!!!")
    }
   
   
  }

  save(): void {
    this.isConfirmLoading = true;
    let isGradeNull = this.checkGrade(this.studentList);
    if(isGradeNull){
      setTimeout(() => {
        let studentListObj={
          examid:this.examid,
          studentList:this.studentList
        }
        if(this.flag==0){
          this.studentService.addStudentGrade("/GradeManager/addStudentGrade",JSON.stringify(studentListObj)).then(
            (data:any)=>{
              this.message.success("成绩录入成功");
              this.examlist = [];
              this.initExam();
              this.isVisibleRegister = false;
              this.isConfirmLoading = false;
            }
          )
        }else if(this.flag==1){
          this.studentService.updateStudentGrade("/GradeManager/updateStudentGrade",JSON.stringify(studentListObj)).then(
            (data:any)=>{
              this.message.success("成绩修改成功");
              this.examlist = [];
              this.initExam();
              this.isVisibleRegister = false;
              this.isConfirmLoading = false;
            }
          )
        }
       }, 1000);
       this.isDisabled = true;
    }else{
      this.isConfirmLoading = false;
      this.message.error("有成绩未填写");
    }
  }

  update(): void {
    this.isDisabled = !this.isDisabled;
  }

  searchData(){
    this.students = [];
    for(let i=this.pageIndex*8-8;i<=this.pageIndex*8-1;i++){
      if(i<this.total){
        this.students.push(this.studentList[i])
      }else{
        return;
      }
    }
  }

  checkGrade(studentList:any){
    for(let i=0;i<studentList.length;i++){
      if(studentList[i].grade==null||studentList[i].grade==undefined){
        return false;
      }
    }
    return true;
  }

  histogramData(analysisList){
    let score0_20 = 0;let scoreArr0_20=[];
    let score20_40 = 0;let scoreArr20_40=[];
    let score40_60 = 0;let scoreArr40_60=[];
    let score60_80 = 0;let scoreArr60_80=[];
    let score80_100 = 0;let scoreArr80_100=[];
    analysisList.forEach(element => {
      if(element.grade<=20&&element.grade>=0){
        score0_20++;
        scoreArr0_20.push(element)
      }else if(element.grade>20&&element.grade<=40){
        score20_40++;
        scoreArr20_40.push(element)
      }else if(element.grade>40&&element.grade<=60){
        score40_60++;
        scoreArr40_60.push(element);
      }else if(element.grade>60&&element.grade<=80){
        score60_80++;
        scoreArr60_80.push(element);
      }else if(element.grade>80&&element.grade<=100){
        score80_100++;
        scoreArr80_100.push(element);
      }
    });
    let socreObj=[
      {xscore:"0~20",yscore:score0_20,scoreArr0_20:scoreArr0_20},
      {xscore:"20~40",yscore:score20_40,scoreArr20_40:scoreArr20_40},
      {xscore:"40~60",yscore:score40_60,scoreArr40_60:scoreArr40_60},
      {xscore:"60~80",yscore:score60_80,scoreArr60_80:scoreArr60_80},
      {xscore:"80~100",yscore:score80_100,scoreArr80_100:scoreArr80_100},
    ]
    return socreObj;
  }
 
  histogramWork(analysisList){
    let scoreObj = this.histogramData(analysisList);
    
    this.chart = new G2.Chart({
      container: 'app1', // 指定图表容器 ID
      width : window.innerWidth*0.75*0.45, // 指定图表宽度
      height : 300 // 指定图表高度
    });

    this.chart.axis('yscore', {
      title: {
        textStyle: {
          fontSize: 12, // 文本大小
          textAlign: 'center', // 文本对齐方式
          fill: '#999', // 文本颜色
        }
      }
    });

    this.chart.source(scoreObj,{
      "yscore":{
        alias: '人数',
        min:0,
        maxLimit:analysisList.length,
        tickInterval:10,
        tickCount:4
      }
    });
    this.chart.interval().position('xscore*yscore').color('xscore');
    //  渲染图表
    this.chart.render();
  }

  piePassData(analysisList){
    let passNum = 0;
    let nopassNum = 0;
    let count = analysisList.length
    analysisList.forEach(element => {
      if(element.grade<60){
        nopassNum++;
      }else{
        passNum++;
      }
    });
    let temp1:Number = new Number((passNum/count).toFixed(4));
    let temp2:Number = new Number((nopassNum/count).toFixed(4));
    let data = [{
      item: '及格率',
      count: passNum,
      percent:temp1
    }, {
      item: '不及格率',
      count: nopassNum,
      percent: temp2
    }];
    return data;
  }

  piePassWork(analysisList){
    let data = this.piePassData(analysisList);
    this.chart2 = new G2.Chart({
      container: "app2",
      width:window.innerWidth*0.75*0.45,
      height: 300
    });
    this.chart2.source(data, {
      percent: {
        formatter: function formatter(val) {
          val = ((val*10) * 100/10).toFixed(2) + '%';
          return val;
        }
      }
    });
    this.chart2.coord('theta', {
      radius: 0.75,
      innerRadius: undefined,
      startAngle: undefined,
      endAngle: undefined
    });
    this.chart2.tooltip({
      showTitle: false,
      itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    this.chart2.intervalStack().position('percent').color('item',["#38A0FE","#FF2712"]).label('percent', {
      formatter: function formatter(val, item) {
        return item.point.item + ': ' + val;
      }
    }).tooltip('item*percent', function(item, percent) {
      percent = percent * 100 + '%';
      return {
        name: item,
        value: percent
      };
    }).style({
      lineWidth: 1,
      stroke: '#fff'
    });
    this.chart2.render();
  }

  pieAvgData(analysisList){
    let total:number = 0;
    analysisList.forEach(element => {
      total=total +parseInt(element.grade);
    });
    let avgScore = parseInt((total/analysisList.length).toFixed(0));
    let avgCount = 0;
    let noavgCount = 0;
    analysisList.forEach(element => {
      if(element.grade>avgScore){
        avgCount++;
      }else{
        noavgCount++;
      }
    });
    let temp1:Number = new Number((avgCount/analysisList.length).toFixed(2));
    let temp2:Number = new Number((noavgCount/analysisList.length).toFixed(2));
    let data = [{
      item: '高于平均分('+avgScore+'分)率',
      count: avgCount,
      percent:temp1
    }, {
      item: '低于平均分('+avgScore+'分)率',
      count: noavgCount,
      percent:temp2
    }];
    return data;
  }

  pieAvgWork(analysisList){
    let data = this.pieAvgData(analysisList);
    this.chart3 = new G2.Chart({
      container: "app3",
      width:window.innerWidth*0.75*0.45,
      height: 500,
      padding: [ 20, 50, 95, 48 ]
    });

    this.chart3.source(data, {
      percent: {
        formatter: function formatter(val) {
          val = ((val*10) * 100/10).toFixed(0) + '%';
          return val;
        }
      }
    });
    this.chart3.coord('theta');
    this.chart3.tooltip({
      showTitle: false
    });
   
    this.chart3.intervalStack().position('percent').color('item',["#38A0FE","#FCDB5B"]).label('percent', {
      offset: -40,
      textStyle: {
        textAlign: 'center',
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, .45)'
      }
    }).tooltip('item*percent', function(item, percent) {
      percent = percent * 100 + '%';
      return {
        name: item,
        value: percent
      };
    }).style({
      lineWidth: 1,
      stroke: '#fff'
    });
    this.chart3.render();
  }

  pointData(analysisList){
    for(let i=0;i<analysisList.length;i++){
      analysisList[i].xid = i+1;
      analysisList[i].grade = parseInt(analysisList[i].grade);
    }
    return analysisList;
  }

  pointWork(analysisList){
    let data = this.pointData(analysisList);
    this.chart4 = new G2.Chart({
      container: 'app4',
      width:window.innerWidth*0.75*0.45,
      height: 500,
      padding:[40,40,240,40]
    });
    this.chart4.axis('grade', {
      grid: {
        lineStyle: {
          stroke: '#aaaaaa',
          lineWidth: 1,
          lineDash: [ 2, 2 ]
        }
      }
    });
    this.chart4 .source(data,{
        "grade":{
          max:100,
          min:0
        },
        "xid":{
          maxLimit:data.length,
          minLimit:1
        } 
      }
    );
    this.chart4 .tooltip({
      showTitle: false,
      crosshairs: {
        type: 'cross'
      },
      itemTpl: '<li data-index={index} style="margin-bottom:4px;">' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '{name}<br/>' + '{value}' + '</li>'
    });
    this.chart4 .point().position('xid*grade').color('sid').size(4).opacity(0.65).shape('circle').tooltip('sid*sname*grade',
       function(sid, sname, grade) {
        return {
          name: sid,
          value: sname + '(姓名), ' + grade + '(分数)'
        };
      });
    this.chart4 .render();
  }

  downGrade(exam){
    let a = document.createElement("a");
    this.studentService.downGrade("/GradeManager/downGrade",exam.id).then(
      (data)=>{
        a.setAttribute("href", window.URL.createObjectURL(data));
        a.setAttribute("download", this.studentService.guid()+'.xlsx');
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );

  }

  downTemplate(exam){
    let a = document.createElement("a");
    this.studentService.downTemplate("/GradeManager/downTemplate",exam).then(
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

  gradeImport(exam){
    this.isVisibeUpload = true;
    this.examCheck = exam;
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.btnFlag = 1;
    this.fileList=[];
    this.checkDisabled = true;
    if(file.type!=null&&file.type!=undefined){
      if(file.type!="application/vnd.ms-excel"&&file.type!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        this.message.error("包含文件格式不正确，只支持 .xls,.xlsx 格式")
        this.fileList = [];
        return false;
      }else{
        file.exam = this.examCheck;
        this.checkDisabled = false;   
        this.fileList = this.fileList.concat(file);
        return true;
      }
    }
    return false;
  }

  removeFile = (file: UploadFile):boolean =>{
    this.fileList = [];
    this.checkDisabled = true;
    this.btnFlag = 1;
    return false;
  } 

  checkUpload(){
    var formData = new FormData();
    formData.append("name", "file");
    let examStr = JSON.stringify(this.examCheck);
    formData.append("exam",examStr);
    formData.append("file",  this.fileList[0]);
    let headers = new Headers();
    headers.set('Content-Type', 'multipart/form-data');
    if(this.fileList!=null&&this.fileList.length>0){
      this.studentService.uploading("/GradeManager/uploadCheck",formData).then(
        (data:any)=>{
          if(data=="true"){
            this.message.success("校验成功,可以导入");
            this.btnFlag=2;
            this.uploadDisable = false;
          }else{
            this.message.error("校验失败,"+data)
          }
        }
      )
    }
   
  }

  handleUpload(){
    this.progressPrecent = 0;
    this.progressStatus = "active";
    this.progressFlag = false;
    this.uploadDisable = true;
    this.isUploading = false;
    var formData = new FormData();
    formData.append("name", "file");
    formData.append("examid",JSON.stringify(this.examCheck.id));
    formData.append("file",  this.fileList[0]);
    let headers = new Headers();
    headers.set('Content-Type', 'multipart/form-data');
    this.studentService.uploading("/GradeManager/uploading",formData).then(
      (data:any)=>{
        this.progress= setInterval(()=>{
          this.progressPrecent = this.progressPrecent+Math.round(Math.random()*20);
          if(this.progressPrecent>100){
            this.progressPrecent=100;
          }
          if(this.progressPrecent==100){
            clearInterval(this.progress)
            this.progressStatus = 'success';
            this.examlist = [];
            this.initExam();
            this.message.success("导入成功");
            this.isUploading = true;
            this.btnFlag = 3;
          }
        },1000);
      }
    ).catch(
      (data)=>{
        this.message.error("导入失败,请不要乱搞!");
        this.progressStatus = "exception";
        this.isUploading = true;
        this.btnFlag = 3;
      }
    )
  }

  getChange(info : { file: UploadFile }){
  }

  noticeStudent(student,domObj){
    let btnObj = document.getElementById("btn"+domObj);
    
    let jsonStr = {
      student:student,
      examName:this.examEname
     }
    this.studentService.noticeMsg("/GradeManager/noticeMsg",jsonStr).then(
      (data:any)=>{
        let dataObj = JSON.parse(data);
        if(dataObj.code=="000000"){
          this.message.info("已经通知该学生");
          btnObj.setAttribute("disabled","disabled");
          btnObj.style.backgroundColor="#aaaaaa";
        }else{
          this.message.error("通知失败,请与管理员联系");
        }
       
      }
    );
  }

}
