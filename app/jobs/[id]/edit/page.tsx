import { createClient } from "@/utils/supabase/server"
import { updateJob } from "../../actions"
import ImageUpload from "@/app/components/ImageUpload"
import { redirect } from "next/navigation"

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // Check permission
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth')

    const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

    if (!job) return <div>Job not found</div>

    // Check ownership or admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'
    const isOwner = job.created_by === user.id

    if (!isAdmin && !isOwner) {
        return <div>権限がありません</div>
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-[#4a4a4a]">求人を編集</h1>

            <form action={async (formData) => {
                'use server'
                await updateJob(id, formData)
            }} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                    <input
                        name="title"
                        type="text"
                        required
                        defaultValue={job.title}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#8d6e63] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
                    <input
                        name="location"
                        type="text"
                        required
                        defaultValue={job.location}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#8d6e63] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">給与</label>
                    <input
                        name="salary"
                        type="text"
                        required
                        defaultValue={job.salary}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#8d6e63] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">詳細内容</label>
                    <textarea
                        name="description"
                        required
                        rows={10}
                        defaultValue={job.description}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#8d6e63] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">求人画像</label>
                    <ImageUpload
                        defaultImage={job.image_url}
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
                </div>
            </form>
        </main>
    )
}
