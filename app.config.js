import 'dotenv/config';

export default ({ config }) => {
  const environment = process.env.ENVIRONMENT || 'dev';
  const apiUrl =
    environment === 'prod'
      ? process.env.URL_BASE_PROD
      : process.env.URL_BASE_DEV_JOB || 'http://10.1.59.59/api';

  return {
    ...config,
    name: 'FeiraFacil',
    slug: 'appfeirafacil',
    extra: {
      API_URL: apiUrl,
      eas: {
        projectId: '6fe95fd5-b01b-4ce1-acea-8447f570ec64',
      },
    },
  };
};
