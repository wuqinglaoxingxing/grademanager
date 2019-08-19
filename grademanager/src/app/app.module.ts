import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { ElModule } from 'element-angular';
/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { LoginComponent } from './components/home/login/login.component';
import { RegisterComponent } from './components/home/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { OwnerComponent } from './components/owner/owner.component';
import { AsideComponent } from './components/owner/aside/aside.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginService} from './services/login.service';
import { RegisterService} from './services/register.service';
import { HeaderComponent } from './components/header/header.component';
import { PersonSettingComponent } from './components/owner/person-setting/person-setting.component';
import { NoticeComponent} from './components/owner/notice/notice.component';
import { NoticeService } from './services/notice.service';
import { TeacherService } from './services/teacher.service';
import { TeacherlistComponent } from './components/owner/teacherlist/teacherlist.component';
import { GrademanagerComponent } from './components/owner/grademanager/grademanager.component';
import { AddexamComponent } from './components/owner/addexam/addexam.component';
import { ExamService } from './services/exam.service';
import { StudentService } from './services/student.service';
import { AdminComponent } from './components/admin/admin.component';
import { AloginComponent } from './components/admin/alogin/alogin.component';
import { AdminworklistComponent } from './components/adminworklist/adminworklist.component';
import { NoticemanagerComponent } from './components/adminworklist/noticemanager/noticemanager.component';
import { AdminService } from './services/admin.service';
import { AddnoticeComponent } from './components/adminworklist/addnotice/addnotice.component';
import { AddteacherComponent } from './components/adminworklist/addteacher/addteacher.component';
import { AddstudentComponent } from './components/adminworklist/addstudent/addstudent.component';
import { AddyearComponent } from './components/adminworklist/addyear/addyear.component';
import {HashLocationStrategy , LocationStrategy} from '@angular/common';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    OwnerComponent,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    PersonSettingComponent,
    NoticeComponent,
    TeacherlistComponent,
    GrademanagerComponent,
    AddexamComponent,
    AdminComponent,
    AloginComponent,
    AdminworklistComponent,
    NoticemanagerComponent,
    AddnoticeComponent,
    AddteacherComponent,
    AddstudentComponent,
    AddyearComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    /** 导入 ng-zorro-antd 模块 **/
    NgZorroAntdModule,
    HttpClientJsonpModule,
    ElModule.forRoot(),
  ],
  providers: [ 
    { provide: NZ_I18N, useValue: zh_CN },
    RegisterService,
    LoginService,
    NoticeService,
    TeacherService,
    ExamService,
    StudentService,
    AdminService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
