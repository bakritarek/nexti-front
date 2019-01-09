import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';
import {Staff} from '../../class/staff';
import {CalendarService} from '../../services/calendar.service';
import {ServiceCase} from '../../class/service-case';
import {GeneralService} from '../../services/general.service';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {endTimeRange} from '@angular/core/src/profile/wtf_impl';
import {and} from '@angular/router/src/utils/collection';
const STORE_KEY =  'lastAction';
const CHECK_INTERVAL = 100;
@Component({
  selector: 'app-calendars',
  templateUrl: './calendars.component.html',
  styleUrls: ['./calendars.component.css']
})
export class CalendarsComponent implements OnInit {
  // Calendar
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  calendarOptions: Options;
  // System ID
  systemid = localStorage.getItem('systemid');
  // Staff
  staff: Staff;
  staffs = [];
  elemChecked = [];
  color;
  idsStr;
  // Events
  event: ServiceCase;
  events = [];
  elemUpdated: any;
  pop = false;
  SelectedElem: any;
  left;
  top;
  settings = false;
  defaultTime;
  usersettings;
  snap: boolean;
  commit: boolean;
  snapDisabled = true;
  updatedElements = false;
  moment = moment();
  MINUTES_UNITL_AUTO_LOGOUT;
  commitColor = '#ccc';
  scrollHeigth = '300px';
  @ViewChild('Row') Row: ElementRef;
  @ViewChild('Calendar') Calendar: ElementRef;
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('start') start: ElementRef;
  @ViewChild('end') end: ElementRef;
  @ViewChild('settingModal') settingModal: ElementRef;
  oppening;
  closing;
  NavbarWidth;
  ChangeStaffModal = false;
  SelectedStaff: any;
  eventId;
  month;
  week;
  day;
  list;
  today;
  StartTime;
  endTime;
  reziseCalendar;
  SettingModalIsOpen = false;
  WeekResized = false;
  DayResized = false;

  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY), 10);
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }
  constructor(private calendarService: CalendarService, private router: Router
              , private user: GeneralService, private auth: AuthService) {

    this.getData();
    this.prepareCalendar();
    setTimeout(() => {

      this.createCalendar();
    }, 100);
    setTimeout(() => {

      this.check();
      this.initListener();
      this.initInterval();
      localStorage.setItem(STORE_KEY, Date.now().toString());

    }, 100);


  }

  ngOnInit() {


  }
  getData() {

   this.elemChecked = [];
   this.staffs = [];
    this.calendarService.getStaff(this.systemid).subscribe(data => {
      data.forEach((value => {

        const len = value['servicecase'].length;
        this.staff = {
          id: value['id'],
          name: value['name'],
          color: value['color']['color'],
          length: len
        };
        this.elemChecked.push(+value['id']);
        this.staffs.push(this.staff);
        const length = value['servicecase'].length;
        for (let i = 0; i < length; i++) {

          const id = value['servicecase'][i].id;
          const start = value['servicecase'][i].startdate + 'T' + value['servicecase'][i].starttime;
          let end;
          if (value['servicecase'][i].latestenddate !== '' &&  value['servicecase'][i].latestendtime !== '') {
            end = value['servicecase'][i].latestenddate + 'T' + value['servicecase'][i].latestendtime;
          } else {
            end = '';
          }
          let company = '';
          let title = '';
          if (value['servicecase'][i]['company']) {
             company = value['servicecase'][i]['company']['name'].substring(0, 25);
             title = value['servicecase'][i]['company']['name'].substring(0, 25);
          } else {
             company = '';
             title = value['servicecase'][i].longdescription.substring(0, 10);
          }

          this.event = {
            id: id,
            start: start,
            end: end,
            title: title,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            draggable: true,
            color: value['color']['color'],
            staff: value['name'],
            staff_id: value['id'],
            className: 'popover__title',
            company: company,
          };
          this.events.push(this.event);

        }
      }));

    });
    setTimeout(() => {

      this.updateData(this.elemChecked);
    }, 500);

  }
  prepareCalendar() {
    this.usersettings = this.calendarService.getSettings(localStorage.getItem('id'), this.systemid).subscribe(data => {
     this.commit = data['commit'] === 'true';

      this.snap = data['snap'] === 'true';
      this.defaultTime = data['time_interval'];
      this.MINUTES_UNITL_AUTO_LOGOUT = data['timeout'];
      this.oppening = data['start_time'];
      this.closing = data['end_time'];

    });
    if (localStorage.getItem('lang') === 'de') {
      this.month = 'Monat';
      this.week = 'Woche';
      this.day = 'Tag';
      this.list = 'Liste';
      this.today = 'heute';
    } else {
      this.month = 'Month';
      this.week = 'Week';
      this.day = 'Day';
      this.list = 'List';
      this.today = 'today';
    }
  }
  reziseCalendarFunction() {
    if (this.ucCalendar.element.nativeElement.children[1].children[0].className === 'fc-view fc-agendaWeek-view fc-agenda-view') {
      const total = $('.fc-slats').height();
      this.ucCalendar.element.nativeElement.children[1].children[0].children[0].children[1].children[0].children[0]
        .children[2].children[0].children[0].style.height = total + 'px';

        this.WeekResized = true;
    }

    if (this.ucCalendar.element.nativeElement.children[1].children[0].className === 'fc-view fc-agendaDay-view fc-agenda-view') {
      const total = $('.fc-slats').height();
      this.ucCalendar.element.nativeElement.children[1].children[0].children[0].children[1].children[0].children[0]
        .children[2].children[0].children[0].style.height = total + 'px';
      this.DayResized = true;
    }

  }
  createCalendar() {
    const time = +this.closing.substring(0, 2) - 2;
    this.reziseCalendar = 3.2 - ((+time - 12) * 0.3) ;
    this.reziseCalendar =  $(window).height() * 0.75;
    this.reziseCalendar = $('.fc-slats')['prevObject']['0']['defaultView']['innerHeight'] - 200;

    const bottomContainerPos = this.Row.nativeElement.clientHeight;

    this.calendarOptions = {
      editable: true,
      eventLimit: true,
      locale : localStorage.getItem('lang'),
      views: {
        month: {
          timeFormat: 'H:mm',

        },
        week: {
          aspectRatio: 2,

          timeFormat: 'H:mm',

        },
        agendaWeek: {
          timeFormat: 'H:mm',
        },
        agenda: {
          timeFormat: 'H:mm',
        }
      },
      buttonText: {
        month: this.month,
        week: this.week,
        day: this.day,
        list: this.list,
        today: this.today,

      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      slotLabelFormat: 'H:mm',
      selectable: true,
      events: this.events,
      slotEventOverlap: false,
      snapDuration: moment.duration(parseInt(this.defaultTime, 10), 'minutes'),
      minTime: moment.duration(this.oppening),
      maxTime: moment.duration(this.closing),
    } ;


  }
  Color(elem) {

    this.color = null;
    let exist = false;
    this.staffs.forEach((value => {
      if (+value.id === +elem.target.id) {
        this.color = value['color'];
        console.log(value['color']);
      }
    }));
    if (elem.target.localName === 'div') {
      for (let i = 0; i < this.elemChecked.length; i++) {
        if (+this.elemChecked[i] === +elem.target.id) {
          exist = true;
          this.elemChecked.splice(i, 1);
          elem.srcElement.children[0].children[0].children[0].style.backgroundColor = 'white';

        }
      }
      if (!exist) {
        this.elemChecked.push(+elem.target.id);
        elem.srcElement.children[0].children[0].children[0].style.backgroundColor = this.color;
      }
    } else if (elem.target.localName === 'label') {
      for (let i = 0; i < this.elemChecked.length; i++) {
        if (+this.elemChecked[i] === +elem.target.id) {
          exist = true;
          this.elemChecked.splice(i, 1);
          elem.target.style.backgroundColor = 'white';

        }
      }
      if (!exist) {
        this.elemChecked.push(+elem.target.id);
        elem.target.style.backgroundColor = this.color;
      }
    }

    this.updateData(this.elemChecked);

  }
  updateData(ids) {
    this.events = [];
    this.idsStr = '';
    ids.forEach((value => {
      this.idsStr = this.idsStr + value + ';';
    }));
    this.calendarService.getStaffByIds(this.idsStr, this.systemid).subscribe(data => {
      data.forEach((value => {
        const length = value['servicecase'].length;
        for (let i = 0; i < length; i++) {
          const id = value['servicecase'][i].id;
          const start = value['servicecase'][i].startdate + 'T' + value['servicecase'][i].starttime;
          let end;
          let company = '';
          let title = '';
          if (value['servicecase'][i]['company']) {
            company = value['servicecase'][i]['company']['name'].substring(0, 25);
            title = value['servicecase'][i]['company']['name'].substring(0, 25);
          } else {
            company = '';
            title = value['servicecase'][i].longdescription.substring(0, 10);
          }
          if (value['servicecase'][i].latestenddate !== '' &&  value['servicecase'][i].latestendtime !== '') {
            end = value['servicecase'][i].latestenddate + 'T' + value['servicecase'][i].latestendtime;
          } else {
            end = '';
          }
          this.event = {
            id: id,
            start: start,
            end: end,
            title: title,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            draggable: true,
            color: value['color']['color'],
            staff: value['name'],
            staff_id: value['id'],
            className: 'popover__title',
            company: company,
          };
          this.events.push(this.event);

        }
      }));

      this.ucCalendar.renderEvents(this.events);
    });
  }
  draging(elem) {


    this.updatedElements = true;
    localStorage.setItem('updatedElements', '1');
    this.commitColor = '#f5f5f5';
    let SMonth = elem.detail.event.start._i[1];
    SMonth++;
    SMonth = this.calendarService.reFormat(SMonth);
    parseInt(SMonth, 10);
    const SDay = this.calendarService.reFormat(elem.detail.event.start._i[2]);
    parseInt(SDay, 10);
    const SH = this.calendarService.reFormat(elem.detail.event.start._i[3]);
    parseInt(SH, 10);
    const SM = this.calendarService.reFormat(elem.detail.event.start._i[4]);
    parseInt(SM, 10);
    const SS = this.calendarService.reFormat(elem.detail.event.start._i[5]);
    parseInt(SS, 10);

    let EYear = null;
    let EMonth = null;
    let EDay = null;
    let EH = null;
    let EM = null;
    let ES = null;

    if (elem.detail.event.end) {

      EYear = elem.detail.event.end._i[0];
      parseInt(EYear, 10);
      EMonth = elem.detail.event.end._i[1];
      EMonth++;
      EMonth = this.calendarService.reFormat(EMonth);
      EDay = this.calendarService.reFormat(elem.detail.event.end._i[2]);
      parseInt(EDay, 10);
      EH = this.calendarService.reFormat(elem.detail.event.end._i[3]);
      parseInt(EH, 10);
      EM = this.calendarService.reFormat(elem.detail.event.end._i[4]);
      parseInt(EM, 10);
      ES = this.calendarService.reFormat(elem.detail.event.end._i[5]);
      parseInt(ES, 10);

    }

    if (this.snap === true) {

      const minut = this.defaultTime;
      const minuts = parseInt(minut, 10);
      let sm = parseInt(SM, 10);
      let minu;
      let hr;
      let endMinu;
      let endHr;
      if (minuts === 5 || minuts === 15 || minuts === 30) {
        sm = Math.round(sm / minuts) * minuts;
        if (sm === 60) {
          sm = 0;

          minu = this.calendarService.reFormat(sm);
          hr = this.calendarService.reFormat(parseInt(SH, 10) + 1);
        } else {
          minu = this.calendarService.reFormat(sm);
          hr = SH;
        }
        const Diff = parseInt(SM, 10) - sm;

        let endTime = EM - Diff;
        if (endTime < 0) {
          endTime = 60 + endTime;
          EH = this.calendarService.reFormat(parseInt(EH, 10) - 1);
        }
        if (endTime >= 60) {
          endTime = endTime - 60;
          EH = this.calendarService.reFormat(parseInt(EH, 10) + 1);
        }
        if (Diff !== 0) {
          if (endTime >= 60) {
            const a = Math.round(endTime / 60);
            endTime = endTime -  (a * 60);

            endMinu = this.calendarService.reFormat(endTime);
            endHr = this.calendarService.reFormat(parseInt(EH, 10) - a);
          } else {
            endMinu = this.calendarService.reFormat(endTime);
            endHr = EH;
          }
        } else {
          endMinu = this.calendarService.reFormat(endTime);
          endHr = EH;
        }

        this.elemUpdated = {
          id: elem.detail.event.id,
          start: elem.detail.event.start._i[0] + '-' + SMonth + '-' + SDay,
          end: EYear + '-' + EMonth + '-' + EDay,
          endtime: endHr + ':' + endMinu + ':00',
          starttime: hr + ':' + minu + ':' + '00',

        };

      }


      if (minuts === 1) {
        this.elemUpdated = {
          id: elem.detail.event.id,
          start: elem.detail.event.start._i[0] + '-' + SMonth + '-' + SDay,
          end: EYear + '-' + EMonth + '-' + EDay,
          endtime: EH + ':' + EM + ':00',
          starttime: SH + ':' + SM + ':' + SS,

        };

      }
    } else {

      this.elemUpdated = {
        id: elem.detail.event.id,
        start: elem.detail.event.start._i[0] + '-' + SMonth + '-' + SDay,
        end: EYear + '-' + EMonth + '-' + EDay,
        endtime: EH + ':' + EM + ':00',
        starttime: SH + ':' + SM + ':' + SS,

      };

    }
    this.calendarService.UpdateOneEvent(this.elemUpdated).subscribe(data => {

    });


    setTimeout(() => {
      this.calendarService.beforCommit(this.elemUpdated.id);

      this.updateData(this.elemChecked);
    }, 100);


  }
  PopOver(elem): void {

    this.SelectedElem = {
      id: elem.detail.event.id,
      start: elem.detail.event.start,
      end: elem.detail.event.end,
      staff: elem.detail.event.staff,
      title: elem.detail.event.title,
      company: elem.detail.event.company
    };
    this.pop = true;
    this.left = elem.detail.jsEvent.clientX - 290;
    this.top = elem.detail.jsEvent.clientY + 50;

  }
  undisplay() {
    this.pop = false;
  }
  ChangeEvent() {

    this.calendarService.ChangeStaffFunc(this.SelectedStaff, this.eventId, this.start.nativeElement.value
      ).subscribe(data => {
      if (data === 1) {
        setTimeout(() => {
          localStorage.setItem('updatedElements', '1');
          this.updateData(this.elemChecked);
        }, 100);
        this.ChangeStaffModal = false;
        this.modal.nativeElement.style.display = 'none';
        this.SettingModalIsOpen = false;

      }
    });
  }

  DisplayChangeStaff(elem) {
    this.StartTime = '';
    this.endTime = '';
    if (elem) {
      this.StartTime = elem.detail.event.start._i;
      this.StartTime = this.StartTime.substring(11, 16);

    }
    if (elem.detail.event.end) {
      this.endTime = elem.detail.event.end._i;
      this.endTime = this.endTime.substring(11, 16);
    }
    this.ChangeStaffModal = true;
    this.modal.nativeElement.style.display = 'block';
    this.eventId = elem.detail.event.id;
    this.staffs.forEach((value => {
      if (value.id === elem.detail.event.staff_id) {
        this.SelectedStaff = value.id;
      }
    }));

    setTimeout(() => {

     this.SettingModalIsOpen = true;
      console.log(this.SettingModalIsOpen);
    }, 500);


  }
  unDisplayChangeStaff() {

      console.log('zaaab');
      this.ChangeStaffModal = false;
      this.modal.nativeElement.style.display = 'none';
    this.SettingModalIsOpen = false;
    this.ChangeEvent();
  }
  ClickOutSide() {
    if (this.SettingModalIsOpen === true) {
      this.ChangeStaffModal = false;
      this.modal.nativeElement.style.display = 'none';
      this.SettingModalIsOpen = false;
      this.ChangeEvent();
    }
  }
  reset() {
    this.setLastAction(Date.now());
  }
  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }
  initListener() {
    window.onload = () => { this.reset(); };
    window.onmousemove = () => { this.reset(); };
    window.onmousedown = () => { this.reset(); };
    window.onclick = () => { this.reset(); };
    window.onscroll = () => { this.reset(); };
    window.onkeypress = () => { this.reset(); };
  }
  check() {

    setTimeout(() => {
      this.reziseCalendarFunction();
    }, 0);
    this.scrollHeigth = (this.Row.nativeElement.clientHeight - 200) + 'px';
    this.NavbarWidth = (this.Calendar.nativeElement.clientWidth - 100) + 'px';

    if (this.router.url !== '/login') {
      const now = Date.now();
      const timeleft = this.getLastAction() + this.MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
      const diff = timeleft - now;
      const isTimeout = diff < 0;

      this.auth.stillLoged().subscribe(data => {
        if (data['isLoged'] === false) {
          localStorage.setItem('stillLoged', '0');
        } else {
          localStorage.setItem('stillLoged', '1');
        }
      });
      const stillLoged = localStorage.getItem('stillLoged');
      if (isTimeout || stillLoged === '0')  {
        if (this.commit) {
          this.calendarService.Commit().subscribe(data2 => {
            if (data2['result'] === 1) {
              this.user.logout(localStorage.getItem('id')).subscribe(data3 => {
              });
              this.router.navigate(['/login']);
            }
          });
        } else {
          this.user.logout(localStorage.getItem('id')).subscribe(data2 => {
          });
          this.router.navigate(['/login']);
        }

      }
    }

  }

  Test() {
    console.log('clicked');
  }
  Adjust(elem) {

  }

}
