import axiosInstance from "../utils/axios";


const DashboardInicio = async () => {
  const response = await axiosInstance.get("/tasks/stats");
  const stats = response.data.data;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-600">Resumen general de tus proyectos y tareas.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <BigCard
          title="Proyectos"
          total={stats.projects.total}
          items={[
            { label: "Activos", value: stats.projects.active, color: "green" },
            { label: "Cerrados", value: stats.projects.closed, color: "red" },
          ]}
        />

        <BigCard
          title="Tareas"
          total={stats.tasks.totalTasks}
          items={[
            { label: "Por Iniciar", value: stats.tasks.notStarted, color: "yellow" },
            { label: "En Progreso", value: stats.tasks.inProgress, color: "purple" },
            { label: "Completadas", value: stats.tasks.completed, color: "blue" },
          ]}
        />
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700">Información</h2>
        <div className="mt-4 bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            Dashboard para la administración de proyectos y gestión de tareas.
          </p>
          <p className="text-gray-500 italic mt-2">Inlaze. 2025</p>
        </div>
      </section>
    </div>
  );
};

interface BigCardProps {
  title: string;
  total: number;
  items: {
    label: string;
    value: number;
    color: "green" | "red" | "yellow" | "purple" | "blue";
  }[];
}

const BigCard: React.FC<BigCardProps> = ({ title, total, items }) => {
  const colorClasses = {
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    blue: "text-blue-500",
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">

      <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
      <p className="mt-2 text-5xl font-bold text-gray-800">{total}</p>

      <div className="flex justify-around mt-6">
        {items.map((item, index) => (
          <div key={index} className="text-center">
            <div
              className={`w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 ${colorClasses[item.color]}`}
            >
              <p className="text-3xl font-bold">{item.value}</p>
            </div>
            <p className="mt-2 text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardInicio;
