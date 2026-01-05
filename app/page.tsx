import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export default async function Home() {
  const supabase = await createClient();

  // Fetch latest 3 jobs
  const { data: latestJobs } = await supabase
    .from("jobs")
    .select("*, profiles(display_name)")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="bg-[#8d6e63] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          未知なる世界を、<br />その手で掘り起こそう。
        </h1>
        <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
          「発掘Mate」は、世界中の遺跡発掘プロジェクトと、<br />
          情熱あるあなたを繋ぐプラットフォームです。
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/jobs" className="bg-white text-[#8d6e63] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
            求人を探す
          </Link>
          <Link href="/auth" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#8d6e63] transition-colors">
            メンバー登録 (無料)
          </Link>
        </div>
      </section>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto p-6 py-16">

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 text-center">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-stone-100">
            <div className="text-4xl mb-4">🏺</div>
            <h3 className="text-xl font-bold text-[#4a4a4a] mb-2">多種多様な求人</h3>
            <p className="text-gray-500">エジプトのピラミッドから、南米のジャングルまで。世界中の発掘現場があなたを待っています。</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-stone-100">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-[#4a4a4a] mb-2">学びの広場</h3>
            <p className="text-gray-500">経験者の体験談や、専門知識を共有できるコミュニティ。現場に出る前の予習に最適です。</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-stone-100">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-[#4a4a4a] mb-2">安心のサポート</h3>
            <p className="text-gray-500">プロフィールを充実させて、リクルーターからのスカウトを待つことも可能です。</p>
          </div>
        </div>

        {/* New Jobs */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-[#4a4a4a]">新着の求人</h2>
            <Link href="/jobs" className="text-[#8d6e63] font-bold hover:underline">すべて見る →</Link>
          </div>

          <div className="grid gap-6">
            {latestJobs && latestJobs.length > 0 ? (
              latestJobs.map((job) => (
                <Link href={`/jobs/${job.id}`} key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-all hover:border-[#8d6e63] block">
                  <h3 className="text-xl font-bold text-[#4a4a4a] mb-1">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>🕒 {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ja }) : ''}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded border border-dashed text-gray-400">
                現在、新着の求人はありません。
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-stone-800 text-white rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-4">あなたの知識、共有しませんか？</h2>
          <p className="mb-6 opacity-80">「学びの広場」では、発掘現場でのノウハウや体験談を募集しています。</p>
          <Link href="/learning" className="inline-block bg-[#8d6e63] text-white px-8 py-3 rounded-full font-bold hover:bg-[#7b5e55] transition-colors">
            学びの広場へ行く
          </Link>
        </section>

      </main>

      {/* フッター */}
      <footer className="bg-[#4a4a4a] text-white p-8 text-center mt-10">
        <p>&copy; 2025 発掘Mate Project. All rights reserved.</p>
      </footer>
    </div>
  )
}