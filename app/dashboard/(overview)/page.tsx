
import ProjectTable from '@/app/components/projects/ProjecTable';
import { getProjects } from '@/app/services/projectService';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Customers',
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';

    const data = await getProjects();

    return (
        <main>
            {/* <ProjectTable data={data} /> */}
        </main>
    );
}