"use client"

import { FC, useEffect, useState } from "react";
import ProjectTable from "./TaskTable";
import { ParamsFilter } from "@/app/types/filters-params";
import { FormattedTaskTable } from "@/app/types/task";
import { getTasks } from "@/app/services/taskService";

const TaskWrappers: FC<ParamsFilter> = ({
    search,
    page,
    limit,
    sortField,
    sortOrder,
}) => {
    const [projects, setProjects] = useState<FormattedTaskTable | null>(null);

    // Obtener registros
    const fetchProjects = async () => {
        try {
            const data = await getTasks({ search, page, limit, sortField, sortOrder });
            setProjects(data);
        } catch (error) {
            console.error("Error al obtener los regitros:", error);
        }
    };


    useEffect(() => {
        fetchProjects();
    }, [search, page, limit, sortField, sortOrder]);

    // Función para recargar la tabla después de crear o editar
    const handleSuccess = async () => {
        await fetchProjects();
    };

    return (
        <div>
            <ProjectTable data={projects} onSuccess={handleSuccess} />
        </div>
    );
};

export default TaskWrappers;
