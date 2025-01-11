"use client"

import { formatDatefunc } from '@/app/utils/formatDate';
import React, { useEffect, useState } from 'react';

import ModalForm from './ModalForm';
import LimitSelector from '@/app/components/LimitTable';
import PaginationTable from '@/app/components/PaginationTable';
import SearchInput from '@/app/components/SearchInput';
import ColumnHeader from '@/app/components/HeaderSort';
import DeleteAlert from '../../components/DeleteAlert';
import { FormattedTaskTable, Task } from '@/app/types/task';
import { deleteTask } from '@/app/services/taskService';
import { useRouter as useRouterApp, useSearchParams } from 'next/navigation';

import ListComment from '../comments/ListComment';
import { authValidate } from '@/app/services/userService';


const TaskTable = ({ data, onSuccess }: { data: FormattedTaskTable | null, onSuccess: () => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [nameItem, setNameItem] = useState<string | null>(null);

    const [selectedItemComment, setSelectedItemComment] = useState<Task | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [authData, setAuthData] = useState<any>();

    const searchParams = useSearchParams();
    const routerApp = useRouterApp();

    // Obtener userId solo en el cliente
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);

        const validateAuth = async () => {
            const auth = await authValidate();
            if (auth.satus == 'error') {
                routerApp.push('/')
            }
            console.log('AUTH DATA: ', auth);

            setAuthData(auth.data)
        }
        validateAuth()
    }, []);

    // Data para la tabla
    const initialData = data ? data.data : [];
    const currentItems = initialData;

    const params = new URLSearchParams(searchParams);

    // Validar que el is del usario sea igual al de la autenticacion
    useEffect(() => {
        if (userId && params.get('ud') !== userId) {
            routerApp.push('/dashboard/projects');
        }
        if (!Array.isArray(currentItems)) {
            routerApp.push('/dashboard/projects');
        }

    }, [params, userId, currentItems, routerApp]);

    //Boton para redirecionar a los proeyctos
    const handleGoBack = () => {
        const projectFilters = localStorage.getItem('projectFilters');
        routerApp.push(`/dashboard/projects?${projectFilters}`);
    };

    // Modal dinámico (actualizar/registrar)
    const openModalForCreate = () => {
        setModalAction('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (item: any) => {
        console.log('ITEM SELECTED: ', item);

        setModalAction('edit');
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // Función para llamar al onSuccess después de una acción en el modal
    const handleModalSuccess = async () => {
        onSuccess();
        setIsModalOpen(false);
    };


    //Alerta para eliminar
    const handleDelete = (id: number, name?: string | null) => {
        setSelectedItemId(id);
        setIsDeleteModalOpen(true);

        if (name) {
            setNameItem(name);
        }
    };

    //resultado de alert cancelar/confirmar (eliminar)
    const handleResult = async (confirmed: boolean) => {
        setIsDeleteModalOpen(false);

        if (confirmed && selectedItemId) {
            console.log(`Item con ID ${selectedItemId} eliminado.`);
            setSelectedItemId(null);
            await deleteTask(selectedItemId.toString());
            onSuccess();
        }
    };


    const closeChat = () => {
        setSelectedItemComment(null);
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
                <div className='flex gap-3'>
                    {/* Volver atras boton */}
                    <button
                        className="flex gap-3 items-center h-10 px-3 py-1 text-white bg-blue-600 hover:bg-blue-500 rounded-md text-sm shadow-lg"
                        onClick={() => handleGoBack()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Buscador */}
                    <div className='w-80 shadow-md'>
                        <SearchInput placeholder="Buscar..." />
                    </div>
                </div>

                {/* Botón de registrar */}
                {authData && authData.rol === 'admin' && (
                    < button
                        className="flex gap-3 items-center h-10 px-3 py-1 text-white bg-blue-600 hover:bg-blue-500 rounded-md text-sm shadow-lg" onClick={() => openModalForCreate()}>
                        <p className="hidden md:block">Registrar Tarea</p>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <ColumnHeader columnName="id" label="ID" />
                            <ColumnHeader columnName="title" label="Nombre" />
                            <ColumnHeader columnName="date_limit" label="Fecha Limite" />
                            <ColumnHeader columnName="description" label="Descripción" />
                            <ColumnHeader columnName="created_at" label="Fecha Creación" />
                            <ColumnHeader columnName="updated_at" label="Fecha Actualización" />
                            <ColumnHeader columnName="status" label="Estado" />
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDatefunc(item.date_limit)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDatefunc(item.created_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDatefunc(item.updated_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold leading-5 ${item.status === 'por hacer'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : item.status === 'en progreso'
                                                ? 'bg-blue-100 text-blue-800'
                                                : item.status === 'completada'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className={`flex items-center gap-5 px-5 py-2 shadow bg-gray-200/50 rounded-full ${authData.rol === 'admin' ? 'justify-between' : 'justify-center'}`}>
                                        {/* Botón de Actualizar */}
                                        {authData && authData.rol === 'admin' && (

                                            <button
                                                className="shadow px-3 py-1 text-blue-500 bg-blue-100 hover:bg-blue-200 rounded-md text-sm"
                                                onClick={() => openModalForEdit(item)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                                </svg>
                                            </button>
                                        )}
                                        {/* Botón de ver Tareas */}
                                        <button
                                            className="shadow px-3 py-1 text-green-500 bg-green-100 hover:bg-green-200 rounded-md text-sm"
                                            onClick={() => setSelectedItemComment(item)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                                                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                                            </svg>

                                        </button>

                                        {/* Botón de eliminar */}
                                        {authData && authData.rol === 'admin' && (
                                            < button
                                                className="px-3 py-1 text-red-500 shadow bg-red-100 hover:bg-red-200 rounded-md text-sm"
                                                onClick={() => handleDelete(Number(item.id), item.title)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                                </svg>

                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="">
                <LimitSelector />
                <PaginationTable totalRecords={data ? data.count : 0} />
            </div>

            {/* Modal Componente */}
            <ModalForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                action={modalAction}
                initialData={selectedItem}
                onSuccess={handleModalSuccess}
            />

            {/* Alerta ocnfimiarcion elminar */}
            <DeleteAlert
                isOpen={isDeleteModalOpen}
                onResult={handleResult}
                item={nameItem}
                onSuccess={handleModalSuccess}
            />

            {/* Modulo comentarios */}
            {
                selectedItemComment && (
                    <ListComment task={selectedItemComment} onClose={closeChat} />
                )
            }

        </div >
    );
};


export default TaskTable;