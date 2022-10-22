import { Component, OnInit } from '@angular/core';
import { VarGlobService } from 'src/app/services/var-glob.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  heading: string = "";

  constructor(private _VarGlob: VarGlobService) { }

  ngOnInit(): void {
    console.log("header gloc glob: ", this._VarGlob.headerHeading);

    this.heading = this._VarGlob.headerHeading;
  }

}
