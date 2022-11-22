import { Component, Input, OnInit } from '@angular/core';

import { user } from 'src/app/util/type';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input()
  user!: user;

  constructor() { }

  ngOnInit(): void {
  }

}
