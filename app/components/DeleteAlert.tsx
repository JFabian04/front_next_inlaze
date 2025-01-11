import { Dialog } from '@headlessui/react';
import { FC } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onResult: (confirmed: boolean) => void;
    item?: string | null;
    onSuccess?: () => void;
}

const AlertDelete: FC<ConfirmModalProps> = ({ isOpen, onResult, item, onSuccess }) => {
    const handleCancel = () => {
        onResult(false);
    };

    const handleConfirm = () => {
        onResult(true);
        toast.success('Registro eliminado correctamente.')

        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <>
            <Dialog open={isOpen} onClose={() => onResult(false)}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black/25" />
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <Dialog.Title className="text-lg font-semibold">
                            Confirmar Eliminación
                        </Dialog.Title>
                        {item && (
                            <label className=' bg-blue-100 px-2 text-blue-500 font-bold'>
                                {item}
                            </label>
                        )}

                        <p className="mt-4">
                            ¿Estás seguro de que deseas eliminar este registro?
                        </p>
                        <p className='text-sm mt-2 ml-2'>Esta acción no se puede deshacer.</p>


                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog >

        </>
    );
};

export default AlertDelete;
