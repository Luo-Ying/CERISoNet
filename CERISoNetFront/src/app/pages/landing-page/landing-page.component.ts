import { Component, OnInit } from '@angular/core';
// import { Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { PageEvent } from '@angular/material/paginator';

import { AuthentificationService } from 'src/app/services/authentification.service';
import { DatabaseService } from 'src/app/services/database.service';
import { VarGlobService } from 'src/app/services/var-glob.service';
import { comment, post, author } from 'src/app/util/type';
import { transferDateToTimestamp } from 'src/app/util/algorithm';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  postsArray: Array<post> = [];

  isCollapsed: boolean = false;


  isOrderByNbLikesAscending: boolean | undefined;
  isOrderByDateAscending: boolean | undefined;

  hashtags: Array<string> = ["all"];

  page: number = 1;
  pageSize: number = 3;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _auth: AuthentificationService,
    private _VarGlob: VarGlobService,
    private _database: DatabaseService,
    private _webSocket: WebSocketService,
  ) { }

  ngOnInit(): void {

    this._webSocket.listen('updatePosts').subscribe((data) => {
      this.postsArray = data;
      this._VarGlob.bandeauMessage = "Comment added successfully!";
      this._VarGlob.bandeauMsgType = "success";
    })

    if (localStorage.getItem('id')) {

      this.getAllComments("all");

    }
    else {
      this._VarGlob.bandeauMessage = "Connectez-vous pour accéder au site !";
      this._VarGlob.bandeauMsgType = 'warning';
      this.router.navigate(['/login'], {});
    }

  }

  /**tri à bulles */
  sortPostsByNbLikeDescendingorder(): void {
    const len = this.postsArray.length;
    for (let i = 0; i < this.postsArray.length - 1; i++) {
      for (let j = 0; j < this.postsArray.length - 1 - i; j++) {
        if (this.postsArray[j].likes < this.postsArray[j + 1].likes) {
          const temp = this.postsArray[j + 1];
          this.postsArray[j + 1] = this.postsArray[j];
          this.postsArray[j] = temp;
        }
      }
    }
  }

  sortPostsByNbLikeAscendingOrder(): void {
    const len = this.postsArray.length;
    for (let i = 0; i < this.postsArray.length - 1; i++) {
      for (let j = 0; j < this.postsArray.length - 1 - i; j++) {
        if (this.postsArray[j].likes > this.postsArray[j + 1].likes) {
          const temp = this.postsArray[j + 1];
          this.postsArray[j + 1] = this.postsArray[j];
          this.postsArray[j] = temp;
        }
      }
    }
  }

  sortPostsByDateDescendingorder(): void {
    for (let i = 0; i < this.postsArray.length - 1; i++) {
      for (let j = 0; j < this.postsArray.length - 1 - i; j++) {
        const myDate1 = transferDateToTimestamp(this.postsArray[j].date);
        const myDate2 = transferDateToTimestamp(this.postsArray[j + 1].date);
        if (myDate1 < myDate2) {
          const temp = this.postsArray[j + 1];
          this.postsArray[j + 1] = this.postsArray[j];
          this.postsArray[j] = temp;
        }
      }
    }
  }

  sortPostsByDateAscendingorder(): void {
    for (let i = 0; i < this.postsArray.length - 1; i++) {
      for (let j = 0; j < this.postsArray.length - 1 - i; j++) {
        const myDate1 = transferDateToTimestamp(this.postsArray[j].date);
        const myDate2 = transferDateToTimestamp(this.postsArray[j + 1].date);
        if (myDate1 > myDate2) {
          const temp = this.postsArray[j + 1];
          this.postsArray[j + 1] = this.postsArray[j];
          this.postsArray[j] = temp;
        }
      }
    }
  }

  getCommentsOrderByNbLike(): void {
    this.isOrderByDateAscending = undefined;
    this.isOrderByNbLikesAscending = !this.isOrderByNbLikesAscending;
    if (this.isOrderByNbLikesAscending) {
      this.sortPostsByNbLikeAscendingOrder();
    }
    else {
      this.sortPostsByNbLikeDescendingorder();
    }
    console.log(this.isOrderByNbLikesAscending);

  }

  getCommentsOrderByDate(): void {
    this.isOrderByNbLikesAscending = undefined;
    this.isOrderByDateAscending = !this.isOrderByDateAscending;
    if (this.isOrderByDateAscending) {
      this.sortPostsByDateAscendingorder();
    }
    else {
      this.sortPostsByDateDescendingorder();
    }
    console.log(this.isOrderByDateAscending);

  }

  getCommentsByHashtags(hashtag: string): void {
    this.isOrderByDateAscending = undefined;
    this.isOrderByNbLikesAscending = undefined;
    this.getAllComments(hashtag);
  }

  getAllComments(hashtag: string): void {

    this.postsArray = [];
    this.hashtags = ["all"];
    this._database.GetAllComments(hashtag).subscribe(
      data => {
        if (hashtag != "all" && this.hashtags.indexOf(hashtag) == -1) {
          this.hashtags.push(hashtag);
        }

        data.forEach(element => {
          if (hashtag == "all") {
            if (element.hashtags) {
              element.hashtags.forEach(e => {
                if (this.hashtags.indexOf(e) == -1) {
                  this.hashtags.push(e);
                }
              })
            }
          }
          console.log(element);
          // console.log(element.Shared);
          console.log(element.author);
          // let author: author;
          this._database.GetInfosUserById(element.createdBy).subscribe(data => {
            element.author = data;
          });
          this.postsArray.push(element);
        });
        // TODO: modifier les code suivant, celui pour afficher les author! (vu que la récupération d'author est fait ici!)

      },
      error => {
        console.log(error);

      }
    )
  }

}
