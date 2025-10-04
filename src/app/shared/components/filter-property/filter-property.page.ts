import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController, GestureController, Gesture, AnimationController, Animation } from '@ionic/angular';
import { IonContent, IonToolbar, IonButton, IonLabel,IonTitle,IonHeader, IonButtons ,
  IonIcon, IonChip, IonItem, IonInput, IonSelect, IonSelectOption, IonList, IonRadioGroup, IonRadio,IonNote
} from '@ionic/angular/standalone';

interface FilterOption {
  id: string;
  label: string;
  selected: boolean;
}

interface PriceRange {
  min: string;
  max: string;
}

interface AppliedFilters {
  propertyTypes: FilterOption[];
  bhkTypes: FilterOption[];
  furnishing: FilterOption[];
  amenities: FilterOption[];
  priceRange: PriceRange;
  location: string;
  sortBy: string;
}

@Component({
  selector: 'app-filter-property',
  templateUrl: './filter-property.page.html',
  styleUrls: ['./filter-property.page.scss'],
  standalone: true,
  imports: [IonButtons, 
    IonToolbar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButton, IonIcon, IonChip, IonLabel, IonItem, IonInput, IonSelect, IonSelectOption, IonList, 
    IonRadioGroup, IonRadio, IonNote
  ]
})
export class FilterPropertyPage implements OnInit {
  
  @ViewChild('dragHandle', { read: ElementRef }) dragHandle!: ElementRef;
  @ViewChild('bottomSheetContent', { read: ElementRef }) bottomSheetContent!: ElementRef;
  @Input() currentFilters?: AppliedFilters;
  
  private dragGesture!: Gesture;
  private closeAnimation!: Animation;
  private isDragging = false;
  private startY = 0;
  private currentY = 0;
  
  propertyTypes: FilterOption[] = [
    { id: 'villa', label: 'Villas', selected: false },
    { id: 'house', label: 'Houses', selected: false },
    { id: 'apartment', label: 'Apartments', selected: false },
    { id: 'condo', label: 'Condos', selected: false },
    { id: 'townhouse', label: 'Townhouses', selected: false }
  ];

  bhkTypes: FilterOption[] = [
    { id: '1bhk', label: '1 BHK', selected: false },
    { id: '2bhk', label: '2 BHK', selected: false },
    { id: '3bhk', label: '3 BHK', selected: false },
    { id: '4bhk', label: '4 BHK', selected: false },
    { id: '5bhk', label: '5+ BHK', selected: false }
  ];

  furnishingTypes: FilterOption[] = [
    { id: 'fully', label: 'Fully Furnished', selected: false },
    { id: 'semi', label: 'Semi Furnished', selected: false },
    { id: 'unfurnished', label: 'Unfurnished', selected: false }
  ];

  amenities: FilterOption[] = [
    { id: 'pool', label: 'Swimming Pool', selected: false },
    { id: 'gym', label: 'Gym', selected: false },
    { id: 'parking', label: 'Parking', selected: false },
    { id: 'security', label: 'Security', selected: false },
    { id: 'garden', label: 'Garden', selected: false },
    { id: 'elevator', label: 'Elevator', selected: false },
    { id: 'backup', label: 'Power Backup', selected: false },
    { id: 'clubhouse', label: 'Club House', selected: false },
    { id: 'playground', label: 'Playground', selected: false },
    { id: 'spa', label: 'Spa', selected: false },
    { id: 'wifi', label: 'Wi-Fi', selected: false },
    { id: 'maintenance', label: '24/7 Maintenance', selected: false }
  ];

  priceRange: PriceRange = {
    min: '',
    max: ''
  };

  location: string = '';
  
  sortOptions: string[] = [
    'Price: Low to High',
    'Price: High to Low', 
    'Newest First',
    'Most Popular',
    'Area: Low to High',
    'Area: High to Low',
    'Distance: Near to Far',
    'Rating: High to Low'
  ];

  selectedSort: string = 'Most Popular';

  // Filter statistics
  totalFiltersApplied = 0;
  lastAppliedFilters?: AppliedFilters;

