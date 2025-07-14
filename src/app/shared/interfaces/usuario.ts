export interface Usuario {
    id: number;
    username: string;
    password: string;
    email: string;
    nombres: string;
    apellidos: string;
    direccion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    referencia: string;
    role: 'admin' | 'cliente' | 'proveedor'; // Restringe el tipo de usuario a valores específicos
  }
  