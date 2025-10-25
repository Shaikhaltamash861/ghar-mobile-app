import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { IonInput, IonButton, IonIcon, IonSpinner, IonContent,IonInputPasswordToggle } from '@ionic/angular/standalone';
import { AuthService, LoginRequest } from 'src/app/core/services/auth/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { addIcons } from 'ionicons';
import { mailOpenOutline, mailOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { User } from 'src/app/core/services/user/user';
import { API_BASE_URL } from 'src/app/app.constant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, IonInput, IonButton, IonIcon, IonSpinner, IonContent],
  providers: [AuthService, HttpClient],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  isPasswordVisible = false;
  isLoading = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(User);
  private http = inject(HttpClient);
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    addIcons({ mailOpenOutline, mailOutline, eyeOutline, eyeOffOutline });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async onLogin() {
    if (this.loginForm.valid) {
      // const loading = await this.loadingController.create({
      //   message: 'Signing in...',
      //   duration: 2000
      // });

      // await loading.present();

      const loginPayload = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      this.isLoading = true;
      this.authService.login(loginPayload).subscribe((response) => {
        console.log('Login successful', response);
        if (response.token) {
          console.log('Token:', response.token);
          
          const user = {
            id: response._id,
            name: response.name,
            email: response.email,
            role: response.role
          };
          this.userService.setUser(user);
          // // this.uploadToken(response._id);
          this.isLoading = false;
          this.setToken(response.token).then(() => {
            this.router.navigate(['']);
          }
          ).catch((error) => {
            this.isLoading = false;
            console.error('Error storing token', error);
          });
        }
      }, (error) => {
        this.isLoading = false;
        this.showValidationErrors();
        console.error('Login failed', error);
      });



      // Simulate API call
      // setTimeout(async () => {
      //   await loading.dismiss();
      //   // Navigate to home or dashboard
      //   this.navCtrl.navigateForward('/tb/home');
      // }, 2000);
    } else {
      this.showValidationErrors();
    }
  }

  async showValidationErrors() {
    const alert = await this.alertController.create({
      header: 'Invalid Input',
      message: 'Please check your email and password.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async setToken(token): Promise<void> {
   return await Preferences.set({
      key: 'authToken',
      value: token
    });
  }

  async uploadToken(userId) {
    const fcm = await Preferences.get({ key: 'fcmToken' });

    this.http.put(API_BASE_URL + '/fcm-token', { userId: userId, fcmToken: fcm.value }).subscribe({
      next: (res) => {
        console.log('FCM token updated successfully', res);
      },
      error: (err) => {
        console.error('Error updating FCM token', err);
      }
    });

  }

  goBack() {
    this.navCtrl.back();
  }

  forgotPassword() {
    // Handle forgot password logic
    console.log('Forgot password clicked');
  }

  continueWithGoogle() {
    console.log('Continue with Google');
  }

  continueWithApple() {
    console.log('Continue with Apple');
  }

  continueWithFacebook() {
    console.log('Continue with Facebook');
  }

  navigateToSignUp() {
    this.navCtrl.navigateForward('/signup');
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}