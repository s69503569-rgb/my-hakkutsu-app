'use client'

import { useState, useEffect } from 'react'
import { updateUserRole } from '../settings/actions'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
    const [users, setUsers] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/auth')
                return
            }

            // Check if user is admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin') {
                router.push('/')
                return
            }

            setCurrentUser(user)

            // Fetch all users
            const { data: allProfiles } = await supabase
                .from('profiles')
                .select('id, display_name, role, updated_at')
                .order('updated_at', { ascending: false })

            if (allProfiles) {
                // Get emails from auth.users
                const usersWithEmails = await Promise.all(
                    allProfiles.map(async (profile) => {
                        const { data: { users } } = await supabase.auth.admin.listUsers()
                        const authUser = users.find(u => u.id === profile.id)
                        return {
                            ...profile,
                            email: authUser?.email || '不明'
                        }
                    })
                )
                setUsers(usersWithEmails)
            }

            setLoading(false)
        }

        fetchData()
    }, [router])

    const handleRoleChange = async (userId: string, newRole: string) => {
        setError(null)
        setSuccess(null)

        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('role', newRole)

        const result = await updateUserRole(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess(result.message || '権限を更新しました')
            // Refresh users list
            const supabase = createClient()
            const { data: allProfiles } = await supabase
                .from('profiles')
                .select('id, display_name, role, updated_at')
                .order('updated_at', { ascending: false })

            if (allProfiles) {
                const usersWithEmails = await Promise.all(
                    allProfiles.map(async (profile) => {
                        const { data: { users } } = await supabase.auth.admin.listUsers()
                        const authUser = users.find(u => u.id === profile.id)
                        return {
                            ...profile,
                            email: authUser?.email || '不明'
                        }
                    })
                )
                setUsers(usersWithEmails)
            }
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
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-[#333] mb-8">管理者ページ - ユーザー管理</h1>

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

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#666] uppercase tracking-wider">
                                    表示名
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#666] uppercase tracking-wider">
                                    メールアドレス
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#666] uppercase tracking-wider">
                                    現在の権限
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#666] uppercase tracking-wider">
                                    権限変更
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333]">
                                        {user.display_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333]">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'recruiter' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role === 'admin' ? '管理者' :
                                                user.role === 'recruiter' ? '採用担当' : 'ユーザー'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {user.id !== currentUser?.id ? (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-1 text-[#333] focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                                            >
                                                <option value="user">ユーザー</option>
                                                <option value="recruiter">採用担当</option>
                                                <option value="admin">管理者</option>
                                            </select>
                                        ) : (
                                            <span className="text-[#666] text-xs">自分の権限は変更できません</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-[#333] mb-2">権限について</h2>
                    <ul className="space-y-2 text-sm text-[#333]">
                        <li><strong className="text-red-600">管理者:</strong> すべての機能にアクセス可能、すべてのユーザーの権限を変更可能</li>
                        <li><strong className="text-blue-600">採用担当:</strong> 求人の作成・編集・削除、応募者の閲覧が可能</li>
                        <li><strong className="text-gray-600">ユーザー:</strong> 記事の作成・編集・削除、求人への応募が可能</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
