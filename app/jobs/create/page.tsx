'use client'

import { createJob } from "../actions"
import { useState } from "react"
import ImageUpload from "@/app/components/ImageUpload"

export default function CreateJobPage() {
    // We can use useActionState in React 19 / Next.js 15+ but let's stick to simple handler for now
    // or just standard form action if we don't need complex error handling, 
    // but we usually do.
    const [submitting, setSubmitting] = useState(false)

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-[#4a4a4a] mb-6">求人を掲載する</h1>

            <form action={createJob} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
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
                        onUpload={() => { }} // State handled by hidden input within component but for server action we rely on the hidden input 'image_url' which ImageUpload component should generate or we manage it here.
                    // Actually ImageUpload component in previous step had <input type="hidden" name="image_url" ... /> 
                    // So we just need to render it.
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-[#8d6e63] text-white font-bold py-3 rounded hover:bg-[#6d4c41] transition-colors"
                    >
                        求人を公開する
                    </button>
                </div>
            </form>
        </main>
    )
}
