export interface Task {
    id?: string;
    title: string;
    description: string;
    date_limit?: Date;
    created_at?: Date;
    updated_at?: Date;
    status?: string;
    users?: [];
    project?: string;
  }
  
  
  export interface FormattedTaskTable {
    data: Task[];
    count: number;
  }
  
  