import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://bm2d19ra7b.execute-api.us-east-1.amazonaws.com/v1/',
  // Otras variables de configuración para producción
  debug: false,
  logLevel: 'error'
}; 