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
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  // Cambiar entre Login y registro. Limpia errores de validacion
  const changeForm = (isRegistering: boolean) => {
    setIsRegistering(isRegistering);
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setErrors({});
  };

  //metodo para Login, redirige a dashboard
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    try {
      const response = await axiosInstance.post<{ data: any }>('/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('userId', response.data.data.payload.user_id);

      router.push('/dashboard');
    } catch (err: any) {
      setLoading(false)
      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
        setLoading(false)
      } else {
        setErrors({ general: 'Error al iniciar sesión. Inténtalo nuevamente.' });
        setLoading(false)
      }
    }
  };

  //Metodo para registrar usuario. Muestra toast
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden.' });
      setLoading(false)
      return;
    }

    try {
      const response = await axiosInstance.post('/users', {
        email,
        name,
        password,
      });

      toast.success(response.data.message || '¡Registro exitoso!');
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
      setErrors({});

      setIsRegistering(false);
      setLoading(false)

    } catch (err: any) {
      if (err.response?.data?.errors) {
        const validationErrors = processValidationErrors(err.response.data.errors);
        setErrors(validationErrors);
        setLoading(false)

      } else {
        setErrors({ general: 'Error al registrarse. Inténtalo nuevamente.' });
        toast.error(errors.general || 'Error al registrarse. Inténtalo nuevamente.');
        setLoading(false)
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-blue-500"
                  placeholder="example@email.com"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} { }
              </div>
              {isRegistering && (
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Jhon Doe"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>} { }
                </div>
              )}

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
                className="w-full flex items-center justify-center text-white bg-yellow-600 hover:bg-yellow-600/80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                ) : (
                  <span>{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</span>
                )}
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
