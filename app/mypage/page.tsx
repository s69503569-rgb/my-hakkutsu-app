import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MyPageClient from "./MyPageClient";

export default async function MyPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch applications I made
    const { data: myApplications } = await supabase
        .from("applications")
        .select("*, jobs(title, location)")
        .eq("applicant_id", user.id);

    // Fetch jobs I created (if recruiter)
    let myJobs: any[] = [];
    if (profile?.role === 'recruiter') {
        const { data: jobs } = await supabase
            .from("jobs")
            .select("*, applications(*, profiles(*))")
            .eq("created_by", user.id);
        if (jobs) myJobs = jobs;
    }

    return (
        <MyPageClient
            profile={profile}
            user={user}
            myApplications={myApplications || []}
            myJobs={myJobs}
        />
    );
}
