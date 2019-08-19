import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../services/teacher.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginService } from '../../../services/login.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-teacherlist',
  templateUrl: './teacherlist.component.html',
  styleUrls: ['./teacherlist.component.css'],
})
export class TeacherlistComponent implements OnInit {
 
  public pageIndex = 1;
  public pageSize = 10;

  public loading = true;
  public total:number = 1;
  public listOfData = [];

  public sortKey = "";
  public sortValue = "";
  public searchValue:string="";

  constructor(public teacherService:TeacherService,public message:NzMessageService,public loginService:LoginService,private router:Router) {
  }

  ngOnInit() {
    this.loginService.goHome();
    this.searchData();
  }

  sort(sort: { key: string, value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData();
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    if(this.searchValue==""){
      this.searchDataObjFun();
    }else{
      this.searchObjFun();
    }
  }

  search(){
    this.loading = true;
    this.pageIndex = 1;
    if(this.searchValue!=""){
      this.searchObjFun();
    }else{
      this.reset();
    }
  }

  reset(){
    this.searchValue="";
    this.searchData(true);
  }

  searchDataObjFun(){
    let tableInfo={
      pageIndex:this.pageIndex,
      pageSize:this.pageSize,
      sortValue:this.sortValue
    }
    this.teacherService.getTeachers("/GradeManager/getTeachers",JSON.stringify(tableInfo)).then(
      (data: any) => {
        this.loading = false;
        this.total = data.total;
        this.listOfData = eval("("+data.results+")");
    }).catch(
      ()=>{
        this.loading = false;
        this.message.create("error", `服务器出错!!!`);
      }
    );
  }

  searchObjFun(){
    let searchObj={
      pageIndex:this.pageIndex,
      pageSize:this.pageSize,
      searchValue:this.searchValue,
      sortValue:this.sortValue
    }
    this.teacherService.getTeachersByName("/GradeManager/getTeachersByName",JSON.stringify(searchObj)).then(
      (data:any)=>{
        this.loading = false;
        this.total = data.total;
        this.listOfData = eval("("+data.results+")");
      }
    ).catch(
      ()=>{
        this.loading = false;
        this.message.create("error", `服务器出错!!!`);
      }
    );
  }

}
