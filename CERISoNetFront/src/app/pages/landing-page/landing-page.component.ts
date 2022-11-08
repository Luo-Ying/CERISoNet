import { Component, OnInit } from '@angular/core';
// import { Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { PageEvent } from '@angular/material/paginator';

import { AuthentificationService } from 'src/app/services/authentification.service';
import { DatabaseService } from 'src/app/services/database.service';
import { VarGlobService } from 'src/app/services/var-glob.service';
import { comment, post } from 'src/app/util/type';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  commentsArray: Array<post> = [];

  isCollapsed: boolean = false;

  isOrderByNbLikesUpDown: boolean | undefined;
  isOrderByDateUpDown: boolean | undefined;

  hashtags: Array<string> = ["all"];

  page: number = 1;
  pageSize: number = 2;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _auth: AuthentificationService,
    private _VarGlob: VarGlobService,
    private _database: DatabaseService
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('id')) {

      this.getAllComments("all");

    }
    else {
      this._VarGlob.bandeauMessage = "Connectez-vous pour accéder au site !";
      this._VarGlob.bandeauMsgType = 'warning';
      this.router.navigate(['/login'], {});
    }

  }
  // TODO: trier côté fronend ? (peut fonctionner ensemble avec filter du hashtag) 
  // trier côté backend ? (fonctionne séparément avec filtre du hashtag)

  getCommentsOrderByNbLike(): void {
    this.isOrderByDateUpDown = undefined;
    if (this.isOrderByNbLikesUpDown) {
      this.isOrderByNbLikesUpDown = !this.isOrderByNbLikesUpDown;
    }
    else {
      this.isOrderByNbLikesUpDown = true;
    }
    console.log(this.isOrderByNbLikesUpDown);

  }

  getCommentsOrderByDate(): void {
    this.isOrderByNbLikesUpDown = undefined;
    if (this.isOrderByDateUpDown) {
      this.isOrderByDateUpDown = !this.isOrderByDateUpDown;
    }
    else {
      this.isOrderByDateUpDown = true;
    }
    console.log(this.isOrderByDateUpDown);

  }

  getCommentsByHashtags(hashtag: string): void {
    this.getAllComments(hashtag);
  }

  getAllComments(hashtag: string): void {

    this.commentsArray = [];
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
          this.commentsArray.push(element);
        });

      },
      error => {
        console.log(error);

      }
    )
  }

}
