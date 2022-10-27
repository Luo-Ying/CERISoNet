import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable, Subscribable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  options = { headers: { 'Content-Type': 'application/json' } };

  constructor(private _http: HttpClient) { }

  GetAllComments(): Observable<boolean> {
    return Observable.create((observable: Subscriber<boolean>) => {
      this._http.get<any>(
        'https://pedago.univ-avignon.fr:3231/db-CERI/CERISoNet'
      ).subscribe(
        data => {
          console.log(data);

        }
      )
    })
  }

}
