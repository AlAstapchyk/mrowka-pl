import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";

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
  employmentType: employmentType("employment_type").notNull(),
  jobLevel: jobLevel("job_level").notNull(),
  workingMode: workingMode("working_mode").notNull(),
  salaryRange: text("salary_range"),
  location: text("location"),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  postedBy: uuid("posted_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
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
