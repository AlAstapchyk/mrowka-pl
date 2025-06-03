import { z } from "zod";

export const jobOfferSchema = z
  .object({
    title: z
      .string()
      .min(1, "Job title is required")
      .max(100, "Job title must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Job description is required")
      .max(5000, "Job description must be less than 5000 characters"),
    minSalary: z.number().min(0, "Minimum salary must be positive").optional(),
    maxSalary: z.number().min(0, "Maximum salary must be positive").optional(),
    currency: z.string().min(1, "Currency is required"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location must be less than 100 characters"),
    employmentType: z.string().min(1, "Employment type is required"),
    jobLevel: z.string().min(1, "Job level is required"),
    workingMode: z.string().min(1, "Working mode is required"),
  })
  .refine(
    (data) => {
      if (data.minSalary && data.maxSalary) {
        return data.minSalary <= data.maxSalary;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"],
    },
  );

export type JobOfferFormData = z.infer<typeof jobOfferSchema>;
