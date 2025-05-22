export function getLabelById(
  list: { id: string; label: string }[],
  id?: string | null,
) {
  return list.find((item) => item.id === id)?.label || id || "—";
}

export const JOB_LEVELS = [
  { id: "intern", label: "Trainee/Intern" },
  { id: "junior", label: "Junior" },
  { id: "middle", label: "Middle" },
  { id: "senior", label: "Senior" },
  { id: "lead", label: "Lead" },
];

export const WORKING_MODES = [
  { id: "onsite", label: "On-site work" },
  { id: "hybrid", label: "Hybrid work" },
  { id: "remote", label: "Remote work" },
];

export const EMPLOYMENT_TYPES = [
  { id: "employment", label: "Employment contract" },
  { id: "contract_for_work", label: "Contract for work" },
  { id: "contract_of_mandate", label: "Contract of mandate" },
  { id: "b2b", label: "Contract B2B" },
  { id: "replacement", label: "Replacement contract" },
  { id: "agency", label: "Agency agreement" },
  { id: "temporary_employment", label: "Temporary employment" },
  { id: "internship", label: "Internship contract" },
];
