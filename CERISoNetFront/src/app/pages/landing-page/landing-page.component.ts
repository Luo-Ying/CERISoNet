import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  @Input() message: string | null | undefined;

  @Input() msgType: string | null | undefined;

  isBandeauVisible: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(param => {
      this.message = param['message'];
      this.msgType = param['msgType'];
    })

    setTimeout(() => {
      this.isBandeauVisible = true;
    }, 100);
    setTimeout(() => {
      this.isBandeauVisible = false
    }, 5000);
  }

}
