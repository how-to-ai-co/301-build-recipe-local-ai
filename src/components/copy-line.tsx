"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

// A short block of text (a command or a prompt) with its own copy button.
export function CopyLine({ text, label, wrap = false, caption }: { text: string; label: string; wrap?: boolean; caption?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement("textarea");
      t.value = text;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      {caption ? (
        <span className="text-sm font-medium">{caption}</span>
      ) : (
        <pre className={`font-mono text-[14px] leading-relaxed ${wrap ? "whitespace-pre-wrap" : "overflow-auto"}`}>{text}</pre>
      )}
      <Button onClick={copy} variant="secondary" className="shrink-0" aria-label={`Copy: ${label}`}>
        {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
