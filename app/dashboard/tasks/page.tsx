
import { Metadata } from 'next';
import { FC } from 'react';
import ProjectWrapper from './TaskWrappers';

export const metadata: Metadata = {
    title: 'Proyectos',
};

interface InvoicesProps {
    searchParams?: Promise<{ search?: string; page?: string, limit?: string, sortField?: string, sortOrder?:string }>;
}

const Projects: FC<InvoicesProps> = async ({searchParams}) => {
    const params = await searchParams;
    
    return (
        <main>
            <div className="w-full">
                <h1 className='mb-8 text-xl md:text-2xl'>
                    Gestión de Tareas
                </h1>
                <ProjectWrapper search={params?.search || ''} limit={params?.limit || ''} page={params?.page || ''} sortField={params?.sortField || 'created_at'} sortOrder={params?.sortOrder || 'DESC'} />
            </div >
        </main>
    );
}

export default Projects;