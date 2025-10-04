import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonChip,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle } from 'ionicons/icons';

@Component({
  selector: 'app-home-login',
  templateUrl: './home-login.page.html',
  styleUrls: ['./home-login.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    IonButton, CommonModule]
})
export class HomeLoginPage {

  router = inject(Router)

  constructor(private navCtrl: NavController) {
    addIcons({logoFacebook, logoGoogle})
   }

  login() {
    this.router.navigate(['/login']);
    // Handle login logic
    console.log('Login clicked');
  }

  signUp() {
    // Handle sign up logic
    this.router.navigate(['/signup']);
    console.log('Sign Up clicked');
  }

  continueWithGoogle() {
    // Handle Google OAuth
    console.log('Continue with Google');
  }

  continueWithApple() {
    // Handle Apple Sign In
    console.log('Continue with Apple');
  }

  continueWithFacebook() {
    // Handle Facebook OAuth
    console.log('Continue with Facebook');
  }
}