import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// import Authen

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BandeauComponent } from './components/bandeau/bandeau.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { TitleCasePipePipe } from './pipes/title-case-pipe.pipe';
import { AuthentificationService } from './services/authentification.service'
import { VarGlobService } from './services/var-glob.service'

@NgModule({
  declarations: [ /** Déclaration des composants, pipes, directives */
    AppComponent,
    BandeauComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    TitleCasePipePipe
  ],
  imports: [  /** Déclaration des modules utilisables */
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [  /**Déclaration des services utilisables / singleton */
    AuthentificationService,
    VarGlobService
  ],
  bootstrap: [AppComponent] /**  Déclaration du composant racine */
})
export class AppModule { }