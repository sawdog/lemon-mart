import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { EntityDataModule } from '@ngrx/data'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { IConfig, NgxMaskModule } from 'ngx-mask'

import { environment } from '../environments/environment'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AuthGuard } from './auth/auth-guard.service'
import { AuthHttpInterceptor } from './auth/auth-http-interceptor'
import { authFactory } from './auth/auth.factory'
import { AuthService } from './auth/auth.service'
import { SimpleDialogComponent } from './common/simple-dialog.component'
import { UiService } from './common/ui.service'
import { entityConfig } from './entity-metadata'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { MaterialModule } from './material.module'
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { UserService } from './user/user/user.service'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {
  showMaskTyped: true,
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    NavigationMenuComponent,
    SimpleDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxMaskModule.forRoot(options),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [
    {
      provide: AuthService,
      useFactory: authFactory,
      deps: [HttpClient, AngularFireAuth],
    },
    AuthGuard,
    UiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    UserService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [SimpleDialogComponent],
})
export class AppModule {}
