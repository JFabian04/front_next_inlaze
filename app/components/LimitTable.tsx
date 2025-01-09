'use client';

import { useSearchParams, useRouter } from 'next/navigation';

//Funcion encargada de definir el parametro limit para la tabla
const LimitSelector: React.FC = () => {
    // Parametros URL
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const currentLimit = parseInt(searchParams.get('limit') || '10', 10);

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = event.target.value;

        const params = new URLSearchParams(searchParams.toString());
        params.set('limit', newLimit);

        replace(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="limit" className="text-sm">Mostrar:</label>
            <select
                id="limit"
                value={currentLimit}
                onChange={handleLimitChange}
                className="px-3 py-1 rounded-md border border-gray-200 text-sm"
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
            <span className="text-sm">por página</span>
        </div>
    );
};

export default LimitSelector;
