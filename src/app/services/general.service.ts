import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public name;
  response;
  url = 'http://192.168.100.136/nexti/web/app.php/user/';
  constructor(private http: HttpClient) { }

  userInfo() {
    return this.name = localStorage.getItem('name');
  }


  logout(id: string) {
    localStorage.setItem('username', '');
    localStorage.setItem('systemid', '');
    localStorage.setItem('name', '');
    localStorage.setItem('stillLoged', '');
    localStorage.setItem('updatedElements', '0');
    return this.response = this.http.get(this.url + 'logout/' + id);


  }
}
