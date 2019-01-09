import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  instance: string;
  error: string;
  constructor(translate: TranslateService, private service: AuthService, private router: Router, private spinner: NgxSpinnerService) {

  }

  ngOnInit() {
  }

  login() {
    this.service.Login(this.username, this.password, this.instance).subscribe(data => {
      if (data['code'] === 1) {

        localStorage.setItem('username', this.username);
        localStorage.setItem('name', data['name']);
        localStorage.setItem('systemid', this.instance);
        localStorage.setItem('id', data['id']);
        localStorage.setItem('stillLoged', '1');
        localStorage.setItem('updatedElements', '0');
        this.service.updateData(this.instance).subscribe(data2 => {

          this.router.navigate(['/']);
          this.spinner.hide();
        });

      } else {
        this.error = 'incorrect_login_or_password';
      }
    });
  }



}
