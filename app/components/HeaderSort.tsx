'use client';

import { useSearchParams, useRouter } from 'next/navigation';

interface ColumnHeaderProps {
    columnName: string;
    label: string;
}

// Función para filtrado por columnas y orden ascendete/descendente
const ColumnHeader: React.FC<ColumnHeaderProps> = ({ columnName, label }) => {
    // Gestion de parametros por URL
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const sortField = searchParams.get('sortField');
    const sortOrder = searchParams.get('sortOrder') || 'ASC';

    // Validacion si es ASC/DESC par filtrar siempre por el contra
    const handleSortChange = () => {
        const newSortOrder = sortField === columnName && sortOrder === 'ASC' ? 'DESC' : 'ASC';

        const params = new URLSearchParams(searchParams.toString());
        params.set('sortField', columnName);
        params.set('sortOrder', newSortOrder);

        replace(`?${params.toString()}`);
    };

    return (
        <th
            onClick={handleSortChange}
            className="cursor-pointer text-left py-2 px-4 hover:bg-gray-100"
        >
            {label}
            {sortField === columnName && (
                <span className={`ml-2 text-sm ${sortOrder === 'ASC' ? 'text-blue-500' : 'text-red-500'}`}>
                    {sortOrder === 'ASC' ? '↑' : '↓'}
                </span>
            )}
        </th>
    );
};

export default ColumnHeader;
