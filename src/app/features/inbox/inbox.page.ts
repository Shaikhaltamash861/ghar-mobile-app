// contact-requests.page.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge,
  IonNote,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonFabButton,
  IonCheckbox,
  IonActionSheet,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  searchOutline,
  personCircleOutline,
  checkmarkOutline,
  checkmarkDoneOutline,
  callOutline,
  chatbubbleOutline,
  timeOutline,
  homeOutline,
  ellipsisVerticalOutline,
  checkboxOutline,
  trashOutline,
  archiveOutline,
  refreshOutline
} from 'ionicons/icons';

import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/app.constant';
import { Router } from '@angular/router';
import { CacheService } from 'ionic-cache';
import { Chat } from 'src/app/shared/services/chat';
import { User } from 'src/app/core/services/user/user';

interface ContactRequest {
  id: string;
  senderName: string;
  senderPhone: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  timestamp: Date;
  status: 'unread' | 'read' | 'replied';
  isStarred: boolean;
  messagePreview: string;
  participants?: [
    {
      _id: string
    }
  ]
}
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonNote,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonFab,
    IonFabButton,
    IonCheckbox,
    IonActionSheet,
    IonButtons,
    IonBackButton
  ],
  providers: [HttpClient]
})
export class InboxPage implements OnInit {

  searchTerm = '';
  isSelectionMode = false;
  selectedRequests: Set<string> = new Set();
  isActionSheetOpen = false;

  actionSheetButtons = [
    {
      text: 'Mark as Read',
      icon: 'checkmark-outline',
      handler: () => this.markAsRead()
    },
    {
      text: 'Mark as Unread',
      icon: 'ellipse-outline',
      handler: () => this.markAsUnread()
    },
    {
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: () => this.deleteSelected()
    },
    {
      text: 'Cancel',
      icon: 'close-outline',
      role: 'cancel'
    }
  ]

  // Sample contact requests data
  contactRequests: ContactRequest[] = [
    {
      id: '1',
      senderName: 'Raj Sharma',
      senderPhone: '+91 9876543210',
      message: 'Hi, I am interested in this 2BHK apartment. Could we schedule a visit this weekend? I would like to know more about the amenities and parking facilities.',
      propertyId: 'prop1',
      propertyTitle: '2BHK Apartment in Bandra',
      propertyImage: 'https://via.placeholder.com/60x60/4CAF50/white?text=2BHK',
      timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
      status: 'unread',
      isStarred: false,
      messagePreview: 'Hi, I am interested in this 2BHK apartment. Could we schedule a visit...'
    },
    {
      id: '2',
      senderName: 'Priya Patel',
      senderPhone: '+91 9765432109',
      message: 'Hello! I saw your property listing and I am very interested. Is it still available? What is the monthly rent including maintenance charges?',
      propertyId: 'prop2',
      propertyTitle: '3BHK Villa in Juhu',
      propertyImage: 'https://via.placeholder.com/60x60/2196F3/white?text=3BHK',
      timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      status: 'read',
      isStarred: true,
      messagePreview: 'Hello! I saw your property listing and I am very interested...'
    },
    {
      id: '3',
      senderName: 'Amit Kumar',
      senderPhone: '+91 9654321098',
      message: 'Good morning, I would like to know if pets are allowed in this apartment. I have a small dog.',
      propertyId: 'prop3',
      propertyTitle: '1BHK Studio in Andheri',
      propertyImage: 'https://via.placeholder.com/60x60/FF9800/white?text=1BHK',
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      status: 'replied',
      isStarred: false,
      messagePreview: 'Good morning, I would like to know if pets are allowed...'
    },
    {
      id: '4',
      senderName: 'Sneha Reddy',
      senderPhone: '+91 9543210987',
      message: 'Hi, I am relocating to Mumbai for work. This property looks perfect for me. Can we discuss the terms and conditions?',
      propertyId: 'prop4',
      propertyTitle: '2BHK Flat in Powai',
      propertyImage: 'https://via.placeholder.com/60x60/9C27B0/white?text=2BHK',
      timestamp: new Date(Date.now() - 4 * 60 * 60000), // 4 hours ago
      status: 'read',
      isStarred: false,
      messagePreview: 'Hi, I am relocating to Mumbai for work. This property looks perfect...'
    },
    {
      id: '5',
      senderName: 'Vikash Singh',
      senderPhone: '+91 9432109876',
      message: 'Interested in this property. What is the security deposit amount and when can I visit?',
      propertyId: 'prop5',
      propertyTitle: '4BHK Penthouse in Worli',
      propertyImage: 'https://via.placeholder.com/60x60/F44336/white?text=4BHK',
      timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      status: 'unread',
      isStarred: false,
      messagePreview: 'Interested in this property. What is the security deposit amount...'
    }
  ];

