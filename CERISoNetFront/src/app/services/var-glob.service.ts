import { Injectable } from '@angular/core';

import { post } from 'src/app/util/type';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class VarGlobService {

  isLogged: boolean = false;

  bandeauMessage: string = "";

  bandeauMsgType: string = "";

  commentsArray: Array<post> = [];

  hashtags: Array<string> = ["all"];

  constructor(private _database: DatabaseService) { }

  getIsLogged(): boolean {
    return this.isLogged;
  }

  getAllComments(value: string): void {
    console.log(value);

    this.commentsArray = [];
    this.hashtags = ["all"];
    this._database.GetAllComments(value).subscribe(
      data => {
        if (value != "" && value != "all" && this.hashtags.indexOf(value) == -1) {
          this.hashtags.push(value);
        }
        data.forEach(element => {
          console.log(element);
          if (value == "" || value == "all") {
            element.hashtags.forEach(e => {
              this.hashtags.push(e);
            })
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
