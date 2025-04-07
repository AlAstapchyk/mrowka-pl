import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (data.user)
    return (
      <main className="container mt-4">
        <p>Hello, {data.user.user_metadata.full_name}</p>
        <p>Your email: {data.user.email}</p>
        <p>Your role: {data.user.user_metadata.role}</p>

        <Button className="mt-4" onClick={logout}>
          Log Out
        </Button>
      </main>
    );
}
