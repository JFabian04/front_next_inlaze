'use client';

import { Dialog } from '@headlessui/react';
import { FC, useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { processValidationErrors } from '@/app/utils/validationError';
import { createTask, updateTask } from '@/app/services/taskService';
import { Task } from '@/app/types/task';
import { validateRangeDate } from '@/app/utils/formatDate';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: 'create' | 'edit';
    initialData?: Task;
    onSuccess?: () => void;
}

const ModalForm: FC<ModalProps> = ({ isOpen, onClose, action, initialData, onSuccess }) => {
    const [formData, setFormData] = useState<any>({
        title: '',
        description: '',
        date_limit: '',
    });

    const [errors, setErrors] = useState<any>({});

    // Llenar el formulario si es editar
    useEffect(() => {
        setErrors({});

        if (action === 'edit' && initialData) {
            // Convertimos la fecha a formato ISO para el input de tipo date
            const formattedDate = initialData.date_limit
                ? new Date(initialData.date_limit).toISOString().split('T')[0]
                : '';
            setFormData({ ...initialData, date_limit: formattedDate });
        } else {
            setFormData({ title: '', description: '', date_limit: '' });
        }
    }, [action, initialData]);

    // Evento de cierre (limpia los campos)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let response;

            if (action === 'create') {
                const userId = localStorage.getItem('userId')
                const data = {
                    ...formData,
                    user: userId,
                    project: 1
                };
                response = await createTask(data);
            } else if (formData.id) {
                const { title, description, date_limit } = formData;
                response = await updateTask(formData.id, { title, description, date_limit });
            } else {
                toast.error('Error en la operación. Inténtelo de nuevo.');
            }

            if (response) {
                onClose();
                toast.success(response.message);

                if (onSuccess) {
                    onSuccess();
                }
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Validar estado de la fecha límite
    const dateLimitRange = validateRangeDate(initialData ? initialData.date_limit : undefined);

    return (
        <>
            <Dialog open={isOpen} onClose={onClose}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black/25" />
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <Dialog.Title className="text-lg font-semibold">
                            {action === 'create' ? 'Registrar' : 'Editar Registro'}
                        </Dialog.Title>

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                                    Titulo
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                                    Descripción
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    maxLength={200}
                                    rows={4}
                                    className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                />
                                {/* Indicador de caracteres */}
                                <div className="text-right text-sm text-gray-500">
                                    {formData.description.length}/200 caracteres
                                </div>
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="date_limit">
                                    Fecha limite
                                </label>
                                <input
                                    type="date"
                                    name="date_limit"
                                    id="date_limit"
                                    value={formData.date_limit || ''}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]} // Limita la fecha a hoy o fechas futuras
                                />
                                {errors.date_limit && <p className="text-red-500 text-sm">{errors.date_limit}</p>}
                                <span className={`${dateLimitRange?.color}`}>{dateLimitRange?.message}</span>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    {action === 'create' ? 'Registrar' : 'Actualizar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Dialog>

            <ToastContainer />
        </>
    );
};

export default ModalForm;
