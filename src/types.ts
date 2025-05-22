import { EmploymentType, JobLevel, WorkingMode } from "./db/schema";

export interface JobSearchParams {
  query?: string;
  location?: string;
  jobLevel?: JobLevel[];
  minSalary?: number;
  workingMode?: WorkingMode[];
  employmentType?: EmploymentType[];
  page?: number;
  pageSize?: number;
  sortDirection?: "asc" | "desc";
}
