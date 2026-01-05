'use client'

import { createClient } from "@/utils/supabase/client"
import { useState, useRef } from "react"

export default function ImageUpload({
    bucket = 'images',
    onUpload,
    defaultImage = ''
}: {
    bucket?: string,
    onUpload: (url: string) => void,
    defaultImage?: string
}) {
    const [imageUrl, setImageUrl] = useState(defaultImage)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const supabase = createClient()
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

            setImageUrl(data.publicUrl)
            onUpload(data.publicUrl)
        } catch (error: any) {
            alert('画像のアップロードに失敗しました: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {imageUrl ? (
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setImageUrl('')
                                onUpload('')
                            }}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        >
                            ❌
                        </button>
                    </div>
                ) : (
                    <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span className="text-gray-400">No Image</span>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {uploading ? 'アップロード中...' : '画像をアップロード'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <p className="text-xs text-gray-500">
                        JPG, PNG, GIF files are allowed
                    </p>
                </div>
            </div>
            {/* hidden input specifically for standard form submission if needed, 
                but we are using state lifting (onUpload) usually. 
                However, for server actions, a hidden input is useful. */}
            <input type="hidden" name="image_url" value={imageUrl} />
        </div>
    )
}
