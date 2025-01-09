import { ParamsFilter } from "../types/filters-params";
import { Project } from "../types/project";
import axiosInstance from "../utils/axios";

const BASE_URL = '/projects';

// Obtener todos los registros. Recibe params para filtros
export const getProjects = async ({
  search = '',
  page = '1',
  limit = '10',
  sortField = 'name',
  sortOrder = 'ASC'
}: ParamsFilter) => {
  console.log('Params: ', page, limit, search, sortField, sortOrder);

  try {
    const response = await axiosInstance.get(BASE_URL + `?page=${page}&limit=${limit}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener un registro especfico
export const getProjectById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// crear un nuevo registro
export const createProject = async (projectData: Project) => {
  try {
    const response = await axiosInstance.post(BASE_URL, projectData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// actualizar un registro
export const updateProject = async (id: string, projectData: Project) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// eliminar un proyecto (softdelete)
export const deleteProject = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
