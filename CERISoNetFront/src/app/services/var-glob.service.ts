import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VarGlobService {

  headerHeading: string = "";

  isLogged: boolean | undefined;

  bandeauMessage: string = "";

  bandeauMsgType: string = "";

  constructor() { }
}
