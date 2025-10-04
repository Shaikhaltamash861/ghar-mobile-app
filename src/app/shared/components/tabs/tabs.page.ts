import { Component } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { library, playCircle, radio, search, homeOutline, mailOutline, folderOpenOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonIcon, IonTabBar, IonTabButton, IonTabs],
})
export class TabsPage {

  constructor() {
    addIcons({homeOutline,mailOutline,folderOpenOutline,personCircleOutline,radio,library,search,playCircle});
   }

  ngOnInit() {
  }

}
