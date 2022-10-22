import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VarGlobService {

  isLogged: boolean | undefined;

  bandeauMessage: string = "";

  bandeauMsgType: string = "";

  constructor() { }
}
