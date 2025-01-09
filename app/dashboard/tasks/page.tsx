
import { Metadata } from 'next';
import { FC } from 'react';
import ProjectWrapper from './TaskWrappers';

export const metadata: Metadata = {
    title: 'Tareas',
};

interface InvoicesProps {
    searchParams?: Promise<{ search?: string; page?: string, limit?: string, sortField?: string, sortOrder?: string, id?: string, ud?: string }>;
}

const Projects: FC<InvoicesProps> = async ({ searchParams }) => {
    const params = await searchParams;
    console.log('PARAMES PAGE: ', params?.ud);
    
    return (
        <main>
            <div className="w-full">
                <h1 className='mb-8 text-xl md:text-2xl'>
                    Gestión de Tareas
                </h1>
                <ProjectWrapper id={params?.id || ''} ud={params?.ud || ''} search={params?.search || ''} limit={params?.limit || ''} page={params?.page || ''} sortField={params?.sortField || 'created_at'} sortOrder={params?.sortOrder || 'DESC'} />
            </div >
        </main>
    );
}

export default Projects;