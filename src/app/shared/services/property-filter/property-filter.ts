import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

export interface PropertyFilters {
  propertyType?: string[];
  bhkType?: string[];
  furnishing?: string[];
  rentRange?: { min: number; max: number };
  depositRange?: { min: number; max: number };
  city?: string;
  state?: string;
  amenities?: string[];
  availableFrom?: Date;
  contactPreference?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class PropertyFilterService {
  private filtersSubject = new BehaviorSubject<PropertyFilters>({});
  public filters$ = this.filtersSubject.asObservable();

  private propertyTypes = ['Flat', 'Room', 'PG', 'House', 'Hostel', 'Other'];
  private bhkTypes = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK+'];
  private furnishingTypes = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'];
  private amenitiesList = [
    'Parking', 'WiFi', 'AC', 'Power Backup', 'Lift', 
    'Water Supply', 'Security', 'Gym', 'Swimming Pool', 'Other'
  ];
  private contactPreferences = ['Phone', 'Chat', 'Both'];
  private sortOptions = [
    { value: 'rent', label: 'Rent' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'availableFrom', label: 'Available Date' },
    { value: 'title', label: 'Title' }
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  getCurrentFilters(): PropertyFilters {
    return this.filtersSubject.value;
  }

  updateFilters(filters: PropertyFilters) {
    this.filtersSubject.next({ ...this.getCurrentFilters(), ...filters });
  }

  clearAllFilters() {
    this.filtersSubject.next({});
  }

  async presentMainFilterActionSheet() {
    const currentFilters = this.getCurrentFilters();
    const activeFiltersCount = this.getActiveFiltersCount();

    const actionSheet = await this.actionSheetController.create({
      header: `Filters ${activeFiltersCount > 0 ? `(${activeFiltersCount} active)` : ''}`,
      cssClass: 'filter-action-sheet',
      buttons: [
        {
          text: `Property Type ${this.getFilterBadge(currentFilters.propertyType)}`,
          icon: 'home',
          handler: () => {
            this.presentPropertyTypeFilter();
          }
        },
        {
          text: `BHK Type ${this.getFilterBadge(currentFilters.bhkType)}`,
          icon: 'bed',
          handler: () => {
            this.presentBHKTypeFilter();
          }
        },
        {
          text: `Price Range ${this.getPriceRangeBadge(currentFilters.rentRange)}`,
          icon: 'cash',
          handler: () => {
            this.presentPriceRangeFilter();
          }
        },
        {
          text: `Furnishing ${this.getFilterBadge(currentFilters.furnishing)}`,
          icon: 'bed',
          handler: () => {
            this.presentFurnishingFilter();
          }
        },
        {
          text: `Location ${this.getLocationBadge(currentFilters)}`,
          icon: 'location',
          handler: () => {
            this.presentLocationFilter();
          }
        },
        {
          text: `Amenities ${this.getFilterBadge(currentFilters.amenities)}`,
          icon: 'checkmark-circle',
          handler: () => {
            this.presentAmenitiesFilter();
          }
        },
        {
          text: `Sort By ${this.getSortBadge(currentFilters)}`,
          icon: 'funnel',
          handler: () => {
            this.presentSortFilter();
          }
        },
        {
          text: 'Clear All Filters',
          icon: 'refresh',
          role: 'destructive',
          handler: () => {
            this.clearAllFilters();
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

  private async presentPropertyTypeFilter() {
    const currentFilters = this.getCurrentFilters();
    const selectedTypes = currentFilters.propertyType || [];

    const inputs = this.propertyTypes.map(type => ({
      name: 'propertyType',
      type: 'checkbox' as const,
      label: type,
      value: type,
      checked: selectedTypes.includes(type)
    }));

    const alert = await this.alertController.create({
      header: 'Property Type',
      inputs: inputs,
      buttons: [
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            this.updateFilters({ propertyType: [] });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            this.updateFilters({ propertyType: data });
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentBHKTypeFilter() {
    const currentFilters = this.getCurrentFilters();
    const selectedBHK = currentFilters.bhkType || [];

    const inputs = this.bhkTypes.map(bhk => ({
      name: 'bhkType',
      type: 'checkbox' as const,
      label: bhk,
      value: bhk,
      checked: selectedBHK.includes(bhk)
    }));

    const alert = await this.alertController.create({
      header: 'BHK Type',
      inputs: inputs,
      buttons: [
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            this.updateFilters({ bhkType: [] });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            this.updateFilters({ bhkType: data });
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentFurnishingFilter() {
    const currentFilters = this.getCurrentFilters();
    const selectedFurnishing = currentFilters.furnishing || [];

    const inputs = this.furnishingTypes.map(furnishing => ({
      name: 'furnishing',
      type: 'checkbox' as const,
      label: furnishing,
      value: furnishing,
      checked: selectedFurnishing.includes(furnishing)
    }));

    const alert = await this.alertController.create({
      header: 'Furnishing Type',
      inputs: inputs,
      buttons: [
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            this.updateFilters({ furnishing: [] });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            this.updateFilters({ furnishing: data });
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentPriceRangeFilter() {
    const currentFilters = this.getCurrentFilters();
    const currentRange = currentFilters.rentRange || { min: 0, max: 100000 };

    const alert = await this.alertController.create({
      header: 'Price Range (₹)',
      inputs: [
        {
          name: 'minRent',
          type: 'number',
          placeholder: 'Minimum Rent',
          value: currentRange.min.toString()
        },
        {
          name: 'maxRent',
          type: 'number',
          placeholder: 'Maximum Rent',
          value: currentRange.max.toString()
        }
      ],
      buttons: [
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            this.updateFilters({ rentRange: undefined });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            const min = parseInt(data.minRent) || 0;
            const max = parseInt(data.maxRent) || 100000;
            if (min <= max) {
              this.updateFilters({ rentRange: { min, max } });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentLocationFilter() {
    const currentFilters = this.getCurrentFilters();

    const alert = await this.alertController.create({
      header: 'Location',
      inputs: [
        {
          name: 'city',
          type: 'text',
          placeholder: 'City',
          value: currentFilters.city || ''
        },
        {
          name: 'state',
          type: 'text',
          placeholder: 'State',
          value: currentFilters.state || ''
        }
      ],
      buttons: [
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            this.updateFilters({ city: undefined, state: undefined });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            this.updateFilters({ 
              city: data.city?.trim() || undefined,
              state: data.state?.trim() || undefined
            });
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentAmenitiesFilter() {
    const currentFilters = this.getCurrentFilters();
    const selectedAmenities = currentFilters.amenities || [];

    const inputs = this.amenitiesList.map(amenity => ({
      name: 'amenities',
      type: 'checkbox' as const,
      label: amenity,
      value: amenity,
      checked: selectedAmenities.includes(amenity)
    }));

    const alert = await this.alertController.create({
      header: 'Amenities',
      inputs: inputs,
      buttons: [
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            this.updateFilters({ amenities: [] });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            this.updateFilters({ amenities: data });
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentSortFilter() {
    const currentFilters = this.getCurrentFilters();
    const currentSort = currentFilters.sortBy || 'rent';
    const currentOrder = currentFilters.sortOrder || 'asc';

    const actionSheet = await this.actionSheetController.create({
      header: 'Sort By',
      buttons: [
        ...this.sortOptions.map(option => ({
          text: `${option.label} (Low to High)`,
          icon: 'arrow-up',
          cssClass: currentSort === option.value && currentOrder === 'asc' ? 'selected' : '',
          handler: () => {
            this.updateFilters({ sortBy: option.value, sortOrder: 'asc' as const });
          }
        })),
        ...this.sortOptions.map(option => ({
          text: `${option.label} (High to Low)`,
          icon: 'arrow-down',
          cssClass: currentSort === option.value && currentOrder === 'desc' ? 'selected' : '',
          handler: () => {
            this.updateFilters({ sortBy: option.value, sortOrder: 'desc' as const });
          }
        })),
        {
          text: 'Clear Sort',
          icon: 'refresh',
          role: 'destructive',
          handler: () => {
            this.updateFilters({ sortBy: undefined, sortOrder: undefined });
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

  private getFilterBadge(filterArray?: string[]): string {
    if (!filterArray || filterArray.length === 0) return '';
    return `(${filterArray.length})`;
  }

  private getPriceRangeBadge(priceRange?: { min: number; max: number }): string {
    if (!priceRange) return '';
    return `(₹${priceRange.min}-₹${priceRange.max})`;
  }

  private getLocationBadge(filters: PropertyFilters): string {
    const parts = [];
    if (filters.city) parts.push(filters.city);
    if (filters.state) parts.push(filters.state);
    return parts.length > 0 ? `(${parts.join(', ')})` : '';
  }

  private getSortBadge(filters: PropertyFilters): string {
    if (!filters.sortBy) return '';
    const sortOption = this.sortOptions.find(opt => opt.value === filters.sortBy);
    const orderText = filters.sortOrder === 'desc' ? '↓' : '↑';
    return `(${sortOption?.label} ${orderText})`;
  }

  private getActiveFiltersCount(): number {
    const filters = this.getCurrentFilters();
    let count = 0;

    if (filters.propertyType?.length) count++;
    if (filters.bhkType?.length) count++;
    if (filters.furnishing?.length) count++;
    if (filters.rentRange) count++;
    if (filters.city || filters.state) count++;
    if (filters.amenities?.length) count++;
    if (filters.sortBy) count++;

    return count;
  }

  // Helper method to apply filters to property array
  applyFilters(properties: any[]): any[] {
    const filters = this.getCurrentFilters();
    let filteredProperties = [...properties];

    // Property Type filter
    if (filters.propertyType?.length) {
      filteredProperties = filteredProperties.filter(property =>
        filters.propertyType!.includes(property.propertyType)
      );
    }

    // BHK Type filter
    if (filters.bhkType?.length) {
      filteredProperties = filteredProperties.filter(property =>
        filters.bhkType!.includes(property.bhkType)
      );
    }

    // Furnishing filter
    if (filters.furnishing?.length) {
      filteredProperties = filteredProperties.filter(property =>
        filters.furnishing!.includes(property.furnishing)
      );
    }

    // Rent range filter
    if (filters.rentRange) {
      filteredProperties = filteredProperties.filter(property =>
        property.rent >= filters.rentRange!.min && property.rent <= filters.rentRange!.max
      );
    }

    // Location filter
    if (filters.city) {
      filteredProperties = filteredProperties.filter(property =>
        property.address?.city?.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.state) {
      filteredProperties = filteredProperties.filter(property =>
        property.address?.state?.toLowerCase().includes(filters.state!.toLowerCase())
      );
    }

    // Amenities filter
    if (filters.amenities?.length) {
      filteredProperties = filteredProperties.filter(property =>
        filters.amenities!.some(amenity => property.amenities?.includes(amenity))
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredProperties.sort((a, b) => {
        let aValue = a[filters.sortBy!];
        let bValue = b[filters.sortBy!];

        // Handle nested address fields
        if (filters.sortBy === 'city' || filters.sortBy === 'state') {
          aValue = a.address?.[filters.sortBy];
          bValue = b.address?.[filters.sortBy];
        }

        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue?.toLowerCase() || '';
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
    }

    return filteredProperties;
  }
}