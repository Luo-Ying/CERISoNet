import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';


interface Response {
  data?: any;
  status?: any;
  statusMsg?: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  response: Response = {};

  message: string = '';
  msgType: string = '';

  isBandeauVisible: boolean = false;

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
  }

  onSubmit() {
    console.log(this.formData.value);
    this.http.post('https://pedago.univ-avignon.fr:3231/login', this.formData.value, this.options).subscribe(response => {
      this.response = response;
      console.log(this.response);
      this.message = this.response.statusMsg
      if (this.response.status === 200) {
        this.msgType = "info"
      } else {
        this.msgType = "danger"
      }
    })
    this.isBandeauVisible = true;
    setTimeout(() => {
      this.isBandeauVisible = false
    }, 5000);
  }

}



