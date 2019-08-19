import { Component, OnInit,ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd'
import * as wangEditor from 'wangeditor/release/wangEditor.js';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-addnotice',
  templateUrl: './addnotice.component.html',
  styleUrls: ['./addnotice.component.css']
})
export class AddnoticeComponent implements OnInit {

  public title:string;
  public editor:any;

  ngOnInit() {
    this.loginService.goAdmin();
  }

  constructor(public el: ElementRef,public message:NzMessageService,public adminService:AdminService,public router:Router,public loginService:LoginService) { }

  ngAfterViewInit() {  
    let editordom = this.el.nativeElement.querySelector('#editorElem');
    this.editor = new wangEditor(editordom)
    this.editor.customConfig.zIndex = 100
    this.editor.create()
  }

  getNotice(){
    let noticeText = this.editor.txt.text();
    let noticeHTML = this.editor.txt.html();
    if(noticeText!=undefined&&noticeText!=""&&this.title!=""&&this.title!=undefined){
      let noticeObj={
        title:this.title,
        notice:noticeHTML
      }
      this.adminService.addNotice("/GradeManager/addNotice",JSON.stringify(noticeObj)).then(
        ()=>{
          this.message.success("添加成功!");
          this.router.navigate(["/aworklist/noticemanager"])
        }
      );
    }else{
      this.message.error("标题和内容不能为空！")
    }
  }
}
