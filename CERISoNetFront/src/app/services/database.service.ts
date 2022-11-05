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
    let result: Array<post>;
    return Observable.create((observer: Subscriber<Array<post>>) => {
      this._http.get<any>(
        `https://pedago.univ-avignon.fr:3231/db-CERI/CERISoNet?hashtag=${encodeURIComponent(hashtag)}`
      ).subscribe(
        data => {
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

  GetPostById(id_post: number): Observable<post> {
    let post: post;

    return Observable.create((observer: Subscriber<post>) => {
      this._http.get<any>(
        `https://pedago.univ-avignon.fr:3231/db-CERI/CERISoNet/searchPost?id=${id_post}`
      ).subscribe(
        data => {
          post = data;
        },
        error => {
          console.error('une erreur est survenu!', error);
        },
        () => { /** terminaison de l’observable httpClient */
          observer.next(post);  /** renvoi des données pour l’observable principal */
        }
      )
    });
  }

  LikePost(id_post: number, id_user: number, nbLike: number, isLiked: boolean): Observable<boolean> {
    let pass = false;

    return Observable.create((observer: Subscriber<boolean>) => {
      this._http.post<any>(
        `https://pedago.univ-avignon.fr:3231/db-CERI/CERISoNet/updateLikedby`,
        { id_post: id_post, id_user: id_user, nbLike, isLiked: isLiked },
        this.options
      ).subscribe(
        data => {
          pass = data;
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
