import { Check, Copy, ExternalLink, Search } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/categories";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const LIMIT = 8;

type Status = "idle" | "loading" | "ready" | "error";

function rank(entry: SearchEntry, query: string, tokens: string[]): number {
  const [name, code] = entry;
  if (/^\d+$/.test(query)) {
    if (code === query) return 0;
    return code.startsWith(query) ? 1 : -1;
  }
  const lower = name.toLowerCase();
  if (!tokens.every((token) => lower.includes(token))) return -1;
  if (lower.startsWith(query)) return 0;
  if (lower.split(/[\s&/-]+/).some((word) => word.startsWith(tokens[0] ?? "")))
    return 1;
  return 2;
}

function search(entries: SearchEntry[], raw: string): SearchEntry[] {
  const query = raw.trim().toLowerCase();
  if (!query) return [];
  const tokens = query.split(/\s+/);
  return entries
    .map((entry) => ({ entry, score: rank(entry, query, tokens) }))
    .filter((item) => item.score >= 0)
    .toSorted(
      (a, b) =>
        a.score - b.score ||
        a.entry[0].length - b.entry[0].length ||
        a.entry[0].localeCompare(b.entry[0]),
    )
    .map((item) => item.entry);
}

export default function FindGenre({ suggestions }: { suggestions: string[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState<string | null>(null);
  const loading = useRef<Promise<void> | null>(null);

  const load = () => {
    loading.current ??= fetch("/codes.json")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<{ categories: SearchEntry[] }>;
      })
      .then((data) => {
        setEntries(data.categories);
        setStatus("ready");
        return undefined;
      })
      .catch(() => {
        loading.current = null;
        setStatus("error");
        return undefined;
      });
    if (status !== "ready") setStatus("loading");
  };

  const matches = useMemo(() => search(entries, query), [entries, query]);
  const shown = matches.slice(0, LIMIT);

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(
        () => setCopied((value) => (value === code ? null : value)),
        1600,
      );
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <label htmlFor={inputId} className="text-lg font-bold">
        Find a genre
      </label>
      <p className="mt-1 text-sm text-muted-foreground">
        Try a mood, a format, or a code. Results link straight to Netflix.
      </p>
      <div className="relative mt-4">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={inputId}
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          placeholder='Search "zombie" or "1515"'
          className="pl-10"
          value={query}
          onFocus={load}
          onChange={(event) => {
            load();
            setQuery(event.target.value);
          }}
        />
      </div>

      {!query.trim() && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Suggestions">
          {suggestions.map((term) => (
            <li key={term}>
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                onClick={() => {
                  load();
                  setQuery(term);
                }}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div aria-live="polite" className="mt-4">
        {status === "error" && (
          <p className="text-sm text-muted-foreground">
            The catalog didn't load. Check your connection and try again, or{" "}
            <a
              className="text-primary underline underline-offset-4"
              href="/codes"
            >
              browse every code
            </a>
            .
          </p>
        )}
        {query.trim() && status === "loading" && (
          <p className="text-sm text-muted-foreground">Loading the catalog…</p>
        )}
        {query.trim() && status === "ready" && (
          <>
            <p className="mb-2 text-xs text-muted-foreground">
              {matches.length === 0
                ? "No genres match. Try a shorter word."
                : `${matches.length.toLocaleString("en-US")} ${matches.length === 1 ? "genre" : "genres"}${matches.length > LIMIT ? `, showing the top ${LIMIT}` : ""}`}
            </p>
            <ul className="divide-y divide-border/70">
              {shown.map(([name, code, group]) => (
                <li
                  key={code}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{group}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge className="font-mono text-accent">{code}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Copy code ${code}`}
                      onClick={() => copy(code)}
                    >
                      {copied === code ? <Check /> : <Copy />}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={`https://www.netflix.com/browse/genre/${code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${name} on Netflix`}
                      >
                        <ExternalLink />
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            {matches.length > LIMIT && (
              <a
                href="/codes"
                className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
              >
                See every genre on the codes page →
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
