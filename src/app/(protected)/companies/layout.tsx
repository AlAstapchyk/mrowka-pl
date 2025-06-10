import NotFound from "@/app/not-found";
import { getUserRoleById } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import React from "react";

const layout = async ({ children }: { children: React.ReactElement }) => {
    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user?.id) return;

    const role = await getUserRoleById(user.id);

    if (role !== "recruiter") return NotFound();

    return (
        <>
            {children}
        </>
    );
}

export default layout;