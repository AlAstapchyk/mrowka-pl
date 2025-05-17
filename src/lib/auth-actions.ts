"use server";

import { createClient as createAdmin } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export async function deleteUserAndData() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error("Authentication error: " + userError.message);

  if (!user) throw new Error("No authenticated user found");

  const supabaseAdmin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error: profileError } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", user.id);

  if (profileError) {
    throw new Error("Failed to delete user data: " + profileError.message);
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id,
  );

  if (deleteError) {
    throw new Error("Failed to delete user: " + deleteError.message);
  }

  return user;
}

// login with email and password
// NOT USED
// export async function login(formData: FormData) {
//   const supabase = await createClient();

//   const email = formData.get("email") as string;
//   const password = formData.get("haslo") as string;

//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     return { error: error.message };
//   }

//   return { success: true };
// }

// registration with login
// NOT USED
// export async function register(formData: FormData) {
//   const supabase = await createClient();

//   const firstName = formData.get("firstName") as string;
//   const lastName = formData.get("lastName") as string;
//   console.log(`${firstName + " " + lastName}`);
//   const data = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//     options: {
//       data: {
//         full_name: `${firstName}  ${lastName}`,
//         email: formData.get("email") as string,
//         role: formData.get("role") as string,
//       },
//     },
//   };

//   const { error } = await supabase.auth.signUp(data);

//   revalidatePath("/", "layout");
// }

// For future if it will become 🤪
// export async function signInWithGoogle() {
//   const supabase = await createClient();
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       queryParams: {
//         access_type: "offline",
//         prompt: "consent",
//       },
//     },
//   });

//   if (error) {
//     console.log(error);
//     redirect("/error");
//   }

//   redirect(data.url);
// }
