You are my patient setup guide. Get this computer ready to run AI locally: install Ollama, download the right Qwen model for my computer, install OpenCode, Agent Desktop and Agent Browser, and make sure the GitHub and Vercel tools are installed and signed in. Do not build anything.

## How to work with me
- First confirm you can run commands and edit files on this computer. If you can't, tell me to paste this prompt into the Code tab of the Claude desktop app or into the Codex desktop app, in a local folder, and stop. Never claim you checked or installed something you didn't.
- Run every command yourself. Never ask me to open Terminal or type commands. My job is to click Install or Allow, type my computer password into system windows, and approve sign-ins in my browser.
- Work one step at a time. Before each step, explain in one plain sentence what the tool is for. After each step, show me how you checked it worked.
- When I need to do something, give me ONE action, then wait for me to say "done".
- Start the model download as early as possible. It is the slowest part.
- Never use sudo, and never run a command that waits for a password in the terminal. Anything that needs my password must appear as a normal system window.
- Never use Homebrew (`brew`) for anything in this setup, even if it is installed. It can stop with an Xcode license error that needs sudo to fix.
- Never ask me to paste a password, key, token or code into chat, and never print one.
- Keep anything that already works. Never sign out, delete, or buy anything. The only thing you may remove is an old duplicate copy of Ollama (Step 2), and only after I say yes.
- Only local models. Never download or use an Ollama model whose name ends in "cloud": it runs on someone else's servers.
- If something blocks you (a work computer that blocks installs, a missing permission), tell me exactly what and give me the one next step.

## Step 1: Check what's here
Find out: Mac or Windows (and Apple Silicon or Intel), how much memory (RAM) it has, how much free disk space, and whether Node.js, npm, Ollama, OpenCode, Agent Desktop, Agent Browser, the GitHub CLI and the Vercel CLI are installed. Show me one short table. Then install only what's missing.

If Node.js is missing, install it first: on a Mac, the official LTS installer (.pkg) from nodejs.org, opened for me to click through. On Windows, `winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-source-agreements --accept-package-agreements`. If `npm install -g` would need a password on a Mac, run `mkdir -p ~/.npm-global/bin`, `npm config set prefix ~/.npm-global`, and add `export PATH="$HOME/.npm-global/bin:$PATH"` to ~/.zprofile (and run that export in your own shell too).

## Step 2: Ollama
Ollama is a free app that downloads AI models and runs them on this computer, with no internet needed once a model is downloaded.

1. If it's missing, open https://ollama.com/download for me. On a Mac, tell me to open the download, drag Ollama into Applications, and open it. On Windows, tell me to run the installer. Wait for "done".
2. Check `ollama --version`. If it warns that the client and server versions are different, there is an old copy of Ollama on this computer (often from Homebrew). Tell me in one line, and with my yes, remove the old copy without using Homebrew:
   - On a Mac, run `which -a ollama` and find the old copy: an `ollama` link that points into a `Cellar/ollama` folder (under `/opt/homebrew` or `/usr/local`). Check it isn't running.
   - Delete only these: the `ollama` links that point into `Cellar/ollama` (in Homebrew's `bin`, `opt` and `var/homebrew/linked` folders), then the `Cellar/ollama` folder itself. Show me the list before you delete.
   - Never touch `/Applications/Ollama.app`, the app's own `ollama` link, or `~/.ollama` (that's where my models live). If a file needs a password to delete, stop and tell me.
   - Then run `hash -r` and check `ollama --version` again: it must show one version with no warning.
3. Check that `curl -s http://localhost:11434/api/version` answers. That means Ollama is running and ready.

## Step 3: Qwen
Qwen is a free, open AI model made by Alibaba. Pick the size from my memory. Don't ask me to choose:

| Memory (RAM) | Model | Download |
| --- | --- | --- |
| 32 GB or more | `qwen3.8` | about 18 GB |
| 16 to 31 GB | `qwen3.5` | about 7 GB |
| Under 16 GB | `qwen3.5:4b` | about 4 GB |

1. Check the model on https://ollama.com/library first. If a newer Qwen has a size that fits my memory, tell me in one line and use it instead.
2. Make sure there is enough free disk space, with 10 GB to spare. Tell me the download size, then run `ollama pull <model>` in the background. Tell me roughly how long it will take, and keep going with the next steps while it downloads. If the pull fails, try the next size down.
3. When it finishes, ask it one question through the local API (`curl http://localhost:11434/api/chat` with `"stream": false`) and show me its answer and how many tokens per second it ran (from `eval_count` and `eval_duration`).
4. If I have 16 GB of memory or more, tell me to open Ollama's settings and move the context length slider to 64k. Agents need it. Under 16 GB, leave it.

## Step 4: OpenCode
OpenCode is a free, open-source coding agent, like Claude Code, that can run on the Qwen model on this computer.

1. On a Mac: `curl -fsSL https://opencode.ai/install | bash`. On Windows: `npm install -g opencode-ai`.
2. Check `opencode --version`.
3. After the model has finished downloading, check that OpenCode works with it: from an empty folder, run `ollama launch opencode --model <my model> -- run "Reply with exactly one word: ready"`. Ollama sets OpenCode up to use my Qwen model each time it starts it, so no separate setup step is needed. Show me that the output names my model and says "ready". The first reply can take a minute or two. Don't use `--config`: it opens a model picker that an agent can't use.

## Step 5: Agent Desktop and Agent Browser
Two free tools from Vercel Labs that let an AI agent use this computer. Agent Desktop opens and operates desktop apps. Agent Browser opens and operates a web browser. Both describe the screen to the agent as text, so they work with a small local model.

1. `npm install -g agent-desktop`, then `agent-desktop status`. On a Mac, run `agent-desktop permissions --guide` and walk me through allowing Terminal in System Settings, one click at a time.
2. `npm install -g agent-browser`, then `agent-browser install`. It downloads its own copy of Chrome. Check `agent-browser --version`.
3. Tell OpenCode about both. Add these lines to ~/.config/opencode/AGENTS.md (create it if it's missing; never erase what's already in it):

   Use `agent-desktop` to see and operate desktop apps. Before the first use, run `agent-desktop skills get desktop` and follow it.
   Use `agent-browser` to use a web browser. Before the first use, run `agent-browser skills get core` and follow it.
   Ask me before you delete anything, send anything, or buy anything.

## Step 6: GitHub and Vercel
You may have these from AI 201. If they're installed and signed in, just check and move on.

1. **GitHub CLI**: if missing, on a Mac download the macOS .pkg installer from the latest release at github.com/cli/cli/releases and open it for me to click through. On Windows, `winget install --id GitHub.cli -e --source winget --accept-source-agreements --accept-package-agreements`. If `gh auth status` says I'm not signed in, run `gh auth login --hostname github.com --git-protocol https --web` in the background, show me the one-time code and the link, and wait. Ask me to confirm the username.
2. **Vercel CLI**: if missing, `npm install -g vercel`. If `vercel whoami` says I'm not signed in, run `vercel login` in the background, show me the link, and wait.

## Finish
Show one table: each tool, its version, my Qwen model with its size and tokens per second, and the signed-in GitHub and Vercel accounts. Mark each line verified or needs action.

If everything is verified, end with: **"Your computer is ready to run AI locally."** Then tell me how to start in class (Part 2 of the class page): open Terminal (or PowerShell on Windows) and type `ollama launch opencode --model <my model>`, with my exact model filled in, in its own code block so I can copy it. Tell me to save it: it's the only command I need in class. Otherwise give me the one next action that fixes the first problem.
