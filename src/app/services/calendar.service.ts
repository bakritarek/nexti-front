import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Staff} from '../class/staff';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  url = 'http://192.168.100.136/nexti/web/app.php/calendar/';
  systemid = localStorage.getItem('systemid');
  elementToUpdate = [];
  idsStr = '';
  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private authService: AuthService) { }

  getStaff(systemid: string): Observable <Staff[]> {
    return this.http.get<Staff[]>(this.url + 'get_staffs/' + systemid);
  }

  getStaffByIds(ids: string,  systemid: string): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.url + 'get_staffs_from_ids/' + ids + '/' + systemid + '/' + localStorage.getItem('id') );
  }

  reFormat(str: number) {
    let strs = str.toString();
    if (strs.length < 2) {
      strs = '0' + strs;
      return strs;
    } else {
      return str.toString();
    }

  }

  UpdateOneEvent(event) {
    if (!event.end) {
      event.end = 'ko';
    }

    if (!event.endtime) {
      event.endtime = 'ko';
    }

    return this.http.get(this.url + 'update-event/' + event.id + '/' +  event.start + '/'
      + event.end + '/' + event.starttime + '/' + event.endtime + '/' + localStorage.getItem('systemid') + '/' + localStorage.getItem('id') );
  }

  getSettings(id: string, systemid: string) {
    return this.http.get(this.url + 'settings/' + id + '/' + systemid);
  }
  updateSettings(time: string, snap: boolean, timeout: string, commit: boolean, oppening: string, closing: string, id: string, systemid: string) {
    return this.http.get(this.url + 'settings/update/' + time + '/' + snap + '/' + timeout + '/' + commit + '/' + oppening + '/' + closing + '/' +  id + '/' + systemid);
  }

  beforCommit(id: number) {
    let exist = false;
      this.elementToUpdate.forEach((value => {
        if (value === id) {
          exist = true;
        }
      }));
      if (!exist) {
        this.elementToUpdate.push(id);
      }
  }

  checkUpdateList() {
    if (this.elementToUpdate.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  Commit() {

    this.elementToUpdate.forEach((value => {
      this.idsStr = this.idsStr + value + ';';
    }));
    return this.http.get(this.url + 'commit/update/' + localStorage.getItem('systemid') + '/' + localStorage.getItem('id')) ;
  }
  afterCommit() {
    this.elementToUpdate = [];
    this.authService.updateData(localStorage.getItem('systemid')).subscribe(data => {
      this.spinner.hide();
    });
    return true;
  }

  ChangeStaffFunc(staffid: string, servicecaseid: string, start: string) {
    return this.http.get(this.url + 'change_staff/' + staffid + '/' + servicecaseid + '/' + localStorage.getItem('systemid')  +
    '/' + localStorage.getItem('id') + '/' + start);
  }

}
