'use client';

import { Dialog } from '@headlessui/react';
import { FC, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { processValidationErrors } from '@/app/utils/validationError';
import { createTask, getTaskById, updateTask } from '@/app/services/taskService';
import { validateRangeDate } from '@/app/utils/formatDate';
import { authValidate, getUsers } from '@/app/services/userService';
import { useRouter, useSearchParams } from 'next/navigation';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: 'create' | 'edit';
    initialData?: any;
    onSuccess?: () => void;
}


const ModalForm: FC<ModalProps> = ({ isOpen, onClose, action, initialData, onSuccess }) => {
    const [formData, setFormData] = useState<any>({
        title: '',
        description: '',
        date_limit: '',
        users: [],
        status: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [projectId, setProjectId] = useState<any>();
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [validDateRange, setvalidDateRange] = useState<any>({});
    const searchParams = useSearchParams();
    const [authData, setAuthData] = useState<any>();

    const router = useRouter();

    useEffect(() => {
        const projectId = searchParams.get('id');
        setProjectId(projectId);

        const validateAuth = async () => {
            const auth = await authValidate();
            if (auth.satus == 'error') {
                router.push('/')
            }
            console.log('AUTH DATA: ', auth);

            setAuthData(auth.data)
        }
        validateAuth()
    }, []);

    // Llenar formulario si es edición
    useEffect(() => {
        const fetchAndSetData = async () => {
            setErrors({});
            if (action === 'edit' && initialData) {
                try {
                    const { data } = await getTaskById(initialData.id);

                    // Formatea la fecha
                    const formattedDate = initialData.date_limit
                        ? new Date(initialData.date_limit).toISOString().split('T')[0]
                        : '';
                    setFormData({ ...data, date_limit: formattedDate });

                    // Valida el rango de fechas
                    const resp = validateRangeDate(formattedDate);
                    setvalidDateRange(resp);

                } catch (error) {
                    console.error('Error fetching task data: ', error);
                }
            } else {
                setFormData({ title: '', description: '', date_limit: '', users: [] });
            }
        };
        fetchAndSetData();
    }, [action, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Consultar usuarios en el buscador
    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchTerm.trim()) return setUsers([]);
            setLoading(true);
            try {
                const usersData = await getUsers({ search: searchTerm });
                setUsers(usersData.data);
            } catch (error) {
                toast.error('Error al obtener los usuarios');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchUsers, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Agregar usuarios asigandos
    const handleUserSelect = (userId: number) => {
        const selectedUser = users.find((user: any) => user.id === userId);
        if (selectedUser && !formData.users.some((user: any) => user.id === userId)) {
            const newUsers = [...formData.users, { id: selectedUser.id, name: selectedUser.name }];
            setFormData({ ...formData, users: newUsers });
        }
    };

    // Eliminar usuario seleccionado
    const handleRemoveUser = (userId: number) => {
        const newUsers = formData.users.filter((user: any) => user.id !== userId);
        setFormData({ ...formData, users: newUsers });
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...formData,

                project: projectId,
                users: formData.users.map((user: any) => user.id),
            };

            let response;
            if (action === 'create') {
                response = await createTask(formattedData);
            } else if (formData.id) {
                const { title, description, date_limit, status, users, project } = formattedData;
                response = await updateTask(formData.id, { title, description, date_limit, status, users, project });
            } else {
                toast.error('Error en la operación. Inténtelo de nuevo.');
                return;
            }

            if (response) {
                onClose();
                toast.success(response.message);
                if (onSuccess) onSuccess();
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const validationErrors = processValidationErrors(error.response.data.errors);
                setErrors(validationErrors);
            } else {
                toast.error('Hubo un error al procesar la solicitud');
            }
        }
    };


    return (
        <Dialog open={isOpen} onClose={onClose}>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black/25" />
                <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">

                    {authData && authData.rol === 'admin' && (
                        <Dialog.Title className="text-lg font-semibold">
                            {action === 'create' ? 'Registrar' : 'Editar Registro'}
                        </Dialog.Title>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4">
                        {authData && authData.rol === 'admin' && (

                            <div>
                                {/* Título */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Título</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                                </div>

                                {/* Descripción */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        maxLength={200}
                                        rows={4}
                                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                    />
                                    <div className="text-right text-sm text-gray-500">{formData.description.length}/200 caracteres</div>
                                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                                </div>

                                {/* Fecha límite */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Fecha Límite <span className={validDateRange ? validDateRange.color : ''}>{validDateRange ? '(' + validDateRange.message + ')' : ''}</span></label>
                                    <input
                                        type="date"
                                        name="date_limit"
                                        value={formData.date_limit}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                    />
                                    {errors.date_limit && <p className="text-red-500 text-sm">{errors.date_limit}</p>}
                                </div>

                                {/* Select de estado (solo en edición) */}
                                {action === 'edit' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                        >
                                            <option value="por hacer">Por hacer</option>
                                            <option value="en progreso">En progreso</option>
                                            <option value="completada">Completada</option>
                                        </select>
                                    </div>
                                )}

                                {/* Buscador de usuarios */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Buscar Usuarios</label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                        placeholder="Escribe para buscar usuarios..."
                                    />
                                    <ul className="mt-1 z-10 absolute w-[calc(100%-50px)] bg-white max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                                        {loading ? (
                                            <li className="p-2 text-gray-500">Cargando...</li>
                                        ) : (
                                            users.map((user) => (
                                                <li
                                                    key={user.id}
                                                    onClick={() => handleUserSelect(user.id)}
                                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                                >
                                                    {user.name}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                                {errors.users && <p className="text-red-500 text-sm">{errors.users}</p>}
                            </div>
                        )}
                        {/* Usuarios seleccionados */}
                        <div className="mb-4 shadow-lg border bg-slate-300 px-3 py-1">
                            <label className="block text-sm mb-2 font-medium text-gray-700">Usuarios Seleccionados</label>
                            <ul>
                                {formData.users.map((user: any) => (
                                    <li key={user.id} className="bg-gray-50 mb-1 px-2 py-1 rounded-lg flex justify-between items-center">
                                        <span>{user.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveUser(user.id)}
                                            className="text-red-500 ml-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>

                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                            >
                                {authData && authData.rol == 'admin' ? 'Cancelar' : 'Cerrar' }
                            </button>
                            {authData && authData.rol === 'admin' && (
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    {action === 'create' ? 'Registrar' : 'Actualizar'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

        </Dialog>
    );
};

export default ModalForm;
