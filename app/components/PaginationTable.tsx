'use client';

import { useSearchParams, useRouter } from 'next/navigation';

interface PaginationProps {
    totalRecords: number;
}

//Paginación para las tablas. Recibe el numero total de registros
const PaginationTable: React.FC<PaginationProps> = ({ totalRecords }) => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const totalPages = Math.ceil(totalRecords / limit);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        params.set('limit', limit.toString());

        replace(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-end space-x-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Anterior
            </button>

            <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Siguiente
            </button>
        </div>
    );
};

export default PaginationTable;
