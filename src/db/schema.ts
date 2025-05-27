import { InferModel } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const employmentType = pgEnum("employment_type", [
  "employment",
  "contract_for_work",
  "contract_of_mandate",
  "b2b",
  "replacement",
  "agency",
  "temporary_employment",
  "internship",
]);

export const jobLevel = pgEnum("job_level", [
  "intern",
  "junior",
  "middle",
  "senior",
  "lead",
]);

export const workingMode = pgEnum("working_mode", [
  "remote",
  "hybrid",
  "onsite",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "reviewed",
  "accepted",
  "rejected",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobSeekerProfiles = pgTable("job_seeker_profiles", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  phoneNumber: text("phone_number"),
  resumeLink: text("resume_link"),
  skills: text("skills").array(),
  education: text("education"),
  locationPreference: text("location_preference"),
  linkedInUrl: text("linkedin_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  logo_url: text("logo_url"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobOffers = pgTable("job_offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  minSalary: integer("min_salary"),
  maxSalary: integer("max_salary"),
  currency: text("currency").default("PLN").notNull(),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull(),
  jobLevel: text("job_level").notNull(),
  workingMode: text("working_mode").notNull(),
  companyId: uuid("company_id").notNull(),
  postedBy: uuid("posted_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobOffers.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: applicationStatusEnum("status").default("pending").notNull(),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  coverLetter: text("cover_letter").notNull(),
});

export const savedJobs = pgTable("saved_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").references(() => jobOffers.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").defaultNow(),
});

export type EmploymentType = (typeof employmentType)["enumValues"][number];
export type JobLevel = (typeof jobLevel)["enumValues"][number];
export type WorkingMode = (typeof workingMode)["enumValues"][number];
export type ApplicationStatus =
  (typeof applicationStatusEnum)["enumValues"][number];

export type User = InferModel<typeof users>;
export type JobSeekerProfile = InferModel<typeof jobSeekerProfiles>;
export type Company = InferModel<typeof companies>;
export type JobOffer = InferModel<typeof jobOffers>;
export type JobApplication = InferModel<typeof jobApplications>;
