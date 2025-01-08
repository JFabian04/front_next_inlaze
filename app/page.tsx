"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from './utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { processValidationErrors } from './utils/validationError';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  // Cambiar entre Login y registro. Limpia errores de validacion
  const changeForm = (isRegistering: boolean) => {
    setIsRegistering(isRegistering);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  //metodo para Login, redirige a dashboard
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post<{ token: string }>('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);

      router.push('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: 'Error al iniciar sesión. Inténtalo nuevamente.' });
      }
    }
  };

  //Metodo para registrar usuario. Muestra toast
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden.' });
      return;
    }

    try {
      const response = await axiosInstance.post('/users', {
        email,
        password,
      });

      toast.success(response.data.message || '¡Registro exitoso!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});

      setIsRegistering(false);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const validationErrors = processValidationErrors(err.response.data.errors);
        setErrors(validationErrors);
      } else {
        setErrors({ general: 'Error al registrarse. Inténtalo nuevamente.' });
        toast.error(errors.general || 'Error al registrarse. Inténtalo nuevamente.');
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-300">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="shadow-lg bg-gray-100/50 rounded p-2 flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-full h-16"
            src="/images/inlaze_cover.jpg"
            alt="logo"
          />
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {isRegistering ? 'Crear una cuenta' : 'Iniciar Sesión'}
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={isRegistering ? handleRegister : handleLogin}
            >
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="example@email.com"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} { }
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>} { }
              </div>

              {isRegistering && (
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>} { }
                </div>
              )}

              <div className="h-3">
                {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-yellow-600 hover:bg-yellow-600/80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {isRegistering ? (
                  <>
                    ¿Ya tienes una cuenta?{' '}
                    <button
                      onClick={() => changeForm(false)}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Iniciar sesión
                    </button>
                  </>
                ) : (
                  <>
                    ¿No tienes una cuenta?{' '}
                    <button
                      onClick={() => changeForm(true)}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Regístrate
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>


      </div>

      <ToastContainer />
    </section>
  );

};

export default LoginPage;
