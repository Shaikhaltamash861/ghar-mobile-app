import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonInput, IonCard,
  IonItem, IonCardContent, IonCardHeader, IonTextarea, IonSelect,
  IonTitle, IonCardTitle, IonContent, IonSelectOption, IonDatetimeButton, IonModal, IonCheckbox,
  IonLabel, IonDatetime, IonButton, IonToggle, IonIcon
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { add, closeCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { HttpClient } from '@angular/common/http';
import { FileTransfer } from '@capacitor/file-transfer';
import { API_BASE_URL } from 'src/app/app.constant';

export interface PropertyData {
  title: string;
  description?: string;
  propertyType: string;
  bhkType: string;
  rent: number;
  deposit: number;
  furnishing: string;
  availableFrom: string;
  address: {
    buildingName?: string;
    street?: string;
    city: string;
    state: string;
    pincode?: string;
    landmark?: string;
  };
  amenities: string[];
  images: Array<{ url: string }>;
  isAvailable: boolean;
  contactPreference: string;
}

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.page.html',
  styleUrls: ['./add-property.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonInput, IonCard, IonItem,
    IonCardContent, IonCardHeader, IonTextarea, IonSelect, IonCardContent, IonTitle, IonCardTitle,
    IonContent, IonSelectOption, IonDatetimeButton, IonModal, IonCheckbox, IonLabel, IonDatetime,
    IonButton, IonToggle, IonIcon, FormsModule, CommonModule, ReactiveFormsModule
  ],
})
export class AddPropertyPage implements OnInit {
  propertyForm: FormGroup;
  uploadImageLoadinig = false;
  selectedImages: Array<{ url: string; preview: string }> = [];

  propertyTypes = ['Flat', 'Room', 'PG', 'House', 'Hostel', 'Other'];
  bhkTypes = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK+'];
  furnishingTypes = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'];
  amenitiesList = [
    'Parking', 'WiFi', 'AC', 'Power Backup', 'Lift',
    'Water Supply', 'Security', 'Gym', 'Swimming Pool', 'Other'
  ];
  contactPreferences = ['Phone', 'Chat', 'Both'];

  constructor(
    private formBuilder: FormBuilder,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private http: HttpClient
  ) {
    this.initializeForm();
    addIcons({ add, closeCircle });
  }

  ngOnInit() { }

  initializeForm() {
    this.propertyForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      propertyType: ['', Validators.required],
      bhkType: ['1RK'],
      rent: ['', [Validators.required, Validators.min(1)]],
      deposit: [0, [Validators.min(0)]],
      furnishing: ['Unfurnished'],
      availableFrom: [new Date().toISOString()],
      address: this.formBuilder.group({
        buildingName: [''],
        street: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', [Validators.pattern(/^\d{6}$/)]],
        landmark: ['']
      }),
      amenities: this.formBuilder.array([]),
      isAvailable: [true],
      contactPreference: ['Both']
    });
  }

  get amenitiesArray() {
    return this.propertyForm.get('amenities') as FormArray;
  }

  onAmenityChange(amenity: string, event: any) {
    const amenitiesArray = this.amenitiesArray;

    if (event.detail.checked) {
      amenitiesArray.push(this.formBuilder.control(amenity));
    } else {
      const index = amenitiesArray.controls.findIndex(x => x.value === amenity);
      amenitiesArray.removeAt(index);
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.amenitiesArray.value.includes(amenity);
  }

  async presentImageActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePicture(CameraSource.Camera);
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.takePicture(CameraSource.Photos);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async takePicture(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source
      });

      this.uploadImage(image.base64String);
    } catch (error) {
      console.error('Error taking picture:', error);
      this.presentToast('Error taking picture', 'danger');
    }
  }

  private async uploadImage(base64: string) {
    this.uploadImageLoadinig = true;
    if (!base64) {
      this.presentToast('No image data to upload', 'warning');
      return;
    }
    const formData = new FormData();

    const blob = await this.base64ToBlob(base64);
    formData.append('image', blob, 'image.jpg');

    this.http.post(API_BASE_URL + '/upload-image', formData).subscribe((response: any) => {
      if (response) {
        this.selectedImages.push({ preview: response.imageUrls[0], url: response.imageUrls[0] });
        this.uploadImageLoadinig = false;
      }
    }, error => {
      console.error('Image upload failed:', error);
      this.presentToast('Image upload failed', 'danger');
      this.uploadImageLoadinig = false;
    });
  }

  private base64ToBlob(base64: string, contentType = 'image/jpeg'): Blob {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  async onSubmit() {
    if (this.propertyForm.valid) {

      try {
        const propertyData: PropertyData = {
          ...this.propertyForm.value,
          images: this.selectedImages.map(img => ({ url: img.url }))
        };

        this.http.post(API_BASE_URL + '/property', propertyData).subscribe((response: any) => {
          this.presentToast('Property added successfully', 'success');
          console.log('Property added successfully:', response);
          this.router.navigate(['/home']);;
        })



        // Here you would typically send the data to your backend service
        console.log('Property Data:', propertyData);



        await this.presentToast(propertyData.images[0].url, 'success');
        // this.router.navigate(['/properties']);

      } catch (error) {
        console.error('Error adding property:', error);
        await this.presentToast('Error adding property. Please try again.', 'danger');
      }
    } else {
      await this.presentToast('Please fill all required fields correctly', 'warning');
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.propertyForm.controls).forEach(field => {
      const control = this.propertyForm.get(field);
      control?.markAsTouched({ onlySelf: true });

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(subField => {
          control.get(subField)?.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  getFieldError(fieldName: string): string | undefined {
    const field = this.propertyForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
      if (field.errors['pattern']) return `Invalid ${fieldName} format`;
    }
    return undefined;
  }

  getAddressFieldError(fieldName: string): string {
    const field = this.propertyForm.get(`address.${fieldName}`);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['pattern']) return `Invalid ${fieldName} format`;
    }
    return '';
  }
}