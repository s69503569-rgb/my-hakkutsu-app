import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export default async function JobsPage() {
    const supabase = await createClient();
    const { data: jobs, error } = await supabase
        .from("jobs")
        .select("*, profiles(display_name)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching jobs:", error);
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#4a4a4a]">求人一覧</h1>
                <Link
                    href="/jobs/create"
                    className="bg-[#8d6e63] text-white px-4 py-2 rounded hover:bg-[#6d4c41] transition-colors shadow-sm"
                >
                    ＋ 求人を掲載する
                </Link>
            </div>

            <div className="grid gap-4">
                {jobs && jobs.length > 0 ? (
                    jobs.map((job) => (
                        <Link
                            href={`/jobs/${job.id}`}
                            key={job.id}
                            className="block bg-white rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow hover:border-[#8d6e63] overflow-hidden"
                        >
                            {job.image_url && (
                                <div className="w-full h-48 bg-gray-100 border-b border-gray-100">
                                    <img
                                        src={job.image_url}
                                        alt={job.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#4a4a4a] mb-1">
                                            {job.title}
                                        </h2>
                                        <div className="flex gap-3 text-sm text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                📍 {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                💰 {job.salary}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Check if created_at is valid before formatting */}
                                    <span className="text-xs text-gray-400">
                                        {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ja }) : ''}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {job.description}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        Recruiter: {job.profiles && !Array.isArray(job.profiles) ? (job.profiles as any).display_name : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">現在掲載されている求人はありません。</p>
                        <Link href="/jobs/create" className="text-[#8d6e63] font-bold mt-2 inline-block">
                            最初の求人を掲載する
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
