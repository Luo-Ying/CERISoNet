import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable, Subscribable, Subscriber } from 'rxjs';

import { post, author } from 'src/app/util/type';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  options = { headers: { 'Content-Type': 'application/json' } };

  constructor(private _http: HttpClient) { }

  GetAllComments(hashtag: string): Observable<Array<post>> {
    console.log(encodeURIComponent(hashtag));

    // console.log(hashtag);
    let result: Array<post>;
    return Observable.create((observer: Subscriber<Array<post>>) => {
      this._http.get<any>(
        `https://pedago.univ-avignon.fr:3231/db-CERI/CERISoNet?hashtag=${encodeURIComponent(hashtag)}`
      ).subscribe(
        data => {
          console.log(hashtag);

          console.log(data);
          result = data;
        },
        error => { /** erreur de l’observable httpClient */
          console.error('une erreur est survenu!', error);

        },
        () => { /** terminaison de l’observable httpClient */
          observer.next(result);  /** renvoi des données pour l’observable principal */
        }
      )
    })
  }

  GetInfosUserById(id_author: number): Observable<author> {
    let author: author;

    return Observable.create((observer: Subscriber<author>) => {
      this._http.get<any>(
        `https://pedago.univ-avignon.fr:3231/CERISoNet/comments/user?id=${id_author}`
      ).subscribe(
        data => {
          console.log(data);
          author = data;
        },
        error => {
          console.error('une erreur est survenu!', error);
        },
        () => { /** terminaison de l’observable httpClient */
          observer.next(author);  /** renvoi des données pour l’observable principal */
        }
      )
    });

  }

}
