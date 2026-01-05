'use client'

import { createJob } from "../actions"
import { useState } from "react"
import ImageUpload from "@/app/components/ImageUpload"

export default function CreateJobPage() {
    // We can use useActionState in React 19 / Next.js 15+ but let's stick to simple handler for now
    // or just standard form action if we don't need complex error handling, 
    // but we usually do.
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createJob(formData)

        setSubmitting(false)

        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-[#4a4a4a] mb-6">求人を掲載する</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded mb-6 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">求人タイトル</label>
                    <input
                        name="title"
                        type="text"
                        required
                        placeholder="例：古代遺跡の発掘スタッフ募集"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
                        <input
                            name="location"
                            type="text"
                            required
                            placeholder="例：エジプト・カイロ"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">給与 / 報酬</label>
                        <input
                            name="salary"
                            type="text"
                            required
                            placeholder="例：日給 15,000円"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">仕事内容詳細</label>
                    <textarea
                        name="description"
                        required
                        rows={6}
                        placeholder="仕事の内容、条件、応募資格などを詳しく書いてください。"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">求人画像（任意）</label>
                    <ImageUpload
                        onUpload={() => { }}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#8d6e63] text-white font-bold py-3 rounded hover:bg-[#6d4c41] transition-colors disabled:opacity-50"
                    >
                        {submitting ? '送信中...' : '求人を公開する'}
                    </button>
                </div>
            </form>
        </main>
    )
}
