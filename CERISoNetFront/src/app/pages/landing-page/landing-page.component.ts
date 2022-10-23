import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  // @Input() message: string = '';

  // @Input() msgType: string = '';

  isBandeauVisible: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(param => {
      // this.message = param['message'];
      // this.msgType = param['msgType'];
      if (param['isBandeauVisible']) {
        // console.log(param['isBandeauVisible']);

        this.isBandeauVisible = param['isBandeauVisible']
      }
    })

  }

}
