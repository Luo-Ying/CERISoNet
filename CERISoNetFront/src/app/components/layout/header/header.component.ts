import { Component, OnInit } from '@angular/core';
// import { AppComponent } from 'src/app/app.component';
import { VarGlobService } from 'src/app/services/var-glob.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
