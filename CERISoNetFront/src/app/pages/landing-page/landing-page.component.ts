import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { DatabaseService } from 'src/app/services/database.service';
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
    private router: Router,
    private _auth: AuthentificationService,
    private _VarGlob: VarGlobService,
    private _dbMongo: DatabaseService
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('id')) {
      this._dbMongo.GetAllComments().subscribe(
        data => {
          console.log(data);

        },
        error => {
          console.log(error);

        }
      )
    }
    else {
      this._VarGlob.bandeauMessage = "Connectez vous pour accéder au site !";
      this._VarGlob.bandeauMsgType = 'warning';
      this.router.navigate(['/login'], {});
    }

    // this.route.queryParams.subscribe(param => {
    //   // this.message = param['message'];
    //   // this.msgType = param['msgType'];
    //   if (param['disconnect']) {
    //     // console.log(param['isBandeauVisible']);
    //     this.disconnect();
    //   }
    // })

  }

}
