"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { clientApiUrl } from "@/lib/client-api";

export default function ContactPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [subjek, setSubjek] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(clientApiUrl("/interaction/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, subjek, pesan }),
      });

      if (res.ok) {
        setResult({
          success: true,
          msg: "Pesan Anda berhasil terkirim kepada Redaksi korankuid. Terima kasih!",
        });
        setNama("");
        setEmail("");
        setSubjek("");
        setPesan("");
      } else {
        setResult({
          success: false,
          msg: "Gagal mengirim pesan. Silakan coba kembali atau hubungi melalui email/telepon.",
        });
      }
    } catch {
      setResult({
        success: false,
        msg: "Terjadi kesalahan jaringan saat mengirim pesan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100">
        <Link href="/" className="hover:text-[#052962] font-semibold">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-800">Kontak Redaksi & Iklan</span>
      </nav>

      {/* Header */}
      <div className="border-b-4 border-[#052962] pb-6 mb-8">
        <span className="inline-block bg-[#052962] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xs mb-2">
          Hubungi Kami
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Kontak Redaksi & Pemasaran
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-xl">
          Sampaikan informasi peristiwa, hak jawab, opini, kerja sama publikasi, maupun pemasangan iklan media.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#dcdcdc] p-6 sm:p-8 rounded-xs shadow-2xs">
          <h2 className="font-serif text-xl font-bold text-gray-950 mb-4">
            Kirimkan Pesan Anda
          </h2>

          {result && (
            <div
              className={`p-4 rounded-xs text-xs mb-6 flex items-start space-x-2 ${
                result.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              )}
              <span className="leading-relaxed">{result.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full text-sm p-3 border border-gray-300 rounded focus:border-[#052962] focus:ring-1 focus:ring-[#052962] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full text-sm p-3 border border-gray-300 rounded focus:border-[#052962] focus:ring-1 focus:ring-[#052962] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Subjek / Keperluan *
              </label>
              <input
                type="text"
                required
                value={subjek}
                onChange={(e) => setSubjek(e.target.value)}
                placeholder="Contoh: Kerja Sama Iklan / Info Berita / Hak Jawab"
                className="w-full text-sm p-3 border border-gray-300 rounded focus:border-[#052962] focus:ring-1 focus:ring-[#052962] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Isi Pesan *
              </label>
              <textarea
                required
                rows={5}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Tuliskan pesan, rincian keperluan, atau materi informasi Anda..."
                className="w-full text-sm p-3 border border-gray-300 rounded focus:border-[#052962] focus:ring-1 focus:ring-[#052962] outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-[#052962] hover:bg-[#041f4a] text-white text-xs font-bold uppercase tracking-wider py-3 px-8 rounded transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Mengirim..." : "Kirim Pesan Sekarang"}</span>
            </button>
          </form>
        </div>

        {/* Right: Office & Editorial Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#052962] text-white p-6 sm:p-8 rounded-xs">
            <h2 className="font-serif text-xl font-bold mb-4 border-b border-blue-900 pb-3">
              Kantor Redaksi
            </h2>

            <div className="space-y-4 text-xs text-gray-200">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-0.5">Alamat Redaksi & Tata Usaha</p>
                  <p className="leading-relaxed text-gray-300">
                    Jl. Ki Maja No. 34, Way Halim, Kota Bandar Lampung, Provinsi Lampung, Indonesia 35141
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-0.5">Email Redaksi & Sirkulasi</p>
                  <p className="text-gray-300">redaksi@koranku.id</p>
                  <p className="text-gray-300">iklan@koranku.id</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-0.5">Telepon / WhatsApp</p>
                  <p className="text-gray-300">(0721) 774888 / 0812-7900-1234</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fef6eb] border border-[#f2dfce] p-6 rounded-xs">
            <h3 className="font-serif text-base font-bold text-gray-950 mb-2">
              Hak Jawab & Klarifikasi
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sesuai dengan Undang-Undang Pers No. 40 Tahun 1999 dan Kode Etik Jurnalistik, masyarakat berhak menyampaikan hak jawab maupun hak koreksi atas pemberitaan. Kirimkan surat resmi disertai identitas pemohon ke email redaksi kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
