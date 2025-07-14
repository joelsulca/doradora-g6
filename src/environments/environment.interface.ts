export interface Environment {
  production: boolean;
  apiUrl: string;
  debug: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
} 