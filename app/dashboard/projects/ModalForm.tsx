'use client';

import { Dialog } from '@headlessui/react';
import { FC, useState, useEffect } from 'react';
import { createProject, updateProject } from '@/app/services/projectService';
import { Project } from '@/app/types/project';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { processValidationErrors } from '@/app/utils/validationError';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: 'create' | 'edit';
    initialData?: { name: string; description: string };
    onSuccess?: () => void;
}

const ModalForm: FC<ModalProps> = ({ isOpen, onClose, action, initialData, onSuccess }) => {
    const [formData, setFormData] = useState<Project>({
        name: '',
        description: '',
    });
    const [errors, setErrors] = useState<any>({});

    // llenar el formulario si es editar
    useEffect(() => {
        setErrors({})

        if (action === 'edit' && initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', description: '' });
        }
    }, [action, initialData]);

    // evento de cierre (limpia los campos)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let response;

            if (action === 'create') {
                response = await createProject(formData);
            } else if (formData.id) {
                const { name, description } = formData;
                response = await updateProject(formData.id, { name, description });
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

    return (
        <>
            <Dialog open={isOpen} onClose={onClose}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black/25" />
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <Dialog.Title className="text-lg font-semibold">
                            {action === 'create' ? 'Registrar Nuevo Elemento' : 'Editar Elemento'}
                        </Dialog.Title>

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>} { }

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
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>} { }

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
