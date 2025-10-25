import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
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
  IonLabel, IonFab, IonFabButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonRefresherContent,
  IonRefresher,
  RefresherCustomEvent, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  optionsOutline,
  add,
  bedOutline,
  homeOutline,
  keyOutline
} from 'ionicons/icons';
import { FilterPropertyPage } from 'src/app/shared/components/filter-property/filter-property.page';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/app.constant';
import { PropertyFilterService } from 'src/app/shared/services/property-filter/property-filter';
import { CacheService } from "ionic-cache";
import { User } from 'src/app/core/services/user/user';
import { key } from 'localforage-cordovasqlitedriver';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonFabButton, IonFab,
    CommonModule,
    FormsModule,
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher, IonRefresherContent,
  ],
  providers: [HttpClient, PropertyFilterService, ActionSheetController, AlertController, ModalController,]
})
export class HomePage {

  router = inject(Router);
  http = inject(HttpClient);
  private filterService = inject(PropertyFilterService);
  private cache = inject(CacheService);
  appliedFilters: any = null;
  filter = '';
  page = 1;
  totalPages = 0;
  loading = false;
  categories = [
    { name: 'Flat', active: false, icon: 'home-outline' },
    { name: 'Room', active: false, icon: 'person-outline'   },
    { name: 'PG', active: false, icon: 'bed-outline'   },
    { name: 'House', active: false, icon: 'key-outline'   },
    { name: 'Hostel', active: false, icon: 'school-outline'     },
    { name: 'Other', active: false, icon: 'ellipsis-horizontal-outline'     },  
  ];


  properties: any[] = [];

  quickActions = [
    { title: 'New Listings', icon: 'home-outline', color: 'primary' },
    { title: 'New Project', icon: 'business-outline', color: 'secondary' },
    { title: 'Open House', icon: 'key-outline', color: 'tertiary' },
    { title: 'Price Reduced', icon: 'trending-down-outline', color: 'success' }
  ];

  constructor(private modalController: ModalController,public userService: User) {
    addIcons({ add, optionsOutline, bedOutline, homeOutline, keyOutline,  });
    this.loadProperties();
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.page = 1;
    this.loadProperties();
    event.target.complete();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (this.page < this.totalPages && !this.loading) {
      this.page++;
      this.loadProperties(() => {
        (event.target as HTMLIonInfiniteScrollElement).complete();
      });

    }else {
      (event.target as HTMLIonInfiniteScrollElement).complete();
    } 


  }

  async loadProperties(callback?: any) {
    const owner = await this.userService.getUser();
    const ownerId = owner?.['role'] === 'owner' ?  owner?.id : '';
    this.loading = true;
    // Load properties from API or service
    if (this.filter) {
      this.http.get(API_BASE_URL + '/properties' + this.filter + 'page=' + this.page + '&limit=5').subscribe((data: any) => {
        if (data && data.properties) {
          this.properties = data.properties;
          this.totalPages = data.pages;
          this.loading = false;
        }
      });

    }
    else {
      let url = API_BASE_URL + '/properties?' + 'ownerId=' + ownerId + '&page=' + this.page + '&limit=5';
      let cacheKey = url;
      let request = this.http.get(url);
      this.cache.loadFromDelayedObservable(cacheKey, request, 'list', 30).subscribe((response: any) => {
        if (response && response.properties) {
          if (this.page === 1) {
            this.properties = response.properties;
          } else {
            this.properties = [...this.properties, ...response.properties];
          }
          this.totalPages = response.pages;
          this.loading = false;
          if (callback) { callback();}
        }
      });
    }
  }

  onCategorySelect(category: any) {
    this.filter = '?';
    this.page = 1;  
    category.active = true;
    this.filter = this.filter + 'propertyType=' + category.name + '&';
    this.categories.forEach(cat => {
      if (cat.name !== category.name) {
        cat.active = false;
      }
    });
    this.loadProperties();

  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Searching for:', query);
  }

  viewProperty(property) {
    this.router.navigate(['/property-view', property._id]);
  }

  onAddProperty() {
    this.router.navigate(['/add-property']);
  }

  async presentFilterOptions() {
    // await this.filterService.presentMainFilterActionSheet();
    const modal = await this.modalController.create({
      component: FilterPropertyPage,
      cssClass: 'bottom-sheet-modal',
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.8,
      backdropBreakpoint: 0.5,
      componentProps: { currentFilters: this.appliedFilters }
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        this.appliedFilters = data.data;
        this.filter = '';
        this.filter = this.appliedFilters + '&';
        this.loadProperties();
      }
    })
  }
}