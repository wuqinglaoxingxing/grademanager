import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminworklist',
  templateUrl: './adminworklist.component.html',
  styleUrls: ['./adminworklist.component.css']
})
export class AdminworklistComponent implements OnInit {

  constructor(public loginService:LoginService,public router:Router) { 
    this.loginService.goAdmin();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    let menu:any = document.getElementsByClassName("el-menu")[0];
    menu.style.border="none";
  }

  noticeManager(){
    this.router.navigate(["/aworklist/noticemanager"]);
  }

  addTeacher(){
    this.router.navigate(["/aworklist/addteacher"]);
  }

  addStudent(){
    this.router.navigate(["/aworklist/addstudent"]);
  }

  updatemanager(){
    this.router.navigate(["/aworklist/addyear"]);
  }
}
