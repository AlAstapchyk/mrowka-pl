import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().max(200, "Maximum 200 characters").optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  companySize: z
    .enum(["micro", "small", "medium", "large", "enterprise"])
    .optional(),
  companyDescription: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
