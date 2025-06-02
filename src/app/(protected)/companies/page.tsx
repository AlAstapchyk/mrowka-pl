import CompaniesList from "@/components/Companies/CompaniesList";
import { Button } from "@/components/ui/button";
import { getUserCompanies } from "@/db/queries/companies";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const page = async () => {
    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user?.id) return;

    const dataArr = await getUserCompanies(user.id);
    const companyWithRoles = dataArr.map(element => ({
        company: element.company,
        role: element.memberRole,
    }));

    return (
        <div className="container my-4">
            <div className="flex mb-4">
                <h2 className="text-2xl font-semibold mb-4">Companies you have access to</h2>
                <Button className="flex ml-auto bg-black text-white hover:bg-gray-800" variant={"default"} asChild>
                    <Link href={"companies/register"}>
                        Register Company
                    </Link>
                </Button>
            </div>

            <div className="gap-4 grid">
                <CompaniesList companies={companyWithRoles} />
            </div>
        </div>
    );
};

export default page;
