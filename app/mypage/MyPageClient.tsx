'use client'

import { useState } from 'react'

export default function MyPageClient({
    profile,
    user,
    myApplications,
    myJobs
}: {
    profile: any
    user: any
    myApplications: any[]
    myJobs: any[]
}) {
    const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'jobs'>('profile')

    return (
        <main className="max-w-4xl mx-auto p-6">
            {/* Profile Header */}
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 text-center md:text-left">
                    {profile?.profile_photo ? (
                        <img
                            src={profile.profile_photo}
                            alt={profile?.display_name || 'プロフィール写真'}
                            className="w-24 h-24 rounded-full object-cover border-4 border-[#8d6e63]"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const fallback = document.createElement('div')
                                fallback.className = 'w-24 h-24 bg-[#8d6e63] rounded-full flex items-center justify-center text-white text-3xl font-bold'
                                fallback.textContent = profile?.display_name?.[0] || 'U'
                                e.currentTarget.parentNode?.appendChild(fallback)
                            }}
                        />
                    ) : (
                        <div className="w-24 h-24 bg-[#8d6e63] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {profile?.display_name?.[0] || 'U'}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-[#333]">{profile?.display_name || '名無しさん'}</h1>
                        <p className="text-[#666] capitalize">{profile?.role} Account</p>
                        <p className="text-sm text-[#999] mt-1 break-all">{user.email}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'profile'
                            ? 'text-[#8d6e63] border-b-2 border-[#8d6e63]'
                            : 'text-[#666] hover:text-[#333]'
                            }`}
                    >
                        プロフィール
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'applications'
                            ? 'text-[#8d6e63] border-b-2 border-[#8d6e63]'
                            : 'text-[#666] hover:text-[#333]'
                            }`}
                    >
                        応募した求人
                    </button>
                    {profile?.role === 'recruiter' && (
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'jobs'
                                ? 'text-[#8d6e63] border-b-2 border-[#8d6e63]'
                                : 'text-[#666] hover:text-[#333]'
                                }`}
                        >
                            掲載した求人
                        </button>
                    )}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-[#333]">自己紹介</h2>
                        {profile?.bio ? (
                            <p className="text-[#333] whitespace-pre-wrap leading-relaxed">
                                {profile.bio}
                            </p>
                        ) : (
                            <p className="text-[#999] italic">
                                自己紹介はまだ設定されていません。設定ページから追加できます。
                            </p>
                        )}
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-[#333]">応募した求人</h2>
                        <div className="space-y-4">
                            {myApplications && myApplications.length > 0 ? (
                                myApplications.map((app: any) => (
                                    <div key={app.id} className="border border-gray-200 p-4 rounded">
                                        <h3 className="font-bold text-[#333]">{app.jobs?.title}</h3>
                                        <p className="text-sm text-[#666]">📍 {app.jobs?.location}</p>
                                        <p className="text-xs text-[#999] mt-2">
                                            ステータス: <span className="font-medium">{app.status}</span>
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[#999] italic">まだ応募した求人はありません</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Jobs Tab (Recruiter only) */}
                {activeTab === 'jobs' && profile?.role === 'recruiter' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-[#333]">掲載した求人</h2>
                        <div className="space-y-4">
                            {myJobs && myJobs.length > 0 ? (
                                myJobs.map((job: any) => (
                                    <div key={job.id} className="border border-gray-200 p-4 rounded">
                                        <h3 className="font-bold text-[#333]">{job.title}</h3>
                                        <p className="text-sm text-[#666]">📍 {job.location}</p>
                                        <p className="text-xs text-[#999] mt-2">
                                            応募者数: {job.applications?.length || 0}人
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[#999] italic">まだ掲載した求人はありません</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
