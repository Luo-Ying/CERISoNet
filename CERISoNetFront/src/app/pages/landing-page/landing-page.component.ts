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

  hashtags: Array<string> = ["all"];
  // hashtagsToShow: Array<string> = [];

  page: number = 1;
  pageSize: number = 3;

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
      // this.hashtagsToShow = this.hashtags;
      this._VarGlob.commentsArray = this.commentsArray;
      this._VarGlob.hashtags = this.hashtags;

      console.log(this.commentsArray);


    }
    else {
      this._VarGlob.bandeauMessage = "Connectez vous pour accéder au site !";
      this._VarGlob.bandeauMsgType = 'warning';
      this.router.navigate(['/login'], {});
    }

  }

  getCommentsByHashtags(value: string): void {
    console.log(value);
    this.getAllComments(value);
    this._VarGlob.commentsArray = this.commentsArray;
    this._VarGlob.hashtags = this.hashtags;
  }

  getAllComments(value: string): void {
    console.log(value);

    this.commentsArray = [];
    this.hashtags = ["all"];
    this._database.GetAllComments(value).subscribe(
      data => {
        if (value != "all" && this.hashtags.indexOf(value) == -1) {
          this.hashtags.push(value);
        }
        console.log(data);

        data.forEach(element => {
          console.log(element);
          if (value == "all") {
            if (element.hashtags) {
              element.hashtags.forEach(e => {
                this.hashtags.push(e);
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
