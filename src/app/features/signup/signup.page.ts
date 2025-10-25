// signup.page.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  eyeOutline,
  eyeOffOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  logoGoogle,
  logoFacebook
} from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/app.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonSpinner,
    IonInput,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption
  ]
})
export class SignupPage {
  signupForm: FormGroup;
  showPassword = false;
  isSubmitted = false;
  isLoading = false;

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
    addIcons({
      eyeOutline,
      eyeOffOutline,
      personOutline,
      mailOutline,
      lockClosedOutline,
      logoGoogle,
      logoFacebook
    });

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${minLength} characters`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      role: 'Role'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched || this.isSubmitted));
  }

  onSubmit() {
    this.isLoading = true;
    this.isSubmitted = true;

    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      console.log('Signup form submitted:', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        // Don't log the actual password in production
        passwordProvided: !!formData.password
      });

      this.http.post(API_BASE_URL + '/signup', formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/login']);
          console.log('Signup successful', response);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Signup error', error);
        },
      });
    }
  }

    signupWithGoogle() {
      console.log('Google signup clicked');
      // Implement Google OAuth signup
    }

    signupWithFacebook() {
      console.log('Facebook signup clicked');
      // Implement Facebook OAuth signup
    }

    forgotPassword() {
      console.log('Forgot password clicked');
      // Implement forgot password functionality
    }

    goToSignin() {
      this.router.navigate(['/login']);
    }
  }