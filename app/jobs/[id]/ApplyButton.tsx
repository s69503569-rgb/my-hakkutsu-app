'use client'

import { useActionState } from 'react'
import { applyToJob } from '@/app/jobs/actions'

const initialState = {
    message: '',
}

export default function ApplyButton({ jobId, hasApplied, isLoggedIn }: { jobId: string, hasApplied: boolean, isLoggedIn: boolean }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await applyToJob(jobId)
        if (result.error) {
            return { message: result.error }
        }
        if (result.success) {
            return { message: '応募が完了しました' }
        }
        return { message: '' }
    }, initialState)

    if (hasApplied) {
        return (
            <button disabled className="bg-green-100 text-green-700 px-8 py-3 rounded-full font-bold cursor-not-allowed">
                応募済み
            </button>
        )
    }

    if (!isLoggedIn) {
        return (
            <a href={`/auth?redirect=/jobs/${jobId}`} className="bg-[#8d6e63] text-white px-10 py-3 rounded-full font-bold hover:bg-[#6d4c41] transition-colors shadow-md">
                ログインして応募する
            </a>
        )
    }

    return (
        <form action={formAction} className="text-center">
            {state?.message && <p className="text-red-500 mb-2">{state.message}</p>}
            <button
                type="submit"
                disabled={isPending}
                className="bg-[#8d6e63] text-white px-10 py-3 rounded-full font-bold hover:bg-[#6d4c41] transition-colors shadow-md disabled:opacity-50"
            >
                {isPending ? '送信中...' : '応募する'}
            </button>
        </form>
    )
}
