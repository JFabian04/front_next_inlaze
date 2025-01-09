"use client"

import { FormattedProjectTable, Project } from '@/app/types/project';
import { formatDatefunc } from '@/app/utils/formatDate';
import React, { useState } from 'react';

import ModalForm from './ModalForm';
import LimitSelector from '@/app/components/LimitTable';
import PaginationTable from '@/app/components/PaginationTable';
import SearchInput from '@/app/components/SearchInput';
import ColumnHeader from '@/app/components/HeaderSort';
import DeleteAlert from '../DeleteAlert';
import { deleteProject } from '@/app/services/projectService';


const ProjecTable = ({ data, onSuccess }: { data: FormattedProjectTable | null, onSuccess: () => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
    const [selectedProject, setSelectedItem] = useState<any>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [nameItem, setNameItem] = useState<string | null>(null);

    // Data para la tabla
    const initialData = data !== null ? data.data : [];
    const currentItems = initialData;

    // Modal dinámico (actualizar/registrar)
    const openModalForCreate = () => {
        setModalAction('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (item: any) => {
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
            console.log(`Proyecto con ID ${selectedItemId} eliminado.`);
            setSelectedItemId(null);
            await deleteProject(selectedItemId.toString());
            onSuccess();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
                {/* Buscador */}
                <div className='w-80'>
                    <SearchInput placeholder="Buscar..." />
                </div>

                {/* Botón de registrar */}
                <button
                    className="flex gap-3 items-center h-10 px-3 py-1 text-white bg-blue-500 hover:bg-yellow-600 rounded-md text-sm"
                    onClick={() => openModalForCreate()}
                >
                    <p className="hidden md:block">Registrar Proyecto</p>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                    </svg>
                </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <ColumnHeader columnName="id" label="ID" />
                            <ColumnHeader columnName="name" label="Nombre" />
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDatefunc(item.created_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDatefunc(item.updated_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold leading-5 ${item.status
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {item.status ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center justify-between gap-5 px-5 py-2 shadow bg-gray-200/50 rounded-full">
                                        {/* Botón de Actualizar */}
                                        <button
                                            className="shadow px-3 py-1 text-blue-500 bg-blue-100 hover:bg-blue-200 rounded-md text-sm"
                                            onClick={() => openModalForEdit(item)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                            </svg>
                                        </button>
                                        {/* Botón de ver Tareas */}
                                        <button
                                            className="shadow px-3 py-1 text-green-500 bg-green-100 hover:bg-green-200 rounded-md text-sm"
                                            onClick={() => openModalForEdit(item)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
                                            </svg>
                                        </button>

                                        {/* Botón de eliminar */}
                                        <button
                                            className="px-3 py-1 text-red-500 shadow bg-red-100 hover:bg-red-200 rounded-md text-sm"
                                            onClick={() => handleDelete(Number(item.id), item.name)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                            </svg>

                                        </button>
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
                initialData={selectedProject}
                onSuccess={handleModalSuccess}
            />

            {/* Alerta ocnfimiarcion elminar */}
            <DeleteAlert
                isOpen={isDeleteModalOpen}
                onResult={handleResult}
                item={nameItem}
                onSuccess={handleModalSuccess}
            />

        </div>
    );
};


export default ProjecTable;