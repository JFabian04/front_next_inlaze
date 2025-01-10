const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-lg font-bold">Mi Proyecto</h1>
                    <p className="text-sm text-gray-400">© 2025 Todos los derechos reservados.</p>
                </div>

                <nav className="flex space-x-4">
                    <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        Inicio
                    </a>
                    <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        Proyectos
                    </a>
                    <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        Acerca
                    </a>
                    <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        Contacto
                    </a>
                </nav>

                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.23 4.23 0 0 0 1.86-2.34c-.83.49-1.75.85-2.72 1.05a4.18 4.18 0 0 0-7.13 3.82A11.84 11.84 0 0 1 3.18 4.47a4.18 4.18 0 0 0 1.3 5.57 4.1 4.1 0 0 1-1.89-.52v.05a4.18 4.18 0 0 0 3.35 4.1 4.22 4.22 0 0 1-1.88.07 4.19 4.19 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2 19.29a11.83 11.83 0 0 0 6.29 1.84c7.55 0 11.68-6.25 11.68-11.68 0-.18-.01-.35-.02-.53A8.34 8.34 0 0 0 22.46 6z" />
                        </svg>
                    </a>
                    <a
                        href="https://github.com/JFabian04"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34a2.66 2.66 0 0 0-1.11-1.47c-.91-.62.07-.61.07-.61a2.12 2.12 0 0 1 1.54 1.04 2.14 2.14 0 0 0 2.92.83 2.14 2.14 0 0 1 .64-1.34c-2.22-.25-4.56-1.11-4.56-4.94a3.87 3.87 0 0 1 1-2.68 3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1a9.55 9.55 0 0 1 5 0c1.91-1.27 2.75-1 2.75-1a3.6 3.6 0 0 1 .1 2.64 3.87 3.87 0 0 1 1 2.68c0 3.83-2.34 4.69-4.57 4.94a2.4 2.4 0 0 1 .68 1.87c0 1.35-.01 2.44-.01 2.77 0 .27.18.59.69.49A10 10 0 0 0 12 2z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
