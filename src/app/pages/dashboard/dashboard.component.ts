import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { environment } from "../../../environments/environment";

export interface MonthlyTask {
  name: string;
  start: Date;
  end: Date;
  color?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sideBarOpen:boolean = true;
  mytheme:any='light-theme';
  title = 'af-notification';
  message:any = null;
  bookingInfoList:any = [];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
  tasks: MonthlyTask[] = [
    {
      name: 'Design Phase',
      start: new Date('2025-05-01T01:00:00'),
      end: new Date('2025-05-02T23:59:00'),
      color: '#3b82f6'
    },
    // {
    //   name: 'Development',
    //   start: new Date('2025-05-08T10:00:00'),
    //   end: new Date('2025-05-20T17:00:00'),
    //   color: '#10b981'
    // },
    // {
    //   name: 'Testing',
    //   start: new Date('2025-05-18T09:00:00'),
    //   end: new Date('2025-05-28T12:00:00'),
    //   color: '#f59e0b'
    // }
  ];

  daysInMonth: Date[] = [];

  constructor(private _bookingService:BookingsService) {
    
  }
  ngOnInit(): void {
    this.generateMonthDays(2025, 4); // May 2025 (0-indexed)
    this.tasks = [...this.tasks].map((task:any)=>{
      task.left = this.getLeftPercent(task.start);
      task.width = this.getTaskWidthPercent(task.start,task.end);
      task.leftCheck = this.getHourPercentInDay(task.start);
      return task;
    })
  }

  
  changeTheme(e:any){
    document.getElementsByTagName('body')[0].classList.remove(this.mytheme);
    document.getElementsByTagName('body')[0].classList.add(e.target.value);
    this.mytheme = e.target.value;
  }
  generateMonthDays(year: number, month: number): void {
    const date = new Date(year, month, 1);
    this.daysInMonth = [];

    while (date.getMonth() === month) {
      this.daysInMonth.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
  }

  getLeftPercent(start: Date): number {
    const startOfChart = this.daysInMonth[0];
    const chartDurationMs = this.daysInMonth.length * 24 * 60 * 60 * 1000;
    const offsetMs = start.getTime() - startOfChart.getTime();
    console.log((offsetMs / chartDurationMs) * 100);
    return (offsetMs / chartDurationMs) * 100;
  }
  
  getTaskWidthPercent(start: Date, end: Date): number {
    // Total minutes in a day
    const totalMinutesInDay = 24 * 60; // 1440 minutes
  
    // Calculate the total duration of the task in minutes
    const taskDurationMs = end.getTime() - start.getTime();
    const taskDurationMinutes = taskDurationMs / (1000 * 60); // Convert to minutes
  
    // Calculate the width percentage of the task
    return (taskDurationMinutes / totalMinutesInDay) * 100;
  }
  getHourPercentInDay(date: Date): number {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const percent = (totalMinutes / (24 * 60)) * 100;
    return percent;
  }
}
