import { createClient } from "@/utils/supabase/server";
import { applyToJob } from "../actions";
import ApplyButton from "./ApplyButton";
import DeleteJobButton from "./DeleteJobButton";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch job details
    const { data: job, error } = await supabase
        .from("jobs")
        .select("*, profiles(display_name)")
        .eq("id", id)
        .single();

    if (error || !job) {
        return <div className="text-[#333]">求人が見つかりません</div>;
    }

    // Check if user is logged in and get role
    const { data: { user } } = await supabase.auth.getUser();
    let userRole = null;

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        userRole = profile?.role;
    }

    // Check if already applied
    let hasApplied = false;
    if (user) {
        const { data: application } = await supabase
            .from("applications")
            .select("id")
            .eq("job_id", id)
            .eq("applicant_id", user.id)
            .single();
        if (application) {
            hasApplied = true;
        }
    }

    const isAdmin = userRole === 'admin';
    const isOwner = user?.id === job.created_by;
    const canEdit = isAdmin || isOwner;

    // Fetch applicants if owner or admin
    let applicants = null;
    if (canEdit) {
        const { data: apps } = await supabase
            .from("applications")
            .select("*, profiles(*)")
            .eq("job_id", id)
            .order("created_at", { ascending: false });
        applicants = apps;
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-100">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-[#333]">{job.title}</h1>
                    {canEdit && (
                        <div className="flex gap-2 w-full md:w-auto">
                            <Link
                                href={`/jobs/${id}/edit`}
                                className="flex-1 md:flex-none text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                                編集
                            </Link>
                            <DeleteJobButton jobId={id} />
                        </div>
                    )}
                </div>

                {job.image_url && (
                    <div className="mb-6 rounded-lg overflow-hidden border border-gray-100">
                        <img
                            src={job.image_url}
                            alt={job.title}
                            className="w-full h-auto max-h-[400px] object-cover"
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-[#666] mb-6 border-b border-gray-100 pb-6">
                    <span className="flex items-center gap-1">📍 {job.location}</span>
                    <span className="flex items-center gap-1">💰 {job.salary}</span>
                    <span className="flex items-center gap-1">👤 {job.profiles && !Array.isArray(job.profiles) ? (job.profiles as any).display_name : 'Unknown'}</span>
                    <span>🕒 {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ja }) : ''}</span>
                </div>

                <div className="prose max-w-none text-[#333] mb-8 whitespace-pre-wrap">
                    {job.description}
                </div>

                {!canEdit ? (
                    <ApplyButton jobId={id} hasApplied={hasApplied} isLoggedIn={!!user} />
                ) : (
                    <div className="space-y-6">
                        <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center text-sm text-gray-500">
                            <p>💡 あなたはこの求人の管理者です（応募ボタンは表示されません）</p>
                        </div>

                        {/* Applicants List */}
                        <div className="border-t border-gray-100 pt-6">
                            <h2 className="text-xl font-bold text-[#333] mb-4">応募者一覧</h2>
                            {applicants && applicants.length > 0 ? (
                                <div className="space-y-3">
                                    {applicants.map((app: any) => (
                                        <div key={app.id} className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-[#333]">{app.profiles?.display_name || '名前なし'}</p>
                                                <p className="text-sm text-[#666]">{app.profiles?.email}</p>
                                                <p className="text-xs text-[#999]">応募日: {new Date(app.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[#666] italic">まだ応募者はいません</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <Link href="/jobs" className="text-[#8d6e63] hover:underline">
                        ← 求人一覧に戻る
                    </Link>
                </div>
            </div>
        </main>
    );
}
