import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonAvatar, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonIcon, 
  IonButton, 
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonChip,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonActionSheet,
  IonAlert,
  IonToggle,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  settingsOutline, 
  notificationsOutline, 
  lockClosedOutline,
  helpCircleOutline,
  logOutOutline,
  cameraOutline,
  pencilOutline,
  callOutline,
  mailOutline,
  locationOutline,
  calendarOutline,
  shieldCheckmarkOutline,
  moonOutline,
  languageOutline,
  cardOutline, shareOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface ProfileSettings {
  darkMode: boolean;
  notifications: boolean;
  locationServices: boolean;
  twoFactor: boolean;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
 standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonItem,
    IonLabel,
    IonList,
    IonIcon,
    IonButton,
    IonButtons,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonChip,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonFab,
    IonFabButton,
    IonActionSheet,
    IonAlert,
    IonToggle,
    IonInput]
})
export class ProfilePage implements OnInit {
  selectedSegment = 'details';
  showAvatarSheet = false;
  showLogoutAlert = false;

  userProfile: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'January 2023',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Mobile developer passionate about creating amazing user experiences.',
    isVerified: true,
    stats: {
      posts: 42,
      followers: 1234,
      following: 567
    }
  };

  settings: ProfileSettings = {
    darkMode: false,
    notifications: true,
    locationServices: false,
    twoFactor: true
  };

  private router = inject(Router);

  avatarButtons = [
    {
      text: 'Take Photo',
      icon: 'camera-outline',
      handler: () => this.takePhoto()
    },
    {
      text: 'Choose from Gallery',
      icon: 'images-outline',
      handler: () => this.chooseFromGallery()
    },
    {
      text: 'Remove Photo',
      icon: 'trash-outline',
      role: 'destructive',
      handler: () => this.removePhoto()
    },
    {
      text: 'Cancel',
      role: 'cancel'
    }
  ];

  logoutButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Sign Out',
      role: 'destructive',
      handler: () => this.confirmLogout()
    }
  ];

  constructor() {
    addIcons({
      personOutline,
      settingsOutline,
      notificationsOutline,
      lockClosedOutline,
      helpCircleOutline,
      logOutOutline,
      cameraOutline,
      pencilOutline,
      callOutline,
      mailOutline,
      locationOutline,
      calendarOutline,
      shieldCheckmarkOutline,
      moonOutline,
      languageOutline,
      cardOutline
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadSettings();
  }

  loadUserProfile() {
    // Load user profile from service/API
    console.log('Loading user profile...');
  }

  loadSettings() {
    // Load settings from service/API
    console.log('Loading settings...');
  }

  editProfile() {
    console.log('Edit profile clicked');
    // Navigate to edit profile page
  }

  shareProfile() {
    console.log('Share profile clicked');
    // Implement share functionality
  }

  changeAvatar() {
    this.showAvatarSheet = true;
  }

  takePhoto() {
    console.log('Taking photo...');
    // Implement camera functionality
  }

  chooseFromGallery() {
    console.log('Choosing from gallery...');
    // Implement gallery selection
  }

  removePhoto() {
    console.log('Removing photo...');
    this.userProfile.avatar = 'assets/images/avatar-placeholder.png';
  }

  toggleDarkMode() {
    console.log('Dark mode toggled:', this.settings.darkMode);
    document.body.classList.toggle('dark', this.settings.darkMode);
  }

  toggleNotifications() {
    console.log('Notifications toggled:', this.settings.notifications);
    // Update notification settings
  }

  toggleLocation() {
    console.log('Location services toggled:', this.settings.locationServices);
    // Update location settings
  }

  toggleTwoFactor() {
    console.log('Two-factor auth toggled:', this.settings.twoFactor);
    // Update 2FA settings
  }

  changePassword() {
    console.log('Change password clicked');
    // Navigate to change password page
  }

  paymentMethods() {
    console.log('Payment methods clicked');
    // Navigate to payment methods page
  }

  language() {
    console.log('Language settings clicked');
    // Show language selection
  }

  help() {
    console.log('Help clicked');
    // Navigate to help page
  }

  logout() {
    this.showLogoutAlert = true;
  }

  async confirmLogout() {
    await Preferences.clear();
    this.router.navigate(['/login']);
    // Implement logout logic
    // Navigate to login page
  }
}