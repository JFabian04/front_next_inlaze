import { ParamsFilter } from "../types/filters-params";
import axiosInstance from "../utils/axios";

const BASE_URL = '/users'
// Obtener todos los registros. Recibe params para filtros
export const getUsers = async ({
    search = '',
}: ParamsFilter,) => {

    try {
        const response = await axiosInstance.get(BASE_URL + `?&limit=10&search=${search}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Servicio para valdaiar autenticacion
export const authValidate = async () => {
    try {
        const resp = await axiosInstance.get('/auth/protected');
        return resp.data
    } catch (error) {
        throw error
    }
}
