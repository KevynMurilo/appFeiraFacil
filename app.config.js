import 'dotenv/config';

export default ({ config }) => {
  const environment = process.env.ENVIRONMENT || 'dev';
  const apiUrl =
    environment === 'prod'
      ? process.env.URL_BASE_PROD
      : process.env.URL_BASE_DEV_HOME || 'http://177.85.251.66/api';

  return {
    name: 'FeiraFacil',
    slug: 'appfeirafacil',
    owner: 'nyv3kexpo', // ← AQUI É O QUE FALTAVA
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/1x1.png',
      resizeMode: 'cover',
      backgroundColor: '#004AAD'
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: 'com.prefeitura.goias',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      edgeToEdgeEnabled: true
    },
    extra: {
      API_URL: apiUrl,
      eas: {
        projectId: '5070b66c-a01e-44ad-a016-8650f80270bd'
      }
    }
  };
};
