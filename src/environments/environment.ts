import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: '/api/', // Usar proxy en desarrollo
  // Otras variables de configuración para desarrollo
  debug: true,
  logLevel: 'debug'
}; 