import { differenceInDays, isBefore, isEqual, startOfDay } from 'date-fns';
import { parse } from 'date-fns';


export function formatDatefunc(dateBd: Date | undefined) {
    // console.log('Date: ', dateBd);

    if (dateBd != undefined) {
        const dateString = dateBd.toString();

        let date = dateString;
        if (dateString.includes('T')) {
            const split = dateString.split('T');
            date = split[0].toString();
        }
        // console.log('xd---',date);
        const [año, mes, dia] = date.split('-')
        return `${dia}/${mes}/${año}`
    }
}


export function validateRangeDate(date: Date | undefined | string) {
    const now = new Date();
    if (date) {
        const parsedDate = parse(date.toString(), 'yyyy-MM-dd', new Date());
        //Se nralizan las fechas para no tener en cuenta hora
        const normalizedParsedDate = startOfDay(parsedDate);
        const normalizedNow = startOfDay(now);

        const daysDifference = differenceInDays(normalizedParsedDate, normalizedNow);

        // Son iguales (Ultimo dia)
        if (isEqual(normalizedParsedDate, normalizedNow)) {
            return { status: 'equal', message: 'Hoy, último día', color: 'text-orange-400' };
        }
        //falta 1 día para la fecha limite
        else if (daysDifference === 1) {
            return { status: 'min', message: 'Falta 1 día', color: 'text-blue-500' };
        }
        // ya pasóo la fecha limite
        else if (isBefore(normalizedParsedDate, normalizedNow)) {
            return { status: 'max', message: 'Fecha limite expiró', color: 'text-gray-400' };
        }

    }
}