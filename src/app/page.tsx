import { readFileSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, WifiOff } from "lucide-react";

import { PromptBlock } from "@/components/prompt-block";

type Tool = {
  name: string;
  logo: string;
  logo2?: string;
  what: string;
  you: string;
  agent: string;
  href: string;
  tag: "Download" | "Automatic" | "From AI 201";
};

const tools: Tool[] = [
  {
    name: "Ollama",
    logo: "ollama.svg",
    what: "A free app that downloads AI models and runs them on your own computer. Once a model is downloaded, it works with the Wi-Fi off.",
    you: "Drag it into Applications",
    agent: "Opens the download, checks it runs",
    href: "https://ollama.com",
    tag: "Download",
  },
  {
    name: "Qwen",
    logo: "qwen.svg",
    what: "A free, open AI model from Alibaba. Your agent picks the size that fits your computer’s memory: Qwen 3.8 on 32 GB or more, Qwen 3.5 on 16 GB, a smaller Qwen 3.5 below that.",
    you: "Nothing to do",
    agent: "Picks the size and downloads it",
    href: "https://ollama.com/library/qwen3.8",
    tag: "Automatic",
  },
  {
    name: "OpenCode",
    logo: "opencode.svg",
    what: "A free, open-source coding agent, like Claude Code. It reads files, runs commands and builds things, using Qwen on your computer instead of a model in the cloud.",
    you: "Nothing to do",
    agent: "Installs it and connects it to Qwen",
    href: "https://opencode.ai",
    tag: "Automatic",
  },
  {
    name: "Agent Desktop",
    logo: "vercel.svg",
    what: "From Vercel Labs. Lets an AI agent open and use the apps on your computer. It describes the screen as text, so a small local model can do it.",
    you: "Allow it in System Settings",
    agent: "Installs it and walks you through",
    href: "https://github.com/vercel-labs/agent-desktop",
    tag: "Automatic",
  },
  {
    name: "Agent Browser",
    logo: "vercel.svg",
    what: "From Vercel Labs. Gives an AI agent its own web browser to open pages, click and fill in forms.",
    you: "Nothing to do",
    agent: "Installs it and its browser",
    href: "https://agent-browser.dev",
    tag: "Automatic",
  },
  {
    name: "GitHub and Vercel",
    logo: "github.svg",
    logo2: "vercel.svg",
    what: "You set these up in AI 201. Your agent checks they’re still installed and signed in. Remember: putting something live on Vercel is the moment it leaves your computer.",
    you: "Approve a sign-in if asked",
    agent: "Checks both, signs you in if needed",
    href: "https://vercel.com",
    tag: "From AI 201",
  },
];

const models = [
  { memory: "32 GB or more", model: "Qwen 3.8", tag: "qwen3.8", size: "18 GB" },
  { memory: "16 to 31 GB", model: "Qwen 3.5", tag: "qwen3.5", size: "7 GB" },
  { memory: "Under 16 GB", model: "Qwen 3.5 small", tag: "qwen3.5:4b", size: "4 GB" },
];

type Resource = { name: string; logo: string; what: string; href: string; linkLabel: string };

const resources: Resource[] = [
  {
    name: "Weightclass",
    logo: "weightclass.svg",
    what: "Which models fit on your computer. Set the memory filter to your RAM, choose open models, and see how smart each one is for its size.",
    href: "https://weightclass.xyz",
    linkLabel: "weightclass.xyz",
  },
  {
    name: "Artificial Analysis",
    logo: "artificial-analysis.png",
    what: "Independent tests of every major AI model, scored on the same exams. Use the Small filter to compare models you can run at home.",
    href: "https://artificialanalysis.ai/models/open-source",
    linkLabel: "artificialanalysis.ai",
  },
  {
    name: "Ollama library",
    logo: "ollama.svg",
    what: "Every model Ollama can download, with its sizes. Skip anything marked cloud: it runs on someone else’s servers.",
    href: "https://ollama.com/library",
    linkLabel: "ollama.com/library",
  },
];

const linkClass =
  "underline decoration-primary/40 underline-offset-4 transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

function SectionHead({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-primary uppercase">Part {n}</p>
      <h2 className="mt-1 font-heading text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">{body}</p>
    </div>
  );
}

function Logo({ file, size }: { file: string; size: number }) {
  return <Image src={`/logos/${file}`} alt="" width={size} height={size} className="object-contain" style={{ width: size, height: size }} />;
}

