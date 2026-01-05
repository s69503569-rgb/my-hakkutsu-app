'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createArticle(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'ログインが必要です' }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const image_url = formData.get('image_url') as string

    if (!title || !content) {
        return { error: 'タイトルと本文は必須です' }
    }

    const { error } = await supabase.from('articles').insert({
        title,
        content,
        image_url,
        author_id: user.id
    })

    if (error) {
        return { error: '記事の作成に失敗しました: ' + error.message }
    }

    revalidatePath('/learning')
    redirect('/learning')
}

export async function updateArticle(articleId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const image_url = formData.get('image_url') as string

    const { error } = await supabase
        .from('articles')
        .update({
            title,
            content,
            image_url,
            updated_at: new Date().toISOString()
        })
        .eq('id', articleId)

    if (error) {
        return { error: '更新に失敗しました: ' + error.message }
    }

    revalidatePath(`/learning/${articleId}`)
    revalidatePath('/learning')
    redirect(`/learning/${articleId}`)
}

export async function deleteArticle(articleId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

    if (error) {
        return { error: '削除に失敗しました: ' + error.message }
    }

    revalidatePath('/learning')
    redirect('/learning')
}
