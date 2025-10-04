import { Routes } from '@angular/router';
import { TabsPage } from './shared/components/tabs/tabs.page';
import { authGuard } from './core/guards/auth/auth-guard';
import { loginGuard } from './core/guards/login-guard';

export const routes: Routes = [

  {
    path: '',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'inbox',
        loadComponent: () => import('./features/inbox/inbox.page').then(m => m.InboxPage)
      },
      {
        path: 'activity',
        loadComponent: () => import('./features/activity/activity.page').then(m => m.ActivityPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.page').then(m => m.ProfilePage)
      }
    ]
  },
  {
    path: 'auth',
    canActivate: [loginGuard],
    loadComponent: () => import('./shared/components/home-login/home-login.page').then( m => m.HomeLoginPage)
  },

  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'property-view/:id',
    loadComponent: () => import('./features/property-view/property-view.page').then( m => m.PropertyViewPage)
  },
  {
    path: 'add-property',
    loadComponent: () => import('./features/add-property/add-property.page').then( m => m.AddPropertyPage)
  },
  {
    path: 'filter-property',
    loadComponent: () => import('./shared/components/filter-property/filter-property.page').then( m => m.FilterPropertyPage)
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./features/chat/chat.page').then( m => m.ChatPage)
  },
  // {
  //   path: 'signup',
  //   loadComponent: () => import('./features/signup/signup.page').then( m => m.SignupPage)
  // },
  // {
  //   path: 'home',
  //   loadComponent: () => import('./features/home/home.page').then( m => m.HomePage)
  // },
  // {
  //   path: 'tabs',
  //   loadComponent: () => import('./shared/components/tabs/tabs.page').then( m => m.TabsPage)
  // },
];
