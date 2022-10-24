import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { VarGlobService } from 'src/app/services/var-glob.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  // @Input() message: string = '';

  // @Input() msgType: string = '';

  // isBandeauVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _auth: AuthentificationService,
    private _VarGlob: VarGlobService
  ) { }

  ngOnInit(): void {

    // this.route.queryParams.subscribe(param => {
    //   // this.message = param['message'];
    //   // this.msgType = param['msgType'];
    //   if (param['disconnect']) {
    //     // console.log(param['isBandeauVisible']);
    //     this.disconnect();
    //   }
    // })

  }

  // disconnect = () => {
  //   this._auth.Disconnect().subscribe(
  //     data => {
  //       // console.log("putin");
  //       // this.message = "Utilisateur déconnecte!";
  //       // this.msgType = 'warning';
  //       this._VarGlob.bandeauMessage = "Utilisateur déconnecte!";
  //       this._VarGlob.bandeauMsgType = 'warning';
  //       // this.isLogged = false;
  //       // location.reload();
  //       // this.router.navigate(['/'], {});
  //     },
  //     error => {

  //     }
  //   );
  // }

}
