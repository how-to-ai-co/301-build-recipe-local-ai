"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "error";

function copyWithFallback(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  return ok;
}

export function PromptBlock({
  id,
  step,
  title,
  when,
  text,
  copyLabel,
}: {
  id: string;
  step: string;
  title: string;
  when: string;
  text: string;
  copyLabel: string;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function handleCopy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = copyWithFallback(text);
    }
    setState(ok ? "copied" : "error");
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), ok ? 2500 : 6000);
  }

  const lineCount = text.trimEnd().split("\n").length;

  return (
    <section id={id} className="scroll-mt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-primary uppercase">{step}</p>
          <h2 className="mt-1 font-heading text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">{when}</p>
        </div>
        <Button
          onClick={handleCopy}
          size="lg"
          className="h-11 w-full px-5 text-sm sm:w-auto"
          aria-label={`Copy the ${title.toLowerCase()}`}
        >
          {state === "copied" ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {state === "copied" ? "Copied" : copyLabel}
        </Button>
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm">
        {state === "copied" && (
          <span className="text-primary">Copied. Paste it into Claude Code.</span>
        )}
        {state === "error" && (
          <span className="text-destructive">
            Couldn&apos;t copy automatically. Click inside the box, select all, and copy.
          </span>
        )}
      </p>

      <div className="mt-2 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b bg-secondary/35 px-4 py-2 font-mono text-xs text-muted-foreground">
          <span>{id}.md</span>
          <span>{lineCount} lines</span>
        </div>
        <pre
          tabIndex={0}
          aria-label={`${title} text`}
          className="max-h-[26rem] overflow-auto p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
        >
          {text}
        </pre>
      </div>
    </section>
  );
}
