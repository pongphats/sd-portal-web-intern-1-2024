import { EnvironmentOptions } from './interfaces/environment-options.interface';

export const environment: EnvironmentOptions = {
  production: false,
  trainingService : "http://localhost:8080",
  welfareService : "http://localhost:8081"
  // trainingService: 'https://hrweb.pccth.com:8443',
  // welfareService: 'https://hrweb.pccth.com:8444',
};
