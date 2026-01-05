'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createJob(formData: FormData) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        console.error('User not authenticated')
        return { error: 'ログインが必要です' }
    }

    const title = formData.get('title') as string
    const location = formData.get('location') as string
    const salary = formData.get('salary') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string

    if (!title || !location || !salary) {
        return { error: '必須項目が未入力です' }
    }

    const jobData = {
        title,
        location,
        salary,
        description,
        image_url,
        created_by: user.id
    }

    console.log('Creating job:', jobData)

    const { error } = await supabase.from('jobs').insert(jobData)

    if (error) {
        console.error("Job creation error:", error)
        return { error: '求人の作成に失敗しました: ' + error.message }
    }

    revalidatePath('/jobs')
    redirect('/jobs')
}

export async function applyToJob(jobId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    // Check if already applied
    const { data: existingApp } = await supabase.from('applications')
        .select('*')
        .eq('job_id', jobId)
        .eq('applicant_id', user.id)
        .single()

    if (existingApp) {
        return { error: 'すでに応募済みです' }
    }

    const { error } = await supabase.from('applications').insert({
        job_id: jobId,
        applicant_id: user.id,
        status: 'pending'
    })

    if (error) {
        return { error: '応募に失敗しました: ' + error.message }
    }

    revalidatePath(`/jobs/${jobId}`)
    return { success: true }
}


export async function updateJob(jobId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    // Role, Ownership check is handled by RLS, but we can check early for UX
    // ...

    const title = formData.get('title') as string
    const location = formData.get('location') as string
    const salary = formData.get('salary') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string

    const { error } = await supabase
        .from('jobs')
        .update({
            title,
            location,
            salary,
            description,
            image_url,
            updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

    if (error) {
        return { error: '更新に失敗しました: ' + error.message }
    }

    revalidatePath(`/jobs/${jobId}`)
    revalidatePath('/jobs')
    redirect(`/jobs/${jobId}`)
}

export async function deleteJob(jobId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

    if (error) {
        console.error('Delete error:', error)
        // In a server action called from a form, we might want to return state, 
        // but for a simple delete button usage, we might throw or handle differently.
        // For now, let's just log. To show error to user, we'd need useActionState or similar.
        throw new Error('削除に失敗しました: ' + error.message)
    }

    revalidatePath('/jobs')
    redirect('/jobs')
}
