import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ghar.app',
  appName: 'ghar',
  webDir: 'www',

  plugins: {
    StatusBar: {
      backgroundColor: "#FFFFFF",
      style: "LIGHT"
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FFFFFFFF"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Keyboard: {
      resize: 'body', // or 'ionic' — prevents overlap
      style: 'dark',
    },
  }
};

export default config;
