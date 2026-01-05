import { createClient } from "@/utils/supabase/server"
import { updateArticle } from "../../actions"
import ImageUpload from "@/app/components/ImageUpload"
import { redirect } from "next/navigation"

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // Check permission
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth')

    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

    if (!article) return <div>記事が見つかりません</div>

    // Check ownership or admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'
    const isOwner = article.author_id === user.id

    if (!isAdmin && !isOwner) {
        return <div>権限がありません</div>
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-[#4a4a4a]">記事を編集</h1>

            <form action={async (formData) => {
                'use server'
                await updateArticle(id, formData)
            }} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                    <input
                        name="title"
                        type="text"
                        required
                        defaultValue={article.title}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#8d6e63] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                    <textarea
                        name="content"
                        required
                        rows={15}
                        defaultValue={article.content}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#8d6e63] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">記事の画像</label>
                    <ImageUpload
                        defaultImage={article.image_url}
                        onUpload={() => { }}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-[#8d6e63] text-white py-3 rounded hover:bg-[#6d4c41] font-bold transition-colors"
                    >
                        更新する
                    </button>
                    <a href={`/learning/${id}`} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300 font-bold text-center transition-colors">
                        キャンセル
                    </a>
                </div>
            </form>
        </main>
    )
}
