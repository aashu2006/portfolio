"use client";
/**
 * Command palette. Opens on Cmd/Ctrl+K, or when anything dispatches the
 * "open-command-palette" event (the dock's search entry does).
 *
 * Kept event-driven rather than context-based so the dock stays a dumb
 * presentational component and layout needs no provider.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Code2,
  Copy,
  Github,
  Home,
  Layers,
  Linkedin,
  Moon,
  Search,
  Twitter,
  Youtube,
} from "lucide-react";
import { toggleTheme } from "./theme-toggle";

export const OPEN_EVENT = "open-command-palette";

const EMAIL = "akshatp439@gmail.com";

type CommandGroup = "Go" | "Actions" | "Links";

type Command = {
  id: string;
  label: string;
  group: CommandGroup;
  icon: ReactNode;
  keywords?: string;
  hint?: string;
  href?: string;
  external?: boolean;
  action?: () => void;
};

const GROUP_ORDER: CommandGroup[] = ["Go", "Actions", "Links"];

/** Subsequence match, so "sw" finds "Split-it-Wise". */
const matches = (haystack: string, query: string) => {
  if (!query) return true;
  const h = haystack.toLowerCase();
  const q = query.toLowerCase().replace(/\s+/g, "");
  let cursor = 0;
  for (const char of q) {
    cursor = h.indexOf(char, cursor);
    if (cursor === -1) return false;
    cursor += 1;
  }
  return true;
};

export const CommandPalette = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked; the address is shown in the hint either way
    }
  }, []);

  const commands: Command[] = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
        group: "Go",
        icon: <Home size={15} />,
        keywords: "about index start",
        href: "/",
      },
      {
        id: "projects",
        label: "Projects",
        group: "Go",
        icon: <Layers size={15} />,
        keywords: "split-it-wise file-lens know-your-plate build",
        href: "/projects",
      },
      {
        id: "work",
        label: "Work",
        group: "Go",
        icon: <Code2 size={15} />,
        keywords: "open source p5 kubestellar hiero oss contributions",
        href: "/work",
      },
      {
        id: "blog",
        label: "Thoughts",
        group: "Go",
        icon: <BookOpen size={15} />,
        keywords: "blog writing posts",
        href: "/blog",
      },
      {
        id: "theme",
        label: "Toggle theme",
        group: "Actions",
        icon: <Moon size={15} />,
        keywords: "dark light mode appearance",
        action: toggleTheme,
      },
      {
        id: "email",
        label: "Copy email",
        group: "Actions",
        icon: copied ? <Check size={15} /> : <Copy size={15} />,
        keywords: "contact mail reach hire",
        hint: EMAIL,
        action: copyEmail,
      },
      {
        id: "github",
        label: "GitHub",
        group: "Links",
        icon: <Github size={15} />,
        keywords: "code repos aashu2006",
        href: "https://github.com/aashu2006",
        external: true,
      },
      {
        id: "twitter",
        label: "Twitter",
        group: "Links",
        icon: <Twitter size={15} />,
        keywords: "x softaspause",
        href: "https://x.com/softaspause",
        external: true,
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        group: "Links",
        icon: <Linkedin size={15} />,
        keywords: "resume cv professional",
        href: "https://linkedin.com/in/akshatpatil107",
        external: true,
      },
      {
        id: "youtube",
        label: "YouTube",
        group: "Links",
        icon: <Youtube size={15} />,
        keywords: "videos softaspause",
        href: "https://www.youtube.com/@softaspause",
        external: true,
      },
    ],
    [copied, copyEmail]
  );

  const results = useMemo(
    () =>
      commands.filter((command) =>
        matches(`${command.label} ${command.keywords ?? ""}`, query)
      ),
    [commands, query]
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const run = useCallback(
    (command: Command) => {
      if (command.href) {
        if (command.external) {
          window.open(command.href, "_blank", "noopener,noreferrer");
        } else {
          router.push(command.href);
        }
        close();
        return;
      }
      command.action?.();
      // Copy stays open briefly so the checkmark is visible.
      if (command.id !== "email") close();
    },
    [close, router]
  );

  // Open/close triggers
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((wasOpen) => !wasOpen);
      }
    };
    const onOpenEvent = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, []);

  // Focus handling and scroll lock
  useEffect(() => {
    if (!open) {
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
      return;
    }

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // rAF so the input exists before we reach for it
    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.body.style.overflow = overflow;
      cancelAnimationFrame(frame);
    };
  }, [open]);

  // Keep the highlighted row in view
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      '[data-selected="true"]'
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [open, selected, results.length]);

  const onListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown" || (event.key === "n" && event.ctrlKey)) {
      event.preventDefault();
      setSelected((index) => (index + 1) % Math.max(results.length, 1));
      return;
    }
    if (event.key === "ArrowUp" || (event.key === "p" && event.ctrlKey)) {
      event.preventDefault();
      setSelected(
        (index) =>
          (index - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1)
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const command = results[selected];
      if (command) run(command);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          style={{ background: "var(--scrim)", backdropFilter: "blur(2px)" }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onListKeyDown}
            className="w-full max-w-lg rounded-xl overflow-hidden"
            style={{
              // Raised, not --background: on dark, a panel the same value as
              // the page behind it reads as a hole rather than a card, since
              // shadows barely register at that luminance.
              background: "var(--surface-raised)",
              border: "1px solid var(--hairline)",
              boxShadow: "var(--shadow-float)",
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: "1px solid var(--hairline)" }}
            >
              <Search size={15} className="text-faint-text flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                placeholder="Search pages, actions, links..."
                aria-label="Search commands"
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-faint-text"
              />
              <kbd className="label-micro hidden sm:block">esc</kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted-text text-center">
                  nothing matches that
                </p>
              )}

              {GROUP_ORDER.map((group) => {
                const groupResults = results.filter(
                  (command) => command.group === group
                );
                if (groupResults.length === 0) return null;

                return (
                  <div key={group} className="px-2 pb-1">
                    <p className="label-micro px-2 py-2">{group}</p>
                    {groupResults.map((command) => {
                      const index = results.indexOf(command);
                      const isSelected = index === selected;

                      return (
                        <button
                          key={command.id}
                          type="button"
                          data-selected={isSelected}
                          onMouseMove={() => setSelected(index)}
                          onClick={() => run(command)}
                          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors"
                          style={{
                            background: isSelected
                              ? "var(--hover-surface)"
                              : "transparent",
                            color: isSelected
                              ? "var(--foreground)"
                              : "var(--muted-text)",
                          }}
                        >
                          <span className="flex-shrink-0">{command.icon}</span>
                          <span className="text-sm flex-1 truncate">
                            {command.id === "email" && copied
                              ? "Copied to clipboard"
                              : command.label}
                          </span>
                          {command.hint && (
                            <span className="text-[11px] text-faint-text hidden sm:block truncate max-w-[45%]">
                              {command.hint}
                            </span>
                          )}
                          {command.external && (
                            <ArrowUpRight
                              size={13}
                              className="text-faint-text flex-shrink-0"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderTop: "1px solid var(--hairline)" }}
            >
              <span className="label-micro">akshat patil</span>
              <span className="label-micro hidden sm:block">
                ↑↓ move · ↵ select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
