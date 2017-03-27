// <reference path="../<path-to>EventSource.d.ts"/>
import { Component, NgZone, OnInit } from '@angular/core';
//import {Observable} from 'rxjs/Observable';
import {Subject, Observable}  from 'rxjs/Rx';
import 'rxjs/Rx';
declare var EventSource:any


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  someStrings:string[] = [];
  zone:NgZone;

  constructor() {
    this.zone = new NgZone({enableLongStackTrace: false});
  }
  ngOnInit(){
    const observable = Observable.create(observer => {
      const eventSource = new EventSource('/stream');
      eventSource.onmessage = x => observer.next(x.data);
      eventSource.onerror = x => observer.error(x);

      return () => {
        eventSource.close();
      };
    });

    observable.subscribe({
      next: guid => {
        this.zone.run(() => this.someStrings.push(guid));
        console.log(guid);
      },
      error: err => console.error('something wrong occurred: ' + err)
    });
  }
/*
  private zone = new NgZone({ enableLongStackTrace: false });

  getScoreUpdates(): Observable<number> {
      return Observable.create(observer => {
        const eventSource = new EventSource(`/stream`);
        eventSource.onmessage = score => this.zone.run(() => observer.next(score));
        eventSource.onerror = error => this.zone.run(() => observer.error(error));
        return () => eventSource.close();
      });
    }
*/
  }
