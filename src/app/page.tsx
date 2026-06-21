import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Righteous, Outfit } from 'next/font/google'
import { ArrowRight, BookOpen, Heart, Sparkles, ShieldCheck } from 'lucide-react'

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
})

const stories = [
  {
    id: 1,
    title: "Ketika Dokter Mengatakan Tidak Ada Harapan Lagi",
    author: "Kesaksian Nyata",
    cliffhangerIndex: 2,
    content: [
      "Saya masih ingat malam itu dengan sangat jelas. Lorong rumah sakit terasa begitu dingin, sementara suara alat-alat medis terdengar seperti pengingat bahwa waktu terus berjalan. Ayah saya terbaring lemah di ruang ICU setelah mengalami komplikasi yang sangat serius.",
      "Dokter memanggil keluarga kami dan menjelaskan kondisi yang tidak pernah ingin kami dengar. \"Kami sudah melakukan yang terbaik. Bersiaplah untuk kemungkinan terburuk.\" Kalimat itu seperti menghancurkan seluruh harapan yang selama ini kami pegang.",
      "Malam demi malam kami bergantian menjaga. Saya sering duduk sendirian di kursi lorong rumah sakit, menangis sambil bertanya kepada Tuhan mengapa semua ini harus terjadi. Saya berdoa, membaca firman, bahkan meminta teman-teman gereja untuk mendoakan ayah saya. Namun setiap hari hasil pemeriksaan selalu menunjukkan kondisi yang sama.",
      "Suatu malam, ketika hampir semua orang tertidur, seorang pria tua yang tidak pernah saya kenal sebelumnya duduk di samping saya. Ia melihat saya yang sedang menunduk dan berkata dengan suara pelan, \"Nak, jangan menyerah. Besok pagi akan ada kabar yang berbeda.\"",
      "Saya terkejut. Sebelum sempat bertanya siapa dirinya, pria itu berdiri dan berjalan pergi menyusuri lorong rumah sakit.",
      "Keesokan paginya, saya datang lebih awal ke ICU. Dokter dan beberapa perawat terlihat berdiskusi sambil melihat hasil pemeriksaan terbaru. Wajah mereka tampak bingung. Salah satu dokter menghampiri kami dan berkata, \"Ada perkembangan yang tidak kami duga. Kondisi ayah Anda menunjukkan perbaikan yang signifikan.\"",
      "Saya tidak percaya dengan apa yang saya dengar. Hari demi hari kondisi ayah semakin membaik. Dalam beberapa minggu, ia sudah bisa duduk, berbicara, bahkan bercanda dengan kami.",
      "Ketika semuanya mulai tenang, saya teringat pada pria tua yang saya temui malam itu. Saya mencoba mencarinya. Saya bertanya kepada petugas keamanan, perawat, bahkan resepsionis rumah sakit. Tidak ada satu pun yang mengenalnya. Yang membuat saya semakin heran, pada malam yang saya maksud, tidak ada catatan pengunjung yang sesuai dengan ciri-ciri pria tersebut.",
      "Sampai hari ini saya tidak tahu siapa dia. Tetapi saya tahu satu hal: ketika kami merasa harapan sudah habis, Tuhan bekerja dengan cara yang tidak pernah kami bayangkan.",
      "Ayah saya kini masih hidup dan sering menceritakan kepada orang lain bahwa mukjizat tidak selalu datang dengan cara yang spektakuler. Kadang Tuhan hanya mengirimkan secercah harapan tepat pada saat kita paling membutuhkannya."
    ]
  },
  {
    id: 2,
    title: "Dompet Terakhir dan Doa yang Tidak Terdengar",
    author: "Kesaksian Nyata",
    cliffhangerIndex: 2,
    content: [
      "Tahun itu menjadi tahun terberat dalam hidup saya. Setelah delapan tahun bekerja di perusahaan yang sama, saya harus menerima kenyataan bahwa perusahaan melakukan pengurangan karyawan. Nama saya termasuk dalam daftar yang diberhentikan.",
      "Awalnya saya berpikir semuanya akan baik-baik saja. Saya masih memiliki sedikit tabungan. Namun bulan demi bulan berlalu dan pekerjaan baru tidak kunjung datang. Tagihan listrik menumpuk, cicilan rumah mulai jatuh tempo, dan anak saya membutuhkan biaya sekolah.",
      "Suatu sore saya membuka dompet dan hanya menemukan uang yang cukup untuk membeli makan satu kali. Saya duduk di dalam mobil sambil memegang uang itu. Rasanya seperti seluruh beban dunia berada di pundak saya. Saya berdoa, \"Tuhan, saya tidak tahu harus bagaimana lagi.\"",
      "Namun berbeda dari biasanya, saya tidak merasakan apa-apa. Tidak ada damai sejahtera. Tidak ada jawaban. Hanya keheningan.",
      "Malam itu saya pulang dengan perasaan hancur. Ketika tiba di rumah, saya melihat sebuah amplop putih berada di depan pintu. Tidak ada nama pengirim. Saya membukanya perlahan...",
      "Di dalamnya terdapat sejumlah uang yang jumlahnya cukup untuk memenuhi kebutuhan keluarga kami selama beberapa minggu. Namun yang membuat saya menangis bukan uang itu. Ada secarik kertas bertuliskan: \"Tuhan belum selesai menolongmu. Tetaplah percaya.\"",
      "Saya dan istri saling berpandangan. Kami tidak tahu siapa yang mengirimkannya. Beberapa hari kemudian saya mendapat panggilan wawancara kerja dari perusahaan yang sebelumnya bahkan tidak pernah saya lamar. Ternyata seorang teman lama merekomendasikan nama saya kepada perusahaan tersebut tanpa sepengetahuan saya. Sebulan kemudian saya diterima bekerja.",
      "Beberapa tahun setelah kejadian itu, saya akhirnya mengetahui siapa yang mengirim amplop tersebut. Ternyata seorang anggota gereja yang tidak terlalu dekat dengan saya. Ia bercerita bahwa saat berdoa, ia merasa tergerak untuk membantu seseorang yang sedang mengalami kesulitan, bahkan ia tidak tahu kondisi saya secara detail.",
      "Hari itu saya belajar bahwa Tuhan sering menjawab doa melalui tangan orang lain. Dan meskipun terkadang doa terasa tidak didengar, bukan berarti Tuhan sedang diam. Mungkin Ia sedang menyiapkan jawaban yang belum bisa kita lihat."
    ]
  },
  {
    id: 3,
    title: "Doa Seorang Ibu yang Tidak Pernah Berhenti",
    author: "Kesaksian Nyata",
    cliffhangerIndex: 2,
    content: [
      "Ibu saya adalah orang yang paling setia berdoa yang pernah saya kenal. Setiap malam, sebelum tidur, ia selalu membawa sebuah buku catatan kecil berwarna cokelat. Buku itu sudah kusam dan beberapa halamannya mulai lepas. Ketika saya masih kecil, saya sering melihatnya menulis sesuatu di dalam buku itu sebelum berdoa.",
      "Saat beranjak dewasa, hidup saya berubah jauh dari Tuhan. Saya mulai jarang beribadah, sering membuat keputusan yang salah, dan beberapa kali membuat keluarga saya kecewa. Ibu tidak pernah marah dengan kata-kata kasar. Ia hanya berkata, \"Ibu akan terus mendoakanmu.\" Sejujurnya saya sering menganggap ucapan itu biasa saja.",
      "Tahun demi tahun berlalu. Tidak ada perubahan dalam hidup saya. Bahkan saya semakin menjauh. Sampai suatu pagi saya menerima telepon dari rumah sakit: Ibu mengalami serangan jantung.",
      "Saya bergegas menuju rumah sakit dengan perasaan panik. Di ruang perawatan, saya melihat ibu terbaring lemah namun tetap tersenyum ketika melihat saya datang. Ia menggenggam tangan saya dan berkata, \"Jangan lupa Tuhan selalu mengasihimu.\" Beberapa hari kemudian, Tuhan memanggil ibu pulang.",
      "Itu adalah masa paling berat dalam hidup saya. Saat membereskan barang-barangnya, saya menemukan buku catatan cokelat yang selalu ia bawa. Dengan tangan bergetar, saya membukanya...",
      "Halaman demi halaman berisi daftar doa. Nama keluarga, nama tetangga, nama teman-teman gereja, lalu saya menemukan nama saya. Bukan hanya satu halaman atau sepuluh halaman, hampir separuh isi buku itu berisi doa-doa untuk saya. Ada tanggal-tanggal yang menunjukkan bahwa ibu mendoakan saya selama bertahun-tahun.",
      "Setiap halaman berisi kalimat seperti: \"Tuhan, jaga anakku. Tuhan, kembalikan hatinya kepada-Mu. Tuhan, jangan pernah tinggalkan dia meskipun dia jauh dari-Mu.\" Air mata saya tidak bisa berhenti mengalir.",
      "Untuk pertama kalinya saya menyadari betapa besar kasih seorang ibu dan betapa setianya Tuhan mendengar doa yang dipanjatkan dengan sungguh-sungguh. Hari itu menjadi titik balik hidup saya. Saya kembali mendekat kepada Tuhan, mulai melayani dan membagikan kesaksian ini kepada banyak orang.",
      "Dan setiap kali saya merasa lemah, saya selalu mengingat buku kecil milik ibu. Buku yang mengingatkan saya bahwa bahkan ketika saya menjauh, ada seorang ibu yang tidak pernah berhenti berdoa, dan ada Tuhan yang tidak pernah berhenti menunggu saya pulang."
    ]
  }
];

