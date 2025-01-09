export interface Project {
  id?: string;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
  status?: boolean;
}


export interface FormattedProjectTable {
  data: Project[];
  count: number;
}

