import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carnetauto.app',
  appName: 'Carnet Auto',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
