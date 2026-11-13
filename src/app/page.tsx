import { readFileSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { CopyLine } from "@/components/copy-line";
import { PromptBlock } from "@/components/prompt-block";

type Tool = {
  name: string;
  logo: string;
  logo2?: string;
  what: string;
  you: string;
  agent: string;
  href: string;
  tag: "Download" | "Automatic" | "From AI 201" | "You pick";
  extra?: { label: string; href: string };
};

const DEMO_REPO = "https://github.com/how-to-ai-co/local-ai-research-demo";

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
    what: "A free, open AI model from Alibaba. It comes in sizes: the bigger it is, the smarter, but it has to fit your computer’s memory.",
    you: "Pick the size that fits",
    agent: "Downloads it and tests it",
    href: "https://ollama.com/library/qwen3.8",
    tag: "You pick",
  },
  {
    name: "OpenCode",
    logo: "opencode.svg",
    what: "A free, open-source coding agent, like Claude Code. It reads files, runs commands and builds things, using Qwen on your computer instead of a model in the cloud.",
    you: "Nothing to do",
    agent: "Installs it",
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
    extra: { label: "AI 201 setup", href: "https://ai201-prompts.vercel.app" },
  },
  {
    name: "Research demo",
    logo: "github.svg",
    what: "The class demo. A browser researches AI models on Weightclass, your local model writes a verdict on each, and Numbers fills in a table. Mac only.",
    you: "Nothing to do",
    agent: "Downloads it to your home folder",
    href: DEMO_REPO,
    tag: "Automatic",
    extra: { label: "Code on GitHub", href: DEMO_REPO },
  },
];

const models = [
  { memory: "32 GB or more", model: "Qwen 3.8", tag: "qwen3.8", size: "18 GB", needDisk: 28, bigContext: true },
  { memory: "16 to 31 GB", model: "Qwen 3.5", tag: "qwen3.5", size: "7 GB", needDisk: 17, bigContext: true },
  { memory: "Under 16 GB", model: "Qwen 3.5 small", tag: "qwen3.5:4b", size: "4 GB", needDisk: 14, bigContext: false },
];

const startCommand = (tag: string) => `cd ~/local-ai-research-demo && ollama launch opencode --model ${tag}`;

function modelPrompt(m: (typeof models)[number]) {
  return `Download the ${m.model} AI model (\`${m.tag}\`) for Ollama on this computer and check it works. Run every command yourself. Never use sudo, never ask me to type commands, and never download a model whose name ends in "cloud".

1. Check there are at least ${m.needDisk} GB of free disk space. If not, tell me and stop.
2. Run \`ollama pull ${m.tag}\` in the background. Tell me it's about ${m.size} and roughly how long it will take.
3. When it's done, ask it one question through \`curl http://localhost:11434/api/chat\` with "stream": false. Show me its answer and how many tokens per second it ran (from eval_count and eval_duration).
4. Check OpenCode works with it: run \`ollama launch opencode --model ${m.tag} -- run "Reply with exactly one word: ready"\` and show me it says ready. The first reply can take a minute or two. Don't use --config.
5. ${m.bigContext ? "Tell me to open Ollama's settings and move the context length slider to 64k. Agents need it. Wait for me to say done." : "Leave Ollama's context length as it is."}

End with "Your model is ready."`;
}

const demoPrompt =
  "Run `node research.mjs` in this folder and wait for it to finish (about 30 seconds). It opens weightclass.xyz in Chrome, filters to open AI models that fit 48 GB of memory, asks you, the local model, for a short verdict on each, and fills in a Numbers spreadsheet. Don't change any files.\n\nWhen it's done, show me the table it printed, and tell me which model you'd pick for my computer and why.";

const whyLocal = [
  { title: "Where cloud AI isn’t allowed", body: "Law, healthcare, finance, government, or any company with a no-external-AI policy. The data can’t leave, so the AI comes to the data." },
  { title: "Moving data between apps", body: "The copy-and-paste work between programs that don’t connect. Companies pay for automation tools to do this. A local model reads messy input too." },
  { title: "Old software with no API", body: "Accounting programs, lab systems, internal tools that only have screens and buttons. The agent uses them like a person." },
  { title: "Unlimited runs, no bill", body: "No per-task cost, so it can work through 500 files overnight." },
  { title: "No internet", body: "On a plane, in the field, or on a secure network." },
];

const localIdeas = [
  "Read invoices or receipts (PDFs in Preview) and type their totals into a spreadsheet.",
  "Turn rough meeting notes into a formatted document in Pages or Word.",
  "Draft replies to messages in Mail, saved as drafts for you to review.",
  "Fill out a form in a desktop app from a text file of details.",
  "Rename and sort files in Finder by what’s inside them.",
  "Write a text message in Messages for you to review and send.",
  "Make a to-do list in Reminders from an email you paste in.",
  "Write a weekly report in a document from several local files.",
  "Fill in a Numbers or Excel template from data in another app.",
  "Clean up a messy spreadsheet: names, dates and duplicates.",
];

