import { Injectable } from '@angular/core';

import { post } from 'src/app/util/type';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class VarGlobService {

  isLogged: boolean = false;

  userLastLogin: string = "";

  bandeauMessage: string = "";

  bandeauMsgType: string = "";

  commentsArray: Array<post> = [];

  hashtags: Array<string> = ["all"];

  constructor(private _database: DatabaseService) { }

  getIsLogged(): boolean {
    return this.isLogged;
  }
}
