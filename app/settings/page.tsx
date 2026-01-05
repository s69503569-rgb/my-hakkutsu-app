'use client'

import { useState, useEffect } from 'react'
import { updateProfile, updatePassword, updateEmail, updateFontSize, deleteAccount } from './actions'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'danger'>('profile')
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/auth')
                return
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setUser(user)
            setProfile(profileData)
            setLoading(false)
        }

        fetchUserData()
    }, [router])

    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        const formData = new FormData(e.currentTarget)
        const result = await updateProfile(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess('プロフィールを更新しました')
            // Refresh profile data
            const supabase = createClient()
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            setProfile(data)
        }
    }

    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        const formData = new FormData(e.currentTarget)
        const result = await updatePassword(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess(result.message || 'パスワードを更新しました')
            e.currentTarget.reset()
        }
    }

    const handleEmailUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        const formData = new FormData(e.currentTarget)
        const result = await updateEmail(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess(result.message || 'メールアドレスを更新しました')
        }
    }

    const handleFontSizeUpdate = async (size: string) => {
        setError(null)
        setSuccess(null)

        const result = await updateFontSize(size)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess('フォントサイズを更新しました')
            // Update body class
            document.body.className = document.body.className.replace(/font-(small|medium|large)/, `font-${size}`)
            // Refresh profile
            const supabase = createClient()
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            setProfile(data)
        }
    }

    const handleDeleteAccount = async () => {
        if (!confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
            return
        }

        if (!confirm('すべてのデータが削除されます。本当によろしいですか？')) {
            return
        }

        setError(null)
        const result = await deleteAccount()

        if (result?.error) {
            setError(result.error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfaf4] flex items-center justify-center">
                <div className="text-[#333]">読み込み中...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fdfaf4] p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[#333] mb-8">設定</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'profile'
                            ? 'text-[#8d6e63] border-b-2 border-[#8d6e63]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        プロフィール
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'security'
                            ? 'text-[#8d6e63] border-b-2 border-[#8d6e63]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        セキュリティ
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'preferences'
                            ? 'text-[#8d6e63] border-b-2 border-[#8d6e63]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        表示設定
                    </button>
                    <button
                        onClick={() => setActiveTab('danger')}
                        className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'danger'
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        アカウント削除
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded mb-6">
                        {success}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-[#333]">プロフィール設定</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#333] mb-1">
                                    表示名
                                </label>
                                <input
                                    name="displayName"
                                    type="text"
                                    required
                                    defaultValue={profile?.display_name || ''}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-[#333] focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#333] mb-1">
                                    プロフィール写真URL
                                </label>
                                <input
                                    name="profilePhoto"
                                    type="url"
                                    defaultValue={profile?.profile_photo || ''}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-[#333] focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                                />
                                <p className="text-xs text-[#666] mt-1">
                                    画像のURLを入力してください（例: Googleドライブの共有リンクなど）
                                </p>
                                {profile?.profile_photo && (
                                    <div className="mt-2">
                                        <img
                                            src={profile.profile_photo}
                                            alt="プロフィール写真プレビュー"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#333] mb-1">
                                    自己紹介（公開プロフィール）
                                </label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    defaultValue={profile?.bio || ''}
                                    placeholder="あなたについて教えてください..."
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-[#333] focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                                />
                                <p className="text-xs text-[#666] mt-1">
                                    この内容はマイページで公開されます
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#333] mb-1">
                                    メールアドレス
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    value={user?.email || ''}
                                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-[#666]"
                                />
                                <p className="text-xs text-[#666] mt-1">
                                    メールアドレスは「セキュリティ」タブで変更できます
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#333] mb-1">
                                    権限
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={profile?.role || 'user'}
                                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-[#666] capitalize"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[#8d6e63] text-white px-6 py-2 rounded hover:bg-[#6d4c41] transition-colors"
                            >
                                保存
                            </button>
                        </form>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-[#333]">パスワード変更</h2>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        新しいパスワード
                                    </label>
                                    <input
                                        name="newPassword"
                                        type="password"
                                        required
                                        minLength={6}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        新しいパスワード（確認）
                                    </label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        minLength={6}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#8d6e63] text-white px-6 py-2 rounded hover:bg-[#6d4c41] transition-colors"
                                >
                                    パスワードを変更
                                </button>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-[#333]">メールアドレス変更</h2>
                            <form onSubmit={handleEmailUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        現在のメールアドレス
                                    </label>
                                    <input
                                        type="email"
                                        disabled
                                        value={user?.email || ''}
                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        新しいメールアドレス
                                    </label>
                                    <input
                                        name="newEmail"
                                        type="email"
                                        required
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#8d6e63] text-white px-6 py-2 rounded hover:bg-[#6d4c41] transition-colors"
                                >
                                    メールアドレスを変更
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-[#333]">表示設定</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    フォントサイズ
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleFontSizeUpdate('small')}
                                        className={`px-4 py-2 rounded border ${profile?.font_size === 'small'
                                            ? 'bg-[#8d6e63] text-white border-[#8d6e63]'
                                            : 'border-gray-300 hover:border-[#8d6e63]'
                                            }`}
                                    >
                                        小
                                    </button>
                                    <button
                                        onClick={() => handleFontSizeUpdate('medium')}
                                        className={`px-4 py-2 rounded border ${profile?.font_size === 'medium' || !profile?.font_size
                                            ? 'bg-[#8d6e63] text-white border-[#8d6e63]'
                                            : 'border-gray-300 hover:border-[#8d6e63]'
                                            }`}
                                    >
                                        中
                                    </button>
                                    <button
                                        onClick={() => handleFontSizeUpdate('large')}
                                        className={`px-4 py-2 rounded border ${profile?.font_size === 'large'
                                            ? 'bg-[#8d6e63] text-white border-[#8d6e63]'
                                            : 'border-gray-300 hover:border-[#8d6e63]'
                                            }`}
                                    >
                                        大
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Danger Zone Tab */}
                {activeTab === 'danger' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-red-200">
                        <h2 className="text-xl font-bold mb-4 text-red-600">危険な操作</h2>
                        <div className="space-y-4">
                            <p className="text-[#333]">
                                アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                            >
                                アカウントを削除
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
