"use client";

import React, { useState } from "react";
import { CommentItem } from "@/lib/types";
import { postComment } from "@/lib/client-api";
import { formatDateIndo } from "@/lib/utils";
import { MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface CommentBoxProps {
  idart: string | number;
  initialComments?: CommentItem[];
}

export default function CommentBox({
  idart,
  initialComments = [],
}: CommentBoxProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) {
      setFeedback({ type: "error", msg: "Harap isi nama dan komentar Anda." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const success = await postComment(idart, {
      nama: name.trim(),
      email: email.trim(),
      comment: commentText.trim(),
    });

    setIsSubmitting(false);

    if (success) {
      const newComment: CommentItem = {
        idcomment: Date.now(),
        idart,
        nama: name.trim(),
        comment: commentText.trim(),
        date: new Date().toISOString(),
      };
      setComments((prev) => [newComment, ...prev]);
      setFeedback({
        type: "success",
        msg: "Terima kasih! Komentar Anda berhasil dikirim dan dipublikasikan.",
      });
      setName("");
      setEmail("");
      setCommentText("");
    } else {
      setFeedback({
        type: "error",
        msg: "Gagal mengirim komentar. Silakan coba kembali sesaat lagi.",
      });
    }
  };

  return (
    <section className="my-10 pt-8 border-t-2 border-[#052962]">
      {/* Heading */}
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-5 h-5 text-[#052962]" />
        <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-gray-950">
          Komentar Pembaca ({comments.length})
        </h3>
      </div>

      {/* List Existing Comments */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((item) => (
            <div
              key={item.idcomment}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-gray-900">
                  {item.nama}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDateIndo(item.date)}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {item.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 italic mb-8">
          Belum ada komentar untuk artikel ini. Jadilah yang pertama berkomentar!
        </p>
      )}

      {/* Form Submit Comment */}
      <div className="bg-white border border-[#dcdcdc] p-6 rounded-xs shadow-xs">
        <h4 className="font-serif text-lg font-bold text-gray-900 mb-4">
          Tulis Komentar Anda
        </h4>

        {feedback && (
          <div
            className={`p-3 rounded-xs text-xs mb-4 flex items-center space-x-2 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{feedback.msg}</span>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi"
                className="w-full text-sm p-2.5 border border-gray-300 rounded focus:border-[#052962] focus:ring-1 focus:ring-[#052962] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Email (Tidak dipublikasikan)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: nama@domain.com"
                className="w-full text-sm p-2.5 border border-gray-300 rounded focus:border-[#052962] focus:ring-1 focus:ring-[#052962] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Isi Komentar *
            </label>
            <textarea
              required
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Sampaikan pendapat Anda secara santun, beretika, dan tidak mengandung SARA..."
              className="w-full text-sm p-2.5 border border-gray-300 rounded focus:border-[#052962] focus:ring-1 focus:ring-[#052962] outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 bg-[#052962] hover:bg-[#041f4a] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Mengirim..." : "Kirim Komentar"}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
