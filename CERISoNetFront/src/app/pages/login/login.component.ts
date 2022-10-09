import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { VarGlobService } from 'src/app/services/var-glob.service';


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

  options = { headers: { 'Content-Type': 'application/json' } };

  response: Response = {};

  message: string = '';
  msgType: string = '';

  isBandeauVisible: boolean = false;

  formData!: FormGroup;

  isLogged: boolean | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _auth: AuthentificationService,
    private _VarGlob: VarGlobService
  ) { }

  ngOnInit(): void {

    this.formData = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
    });
  }

  onSubmit() {

    this._auth.VerifyId(this.formData.value.username, this.formData.value.password).subscribe(

      data => {
        this.isLogged = data;
        this._VarGlob.isLogged = data; /** boolean retourné par l’observable */
        if (this.isLogged == true) {
          this._VarGlob.bandeauMessage = "Connexion réussit ! Bienvenu " + this.formData.value.username + ".";
          this._VarGlob.bandeauMsgType = 'info';
          this.router.navigate(['/landingPage'], { queryParams: { message: this.message, msgType: this.msgType } });
        }
        else {
          this._VarGlob.bandeauMessage = "Connexion echouée ! Verifier votre username ou password.";
          this._VarGlob.bandeauMsgType = 'danger';
        }
      },
      error => {
        this._VarGlob.bandeauMessage = "Connexion echouée ! " + error;
        this._VarGlob.bandeauMsgType = 'danger';
      }
    );

    this.isBandeauVisible = true;
    setTimeout(() => {
      this.isBandeauVisible = false
    }, 5000);
  }

}



