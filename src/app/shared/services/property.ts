// property.service.ts (Service interface for reference)
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { Property } from 'src/app/features/home/home.page';

export interface PropertySearchParams {
  location?: string;
  bhk?: string[];
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'environment.apiUrl';
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  async getProperties(searchParams?: PropertySearchParams): Promise<Property[]> {
    try {
      let params = new HttpParams();
      
      if (searchParams) {
        Object.keys(searchParams).forEach(key => {
          const value = searchParams[key as keyof PropertySearchParams];
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params = params.append(key, v.toString()));
            } else {
              params = params.set(key, value.toString());
            }
          }
        });
      }

      const response = await this.http.get<{properties: Property[]}>(`${this.apiUrl}/properties`, { params }).toPromise();
      return response?.properties || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async getPropertyById(id: string): Promise<Property> {
    try {
      const response = await this.http.get<{property: Property}>(`${this.apiUrl}/properties/${id}`).toPromise();
      return response?.property as Property;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const response = await this.http.get<any>(`${this.apiUrl}/properties/stats`).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {};
    }
  }

  async toggleFavorite(propertyId: string): Promise<void> {
    try {
      await this.http.post(`${this.apiUrl}/properties/${propertyId}/favorite`, {}).toPromise();
      
      // Update local favorites
      const currentFavorites = this.favoritesSubject.value;
      const index = currentFavorites.indexOf(propertyId);
      
      if (index > -1) {
        currentFavorites.splice(index, 1);
      } else {
        currentFavorites.push(propertyId);
      }
      
      this.favoritesSubject.next([...currentFavorites]);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  async sendContactRequest(propertyId: string, message?: string): Promise<void> {
    try {
      const body = { propertyId, message: message || 'I am interested in this property.' };
      await this.http.post(`${this.apiUrl}/requests`, body).toPromise();
    } catch (error) {
      console.error('Error sending contact request:', error);
      throw error;
    }
  }

  async getFavorites(): Promise<Property[]> {
    try {
      const response = await this.http.get<{properties: Property[]}>(`${this.apiUrl}/properties/favorites`).toPromise();
      return response?.properties || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  // Mock data for development
  getMockProperties(): Property[] {
    return [
      {
        id: '1',
        title: '2BHK Furnished Apartment',
        description: 'Beautiful 2BHK furnished apartment in the heart of Bandra West.',
        location: 'Bandra West, Mumbai',
        rent: 45000,
        type: 'Apartment',
        bhk: '2BHK',
        area: 850,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
        amenities: ['Parking', 'Swimming Pool', 'Gymnasium', 'Power Backup'],
        rating: 4.5,
        reviewCount: 24,
        isVerified: true,
        isFavorite: false,
        availableFrom: new Date(),
        owner: {
          id: '1',
          name: 'Rajesh Kumar',
          rating: 4.8
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        id: '2',
        title: '1BHK Studio Near Metro',
        description: 'Compact 1BHK studio apartment near metro station.',
        location: 'Powai, Mumbai',
        rent: 28000,
        type: 'Studio',
        bhk: '1BHK',
        area: 500,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'],
        amenities: ['Metro Access', 'Furnished', 'Wi-Fi'],
        rating: 4.2,
        reviewCount: 18,
        isVerified: true,
        isFavorite: true,
        availableFrom: new Date(),
        owner: {
          id: '2',
          name: 'Priya Sharma',
          rating: 4.6
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];
  }
}
