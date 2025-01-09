import { ParamsFilter } from "../types/filters-params";
import { Task } from "../types/task";
import axiosInstance from "../utils/axios";

const BASE_URL = '/tasks';

// Obtener todos los registros. Recibe params para filtros
export const getTasks = async ({
    id = '',
    ud = '',
    search = '',
    page = '1',
    limit = '10',
    sortField = 'name',
    sortOrder = 'ASC',
}: ParamsFilter,) => {
    console.log('Params: ', ud);

    try {
        const response = await axiosInstance.get(BASE_URL + `/${id}/${ud}?page=${page}&limit=${limit}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Obtener un registro especfico
export const getTaskById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// crear un nuevo registro
export const createTask = async (data: Task) => {
    try {
        const response = await axiosInstance.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// actualizar un registro
export const updateTask = async (id: string, data: Task) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// eliminar un proyecto (softdelete)
export const deleteTask = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
