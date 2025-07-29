import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import postgres from "postgres";

config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!supabaseUrl || !serviceRoleKey || !databaseUrl) {
  throw new Error("Missing environment variables");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const sql = postgres(databaseUrl);

const testUsers = [
  {
    email: "seeker@mrowka.pl",
    password: "Password123!",
    fullName: "Test Seeker",
    role: "job_seeker",
  },
  {
    email: "recruiter@mrowka.pl",
    password: "Password123!",
    fullName: "Test Recruiter",
    role: "recruiter",
  },
];

async function seed() {
  for (const user of testUsers) {
    console.log(`Seeding user: ${user.email}`);

    // 1. Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    let userId = existingUsers?.users?.find(u => u.email === user.email)?.id;

    if (userId) {
      console.log(`User ${user.email} already exists in auth. Updating password to ensure test consistency...`);
      await supabase.auth.admin.updateUserById(userId, {
        password: user.password,
        email_confirm: true
      });
    } else {
      // 2. Create user in Supabase Auth (bypassing email confirmation)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
        },
      });

      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError.message);
        continue;
      }
      userId = authData?.user?.id;
    }
    
    if (!userId) {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === user.email);
      if (existingUser) userId = existingUser.id;
    }

    if (!userId) {
      console.error(`Could not find or create user ID for ${user.email}`);
      continue;
    }

    // 2. Insert into public.users table using raw SQL
    try {
      await sql`
        INSERT INTO users (id, email, full_name, role)
        VALUES (${userId}, ${user.email}, ${user.fullName}, ${user.role})
        ON CONFLICT (email) DO UPDATE 
        SET full_name = EXCLUDED.full_name, role = EXCLUDED.role
      `;
      console.log(`Successfully synced ${user.email} to public.users table.`);
    } catch (dbError) {
      console.error(`Error inserting into public.users:`, dbError);
    }
    
    // 3. Clear previous test data for this user to allow repeatable E2E tests
    try {
      await sql`DELETE FROM job_applications WHERE user_id = ${userId}`;
      await sql`DELETE FROM saved_jobs WHERE user_id = ${userId}`;
      console.log(`Cleared previous applications and saved jobs for ${user.email}.`);
    } catch (cleanupError) {
      console.error(`Error cleaning up data for ${user.email}:`, cleanupError);
    }
  }

  await sql.end();
  console.log("Seeding complete.");
}

seed().catch(console.error);
