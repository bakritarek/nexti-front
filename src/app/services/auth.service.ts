import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'http://192.168.100.136/nexti/web/app.php/';
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  Login(username: string, password: string, systemid: string) {
    return this.http.get(this.url + 'user/login/' + username + '/' + password + '/' + systemid);
  }
  updateData(systemid: string) {
    this.spinner.show();
    return this.http.get(this.url + 'calendar/synchro_data/' + systemid + '/' + localStorage.getItem('id'));
  }
  isLoged() {
    if (localStorage.getItem('username')) {
      return true;
    } else {
      return false;
    }
  }

  stillLoged() {
    return this.http.get(this.url + 'user/still-logged/' + localStorage.getItem('id'));
  }

  Spinner() {

    this.spinner.show();
  }
}
