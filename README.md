# 301 Build Recipe: Local AI

Handout for the **AI 301 live class: run AI on your own computer.** One setup prompt, pasted into Claude Code or Codex, installs Ollama, downloads the right Qwen model for the computer's memory, installs OpenCode, Agent Desktop and Agent Browser, and checks GitHub and Vercel from AI 201. Then class runs offline in OpenCode on Qwen.

Live: https://301-build-recipe-local-ai.vercel.app

- `content/setup-prompt.md`: the setup prompt.
- `src/app/page.tsx`: the page (tools, model table, prompt, model resources).
- `scripts/make-images.mjs`: regenerates the share image and icons (`node scripts/make-images.mjs`).

Model names and sizes checked on ollama.com on 12 November 2026. Re-check before class.

`npm ci`, `npm run dev`, `npm run build`.
