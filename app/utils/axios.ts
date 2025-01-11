import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Asegúrate de enviar las cookies con cada solicitud
});

// Interceptor para solicitudes
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No es necesario hacer nada con las cabeceras de autorización aquí,
    // ya que las cookies se enviarán automáticamente con withCredentials: true.
    console.log('Enviando solicitud con cookies...');
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para respuestas
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.error('Token inválido o expirado. Redirigiendo al login...');
        redirect('/');
      } else if (status === 404) {
        console.error('Recurso no encontrado.');
      } else if (status >= 500) {
        console.error('Error del servidor: ', error.response);
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor.');
    } else {
      console.error('Error desconocido:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
