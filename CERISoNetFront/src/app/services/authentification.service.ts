import { Injectable, ɵisObservable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  options = { headers: { 'Content-Type': 'application/json' } };

  constructor(private _http: HttpClient) { }

  IsLogged(): boolean {
    if (localStorage.getItem('accessToken') == 'true') { return true; }
    else { return false; }
  }

  /** Service Authentification : création d’un observable utilisant le service httpClient et
    * la méthode get également observable 
    */

  /** la méthode renvoie un observable principal et un booléen en données */
  VerifyId(username: string, password: string): Observable<boolean> {
    let trueId: boolean = false;

    /** la méthode renvoie un observable et un booléen en données */
    return Observable.create((observer: Subscriber<boolean>) => {
      this._http.post<any>(
        'https://pedago.univ-avignon.fr:3231/login',
        { username: username, password: password },
        this.options).subscribe(
          data => { /** / succes de l’observable httpClient */
            if (data.status == 200) {
              const date = new Date();

              // localStorage.setItem('accessToken', data);
              localStorage.setItem('id', data.id);
              localStorage.setItem('identifiant', username);
              localStorage.setItem('lastName', data.lastName);
              localStorage.setItem('firsteName', data.firstName);
              localStorage.setItem('urlAvatar', data.urlAvatar);
              localStorage.setItem('lastLogin', date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
              trueId = true;
            }
            else {
              trueId = false;
            }
          },
          error => { /** erreur de l’observable httpClient */
            console.error('une erreur est survenu!', error);

          },
          () => { /** terminaison de l’observable httpClient */
            observer.next(trueId);  /** renvoi des données pour l’observable principal */
          }
        );
    });
  }

  Disconnect(): Observable<boolean> {
    let pass: boolean = false;

    return Observable.create((observer: Subscriber<boolean>) => {
      this._http.get<any>(
        `https://pedago.univ-avignon.fr:3231/disconnect?id=${localStorage.getItem('id')}`
      ).subscribe(
        data => {
          if (data.status == 200) {
            localStorage.clear();
            pass = true;
          }
          else {
            pass = false
          }
        },
        error => {
          console.error('une erreur est survenu!', error);
        },
        () => { /** terminaison de l’observable httpClient */
          observer.next(pass);  /** renvoi des données pour l’observable principal */
        }
      )
    });

  }

}
