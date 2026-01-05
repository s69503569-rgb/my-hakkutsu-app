'use client'

import { deleteJob } from '../actions'

export default function DeleteJobButton({ jobId }: { jobId: string }) {
    return (
        <form action={async () => {
            if (confirm('本当にこの求人を削除しますか？\n※この操作は取り消せません。')) {
                await deleteJob(jobId)
            }
        }} className="inline">
            <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
            >
                削除
            </button>
        </form>
    )
}
