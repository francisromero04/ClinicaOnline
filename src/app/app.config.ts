import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { provideHttpClient } from '@angular/common/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    RecaptchaModule,
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: "clinicaonline-50bb7",
          appId: "1:73778727254:web:405c2f92e09d79a81d6ef7",
          storageBucket: "clinicaonline-50bb7.appspot.com",
          apiKey: "AIzaSyDd5KSEgw1vaBrsNjYhqD5Khd4Z2998_K0",
          authDomain: "clinicaonline-50bb7.firebaseapp.com",
          messagingSenderId: "73778727254",
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(AngularFireModule.initializeApp({
      apiKey: "AIzaSyDd5KSEgw1vaBrsNjYhqD5Khd4Z2998_K0",
      authDomain: "clinicaonline-50bb7.firebaseapp.com",
      projectId: "clinicaonline-50bb7",
      storageBucket: "clinicaonline-50bb7.appspot.com",
      messagingSenderId: "73778727254",
      appId: "1:73778727254:web:405c2f92e09d79a81d6ef7"
    })),
    importProvidersFrom(NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })),
    importProvidersFrom(BrowserAnimationsModule) // Añade BrowserAnimationsModule aquí
  ]
};
