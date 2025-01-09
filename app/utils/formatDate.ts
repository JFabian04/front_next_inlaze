import { differenceInDays, isBefore, isEqual } from 'date-fns';

export function formatDatefunc(dateBd: Date | undefined) {
    console.log('Date: ', dateBd);

    if (dateBd != undefined) {
        const dateString = dateBd.toString();

        let date = dateString;
        if (dateString.includes('T')) {
            const split = dateString.split('T');
            date = split[0].toString();
        }
        console.log('xd---',date);
        const [año, mes, dia] = date.split('-')
        return `${dia}/${mes}/${año}`
    }
}


export function validateRangeDate(date: Date | undefined |string) {
    const now = new Date();
    if (date) {
        const daysDifference = differenceInDays(date, now);

        // Son iguales (Ultimo dia)
        if (isEqual(now, date)) {
            return { status: 'equal', message: 'Hoy, último día', color: 'text-orange-400' };
        }
        //falta 1 día para la fecha limite
        else if (daysDifference === 1) {
            return { status: 'min', message: 'Falta 1 día', color: 'text-blue-500' };
        }
        // ya pasóo la fecha limite
        else if (isBefore(date, now)) {
            return { status: 'max', message: 'Fecha limite expiró', color: 'text-gray-400' };
        }

    }
}