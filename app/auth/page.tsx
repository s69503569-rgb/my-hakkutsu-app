'use client'

import { signupWithPassword, loginWithPassword, sendOtp, verifyOtp } from './actions'
import { useState } from 'react'

export default function AuthPage() {
    // Mode: 'signup', 'login', or 'otp'
    const [mode, setMode] = useState<'signup' | 'login' | 'otp'>('login')

    // For OTP flow
    const [otpStep, setOtpStep] = useState<'email' | 'verify'>('email')
    const [otpEmail, setOtpEmail] = useState('')

    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await signupWithPassword(formData)

        setIsLoading(false)

        if (result?.error) {
            setError(result.error)
        }
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await loginWithPassword(formData)

        setIsLoading(false)

        if (result?.error) {
            setError(result.error)
        }
    }

    const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        setMessage(null)
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await sendOtp(formData)

        setIsLoading(false)

        if (result?.error) {
            setError(result.error)
        } else {
            setMessage('認証コードを送信しました。メールをご確認ください。')
            setOtpStep('verify')
        }
    }

    const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        formData.append('email', otpEmail)

        const result = await verifyOtp(formData)

        setIsLoading(false)

        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfaf4] p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-100">
                <h1 className="text-2xl font-bold text-[#8d6e63] mb-6 text-center">
                    {mode === 'signup' ? 'アカウント作成' : mode === 'otp' ? 'コードでログイン' : 'おかえりなさい'}
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-blue-50 text-blue-600 p-3 rounded mb-4 text-sm">
                        {message}
                    </div>
                )}

                {mode === 'signup' && (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
                            <input
                                name="displayName"
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent"
                                placeholder="発掘 太郎"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent"
                                placeholder="user@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent"
                                placeholder="6文字以上"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（確認）</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent"
                                placeholder="6文字以上"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#8d6e63] text-white font-bold py-2 rounded hover:bg-[#6d4c41] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? '登録中...' : '登録する'}
                        </button>
                    </form>
                )}

                {mode === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent"
                                placeholder="user@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#8d6e63] text-white font-bold py-2 rounded hover:bg-[#6d4c41] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'ログイン中...' : 'ログイン'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('otp')}
                            className="w-full text-sm text-[#8d6e63] hover:underline mt-2"
                        >
                            コードでログイン
                        </button>
                    </form>
                )}

                {mode === 'otp' && (
                    <>
                        {otpStep === 'email' ? (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={otpEmail}
                                        onChange={(e) => setOtpEmail(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent"
                                        placeholder="user@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#8d6e63] text-white font-bold py-2 rounded hover:bg-[#6d4c41] transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? '送信中...' : '認証コードを送信'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                                >
                                    パスワードでログイン
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="text-sm text-gray-600 mb-4">
                                    {otpEmail} 宛に送信された6桁のコードを入力してください。
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">認証コード</label>
                                    <input
                                        name="code"
                                        type="text"
                                        required
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent tracking-widest text-center text-xl"
                                        placeholder="123456"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#8d6e63] text-white font-bold py-2 rounded hover:bg-[#6d4c41] transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? '認証中...' : 'ログイン'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpStep('email')
                                        setError(null)
                                        setMessage(null)
                                    }}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                                >
                                    メールアドレスを再入力
                                </button>
                            </form>
                        )}
                    </>
                )}

                {mode !== 'otp' && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'signup' : 'login')
                                setError(null)
                                setMessage(null)
                            }}
                            className="text-[#8d6e63] hover:underline"
                        >
                            {mode === 'login' ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
                        </button>
                    </div>
                )}

                <div className="mt-4 text-center">
                    <a href="/" className="text-gray-400 text-xs hover:text-gray-600">トップページに戻る</a>
                </div>
            </div>
        </div>
    )
}
