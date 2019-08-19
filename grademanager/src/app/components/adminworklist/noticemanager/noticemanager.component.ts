import { Component, OnInit,ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd'
import * as wangEditor from 'wangeditor/release/wangEditor.js';
import { AdminService } from '../../../services/admin.service';
import { NoticeService } from '../../../services/notice.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-noticemanager',
  templateUrl: './noticemanager.component.html',
  styleUrls: ['./noticemanager.component.css']
})
export class NoticemanagerComponent implements OnInit {

  public noticeList:any=[];
  public isVisible:boolean = false;
  public notice:any={
    title:""
  };
  public editor:any;
  public pageIndex:any;

  ngOnInit() {
    this.loginService.goAdmin();
    this.noticeService.getNoticeList("/GradeManager/noticeList").subscribe(
      (data:any)=>{
        this.noticeList = data;
        this.noticeList.forEach(element => {
          let text = element.notice.replace(/<\/?[^>]+>/g,"");
          text = text.replace("&nbsp;","")
          element.text = text;
        });
      }
    )
  }

  constructor(public noticeService:NoticeService,public message:NzMessageService,public router:Router,public loginService:LoginService) { }
  
  ngAfterViewInit() {  
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    this.editor = new wangEditor(div1,div2);
    this.editor.create()
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  handleOk(): void {
      this.isVisible = false;
  }
  checknotice(noticeId){
    this.isVisible = true;
    this.noticeService.getNotice("/GradeManager/notice",JSON.stringify(noticeId)).subscribe(
      (data:any)=>{
        this.notice = data;
        this.editor.txt.html(this.notice.notice)
      }
    );
  }
  
  deletenotice(noticeId){
    this.noticeService.getNotice("/GradeManager/deleteNotice",JSON.stringify(noticeId)).subscribe(
      (data:any)=>{
        this.noticeList = data;
        this.message.success("删除成功!")
      }
    );
  }
  cancel(): void {}

  addNotice(){
    this.router.navigate(["/aworklist/addnotice"]);
  }

  pageChange(key){
    this.pageIndex = key;
  }
}
