import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.css']
})
export class BandeauComponent implements OnInit {

  @Input()
  message: string;

  @Input()
  msgType: string;

  constructor() {
    this.message = "oooo";
    this.msgType = "ookk";
  }

  ngOnInit(): void {

  }

}