  constructor(
    private modalController: ModalController,
    private gestureController: GestureController,
    private animationController: AnimationController
  ) { }

  ngOnInit() {
    // Load current filters if provided
    if (this.currentFilters) {
      this.loadFiltersFromInput(this.currentFilters);
    }
    
    // Set up gesture handling after view init
    setTimeout(() => {
      this.setupDragGesture();
      this.setupCloseAnimation();
    }, 100);
  }

  ngOnDestroy() {
    // Clean up gestures and animations
    if (this.dragGesture) {
      this.dragGesture.destroy();
    }
    if (this.closeAnimation) {
      this.closeAnimation.destroy();
    }
  }

  private loadFiltersFromInput(filters: AppliedFilters) {
    // Load property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      this.propertyTypes.forEach(type => {
        type.selected = filters.propertyTypes.some(f => f.id === type.id && f.selected);
      });
    }

    // Load BHK types
    if (filters.bhkTypes && filters.bhkTypes.length > 0) {
      this.bhkTypes.forEach(bhk => {
        bhk.selected = filters.bhkTypes.some(f => f.id === bhk.id && f.selected);
      });
    }

    // Load furnishing types
    if (filters.furnishing && filters.furnishing.length > 0) {
      this.furnishingTypes.forEach(furnish => {
        furnish.selected = filters.furnishing.some(f => f.id === furnish.id && f.selected);
      });
    }

    // Load amenities
    if (filters.amenities && filters.amenities.length > 0) {
      this.amenities.forEach(amenity => {
        amenity.selected = filters.amenities.some(f => f.id === amenity.id && f.selected);
      });
    }

    // Load price range
    if (filters.priceRange) {
      this.priceRange = { ...filters.priceRange };
    }

    // Load location
    if (filters.location) {
      this.location = filters.location;
    }

    // Load sort option
    if (filters.sortBy) {
      this.selectedSort = filters.sortBy;
    }
  }

  private setupDragGesture() {
    if (this.dragHandle?.nativeElement) {
      this.dragGesture = this.gestureController.create({
        el: this.dragHandle.nativeElement,
        threshold: 15,
        gestureName: 'bottom-sheet-drag',
        onStart: (ev) => {
          this.isDragging = true;
          this.startY = ev.currentY;
        },
        onMove: (ev) => {
          if (!this.isDragging) return;
          
          this.currentY = ev.currentY;
          const deltaY = this.currentY - this.startY;
          
          // Only allow dragging down
          if (deltaY > 0) {
            this.updateSheetPosition(deltaY);
          }
        },
        onEnd: (ev) => {
          if (!this.isDragging) return;
          
          const deltaY = this.currentY - this.startY;
          const velocity = ev.velocityY;
          
          // Close modal if dragged down significantly or with high velocity
          if (deltaY > 100 || velocity > 0.5) {
            this.animateClose();
          } else {
            // Snap back to original position
            this.resetSheetPosition();
          }
          
          this.isDragging = false;
        }
      });
      this.dragGesture.enable();
    }
  }

  private setupCloseAnimation() {
    if (this.bottomSheetContent?.nativeElement) {
      this.closeAnimation = this.animationController
        .create()
        .addElement(this.bottomSheetContent.nativeElement)
        .duration(300)
        .easing('ease-out')
        .fromTo('transform', 'translateY(0)', 'translateY(100%)');
    }
  }

  private updateSheetPosition(deltaY: number) {
    if (this.bottomSheetContent?.nativeElement) {
      this.bottomSheetContent.nativeElement.style.transform = `translateY(${deltaY}px)`;
      
      // Add opacity fade effect
      const opacity = Math.max(0.7, 1 - (deltaY / 300));
      this.bottomSheetContent.nativeElement.style.opacity = opacity.toString();
    }
  }

  private resetSheetPosition() {
    if (this.bottomSheetContent?.nativeElement) {
      this.bottomSheetContent.nativeElement.style.transform = 'translateY(0)';
      this.bottomSheetContent.nativeElement.style.opacity = '1';
    }
  }

  private async animateClose() {
    if (this.closeAnimation) {
      await this.closeAnimation.play();
    }
    this.closeModal();
  }

  toggleChip(option: FilterOption) {
    option.selected = !option.selected;
  }

  // Toggle multiple chips in a category
  toggleAllInCategory(category: 'property' | 'bhk' | 'furnishing' | 'amenities', select: boolean = true) {
    switch (category) {
      case 'property':
        this.propertyTypes.forEach(item => item.selected = select);
        break;
      case 'bhk':
        this.bhkTypes.forEach(item => item.selected = select);
        break;
      case 'furnishing':
        this.furnishingTypes.forEach(item => item.selected = select);
        break;
      case 'amenities':
        this.amenities.forEach(item => item.selected = select);
        break;
    }
  }

  getActiveFiltersCount(): number {
    let count = 0;
    
    // Count selected chips
    count += this.propertyTypes.filter(p => p.selected).length > 0 ? 1 : 0;
    count += this.bhkTypes.filter(b => b.selected).length > 0 ? 1 : 0;
    count += this.furnishingTypes.filter(f => f.selected).length > 0 ? 1 : 0;
    count += this.amenities.filter(a => a.selected).length > 0 ? 1 : 0;
    
    // Count price range if values exist
    if (this.priceRange.min.trim() || this.priceRange.max.trim()) {
      count += 1;
    }
    
    // Count location if value exists
    if (this.location.trim()) {
      count += 1;
    }
    
    return count;
  }

  getDetailedFilterCount(): { [key: string]: number } {
    return {
      propertyTypes: this.propertyTypes.filter(p => p.selected).length,
      bhkTypes: this.bhkTypes.filter(b => b.selected).length,
      furnishing: this.furnishingTypes.filter(f => f.selected).length,
      amenities: this.amenities.filter(a => a.selected).length,
      priceRange: (this.priceRange.min.trim() || this.priceRange.max.trim()) ? 1 : 0,
      location: this.location.trim() ? 1 : 0
    };
  }

  clearAllFilters() {
    this.propertyTypes.forEach(p => p.selected = false);
    this.bhkTypes.forEach(b => b.selected = false);
    this.furnishingTypes.forEach(f => f.selected = false);
    this.amenities.forEach(a => a.selected = false);
    this.priceRange = { min: '', max: '' };
    this.location = '';
    this.selectedSort = this.sortOptions[0];
  }

  clearSpecificFilter(filterType: string) {
    switch (filterType) {
      case 'propertyTypes':
        this.propertyTypes.forEach(p => p.selected = false);
        break;
      case 'bhkTypes':
        this.bhkTypes.forEach(b => b.selected = false);
        break;
      case 'furnishing':
        this.furnishingTypes.forEach(f => f.selected = false);
        break;
      case 'amenities':
        this.amenities.forEach(a => a.selected = false);
        break;
      case 'priceRange':
        this.priceRange = { min: '', max: '' };
        break;
      case 'location':
        this.location = '';
        break;
    }
  }

  async applyFilters() {
    const filters: AppliedFilters = {
      propertyTypes: this.propertyTypes.filter(p => p.selected),
      bhkTypes: this.bhkTypes.filter(b => b.selected),
      furnishing: this.furnishingTypes.filter(f => f.selected),
      amenities: this.amenities.filter(a => a.selected),
      priceRange: { ...this.priceRange },
      location: this.location.trim(),
      sortBy: this.selectedSort
    };

    // Store last applied filters
    this.lastAppliedFilters = { ...filters };
    this.totalFiltersApplied = this.getActiveFiltersCount();

    console.log('Applied filters:', filters);
    console.log('Total active filters:', this.totalFiltersApplied);
    
    // Close bottom sheet modal and pass filters back
    await this.modalController.dismiss(filters);
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  // Utility methods
  hasActiveFilters(): boolean {
    return this.getActiveFiltersCount() > 0;
  }

  getFilterSummary(): string {
    const activeCount = this.getActiveFiltersCount();
    if (activeCount === 0) return 'No filters applied';
    if (activeCount === 1) return '1 filter applied';
    return `${activeCount} filters applied`;
  }

  // Get selected items for display
  getSelectedPropertyTypes(): FilterOption[] {
    return this.propertyTypes.filter(p => p.selected);
  }

  getSelectedBhkTypes(): FilterOption[] {
    return this.bhkTypes.filter(b => b.selected);
  }

  getSelectedFurnishing(): FilterOption[] {
    return this.furnishingTypes.filter(f => f.selected);
  }

  getSelectedAmenities(): FilterOption[] {
    return this.amenities.filter(a => a.selected);
  }

  // Quick preset filters
  applyBudgetFriendlyPreset() {
    this.clearAllFilters();
    this.priceRange = { min: '₹50L', max: '₹1Cr' };
    this.bhkTypes.find(b => b.id === '1bhk')!.selected = true;
    this.bhkTypes.find(b => b.id === '2bhk')!.selected = true;
    this.selectedSort = 'Price: Low to High';
  }

  applyLuxuryPreset() {
    this.clearAllFilters();
    this.priceRange = { min: '₹2Cr', max: '' };
    this.propertyTypes.find(p => p.id === 'villa')!.selected = true;
    this.bhkTypes.find(b => b.id === '3bhk')!.selected = true;
    this.bhkTypes.find(b => b.id === '4bhk')!.selected = true;
    this.furnishingTypes.find(f => f.id === 'fully')!.selected = true;
    this.amenities.find(a => a.id === 'pool')!.selected = true;
    this.amenities.find(a => a.id === 'gym')!.selected = true;
    this.selectedSort = 'Price: High to Low';
  }

  applyFamilyFriendlyPreset() {
    this.clearAllFilters();
    this.bhkTypes.find(b => b.id === '2bhk')!.selected = true;
    this.bhkTypes.find(b => b.id === '3bhk')!.selected = true;
    this.amenities.find(a => a.id === 'playground')!.selected = true;
    this.amenities.find(a => a.id === 'security')!.selected = true;
    this.amenities.find(a => a.id === 'parking')!.selected = true;
    this.selectedSort = 'Most Popular';
  }

  // Price validation
  validatePriceRange(): boolean {
    if (!this.priceRange.min && !this.priceRange.max) return true;
    
    const minPrice = this.parsePriceString(this.priceRange.min);
    const maxPrice = this.parsePriceString(this.priceRange.max);
    
    if (minPrice && maxPrice) {
      return minPrice <= maxPrice;
    }
    
    return true;
  }

  private parsePriceString(priceStr: string): number | null {
    if (!priceStr) return null;
    
    const cleanPrice = priceStr.replace(/[₹,]/g, '').toLowerCase();
    
    if (cleanPrice.includes('cr')) {
      return parseFloat(cleanPrice.replace('cr', '').trim()) * 10000000;
    } else if (cleanPrice.includes('l')) {
      return parseFloat(cleanPrice.replace('l', '').trim()) * 100000;
    }
    
    return parseFloat(cleanPrice) || null;
  }

  // Format price for display
  formatPriceForDisplay(price: string): string {
    if (!price) return '';
    
    const numericValue = this.parsePriceString(price);
    if (!numericValue) return price;
    
    if (numericValue >= 10000000) {
      return `₹${(numericValue / 10000000).toFixed(1)}Cr`;
    } else if (numericValue >= 100000) {
      return `₹${(numericValue / 100000).toFixed(1)}L`;
    }
    
    return `₹${numericValue.toLocaleString()}`;
  }

  // Location suggestions (can be expanded with real API)
  getLocationSuggestions(): string[] {
    return [
      'Bandra West, Mumbai',
      'Andheri East, Mumbai', 
      'Powai, Mumbai',
      'Thane West, Mumbai',
      'Gurgaon, Delhi NCR',
      'Whitefield, Bangalore',
      'Hitech City, Hyderabad'
    ];
  }

  onLocationInput(event: any) {
    const value = event.detail.value;
    // You can implement location autocomplete here
    this.location = value;
  }
}