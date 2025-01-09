"use client"

import { FC, useEffect, useState } from "react";
import { getProjects } from "@/app/services/projectService";
import ProjectTable from "./ProjecTable";
import { ParamsFilter } from "@/app/types/filters-params";
import { FormattedProjectTable, Project } from "@/app/types/project";

const ProjectWrapper: FC<ParamsFilter> = ({
    search,
    page,
    limit,
    sortField,
    sortOrder,
}) => {
    const [projects, setProjects] = useState<FormattedProjectTable | null>(null);

    // Obtener registros
    const fetchProjects = async () => {
        try {
            const data = await getProjects({ search, page, limit, sortField, sortOrder });
            setProjects(data);
        } catch (error) {
            console.error("Error al obtener los proyectos:", error);
        }
    };


    useEffect(() => {
        fetchProjects();
    }, [search, page, limit, sortField, sortOrder]);

    // Función para recargar la tabla después de crear o editar
    const handleSuccess = () => {
         fetchProjects();
    };

    return (
        <div>
            <ProjectTable data={projects} onSuccess={handleSuccess} />
        </div>
    );
};

export default ProjectWrapper;
