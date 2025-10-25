// chat.page.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { send, ellipsisVertical } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/app.constant';
import { User } from 'src/app/core/services/user/user';
import { Chat } from 'src/app/shared/services/chat';
import { IonInput } from '@ionic/angular/standalone';
import { IonContent } from '@ionic/angular/standalone';
import { CacheService } from 'ionic-cache';

addIcons({
  'send': send,
  'ellipsis-vertical': ellipsisVertical
});
export interface IUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId?: IUser;   // populated user object
  text: string;
  read: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v?: number;
}


interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isSent: boolean; // true for sent messages, false for received
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface Contact {
  name: string;
  avatar: string;
  lastSeen: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonInput],
  providers: [HttpClient]
})
export class ChatPage implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  private http = inject(HttpClient);

  messages: IMessage[] = [];

  contact: Contact = {
    name: 'John Doe',
    avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    lastSeen: 'last seen today at 2:30 PM',
    isOnline: true
  };

  newMessage: string = '';
  isTyping: boolean = false;
  conversationId: string = '';
  private userService = inject(User);
  private chat = inject(Chat);
  userId = '';
  recevierId = '';

  private cache = inject(CacheService);

  @ViewChild('messageInput', { static: false }) messageInput!: IonInput;
  @ViewChild('content', { static: false }) content!: IonContent;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.conversationId = this.route.snapshot.paramMap.get('id');

  }

  onMessage(event) {
    const message = {
      _id: '87t87g8xwv8',
      conversationId: this.conversationId,
      senderId: {
        _id: event.senderId
      },
      text: event.text,
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.messages.push(message)
  }

  ngOnInit() {
    // Simulate receiving a new message after 3 seconds
    this.getUserId();
    this.loadMessages()
    this.recevierId = this.chat.getReceiver();
    this.chat.onMessage((event) => this.onMessage(event))
  }

  async getUserId() {
    const user = await this.userService.getUser();
    this.userId = user?.id || '';
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages() {
    // Load messages from API or service based on conversationId
    const url = API_BASE_URL + '/message/' + this.conversationId;
    const cacheKey = url;
    const request = this.http.get(url);

    this.cache.loadFromDelayedObservable(cacheKey, request, 'message', 30).subscribe((data: any) => {
      if (data) {
        this.messages = data
        this.scrollToBottom();
      }
    });
  }

  addMeessage(message: IMessage) {
    this.messages.push(message)
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message = {
        _id: '676',
        conversationId: this.conversationId,
        senderId: {
          _id: this.userId
        },
        text: this.newMessage,
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // this.messages.push(message);
      const messagePayload = {
        conversationId: this.conversationId,
        senderId: this.userId,
        text: this.newMessage,
      }

      const socketPayload = {
        receiverId: this.recevierId,
        senderId: this.userId,
        text: this.newMessage
      }
      this.chat.sendMessage(socketPayload);
      this.addMeessage(message)
      this.http.post(API_BASE_URL + '/message', messagePayload).subscribe((response) => {
        setTimeout(() => {
          this.newMessage = '';
          this.messageInput.setFocus();
          this.scrollToBottom();
        }, 0);
      }, (error) => {
        console.error('Error sending message', error);
        // Optionally, update message status to 'failed' or similar
      });
    }
  }

  formatTime(timestamp: string): string {
    const now = new Date();
    const timestampDate = new Date(timestamp);
    const diff = now.getTime() - timestampDate.getTime();

    if (diff < 60000) { // Less than 1 minute
      return 'now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m`;
    } else if (diff < 86400000) { // Less than 24 hours
      return timestampDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return timestampDate.toLocaleDateString();
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'sending': return 'time-outline';
      case 'sent': return 'checkmark-outline';
      case 'delivered': return 'checkmark-done-outline';
      case 'read': return 'checkmark-done-outline';
      default: return '';
    }
  }

  goBack() {
    // this.router.back();
  }

  openContactInfo() {
    // Implement contact info functionality
    console.log('Open contact info');
  }

  private scrollToBottom() {
    this.content.scrollToBottom(300);
  }
}