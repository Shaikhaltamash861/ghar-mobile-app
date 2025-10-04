import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from 'src/app/app.constant';


@Injectable({
  providedIn: 'root'
})
export class PropertyView {
  http = inject(HttpClient);

  getPropertyById(id: string): any {
    
    alert('Fetching property details...');
    // Logic to fetch property by ID
    return this.http.get(API_BASE_URL +`/property/${id}`);
  }
  
}
