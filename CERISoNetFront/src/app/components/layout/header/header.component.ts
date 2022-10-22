import { Component, OnInit } from '@angular/core';
// import { AppComponent } from 'src/app/app.component';
import { VarGlobService } from 'src/app/services/var-glob.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // private _VarGlob: VarGlobService;

  // heading: string = this._VarGlob.bandeauMessage;

  // heading: string = "";

  constructor() { }

  ngOnInit(): void {
    // console.log("header gloc glob: ", this._VarGlob.headerHeading);

    // this.heading = this._VarGlob.headerHeading;
    // console.log(this._VarGlob.headerHeading);

  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // console.log(changes);
  //   // this.heading = "";
  //   console.log(changes);
  //   // this.heading = this._VarGlob.headerHeading;
  //   // try {
  //   //   if (changes['heading'] && !changes['heading'].firstChange) {
  //   //     this.heading = changes['heading'].currentValue;
  //   //   }
  //   // } catch (err) {
  //   //   console.log(err);
  //   // }
  // }

}