export default function Home() {
  const setupPrompt = readFileSync(path.join(process.cwd(), "content", "setup-prompt.md"), "utf8");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-8">
        <div className="flex items-center justify-between border-b py-6 sm:py-8">
          <span className="text-xl font-bold tracking-tight">How to AI<span className="text-primary">.</span></span>
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">AI 301 · Local AI</span>
        </div>

        <header className="pt-10 sm:pt-14">
          <p className="font-mono text-[11px] tracking-widest text-primary uppercase">Ollama · Qwen · OpenCode · Mac or Windows</p>
          <h1 className="mt-3 font-heading text-5xl leading-[1.04] font-black tracking-tight sm:text-7xl">AI that never leaves your computer.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            One prompt sets up a free, open AI model on your own computer, plus an agent that can use it.
            Then you turn the Wi-Fi off, and it keeps working.
          </p>
          <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <a href="#install" className={`inline-flex items-center gap-1.5 ${linkClass}`}>1. Your tools <ArrowDown className="size-4" aria-hidden="true" /></a>
            <a href="#run" className={`inline-flex items-center gap-1.5 ${linkClass}`}>2. Go offline <ArrowDown className="size-4" aria-hidden="true" /></a>
          </nav>
        </header>

        <section id="install" className="mt-12 scroll-mt-6 border-t pt-9">
          <SectionHead n="1" title="Your tools" body="Everything runs on your computer. Your AI agent installs it all with the setup prompt. The model download is big, so run it before class, at home." />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <li key={tool.name} className="flex flex-col rounded-2xl border bg-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex gap-3"><Logo file={tool.logo} size={48} />{tool.logo2 && <Logo file={tool.logo2} size={48} />}</span>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase ${tool.tag === "Download" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {tool.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  <a href={tool.href} className={linkClass}>{tool.name}</a>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.what}</p>
                <dl className="mt-5 space-y-1.5 border-t pt-4 text-xs">
                  <div className="grid grid-cols-[4.5rem_1fr] gap-2"><dt className="font-mono text-muted-foreground">You</dt><dd>{tool.you}</dd></div>
                  <div className="grid grid-cols-[4.5rem_1fr] gap-2"><dt className="font-mono text-muted-foreground">Agent</dt><dd>{tool.agent}</dd></div>
                </dl>
              </li>
            ))}
          </ul>

          <div className="mt-8 overflow-hidden rounded-2xl border bg-secondary/30">
            <div className="border-b p-5 sm:p-6">
              <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Which Qwen you get</p>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed">
                Your agent checks your computer’s memory and picks for you. Bigger is smarter, but it has to fit.
              </p>
            </div>
            <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {models.map((m) => (
                <div key={m.tag} className="p-5 sm:p-6">
                  <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">{m.memory}</p>
                  <p className="mt-1.5 text-lg font-bold tracking-tight">{m.model}</p>
                  <p className="mt-1 text-sm text-muted-foreground"><code className="font-mono text-foreground">{m.tag}</code> · {m.size} download</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <PromptBlock id="setup-prompt" step="Copy and paste" title="Setup prompt" when="Paste it into Claude Code (the Code tab in the Claude desktop app) or the Codex app. This is the last time you need the cloud. You click Install and Allow, and approve sign-ins. Your agent does the rest." text={setupPrompt} copyLabel="Copy setup prompt" />
          </div>

          <div className="mt-14">
            <h3 className="font-heading text-2xl font-black tracking-tight sm:text-3xl">Where to find models</h3>
            <p className="mt-2 max-w-2xl text-muted-foreground">New open models come out every few weeks. These are the places to check what’s good and what fits.</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {resources.map((r) => (
                <li key={r.name}>
                  <a href={r.href} className="group flex h-full gap-4 rounded-2xl border bg-card p-5 transition hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    <Logo file={r.logo} size={36} />
                    <span className="flex flex-1 flex-col">
                      <span className="flex items-center justify-between gap-2 font-semibold">{r.name}<ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" /></span>
                      <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{r.what}</span>
                      <span className="mt-3 font-mono text-[11px] text-primary">{r.linkLabel}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="run" className="mt-14 scroll-mt-6 border-t pt-9">
          <SectionHead n="2" title="Go offline" body="In class. Open Terminal (PowerShell on Windows), start OpenCode on your Qwen model, then turn the Wi-Fi off." />
          <div className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b bg-secondary/35 px-4 py-2 font-mono text-xs text-muted-foreground">
              <span>Terminal</span>
              <span className="inline-flex items-center gap-1.5"><WifiOff className="size-3.5" aria-hidden="true" /> works offline</span>
            </div>
            <pre className="overflow-auto p-4 font-mono text-[15px] leading-relaxed sm:p-6">ollama launch opencode --model qwen3.5</pre>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Use the model your agent downloaded: <code className="font-mono text-foreground">qwen3.8</code>, <code className="font-mono text-foreground">qwen3.5</code> or <code className="font-mono text-foreground">qwen3.5:4b</code>.
            Type into the box at the bottom and press Enter, like Claude Code. <code className="font-mono text-foreground">/models</code> switches the model. Ctrl+C quits.
          </p>
        </section>
      </div>
      <footer className="border-t px-5 py-6 text-center text-xs text-muted-foreground">How to AI · AI 301 · Local AI</footer>
    </main>
  );
}
