import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public res: Object = {};

  formData!: FormGroup;

  optionRequete = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    })
  };

  options = { headers: { 'Content-Type': 'application/json' } };

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {

    this.formData = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });

    // this.http.get('https://pedago.univ-avignon.fr:3231/', this.options).subscribe(response => {
    //   this.res = response;
    //   console.log(this.res);
    // })
  }

  onSubmit() {
    console.log(this.formData.value);
    this.http.post('https://pedago.univ-avignon.fr:3231/login', this.formData.value, this.options).subscribe(response => {
      this.res = response;
      console.log(this.res);
    })
  }

}



