import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { VarGlobService } from 'src/app/services/var-glob.service';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.css']
})
export class BandeauComponent implements OnInit {

  message: string = "";

  msgType: string = "";

  constructor(private _VarGlob: VarGlobService) { }

  ngOnInit(): void {
    this.message = this._VarGlob.bandeauMessage;
    this.msgType = this._VarGlob.bandeauMsgType;
  }

}
