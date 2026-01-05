'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    const displayName = formData.get('displayName') as string
    const profilePhoto = formData.get('profilePhoto') as string | null
    const bio = formData.get('bio') as string | null

    const updateData: any = {
        display_name: displayName,
        updated_at: new Date().toISOString(),
    }

    if (profilePhoto) {
        updateData.profile_photo = profilePhoto
    }

    if (bio !== null) {
        updateData.bio = bio
    }

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

    if (error) {
        return { error: 'プロフィール更新に失敗しました: ' + error.message }
    }

    revalidatePath('/settings')
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
        return { error: 'パスワードが一致しません' }
    }

    if (newPassword.length < 6) {
        return { error: 'パスワードは6文字以上である必要があります' }
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        return { error: 'パスワード更新に失敗しました: ' + error.message }
    }

    return { success: true, message: 'パスワードを更新しました' }
}

export async function updateEmail(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    const newEmail = formData.get('newEmail') as string

    if (!newEmail || newEmail === user.email) {
        return { error: '新しいメールアドレスを入力してください' }
    }

    const { error } = await supabase.auth.updateUser({
        email: newEmail
    })

    if (error) {
        return { error: 'メール更新に失敗しました: ' + error.message }
    }

    return { success: true, message: '確認メールを送信しました。新しいメールアドレスで確認してください。' }
}

export async function updateFontSize(fontSize: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    if (!['small', 'medium', 'large'].includes(fontSize)) {
        return { error: '無効なフォントサイズです' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            font_size: fontSize,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        console.error('Font size update error:', error)
        return { error: 'フォントサイズ更新に失敗しました: ' + error.message }
    }

    revalidatePath('/settings')
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    try {
        // Use RPC function for complete deletion
        const { error: rpcError } = await supabase.rpc('delete_user_completely')

        if (rpcError) {
            console.error('RPC deletion error:', rpcError)
            // Fallback: delete what we can
            await supabase.from('applications').delete().eq('applicant_id', user.id)
            await supabase.from('jobs').delete().eq('created_by', user.id)
            await supabase.from('profiles').delete().eq('id', user.id)
        }

        // Sign out
        await supabase.auth.signOut()
        redirect('/auth')
    } catch (error: any) {
        console.error('Account deletion error:', error)
        // Even if there's an error, sign out the user
        await supabase.auth.signOut()
        redirect('/auth')
    }
}

export async function updateUserRole(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: '権限がありません' }
    }

    const targetUserId = formData.get('userId') as string
    const newRole = formData.get('role') as string

    if (!['user', 'recruiter', 'admin'].includes(newRole)) {
        return { error: '無効な権限です' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            role: newRole,
            updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId)

    if (error) {
        return { error: '権限更新に失敗しました: ' + error.message }
    }

    revalidatePath('/settings')
    revalidatePath('/admin')
    return { success: true, message: '権限を更新しました' }
}
