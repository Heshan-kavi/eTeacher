import { Component, OnInit ,EventEmitter,Output} from '@angular/core';
import { BookingService } from '../../../services/booking.service'
import {Bookings} from '../../../models/bookings'
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import timeGrigPlugin from '@fullcalendar/timegrid';
import 'fullcalendar';


@Component({
  selector: 'app-teacherbookings',
  templateUrl: './teacherbookings.component.html',
  styleUrls: ['./teacherbookings.component.css']
})
export class TeacherbookingsComponent implements OnInit {
  bookings: Array<Bookings>
  public SelectBooking = new EventEmitter();
  teacherId:String;
  page:any;
  pageSize: number;
  size:number
  showModal: boolean;
  today=new Date;
  todaycon=0;
  todaypen=0;
  
  conpage: number
  penpage: number
  con:any
  pen:any;
  confirmsize: number = 0;
  pendingsize: number = 0;
  calendarVisible = true;
  calendarWeekends = true;
  calendarEvents: EventInput[]
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  user=JSON.parse(localStorage.getItem('user'));
  constructor(private bookingService:BookingService,) { }

  ngOnInit(): void {
    let user=localStorage.getItem('user');
    this.bookings=[]
    const teacherId=this.user.name     //user.id
    this.conpage = 1
    this.penpage = 1
    this.con = []
    this.pen = []
    this.bookingService.getBookingbyteacherId(teacherId).subscribe(res => {
      for (var i in res) {
        this.bookings.push(res[i])
      }
      var j;
      for (j = 0; j < this.bookings.length; j++) {
        if (this.bookings[j].status == "pending") {
          this.bookings[j].color = '#6180fa'
          this.pendingsize += 1;
          this.pen.push(this.bookings[j]);
          

        } else if (this.bookings[j].status == "confirm") {
          this.bookings[j].color = '#ffee52'
          this.confirmsize += 1;
          this.con.push(this.bookings[j]);
        }
        this.calendarEvents=res
      }
      console.log(this.bookings)
    })

    let date1 = JSON.stringify(this.today)
    date1 = date1.slice(1, 11)
    this.bookingService.getBookingbyDateTeacher(date1, teacherId).subscribe(res => {
      var j;
      for (j = 0; j < Object.keys(res).length; j++) {
        if (res[j].status == "pending") {
          this.todaypen += 1;

        } else if (res[j].status == "confirm") {
          this.todaycon += 1;
        }
      }
    })

  }
  @Output() SelectedBooking = new EventEmitter();
  updateBookingEvent(id){
    this.bookingService.updateBooking(id)
    .subscribe(res=>res);  
  }
 
  onSelect(booking){
    this.SelectBooking.emit(booking)
    this.SelectedBooking=booking;
    this.showModal = true
  }
  hide() {
    this.showModal = false;
  }
}
