import React, { useState } from 'react';
import { Copy, Check, Code2, Sparkles, Layers } from 'lucide-react';

export const InteractiveDocs: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'laravel' | 'curl' | 'javascript' | 'python'>('laravel');

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const codeSnippets = {
    laravel: `// 🚀 Contoh Pemanggilan di Controller Laravel (Project Lain)
use App\\Services\\HR\\NotificationService;

public function approveApplicant(Request $request, $id)
{
    // 1. Logika Update Data
    $applicant = Applicant::findOrFail($id);
    $applicant->update(['status' => 'approved']);

    // 2. Tembak Notification Hub (Dinamis Sesuai Route & Placeholders)
    NotificationService::send([
        'user_id'      => $applicant->created_by, // Target Penerima
        'title'        => 'Pengajuan Pelamar Disetujui',
        'message'      => "Berkas pelamar {$applicant->name} telah disetujui.",
        'type'         => 'success',              // info, warning, approval, success, danger
        'module'       => 'applicant',
        'route_event'  => 'approval_applicant',  // Mencocokkan event_code di hr_notification_routes
        'reference_id' => $applicant->id,         // Otomatis menggantikan {id} pada URL Target
        'payload'      => [
            'id'       => $applicant->id,
            'code'     => $applicant->code,
            'category' => 'hr_recruitment'
        ],
        'channels'     => ['database', 'fcm'],    // Saluran kirim: DB Inbox + Push FCM
    ]);

    return response()->json(['message' => 'Approved & Notification Sent!']);
}`,
    curl: `# 🌐 Contoh HTTP REST API (cURL) dari Website / Sistem Apapun
curl -X POST "http://localhost/rs_keuanganGL_V2/api/hr/notification/push" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "event_code": "approval_applicant",
    "user_id": 152,
    "title": "Notifikasi Approval Pelamar",
    "message": "User Manager telah memproses berkas pelamar Budi.",
    "type": "approval",
    "reference_id": 25,
    "payload": {
      "id": 25,
      "code": "APP-2026-001"
    },
    "channels": ["database", "fcm"]
  }'`,
    javascript: `// ⚡ Contoh di JavaScript / TypeScript (Node.js / React / Vue)
import axios from 'axios';

async function triggerNotification() {
  const response = await axios.post('http://localhost/rs_keuanganGL_V2/api/hr/notification/push', {
    event_code: 'approval_applicant',
    user_id: 152,
    title: 'Pelamar Baru Membutuhkan Review',
    message: 'Ada 1 berkas pelamar baru masuk posisi Frontend Developer.',
    type: 'approval',
    reference_id: 25,
    payload: {
      id: 25,
      code: 'APBT-20260908'
    },
    channels: ['database', 'fcm']
  });

  console.log('Notif Response:', response.data);
}`,
    python: `# 🐍 Contoh di Python (Django / Flask / FastApi / Scripts)
import requests

url = "http://localhost/rs_keuanganGL_V2/api/hr/notification/push"
payload = {
    "event_code": "approval_applicant",
    "user_id": 152,
    "title": "Alert: New Applicant Registration",
    "message": "Devi Daniaty baru saja melamar posisi Staff Operasional.",
    "type": "info",
    "reference_id": 25,
    "payload": {
        "id": 25,
        "code": "APP-009"
    },
    "channels": ["database", "fcm"]
}

response = requests.post(url, json=payload)
print(response.json())`
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Developer Integration Guide
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Centralized Notification Service
          </h1>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Satu sistem notifikasi terpusat untuk semua website, aplikasi mobile, dan microservice. Daftarkan URL rute Anda di <span className="text-indigo-400 font-semibold">Route Registry</span>, lalu tembak notifikasi dengan satu baris fungsi!
          </p>
        </div>
      </div>

      {/* Step by Step Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative group hover:border-indigo-500/40 transition-all">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-500/30">
            1
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Daftarkan Event Route</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Daftarkan <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">event_code</code> unik beserta target URL tujuan untuk Website dan Mobile App.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative group hover:border-indigo-500/40 transition-all">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-lg mb-4 border border-purple-500/30">
            2
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Gunakan Placeholder Dinamis</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Gunakan placeholder seperti <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded">&#123;id&#125;</code> atau <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded">&#123;code&#125;</code> pada URL. Sistem akan otomatis mereplace nilainya saat event dikirim.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative group hover:border-indigo-500/40 transition-all">
          <div className="w-10 h-10 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold text-lg mb-4 border border-pink-500/30">
            3
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Tembak Notifikasi (Push)</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Panggil API / Controller dari project manapun. Notifikasi langsung disimpan di database inbox dan dikirimkan via Firebase Cloud Messaging (FCM).
          </p>
        </div>
      </div>

      {/* Field Dictionary Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Kamus Field Database (hr_notification_routes)</h2>
            <p className="text-xs text-slate-400">Penjelasan detail setiap kolom yang wajib/opsional didaftarkan</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Nama Field</th>
                <th className="py-3.5 px-4 font-semibold">Tipe</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Deskripsi & Contoh Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-indigo-400">event_code</td>
                <td className="py-3 px-4 font-mono text-slate-400">VARCHAR(100)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-semibold text-[10px]">Wajib (Unique)</span></td>
                <td className="py-3 px-4 text-slate-300">
                  Kode pengenal unik untuk jenis event notifikasi. Contoh: <code className="bg-slate-950 px-1 py-0.5 rounded text-slate-200">approval_applicant</code>, <code className="bg-slate-950 px-1 py-0.5 rounded text-slate-200">audit_salary</code>, <code className="bg-slate-950 px-1 py-0.5 rounded text-slate-200">leave_request</code>.
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-purple-400">description</td>
                <td className="py-3 px-4 font-mono text-slate-400">VARCHAR(255)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-semibold text-[10px]">Opsional</span></td>
                <td className="py-3 px-4 text-slate-300">
                  Keterangan manusiawi mengenai fungsi rute notifikasi ini untuk dokumentasi admin/developer.
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-emerald-400">web_target</td>
                <td className="py-3 px-4 font-mono text-slate-400">VARCHAR(255)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">Disarankan</span></td>
                <td className="py-3 px-4 text-slate-300">
                  URL tujuan ketika notifikasi diklik pada web frontend. Mendukung placeholder dinamis seperti <code className="text-emerald-300 font-mono">&#123;id&#125;</code>.
                  <div className="mt-1 text-slate-400 font-mono text-[11px]">Contoh: https://daytrack.apbagroup.com/hrm/approval-center/applicant-approval/&#123;id&#125;/process</div>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-cyan-400">mobile_target</td>
                <td className="py-3 px-4 font-mono text-slate-400">VARCHAR(255)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-semibold text-[10px]">Opsional</span></td>
                <td className="py-3 px-4 text-slate-300">
                  Deep link atau URL target untuk aplikasi Mobile (Android/iOS).
                  <div className="mt-1 text-slate-400 font-mono text-[11px]">Contoh: app://approval/applicant/&#123;id&#125; atau URL Web</div>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-amber-400">target_roles_id</td>
                <td className="py-3 px-4 font-mono text-slate-400">TEXT (JSON Array)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-semibold text-[10px]">Opsional</span></td>
                <td className="py-3 px-4 text-slate-300">
                  ID Role pengguna yang berhak menerima notifikasi ini dalam bentuk JSON Array. Contoh: <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">[1, 51]</code> (1 = Superadmin, 51 = HRD Manager). Jika <code className="text-slate-400">NULL</code>, maka terbuka untuk semua target user yang dikirimkan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Integration Examples */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Tata Cara Pemanggilan di Project Lain</h2>
              <p className="text-xs text-slate-400">Pilih bahasa / platform untuk melihat contoh implementasi kode</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(['laravel', 'curl', 'javascript', 'python'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all ${
                  selectedLanguage === lang
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'laravel' ? 'PHP (Laravel)' : lang === 'curl' ? 'cURL (REST API)' : lang}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-950 relative">
          <button
            onClick={() => copyCode(codeSnippets[selectedLanguage], selectedLanguage)}
            className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all z-10"
          >
            {copiedIndex === selectedLanguage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Kode</span>
              </>
            )}
          </button>

          <pre className="font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto p-4 rounded-lg bg-slate-900/90 border border-slate-800/80 leading-relaxed">
            <code>{codeSnippets[selectedLanguage]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
