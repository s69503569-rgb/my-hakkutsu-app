'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function signupWithPassword(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const displayName = formData.get('displayName') as string

    if (!password || !confirmPassword || password !== confirmPassword) {
        return { error: 'パスワードが一致しません' }
    }

    if (password.length < 6) {
        return { error: 'パスワードは6文字以上である必要があります' }
    }

    // Sign up user with metadata (Trigger will create profile)
    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: displayName,
                role: 'user',
                font_size: 'medium',
            }
        }
    })

    if (error) {
        console.error('Signup error:', error)
        return { error: 'アカウント作成に失敗しました: ' + error.message }
    }

    if (!data.user) {
        return { error: 'ユーザー作成に失敗しました' }
    }

    // プロフィール作成はトリガー（DB側）で自動的に行われるため、ここでは待つだけ
    // 必要であればここで少し待機するか、チェックを追加することも可能ですが、
    // 基本的にはトリガーは即座に実行されます。

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function loginWithPassword(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'メールアドレスとパスワードを入力してください' }
    }

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login error:', error)
        return { error: 'ログイン失敗: ' + error.message }
    }

    if (!data.user) {
        return { error: 'ログインに失敗しました' }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

// Keep OTP as alternative login method
export async function sendOtp(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: false, // Don't create user via OTP, only via password signup
        },
    })

    if (error) {
        return { error: 'コード送信失敗: ' + error.message }
    }

    return { success: true }
}

export async function verifyOtp(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const token = formData.get('code') as string
    const type: EmailOtpType = 'email'

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
    })

    if (error) {
        return { error: '認証失敗: ' + error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/auth')
}
