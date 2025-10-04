import { inject, Injectable } from '@angular/core';
import { ActionSheetController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class Images {
  private selectedImages: { url: string; preview: string }[] = [];
  private actionSheetController = inject(ActionSheetController);
  private alertController = inject(AlertController)

  async presentImageActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePicture(CameraSource.Camera);
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.takePicture(CameraSource.Photos);
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

  async takePicture(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source
      });

      if (image.dataUrl) {
        this.selectedImages.push({
          url: image.dataUrl,
          preview: image.dataUrl
        });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }
  
}
