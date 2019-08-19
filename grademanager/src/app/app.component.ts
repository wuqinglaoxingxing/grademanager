import { Component } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // public isLogin:boolean;
  // public isIndex:boolean = true;

  // constructor(public loginService:LoginService){
  // }

  // ngAfterContentChecked(): void {
  //   this.isLogin =  this.loginService.isLogin;
  //   this.isIndex = this.loginService.isIndex;
  // }


}
