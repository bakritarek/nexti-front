import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Router} from '@angular/router';
import {CalendarService} from './services/calendar.service';

const MINUTES_UNITL_AUTO_LOGOUT = 1;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private translate: TranslateService) {
    if (localStorage.getItem('lang')) {
      const lang = localStorage.getItem('lang');
      translate.setDefaultLang(lang);

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use(lang);
    } else {
      translate.setDefaultLang('de');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('de');
    }


  }




}