const browserIdeas = [
  "Fill out a web form from a document on your computer.",
  "Read a public page and pull out the key facts.",
  "Compare a public job post against your private résumé.",
  "Check a list of websites and report which are down or changed.",
  "Gather prices or details from several public pages into one table.",
  "Test your own website by clicking through it and reporting what’s broken.",
  "Read your company’s internal web tools without that data reaching a cloud AI.",
  "Fill in a web timesheet or expense system from your local notes.",
  "Check public records or listings for updates.",
  "Walk through a multi-page signup on a test site and report each step.",
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

function Heading({ step, title }: { step?: string; title: string }) {
  return (
    <div>
      {step && <p className="font-mono text-xs tracking-widest text-primary uppercase">{step}</p>}
      <h2 className="mt-1 font-heading text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function SubStep({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-bold text-primary">{n}</span>
      <div>
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </li>
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
        <div className="border-b py-6 sm:py-8">
          <span className="text-xl font-bold tracking-tight">How to AI<span className="text-primary">.</span></span>
        </div>

        <header className="pt-10 sm:pt-14">
          <h1 className="font-heading text-5xl leading-[1.04] font-black tracking-tight sm:text-7xl">AI on your local computer.</h1>
        </header>

        <section id="tools" className="mt-12 scroll-mt-6 border-t pt-9">
          <Heading title="Your tools" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <li key={tool.name} className="flex flex-col rounded-2xl border bg-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex gap-3"><Logo file={tool.logo} size={48} />{tool.logo2 && <Logo file={tool.logo2} size={48} />}</span>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase ${tool.tag === "Download" || tool.tag === "You pick" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {tool.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  <a href={tool.href} className={linkClass}>{tool.name}</a>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.what}</p>
                {tool.extra && (
                  <a href={tool.extra.href} className="mt-3 inline-flex items-center gap-1 self-start font-mono text-[11px] text-primary hover:underline">
                    {tool.extra.label} <ArrowUpRight className="size-3" aria-hidden="true" />
                  </a>
                )}
                <dl className="mt-5 space-y-1.5 border-t pt-4 text-xs">
                  <div className="grid grid-cols-[4.5rem_1fr] gap-2"><dt className="font-mono text-muted-foreground">You</dt><dd>{tool.you}</dd></div>
                  <div className="grid grid-cols-[4.5rem_1fr] gap-2"><dt className="font-mono text-muted-foreground">Agent</dt><dd>{tool.agent}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 border-t pt-9">
          <PromptBlock id="setup-prompt" step="Step 1" title="Setup prompt" when="Paste this into Claude Code." text={setupPrompt} copyLabel="Copy setup prompt" />
        </section>

        <section id="model" className="mt-14 scroll-mt-6 border-t pt-9">
          <Heading step="Step 2" title="Which model to select" />
          <p className="mt-2 max-w-2xl text-muted-foreground">Pick the one for your computer’s memory. The setup prompt tells you which. Paste its prompt into Claude Code.</p>
          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            {models.map((m) => (
              <li key={m.tag} className="flex flex-col rounded-2xl border bg-card p-5 sm:p-6">
                <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">If you have</p>
                <p className="mt-1 font-heading text-3xl font-black tracking-tight">{m.memory}</p>
                <p className="mt-4 text-lg font-bold tracking-tight">{m.model}</p>
                <p className="mt-0.5 text-sm text-muted-foreground"><code className="font-mono text-foreground">{m.tag}</code> · {m.size} download</p>
                <div className="mt-5 flex-1" />
                <CopyLine text={modelPrompt(m)} label={`${m.model} download prompt`} caption="Download prompt" />
              </li>
            ))}
          </ul>
        </section>

        <section id="run" className="mt-14 scroll-mt-6 border-t pt-9">
          <Heading step="Step 3" title="Run the demo" />
          <ol className="mt-8 space-y-8">
            <SubStep n={1} title="See your model in Ollama">
              <p>Open the Ollama app. Your model is in its list. That’s the AI, on your computer.</p>
            </SubStep>
            <SubStep n={2} title="Open Terminal">
              <p><strong className="text-foreground">Mac:</strong> press Cmd + Space, type <em>Terminal</em>, press Enter.</p>
              <p><strong className="text-foreground">Windows:</strong> press the Start key, type <em>PowerShell</em>, press Enter.</p>
            </SubStep>
            <SubStep n={3} title="Open OpenCode">
              <p>Copy the line for the model you picked, paste it into Terminal, press Enter.</p>
              {models.map((m) => (
                <div key={m.tag}>
                  <p className="mb-1.5 font-mono text-[11px] tracking-widest uppercase">If you picked {m.model}</p>
                  <CopyLine text={startCommand(m.tag)} label={`start command for ${m.model}`} />
                </div>
              ))}
              <p>On Windows, the demo isn’t available yet. Type <code className="font-mono text-foreground">ollama launch opencode --model</code> and your model, and chat with it instead.</p>
            </SubStep>
            <SubStep n={4} title="Paste the demo prompt">
              <p>Paste it into the box at the bottom of OpenCode and press Enter. Give it a minute or two to start, and don’t type while Numbers fills in.</p>
              <CopyLine text={demoPrompt} label="demo prompt" wrap />
            </SubStep>
          </ol>
        </section>

        <section className="mt-14 border-t pt-9">
          <Heading title="Where to find models" />
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
        </section>

        <section className="mt-14 border-t pt-9">
          <Heading title="What to do with local models" />
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyLocal.map((w) => (
              <li key={w.title} className="rounded-2xl border bg-card p-5">
                <h3 className="font-bold tracking-tight">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 grid gap-10 border-t pt-9 lg:grid-cols-2">
          {[
            { title: "What to do with Agent Desktop", items: localIdeas },
            { title: "What to do with Agent Browser", items: browserIdeas },
          ].map((col) => (
            <section key={col.title}>
              <Heading title={col.title} />
              <ol className="mt-6 list-decimal space-y-2 rounded-2xl border bg-card p-5 pl-10 text-sm leading-relaxed marker:font-mono marker:text-muted-foreground">
                {col.items.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </section>
          ))}
        </div>
      </div>
      <footer className="border-t px-5 py-6 text-center text-xs text-muted-foreground">How to AI · Local AI</footer>
    </main>
  );
}
