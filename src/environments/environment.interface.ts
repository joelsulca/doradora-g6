export interface Environment {
  production: boolean;
  apiUrl: string;
  debug: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  // Agregar más variables según sea necesario
  // version: string;
  // appName: string;
  // timeout: number;
} 