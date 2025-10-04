
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ActionSheetController, AlertController,IonicModule } from '@ionic/angular';
import { IonInput, IonButton, IonIcon, IonSpinner, IonContent, IonChip, IonLabel,
   IonTextarea, IonModal, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {chevronBack,
  chevronForward,
  arrowBack,
  shareOutline,
  homeOutline,
  bedOutline,
  constructOutline,
  calendarOutline,
  locationOutline,
  navigateOutline,
  mapOutline,
  checkmarkCircleOutline,
  checkmarkCircle,
  personOutline,
  callOutline,
  closeOutline,
  chatbubbleOutline,
  sendOutline,
  heart,
  heartOutline} from 'ionicons/icons';
import { PropertyView } from './property-view';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/app.constant';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileTransfer } from '@capacitor/file-transfer';
import { CacheService } from 'ionic-cache';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
interface Address {
  buildingName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface PropertyImage {
  url: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  bhkType: string;
  rent: number;
  deposit: number;
  furnishing: string;
  availableFrom: string;
  address: Address;
  amenities: string[];
  images: PropertyImage[];
  contactPreference: string;
}

@Component({
  selector: 'app-property-view',
  templateUrl: './property-view.page.html',
  styleUrls: ['./property-view.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonChip, IonLabel, CommonModule, IonInput, IonTextarea,
     IonModal, IonHeader, IonTitle, IonSpinner, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [HttpClient]
})
export class PropertyViewPage implements OnInit {
  propertyId: string | null = null;
 property: Property = {
    id: '1',
    title: "2BHK Flat in Andheri",
    description: "Spacious flat with parking and all modern amenities. Perfect for small families or working professionals.",
    propertyType: "Flat",
    bhkType: "2BHK",
    rent: 25000,
    deposit: 75000,
    furnishing: "Semi-Furnished",
    availableFrom: "2025-09-01",
    address: {
      buildingName: "Sai Residency",
      street: "Link Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053",
      landmark: "Near Metro Station"
    },
    amenities: ["Parking", "Lift", "Water Supply", "Security", "Power Backup", "Garden"],
    images: [
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=800&q=80" }
    ],
    contactPreference: "Phone"
  };

  currentImageIndex = 0;
  isFavorite = false;
  isContactModalOpen = false;
  contactForm: FormGroup;
  isSubmitted = false;
  private viewPropertyService = inject(PropertyView);
  private http = inject(HttpClient);
    private cache = inject(CacheService);

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder
  ) {
    addIcons({
      chevronBack,
      chevronForward,
      arrowBack,
      shareOutline,
      homeOutline,
      bedOutline,
      constructOutline,
      calendarOutline,
      locationOutline,
      navigateOutline,
      mapOutline,
      checkmarkCircleOutline,
      checkmarkCircle,
      personOutline,
      callOutline,
      closeOutline,
      chatbubbleOutline,
      sendOutline,
      heart,
      heartOutline
    });
      this.contactForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[+]?[0-9]{10,15}$')]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    // In real app, fetch property data based on route params
    const propertyId = this.route.snapshot.paramMap.get('id');
     this.route.paramMap.subscribe(params => {
      this.propertyId = params.get('id') as string;
      console.log('Property ID:', this.propertyId);
    });
    // if (!this.propertyId) return;
    console.log('Property ID from route:', propertyId);
    this.getProperty();

  }

  getProperty() {
    let url = API_BASE_URL +`/property/${this.propertyId}`;
    let cacheKey = url;
    let request = this.http.get(url);
    this.cache.loadFromDelayedObservable(cacheKey, request,'property', 30).subscribe((response: any) => {
      if (response) {
        this.property = response;
      } 
    });

    // this.http.get().subscribe((data: any) => {
    //   this.property = data;
    //   console.log('Property data loaded', data);
    // });
  }

  addImage() {
    //  const copied = await Filesystem.copy({
    //         from: element.url,
    //         to: `property_${new Date().getTime()}.jpeg`,
    //         directory: Directory.Cache
    //       });

    //       const file = await FileTransfer.uploadFile({
    //         path: copied.uri,
    //         url: API_BASE_URL + '/api/upload',
    //         fileKey: 'image',
    //         chunkedMode: true,
    //       })
    //       console.log('File upload response:', file);
    //     });


  }

  goBack() {
    this.navCtrl.back();
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.property.images.length;
  }

  previousImage() {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.property.images.length - 1 
      : this.currentImageIndex - 1;
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  async shareProperty() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share Property',
      buttons: [
        {
          text: 'WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            this.shareViaWhatsApp();
          }
        },
        {
          text: 'Copy Link',
          icon: 'copy-outline',
          handler: () => {
            this.copyLink();
          }
        },
        {
          text: 'More Options',
          icon: 'share-outline',
          handler: () => {
            this.shareNative();
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

  shareViaWhatsApp() {
    const text = `Check out this property: ${this.property.title} - ₹${this.property.rent.toLocaleString('en-IN')}/month`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.showToast('Link copied to clipboard');
    } catch (err) {
      console.error('Could not copy link', err);
    }
  }

  shareNative() {
    if (navigator.share) {
      navigator.share({
        title: this.property.title,
        text: `Check out this property: ${this.property.title}`,
        url: window.location.href
      });
    }
  }

  async showToast(message: string) {
    const alert = await this.alertCtrl.create({
      message,
    });
    await alert.present();
  }

  // async contactOwner() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Contact Owner',
  //     buttons: [
  //       {
  //         text: 'Call Now',
  //         icon: 'call-outline',
  //         handler: () => {
  //           window.open('tel:+919876543210', '_system');
  //         }
  //       },
  //       {
  //         text: 'WhatsApp',
  //         icon: 'logo-whatsapp',
  //         handler: () => {
  //           const message = `Hi, I'm interested in your property: ${this.property.title}`;
  //           window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  //         }
  //       },
  //       {
  //         text: 'Send Message',
  //         icon: 'chatbubble-outline',
  //         handler: () => {
  //           this.sendMessage();
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         icon: 'close',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  async sendMessage() {
    const alert = await this.alertCtrl.create({
      header: 'Send Message',
      inputs: [
        {
          name: 'message',
          type: 'textarea',
          placeholder: 'Type your message here...',
          value: `Hi, I'm interested in your property: ${this.property.title}. Can we schedule a visit?`
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: (data) => {
            console.log('Message sent:', data.message);
            this.showToast('Message sent successfully!');
          }
        }
      ]
    });
    await alert.present();
  }

  scheduleVisit() {
    // Navigate to visit scheduling page or show modal
    console.log('Schedule visit clicked');
    this.showToast('Visit scheduling feature coming soon!');
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  getFullAddress(): string {
    const addr = this.property.address;
    return `${addr.buildingName}, ${addr.street}, ${addr.city}, ${addr.state} ${addr.pincode}`;
  }

  
  // Contact Owner Modal methods
  contactOwner() {
    this.isContactModalOpen = true;
    this.resetContactForm();
  }

  closeContactModal() {
    this.isContactModalOpen = false;
    this.resetContactForm();
  }

  resetContactForm() {
    this.contactForm.reset();
    this.isSubmitted = false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Message must be at least ${minLength} characters`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `Message cannot exceed ${maxLength} characters`;
      }
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      phoneNumber: 'Phone number',
      message: 'Message'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched || this.isSubmitted));
  }

  onContactSubmit() {
    this.isSubmitted = true;
    
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      const contactPayload = {
        propertyId: this.propertyId,
        phone: formData.phoneNumber,
        message: formData.message
      };

      this.http.post(API_BASE_URL + '/contact-request', contactPayload).subscribe({
        next: (response) => {
          console.log('Contact request sent:', response);
          this.showToast('Your request has been sent. The owner will contact you soon.');
          this.closeContactModal();
        }
        , error: (error) => {
          console.error('Contact request error:', error);
          this.showToast( error.error.error || 'There was an error sending your request. Please try again later.');
        }
      });
    } else {
      console.log('Contact form is invalid');
    }
  }

  getCharacterCount(): number {
    const message = this.contactForm.get('message')?.value || '';
    return message.length;
  }
}