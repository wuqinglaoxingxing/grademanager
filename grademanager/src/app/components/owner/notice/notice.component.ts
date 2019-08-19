import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../../services/notice.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  public noticeList:any;
  public notice:any = {
  };
  public isVisible = false;
  public isSpinning = true;

  constructor(public noticeService:NoticeService,public loginService:LoginService) { }

  ngOnInit() {
    this.loginService.goHome();
    this.noticeService.getNoticeList("/GradeManager/noticeList").subscribe(
      (data:any)=>{
        this.noticeList = data;
      }
    );
  }

  ShowNotice(id){
    this.noticeService.getNotice("/GradeManager/notice",id).subscribe(
      (data)=>{
        this.notice = data;
      }
    );
    this.isVisible = true;
    setTimeout(()=>{
      this.isSpinning = false;
    },750)
  }

  handleOk(): void {
    this.isVisible = false;
    this.isSpinning = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


}
