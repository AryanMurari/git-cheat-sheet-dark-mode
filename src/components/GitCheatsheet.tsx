"use client";

import { useMemo } from "react";

type Command = {
  cmd: string;
  desc: string;
  example?: string;
};

type Category = {
  name: string;
  color?: string; // Tailwind color token for accent border
  commands: Command[];
};

// Map limited set of accent colors to concrete utility classes so Tailwind includes them
const COLOR_DOT: Record<string, string> = {
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500", 
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
  fuchsia: "bg-fuchsia-500",
  default: "bg-zinc-500",
};

const CATEGORIES: Category[] = [
  {
    name: "Basics",
    color: "emerald",
    commands: [
      { cmd: "git init", desc: "Initialize a new Git repository in current folder" },
      { cmd: "git status", desc: "Show changed files in the working directory" },
      { cmd: "git add .", desc: "Stage all changes for the next commit" },
      { cmd: "git add <file>", desc: "Stage a specific file" },
      { cmd: "git restore --staged <file>", desc: "Unstage a file (keep changes)" },
      { cmd: "git commit -m \"message\"", desc: "Commit staged changes with a message" },
      { cmd: "git log --oneline --graph --decorate", desc: "Compact commit history with graph" },
      { cmd: "git diff", desc: "Show unstaged changes" },
      { cmd: "git diff --staged", desc: "Show staged changes" },
    ],
  },
  {
    name: "Branching",
    color: "cyan",
    commands: [
      { cmd: "git branch", desc: "List branches" },
      { cmd: "git branch <name>", desc: "Create a new branch" },
      { cmd: "git switch <name>", desc: "Switch to branch (or git checkout <name>)" },
      { cmd: "git switch -c <name>", desc: "Create and switch to new branch" },
      { cmd: "git merge <branch>", desc: "Merge a branch into current branch" },
      { cmd: "git rebase <branch>", desc: "Reapply commits on top of another base tip" },
      { cmd: "git cherry-pick <sha>", desc: "Apply the changes introduced by some existing commit" },
      { cmd: "git branch -d <name>", desc: "Delete a branch (safe)" },
      { cmd: "git branch -D <name>", desc: "Delete a branch (force)" },
    ],
  },
  {
    name: "Remote",
    color: "violet",
    commands: [
      { cmd: "git remote -v", desc: "List remote repositories" },
      { cmd: "git remote add origin <url>", desc: "Add a remote named origin" },
      { cmd: "git push -u origin <branch>", desc: "Push and set upstream for current branch" },
      { cmd: "git push", desc: "Push current branch to its upstream" },
      { cmd: "git fetch", desc: "Download objects and refs from remotes" },
      { cmd: "git pull --rebase", desc: "Fetch and rebase current branch on upstream" },
      { cmd: "git clone <url>", desc: "Clone a repository" },
    ],
  },
  {
    name: "Stash",
    color: "amber",
    commands: [
      { cmd: "git stash", desc: "Stash tracked changes" },
      { cmd: "git stash -u", desc: "Stash including untracked files" },
      { cmd: "git stash list", desc: "List all stashes" },
      { cmd: "git stash apply [stash]", desc: "Apply stash (keep in stash)" },
      { cmd: "git stash pop", desc: "Apply and drop latest stash" },
      { cmd: "git stash drop [stash]", desc: "Drop a specific stash" },
    ],
  },
  {
    name: "History & Inspect",
    color: "sky",
    commands: [
      { cmd: "git show <sha>", desc: "Show details for a specific commit" },
      { cmd: "git blame <file>", desc: "Show who changed what and when in a file" },
      { cmd: "git tag", desc: "List tags" },
      { cmd: "git tag <name>", desc: "Create a lightweight tag" },
      { cmd: "git tag -a <name> -m \"msg\"", desc: "Create an annotated tag" },
      { cmd: "git describe --tags", desc: "Describe current commit using closest tag" },
    ],
  },
  {
    name: "Undo & Fix",
    color: "rose",
    commands: [
      { cmd: "git restore <file>", desc: "Discard changes in the working directory" },
      { cmd: "git reset <file>", desc: "Unstage while keeping changes" },
      { cmd: "git reset --hard", desc: "Reset working tree and index to last commit" },
      { cmd: "git revert <sha>", desc: "Create a new commit reverting a specific commit" },
      { cmd: "git commit --amend", desc: "Amend last commit (message or staged changes)" },
      { cmd: "git reflog", desc: "Reference log of updates to HEAD (life saver)" },
    ],
  },
  {
    name: "Advanced",
    color: "fuchsia",
    commands: [
      { cmd: "git rebase -i <base>", desc: "Interactive rebase (reorder/squash/edit)" },
      { cmd: "git worktree add ../folder <branch>", desc: "Checkout another branch in a separate folder" },
      { cmd: "git submodule add <url>", desc: "Add a submodule" },
      { cmd: "git clean -fd", desc: "Remove untracked files and directories" },
      { cmd: "git bisect start", desc: "Binary search for the commit that introduced a bug" },
    ],
  },
];

export default function GitCheatsheet({ query }: { query: string }) {
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return CATEGORIES;
    const matches = (s: string) => s.toLowerCase().includes(q);
    return CATEGORIES.map(cat => ({
      ...cat,
      commands: cat.commands.filter(c => matches(c.cmd) || matches(c.desc) || matches(cat.name)),
    })).filter(cat => cat.commands.length > 0);
  }, [q]);

  return (
    <div className="space-y-6">
      {filtered.map((cat) => (
        <section key={cat.name} id={cat.name.replace(/\s+/g, "-").toLowerCase()} className="rounded-xl border bg-[var(--card)] text-[var(--foreground)]">
          <header className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b/50">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight flex items-center gap-3">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${COLOR_DOT[cat.color ?? "default"]} shadow-[0_0_0_3px] shadow-[color:var(--color-background)]`}></span>
              {cat.name}
            </h2>
            <a href={`#${cat.name.replace(/\s+/g, "-").toLowerCase()}`} className="text-[var(--muted-foreground)] text-xs hover:text-[var(--foreground)]">#</a>
          </header>
          <ul className="divide-y/50">
            {cat.commands.map((c) => (
              <li key={c.cmd} className="px-4 sm:px-5 py-3 sm:py-4 grid gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <code className="font-mono text-[13.5px] sm:text-sm whitespace-pre-wrap rounded bg-[color-mix(in_oklab,var(--color-muted)_20%,transparent)] px-2 py-1 text-[var(--primary)] border border-[color:var(--color-border)]">
                    {c.cmd}
                  </code>
                  <p className="text-sm text-[var(--muted-foreground)]">{c.desc}</p>
                </div>
                {c.example ? (
                  <pre className="mt-1 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[oklch(0.19_0_0)] text-[oklch(0.94_0_0)] px-3 py-2 text-xs sm:text-[13px]">
{`$ ${c.example}`}
                  </pre>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {filtered.length === 0 && (
        <div className="text-center text-[var(--muted-foreground)] text-sm">No commands match "{query}"</div>
      )}
    </div>
  );
}