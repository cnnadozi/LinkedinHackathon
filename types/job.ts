/** Job posting types (jobs_data.json). */

export type SalaryRange = {
  from: string;
  to: string;
};

export type Job = {
  id: string;
  company: string;
  location: string;
  position: string;
  salary_range: SalaryRange;
  industry: string;
  level: string;
  easy_apply: boolean;
  description: string;
};
