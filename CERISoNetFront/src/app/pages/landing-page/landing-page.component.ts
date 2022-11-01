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
  pageSize: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _auth: AuthentificationService,
    private _VarGlob: VarGlobService,
    private _database: DatabaseService
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('id')) {

      this._VarGlob.getAllComments("");
      // this.hashtagsToShow = this.hashtags;
      this.commentsArray = this._VarGlob.commentsArray;
      this.hashtags = this._VarGlob.hashtags;

    }
    else {
      this._VarGlob.bandeauMessage = "Connectez vous pour accéder au site !";
      this._VarGlob.bandeauMsgType = 'warning';
      this.router.navigate(['/login'], {});
    }

  }

  getCommentsByHashtags(value: string): void {
    console.log(value);
    this._VarGlob.getAllComments(value);
    this.commentsArray = this._VarGlob.commentsArray;
    this.hashtags = this._VarGlob.hashtags;
  }

}
