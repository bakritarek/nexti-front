import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {GeneralService} from '../../services/general.service';
import {Router} from '@angular/router';
import {CalendarService} from '../../services/calendar.service';
import {NgxSpinnerComponent, NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username;
  lang;
  usersettings;
  snapDisabled;
  settings;
  defaultTime;
  commit;
  snap;
  MINUTES_UNITL_AUTO_LOGOUT;
  commitColor;
  updatedElements = '0';
  oppening;
  closing;
  SettingModalIsOpen = false;
  EventStatus;
  Title1;
  Title2;
  Title3;
  Titles ;
  Titles2 ;
  Titles3;

  constructor(public isLoged: AuthService, private translate: TranslateService, public user: GeneralService, private router: Router,
              private calendarService: CalendarService) {
    this.username = localStorage.getItem('name');
    this.lang = localStorage.getItem('lang');
  }

  ngOnInit() {
  }

  changeLang(str: string) {
    localStorage.setItem('lang', str);
    this.lang = localStorage.getItem('lang');
    this.translate.use(str);
    window.location.reload();
  }

  logout() {
    this.user.logout(localStorage.getItem('id')).subscribe(data => {
    });
    this.router.navigate(['/login']);
  }

  LocalStorage() {
    return localStorage.getItem('updatedElements');
  }
  Commit() {
    this.isLoged.Spinner();
    this.calendarService.Commit().subscribe(data => {
      if (data === 1) {
        localStorage.setItem('updatedElements', '0');
        setTimeout(() => {
          this.calendarService.afterCommit();
        }, 1000);
        window.location.reload();
      }
    });


  }
  UpdateTitlesArray() {
    this.calendarService.getTitlesCon(this.Title2, this.Title3).subscribe(Titles => {
      this.Titles = Titles;
      console.log(Titles);
    });
    this.calendarService.getTitlesCon(this.Title1, this.Title3).subscribe(Titles2 => {
      this.Titles2 = Titles2;
      console.log(Titles2);
    });
    this.calendarService.getTitlesCon(this.Title1, this.Title2).subscribe(Titles3 => {
      this.Titles3 = Titles3;
      console.log(Titles3);
    });
  }
  DisplaySettings() {
    this.prepareCalendar();

    if (this.defaultTime !== '1') {
      this.snapDisabled = false;
    }
    this.settings = true;
    setTimeout(() => {
      this.UpdateTitlesArray();
      this.SettingModalIsOpen = true;

    }, 100);
  }
  UnDisplaySettings() {
    this.settings = false;
    this.SettingModalIsOpen = false;
    this.Refresh();
  }

  ClickOutSide() {
    if (this.SettingModalIsOpen === true) {
      this.settings = false;
      this.SettingModalIsOpen = false;
      this.Refresh();
    }
  }
  prepareCalendar() {
    this.usersettings = this.calendarService.getSettings(localStorage.getItem('id'), localStorage.getItem('systemid')).subscribe(data => {
      this.commit = data['commit'] === 'true';

      this.snap = data['snap'] === 'true';
      this.defaultTime = data['time_interval'];
      this.MINUTES_UNITL_AUTO_LOGOUT = data['timeout'];
      this.oppening = data['start_time'];
      this.closing = data['end_time'];
      this.Title1 = data['title'];
      this.Title2 = data['title2'];
      this.Title3 = data['title3'];
      if (data['status'] === '1') {
        this.EventStatus = true;
      }
      if (data['status'] === '0') {
        this.EventStatus = false;
      }

    });
  }

  Refresh() {
    this.UpdateSettingsNoTimeOut();
    setTimeout(() => {
      window.location.reload();
    }, 500);

  }

  UpdateSettings() {
    setTimeout(() => {
      this.calendarService.updateSettings(
        this.defaultTime, this.snap, this.MINUTES_UNITL_AUTO_LOGOUT, this.commit, this.oppening,
        this.closing, this.Title1, this.Title2, this.Title3, this.EventStatus, localStorage.getItem('id'), localStorage.getItem('systemid'))
        .subscribe(
          data => {
          }
        );
    }, 100);
  }
  UpdateSettingsNoTimeOut() {
    let status;
    if (this.EventStatus) {
      status = '1';
    } else {
      status = '0';
    }
    this.calendarService.updateSettings(
      this.defaultTime, this.snap, this.MINUTES_UNITL_AUTO_LOGOUT, this.commit,
      this.oppening, this.closing, this.Title1, this.Title2, this.Title3, status, localStorage.getItem('id'), localStorage.getItem('systemid'))
      .subscribe(
        data => {
        }
      );
  }

  spinnerFun() {
    this.isLoged.Spinner();
  }
}
