import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export default async function LearningPage() {
    const supabase = await createClient();
    const { data: articles, error } = await supabase
        .from("articles")
        .select("*, profiles(display_name)")
        .order("created_at", { ascending: false });

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#4a4a4a]">学びの広場</h1>
                    <p className="text-gray-500 text-sm mt-1">発掘現場で役立つ知識を共有しよう</p>
                </div>
                <Link
                    href="/learning/create"
                    className="w-full sm:w-auto text-center bg-[#8d6e63] text-white px-4 py-2 rounded hover:bg-[#6d4c41] transition-colors shadow-sm"
                >
                    ＋ 記事を書く
                </Link>
            </div>

            <div className="grid gap-6">
                {articles?.map((article) => (
                    <Link
                        href={`/learning/${article.id}`}
                        key={article.id}
                        className="block bg-white rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow overflow-hidden"
                    >
                        {article.image_url && (
                            <div className="w-full h-48 bg-gray-100">
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-[#4a4a4a] mb-2">{article.title}</h2>
                            <div className="text-sm text-gray-500 mb-4 flex gap-3">
                                <span>✍️ {article.profiles && !Array.isArray(article.profiles) ? (article.profiles as any).display_name : 'Unknown'}</span>
                                <span>🕒 {article.created_at ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: ja }) : ''}</span>
                            </div>
                            <div className="text-gray-700 whitespace-pre-wrap line-clamp-3">
                                {article.content}
                            </div>
                        </div>
                    </Link>
                ))}
                {articles?.length === 0 && (
                    <div className="text-center py-10">まだ記事がありません。一番乗りで投稿しましょう！</div>
                )}
            </div>
        </main>
    );
}
