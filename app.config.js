import 'dotenv/config';

export default {
  expo: {
    name: 'AppFeiraFacil',
    slug: 'appfeirafacil',
    version: '1.0.0',
    extra: {
      API_URL:
        process.env.ENVIRONMENT === 'prod'
          ? process.env.URL_BASE_PROD
          : process.env.URL_BASE_DEV_HOME,
    },
  },
};
