import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.css']
})
export class BandeauComponent implements OnInit {

  @Input()
  message: string = '';

  @Input()
  msgType: string = '';

  constructor() { }

  ngOnInit(): void {
    console.log("coucou");
    console.log(this.message);
    console.log(this.msgType);


  }

}
