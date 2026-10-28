"use client";

import { Bot, CornerDownLeft, Loader2, RotateCcw, Send, Sparkles, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { askAssistantAction } from "@/lib/actions/citizen";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  matchedRegion?: string | null;
  error?: boolean;
}

const suggestions = [
  "Kecamatan mana yang paling membutuhkan fasilitas sekolah?",
  "Bagaimana realisasi anggaran tahun ini?",
  "Sekolah mana yang belum memiliki ramp kursi roda?",
  "Ringkas prioritas anggaran 2027.",
];

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatPanel({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Halo ${userName}. Saya asisten data TeraPublic. Tanyakan tentang fasilitas, anggaran, pemerataan wilayah, atau status aduan yang datanya tersedia di sistem.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || loading) return;

    setMessages((current) => [...current, { id: newId(), role: "user", content: message }]);
    setInput("");
    setLoading(true);

    try {
      const result = await askAssistantAction(message);
      if (result.ok && result.answer) {
        setMessages((current) => [
          ...current,
          {
            id: newId(),
            role: "assistant",
            content: result.answer ?? "",
            citations: result.citations,
            matchedRegion: result.matchedRegion,
          },
        ]);
      } else {
        setMessages((current) => [
          ...current,
          {
            id: newId(),
            role: "assistant",
            content: result.message ?? "Asisten belum dapat menjawab pertanyaan itu.",
            error: true,
          },
        ]);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: newId(),
          role: "assistant",
          content:
            "Asisten tidak dapat dihubungi. Pastikan layanan TeraPublic sedang berjalan, lalu coba lagi.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function reset() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Halo ${userName}. Percakapan dimulai ulang. Tanyakan tentang fasilitas, anggaran, pemerataan wilayah, atau aduan.`,
      },
    ]);
    setInput("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <div className="flex min-h-[560px] flex-col overflow-hidden rounded-lg border border-border bg-surface lg:h-[calc(100dvh-15rem)] lg:min-h-[600px]">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/50 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-interactive/10 text-interactive">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-text">Asisten data TeraPublic</p>
              <p className="inline-flex items-center gap-1.5 text-[10px] text-muted">
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                Siap membaca data
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={reset} disabled={loading}>
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Percakapan baru</span>
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6"
          aria-live="polite"
          aria-label="Percakapan dengan asisten data"
        >
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {messages.length === 1 ? (
            <div className="pl-11">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                Contoh pertanyaan
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-left text-[11px] font-medium text-muted transition-colors hover:border-interactive/40 hover:text-text"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="flex items-start gap-2.5">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-interactive/10 text-interactive">
                <Bot className="size-4" aria-hidden="true" />
              </span>
              <div className="rounded-lg rounded-tl-sm border border-border bg-bg px-3.5 py-3">
                <p className="inline-flex items-center gap-2 text-[11px] text-muted">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  Membaca data TeraPublic…
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border bg-surface p-3 sm:p-4">
          <div className="flex items-end gap-2 rounded-md border border-border bg-bg p-1.5 focus-within:border-interactive focus-within:ring-2 focus-within:ring-interactive/15">
            <label htmlFor="assistant-message" className="sr-only">
              Tulis pertanyaan
            </label>
            <textarea
              ref={inputRef}
              id="assistant-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage(input);
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder="Tanyakan sesuatu tentang data publik…"
              className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-text outline-none placeholder:text-muted/70"
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              className="size-9 shrink-0"
              disabled={loading || !input.trim()}
              aria-label="Kirim pertanyaan"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
          <p className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-muted">
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="size-3" aria-hidden="true" />
              Enter untuk kirim · Shift+Enter baris baru
            </span>
            <span>{input.length}/1.000</span>
          </p>
        </form>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-semibold text-text">Yang bisa ditanyakan</h2>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted">
            <li>Jumlah dan sebaran fasilitas per kecamatan.</li>
            <li>Alokasi, realisasi, dan prioritas anggaran.</li>
            <li>Skor aksesibilitas dan wilayah tertinggal.</li>
            <li>Status aduan jika kode pelacakan disebutkan.</li>
          </ul>
        </div>

        <div className="rounded-lg border border-highlight/30 bg-highlight/8 p-5">
          <h2 className="font-display text-sm font-semibold text-text">Baca dengan kritis</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Asisten merangkum data yang tersedia di TeraPublic. Jawaban dapat tidak lengkap atau
            tertinggal dari dokumen terbaru. Verifikasi keputusan formal pada sumber resmi.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface-2/60 p-5">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            <UserRound className="size-3.5" aria-hidden="true" />
            Sesi Anda
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Percakapan berjalan dalam sesi ini dan tidak disimpan sebagai riwayat permanen di antarmuka.
          </p>
        </div>
      </aside>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      <span
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-md",
          isUser ? "bg-primary text-bg" : "bg-interactive/10 text-interactive",
          message.error && "bg-danger/10 text-danger",
        )}
      >
        {isUser ? (
          <UserRound className="size-4" aria-hidden="true" />
        ) : (
          <Bot className="size-4" aria-hidden="true" />
        )}
      </span>
      <div
        className={cn(
          "max-w-[85%] rounded-lg rounded-tl-sm border px-3.5 py-3",
          isUser
            ? "rounded-tr-sm border-primary/20 bg-primary text-bg"
            : message.error
              ? "border-danger/25 bg-danger/5"
              : "border-border bg-bg",
        )}
      >
        <p className="whitespace-pre-wrap text-xs leading-relaxed">{message.content}</p>
        {message.matchedRegion ? (
          <div className="mt-2">
            <Badge tone="info">Wilayah: {message.matchedRegion}</Badge>
          </div>
        ) : null}
        {message.citations && message.citations.length > 0 ? (
          <div className="mt-3 border-t border-border pt-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Sumber</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {message.citations.map((citation) => (
                <span
                  key={citation}
                  className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium text-muted"
                >
                  {citation}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
