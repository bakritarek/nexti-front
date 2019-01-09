import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {AuthGuard} from './guard/auth.guard';
import {CalendarsComponent} from './components/calendars/calendars.component';

const routes: Routes = [
  { path : '', component : CalendarsComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
  { path : 'calendar', component : CalendarsComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
  { path : 'login', component : LoginComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
