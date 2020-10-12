import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { BookingService } from '../../../services/booking.service'
import {Bookings} from '../../../models/bookings'
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import timeGrigPlugin from '@fullcalendar/timegrid';
import 'fullcalendar';



@Component({
  selector: 'app-userbookings',
  templateUrl: './userbookings.component.html',
  styleUrls: ['./userbookings.component.css']
})
export class UserbookingsComponent implements OnInit {
  bookings: Array<Bookings>
  public SelectBooking = new EventEmitter();
  studentId: String;
  todaycon=0;
  todaypen=0;

  conpage:number
  penpage:number
  pastpage:number
  con:any;
  pen:any;
  past:any;
  confirmsize:number=0;
  pendingsize:number=0;
  pastsize:number=0;
  showModal: boolean;
  today=new Date;
  bookingcount:number;

  calendarVisible = true;
  calendarWeekends = true;
  calendarEvents: EventInput[]
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];  //calender views
  user=JSON.parse(localStorage.getItem('user'));
  @Output() SelectedBooking = new EventEmitter();  //take selected booking as output paramter
  
  constructor(private bookingService: BookingService,) { }    // initiate booking service

  ngOnInit(): void {
    const studentId=this.user.name    //init method

    this.conpage=1 
    this.penpage=1
    this.pastpage=1
    this.con=[]
    this.pen=[]
    this.past=[]
    this.bookingService.getBookingbystudentId(studentId).subscribe(res => {       //call booking sevice andget bookings of student
      
      this.bookings=res
      var i;
      for (i = 0; i < this.bookings.length; i++) { 
        if(this.bookings[i].date<date1) {
          this.past.push(this.bookings[i]);
          this.pastsize+=1;
        } else{
          if (this.bookings[i].status == "pending") {
            this.bookings[i].color = '#6180fa'
            this.pendingsize += 1;
            this.pen.push(this.bookings[i]);
  
          } else if (this.bookings[i].status == "confirm") {
            this.bookings[i].color = '#ffee52'
            this.confirmsize+=1;
            this.con.push(this.bookings[i]);
          }
        }         //divide bookings accoiding to states and store seperae arrayss
        this.calendarEvents = res
      }
      
    })

    let date1 = JSON.stringify(this.today)
    date1 = date1.slice(1, 11)
    this.bookingService.getBookingbyDateUser(date1,studentId).subscribe(res => {
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