export default async function IndexPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'user'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role || 'user'
  }

  const isAuth = !!user

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo/NO BG.png" alt="Growth Logo" className="w-9 h-9 object-contain" />
            <span className={`${righteous.className} text-lg text-slate-800 tracking-wide hidden sm:block`}>
              Growth Community
            </span>
          </div>
          <div>
            {isAuth ? (
              <Link
                href={role === 'admin' ? '/admin' : '/user'}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
              >
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-indigo-200"
              >
                Masuk / Daftar
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 pt-16 pb-28 sm:pt-20 sm:pb-32 px-6 overflow-hidden flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-indigo-500/20 blur-[120px] rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h1 className={`${outfit.className} text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-indigo-200 tracking-tight leading-[1.1] pb-2 drop-shadow-sm`}>
            Selamat Datang di <br className="hidden md:block" /> Growth Community
          </h1>
          <p className="text-base sm:text-lg text-indigo-100/90 max-w-2xl mx-auto leading-relaxed">
            Di sini kita berbagi kesaksian, pergumulan, pertanyaan hidup, dan doa untuk saling menguatkan dalam kasih Tuhan.
          </p>
        </div>

        {/* Diagonal shape divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12 text-slate-50" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path fill="currentColor" d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path fill="currentColor" d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </header>

      {/* Main Content - 3 Story Cards Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-100 to-violet-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{story.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 relative flex-1 text-slate-600 text-sm leading-relaxed">
                <div className="space-y-4">
                  {(isAuth ? story.content : story.content.slice(0, story.cliffhangerIndex)).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}

                  {/* Cliffhanger Section for Unauthenticated */}
                  {!isAuth && (
                    <div className="relative">
                      <p className="blur-[4.5px] select-none opacity-50">
                        {story.content[story.cliffhangerIndex]}
                      </p>
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent flex flex-col items-center justify-end pb-2">
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer for Guest */}
              {!isAuth && (
                <div className="p-6 pt-0 mt-auto">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-600 py-3 rounded-xl font-bold transition-all text-sm group"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Daftar untuk Baca Akhir Cerita</span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Global CTA Section */}
        <div className="mt-24 max-w-4xl mx-auto bg-gradient-to-tr from-indigo-50 to-violet-50 border border-indigo-100 rounded-3xl p-8 sm:p-12 text-center shadow-lg shadow-indigo-100/50">
          <Heart className="w-12 h-12 text-rose-500 mx-auto mb-6 drop-shadow-md" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            {isAuth ? 'Tuhan Sungguh Luar Biasa!' : 'Ingin Membaca Akhir dari Kisah-kisah ini?'}
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            {isAuth
              ? 'Anda memiliki kisah dan kesaksian yang serupa? Jangan ragu untuk membagikannya agar bisa memberkati anggota komunitas lainnya.'
              : 'Bergabunglah dengan Growth Community untuk membaca semua kesaksian dan jadilah bagian dari komunitas ini.'}
          </p>

          <Link
            href={isAuth ? (role === 'admin' ? '/admin' : '/user') : '/login'}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-200 hover:-translate-y-0.5"
          >
            {isAuth ? 'Tulis Kesaksian di Dashboard' : 'Buat Akun Gratis Sekarang'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <img src="/logo/NO BG.png" alt="Growth Logo" className="w-6 h-6 object-contain grayscale opacity-60" />
            Growth Community
          </div>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
