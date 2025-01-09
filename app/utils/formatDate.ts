import { format } from 'date-fns';

export function formatDatefunc(dateString: Date | undefined) {
    if (dateString != undefined) {
        return format(new Date(dateString), 'dd-MM-yyyy');
    }
}