  filteredRequests: ContactRequest[] = [];
  consversations: any[] = [];
  private http = inject(HttpClient);
  private router = inject(Router);
  private cache = inject(CacheService);
  private chatService = inject(Chat);
  private userService = inject(User);
  private userId: any;

  constructor() {
    addIcons({
      arrowBack,
      searchOutline,
      personCircleOutline,
      checkmarkOutline,
      checkmarkDoneOutline,
      callOutline,
      chatbubbleOutline,
      timeOutline,
      homeOutline,
      ellipsisVerticalOutline,
      checkboxOutline,
      trashOutline,
      archiveOutline,
      refreshOutline
    });
  }

  ngOnInit() {
    this.filteredRequests = [...this.contactRequests];
    this.loadconversations();
    this.userService.getUser().then((user) => {
      this.userId = user.id;
      this.chatService.connect(user.id); // Replace with actual user ID
    });
  }

  loadconversations() {
    const url = API_BASE_URL + '/conversations';
    const cacheKey = url;
    const request = this.http.get(url);
    this.cache.loadFromDelayedObservable(cacheKey, request, 'list', 1).subscribe((data: any) => {
      if (data && data.conversations) {
        this.consversations = data.conversations;
      }

    });

  }

  goBack() {
    console.log('Going back');
    // Implement navigation back
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.filterRequests();
  }

  filterRequests() {
    if (!this.searchTerm.trim()) {
      this.filteredRequests = [...this.contactRequests];
    } else {
      this.filteredRequests = this.contactRequests.filter(request =>
        request.senderName.toLowerCase().includes(this.searchTerm) ||
        request.propertyTitle.toLowerCase().includes(this.searchTerm) ||
        request.messagePreview.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    return timestamp.toLocaleDateString();
  }

  onRequestClick(conversation: ContactRequest) {
    const user = conversation.participants.find((id) => id !== this.userId);
    this.chatService.setRecevier(user._id)
    this.router.navigate(['/chat', conversation?.['_id']]);
  }

  onRequestLongPress(request: ContactRequest) {
    this.isSelectionMode = true;
    this.toggleSelection(request.id);
  }

  toggleSelection(requestId: string) {
    if (this.selectedRequests.has(requestId)) {
      this.selectedRequests.delete(requestId);
    } else {
      this.selectedRequests.add(requestId);
    }

    if (this.selectedRequests.size === 0) {
      this.isSelectionMode = false;
    }
  }

  selectAll() {
    if (this.selectedRequests.size === this.filteredRequests.length) {
      this.selectedRequests.clear();
      this.isSelectionMode = false;
    } else {
      this.filteredRequests.forEach(request => {
        this.selectedRequests.add(request.id);
      });
    }
  }

  openRequestDetails(request: ContactRequest) {
    // Mark as read
    request.status = 'read';
    console.log('Opening request details:', request);
    // Navigate to chat/detail view
  }

  callSender(request: ContactRequest, event: Event) {
    event.stopPropagation();
    console.log('Calling:', request.senderPhone);
    // Implement call functionality
  }

  openActionSheet() {
    this.isActionSheetOpen = true;
  }

  closeActionSheet() {
    this.isActionSheetOpen = false;
  }

  markAsRead() {
    this.selectedRequests.forEach(id => {
      const request = this.contactRequests.find(r => r.id === id);
      if (request) request.status = 'read';
    });
    this.exitSelectionMode();
    this.closeActionSheet();
  }

  markAsUnread() {
    this.selectedRequests.forEach(id => {
      const request = this.contactRequests.find(r => r.id === id);
      if (request) request.status = 'unread';
    });
    this.exitSelectionMode();
    this.closeActionSheet();
  }

  deleteSelected() {
    this.selectedRequests.forEach(id => {
      const index = this.contactRequests.findIndex(r => r.id === id);
      if (index > -1) {
        this.contactRequests.splice(index, 1);
      }
    });
    this.filterRequests();
    this.exitSelectionMode();
    this.closeActionSheet();
  }

  exitSelectionMode() {
    this.isSelectionMode = false;
    this.selectedRequests.clear();
  }

  doRefresh(event: any) {
    // Simulate data refresh
    setTimeout(() => {
      console.log('Refreshing contact requests');
      event.target.complete();
    }, 1000);
  }

  loadMore(event: any) {
    // Simulate loading more data
    setTimeout(() => {
      console.log('Loading more contact requests');
      event.target.complete();
    }, 1000);
  }

  trackByFn(index: number, request: ContactRequest): string {
    return request.id;
  }

  getUnreadCount(): number {
    return this.contactRequests.filter(r => r.status === 'unread').length;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'unread': return '';
      case 'read': return 'checkmark-outline';
      case 'replied': return 'checkmark-done-outline';
      default: return '';
    }
  }

}
