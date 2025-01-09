import { Comment, CommentCreate } from "../types/comment";
import { ParamsFilter } from "../types/filters-params";
import axiosInstance from "../utils/axios";

const BASE_URL = '/comments';

// Obtener todos los registros. Recibe params para filtros
export const getComments = async ({
    id = '',
    page = '1',
    limit = '10',
    search = '',
    sortField = 'created_at',
    sortOrder = 'DESC',
}: ParamsFilter,) => {

    try {
        const response = await axiosInstance.get(BASE_URL + `/${id}?page=${page}&limit=${limit}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Obtener un registro especfico
export const getCommentById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// crear un nuevo registro
export const createComment = async (data: CommentCreate) => {
    try {
        const response = await axiosInstance.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// actualizar un registro
export const updateComment = async (id: string, data: CommentCreate) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// eliminar un proyecto (softdelete)
export const deleteComment = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
