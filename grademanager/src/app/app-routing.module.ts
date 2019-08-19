import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/home/login/login.component';
import { RegisterComponent } from './components/home/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { OwnerComponent } from './components/owner/owner.component';
import { HeaderComponent } from './components/header/header.component';
import { NoticeComponent} from './components/owner/notice/notice.component';
import { PersonSettingComponent } from './components/owner/person-setting/person-setting.component';
import { TeacherlistComponent } from './components/owner/teacherlist/teacherlist.component';
import { GrademanagerComponent } from './components/owner/grademanager/grademanager.component';
import { AddexamComponent } from './components/owner/addexam/addexam.component';
import { AdminComponent } from './components/admin/admin.component';
import { AloginComponent } from './components/admin/alogin/alogin.component';
import { AdminworklistComponent } from './components/adminworklist/adminworklist.component';
import { NoticemanagerComponent } from './components/adminworklist/noticemanager/noticemanager.component';
import { AddnoticeComponent } from './components/adminworklist/addnotice/addnotice.component';
import { AddteacherComponent } from './components/adminworklist/addteacher/addteacher.component';
import { AddstudentComponent } from './components/adminworklist/addstudent/addstudent.component';
import { AddyearComponent } from './components/adminworklist/addyear/addyear.component';

const routes: Routes = [

  {
    path:"home",component:HomeComponent,
    children:[
      {path:"login",component:LoginComponent},
      {path:"register",component:RegisterComponent},
      { path:"**",component:HomeComponent},
    ]
  },
  {
    path:"aworklist",component:AdminworklistComponent,
    children:[
      {path:"noticemanager",component:NoticemanagerComponent},
      {path:"addnotice",component:AddnoticeComponent},
      {path:"addteacher",component:AddteacherComponent},
      {path:"addstudent",component:AddstudentComponent},
      {path:"addyear",component:AddyearComponent},
      {path:"**",component:NoticemanagerComponent}
    ]
  },
  {
    path:"admin",component:AdminComponent,
    children:[
      {path:"login",component:AloginComponent},
      { path:"**",component:HomeComponent},
    ]
  },
  {
    path:"header",component:HeaderComponent,
  },
  {
    path:"owner",component:OwnerComponent,
    children:[
      { path:"notice",component:NoticeComponent,},
      { path:"perSetting",component:PersonSettingComponent},
      { path:"teacherlist",component:TeacherlistComponent},
      { path:"grademanager",component:GrademanagerComponent},
      { path:"addexam",component:AddexamComponent},
      { path:"**",component:NoticeComponent,},
    ]
  },
  {
    path:"**",component:HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
