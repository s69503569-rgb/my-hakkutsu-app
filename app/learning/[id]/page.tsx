import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import DeleteArticleButton from "./DeleteArticleButton";

export default async function ArticleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: article, error } = await supabase
        .from("articles")
        .select("*, profiles(display_name)") // profiles: author table join usually needs foreign key set
        // Supabase foreign key on author_id -> profiles might not be automatic if not named 'profiles_id'
        // But let's assume 'author_id' ref 'auth.users' and 'profiles' is 'id'.
        // Actually, we need to join profiles on article.author_id = profiles.id
        // This usually requires a defined relationship in Supabase.
        // If not defined, we might need to fetch profile separately or rely on author_id being same as profile id.
        .eq("id", id)
        .single();

    // If the relationship isn't auto-detected, we might need to be careful.
    // However, usually `created_by` or `author_id` referencing `auth.users` allows joining `profiles` if `profiles.id` is PK and references `auth.users`.
    // Let's try simple select first. If it fails, I'll fix.

    if (error || !article) {
        return <div className="text-[#333]">記事が見つかりません</div>;
    }

    // Get Author Profile (if join didn't work beautifully, or to be safe)
    // Actually, let's assume 'profiles' join worked. If not, we can fetch.
    let authorName = 'Unknown';
    if (article.profiles) {
        authorName = (article.profiles as any).display_name;
    } else {
        // Fallback or separate fetch if needed
        const { data: p } = await supabase.from('profiles').select('display_name').eq('id', article.author_id).single();
        if (p) authorName = p.display_name;
    }

    const { data: { user } } = await supabase.auth.getUser();
    let canEdit = false;

    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const isAdmin = profile?.role === 'admin';
        const isOwner = article.author_id === user.id;
        canEdit = isAdmin || isOwner;
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-100">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-[#333]">{article.title}</h1>
                    {canEdit && (
                        <div className="flex gap-2 w-full md:w-auto">
                            <Link
                                href={`/learning/${id}/edit`}
                                className="flex-1 md:flex-none text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                                編集
                            </Link>
                            <DeleteArticleButton articleId={id} />
                        </div>
                    )}
                </div>

                {article.image_url && (
                    <div className="mb-8 rounded-lg overflow-hidden border border-gray-100">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-auto max-h-[500px] object-cover"
                        />
                    </div>
                )}

                <div className="flex items-center gap-4 text-sm text-[#666] mb-8 border-b border-gray-100 pb-6">
                    <span className="flex items-center gap-1">👤 {authorName}</span>
                    <span>🕒 {article.created_at ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: ja }) : ''}</span>
                </div>

                <div className="prose max-w-none text-[#333] mb-8 whitespace-pre-wrap leading-relaxed">
                    {article.content}
                </div>

                <div className="mt-6">
                    <Link href="/learning" className="text-[#8d6e63] hover:underline">
                        ← 記事一覧に戻る
                    </Link>
                </div>
            </div>
        </main>
    );
}
