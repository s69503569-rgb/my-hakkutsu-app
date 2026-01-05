'use client'

import { createArticle } from "../actions"
import ImageUpload from "@/app/components/ImageUpload"

export default function CreateArticlePage() {
    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-[#4a4a4a] mb-6">記事を書く</h1>

            <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const result = await createArticle(formData)
                if (result && result.error) {
                    alert(result.error)
                }
            }} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                    <input
                        name="title"
                        type="text"
                        required
                        placeholder="例：エジプトでの住居探しのコツ"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                    <textarea
                        name="content"
                        required
                        rows={12}
                        placeholder="ここに知識や経験を書いてください..."
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">記事の画像（任意）</label>
                    <ImageUpload
                        onUpload={() => { }}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-[#8d6e63] text-white font-bold py-3 rounded hover:bg-[#6d4c41] transition-colors"
                    >
                        公開する
                    </button>
                </div>
            </form>
        </main>
    )
}
