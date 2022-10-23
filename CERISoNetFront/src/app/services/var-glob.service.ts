import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VarGlobService {

  isLogged: boolean = false;

  bandeauMessage: string = "";

  bandeauMsgType: string = "";

  constructor() { }

  getIsLogged(): boolean {
    return this.isLogged;
  }
}
