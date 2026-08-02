import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marium.aiworkspace',
  appName: 'CloudWorker AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
