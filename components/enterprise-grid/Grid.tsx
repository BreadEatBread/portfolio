"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  columns as defaultColumns,
  generateRows,
  ROW_COUNT,
  TOTAL_WIDTH,
  type ColumnKey,
  type Employee,
} from "@/lib/enterprise-grid/data";

const ROW_HEIGHT = 36;
const CONTAINER_HEIGHT = 620;
const OVERSCAN = 6;
const HEADER_HEIGHT = 40;

type SortState = { key: ColumnKey; direction: "asc" | "desc" } | null;

function compareValue(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") {
    return a === b ? 0 : a ? -1 : 1;
  }
  return String(a).localeCompare(String(b), "ko");
}

function toCsv(rows: Employee[], keys: ColumnKey[]): string {
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const header = keys.join(",");
  const body = rows.map((r) => keys.map((k) => escape(r[k])).join(",")).join("\n");
  return header + "\n" + body;
}

export function Grid() {
  const allRows = useMemo(() => generateRows(), []);
  const [columnsState] = useState(defaultColumns);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [lastAnchor, setLastAnchor] = useState<number | null>(null);
  const [focusIdx, setFocusIdx] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [genTime, setGenTime] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t0 = performance.now();
    void allRows.length;
    setGenTime(performance.now() - t0);
  }, [allRows]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allRows;
    const q = query.trim().toLowerCase();
    return allRows.filter((r) =>
      (r.name + r.department + r.role + r.email + r.city).toLowerCase().includes(q),
    );
  }, [allRows, query]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => compareValue(a[sort.key], b[sort.key]) * dir);
  }, [filtered, sort]);

  const totalHeight = sorted.length * ROW_HEIGHT;
  const visibleStart = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const visibleEnd = Math.min(
    sorted.length,
    Math.ceil((scrollTop + CONTAINER_HEIGHT) / ROW_HEIGHT) + OVERSCAN,
  );
  const visibleRows = sorted.slice(visibleStart, visibleEnd);
  const paddingTop = visibleStart * ROW_HEIGHT;
  const paddingBottom = totalHeight - visibleEnd * ROW_HEIGHT;

  const onSortToggle = useCallback((key: ColumnKey) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }, []);

  const onRowClick = useCallback(
    (evt: ReactMouseEvent, row: Employee, indexInSorted: number) => {
      const id = row.id;
      setFocusIdx(indexInSorted);
      if (evt.shiftKey && lastAnchor !== null) {
        const start = Math.min(lastAnchor, indexInSorted);
        const end = Math.max(lastAnchor, indexInSorted);
        const range = sorted.slice(start, end + 1).map((r) => r.id);
        setSelected(new Set(range));
        return;
      }
      if (evt.metaKey || evt.ctrlKey) {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
        setLastAnchor(indexInSorted);
        return;
      }
      setSelected(new Set([id]));
      setLastAnchor(indexInSorted);
    },
    [lastAnchor, sorted],
  );

  const onCsvExport = useCallback(() => {
    const target = selected.size > 0
      ? sorted.filter((r) => selected.has(r.id))
      : sorted;
    const csv = toCsv(target, columnsState.map((c) => c.key));
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees-${target.length}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [columnsState, selected, sorted]);

  const onReset = useCallback(() => {
    setQuery("");
    setSort(null);
    setSelected(new Set());
    setLastAnchor(null);
    setFocusIdx(0);
    containerRef.current?.scrollTo({ top: 0 });
  }, []);

  // Keyboard navigation (ArrowUp/Down, PageUp/Down, Home/End, Space toggle)
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (sorted.length === 0) return;
      const move = (delta: number) => {
        e.preventDefault();
        const next = Math.max(0, Math.min(sorted.length - 1, focusIdx + delta));
        setFocusIdx(next);
        const el = containerRef.current;
        if (!el) return;
        const rowTop = next * ROW_HEIGHT;
        if (rowTop < el.scrollTop) el.scrollTop = rowTop;
        else if (rowTop + ROW_HEIGHT > el.scrollTop + CONTAINER_HEIGHT)
          el.scrollTop = rowTop + ROW_HEIGHT - CONTAINER_HEIGHT;
      };
      if (e.key === "ArrowDown") move(1);
      else if (e.key === "ArrowUp") move(-1);
      else if (e.key === "PageDown") move(Math.floor(CONTAINER_HEIGHT / ROW_HEIGHT));
      else if (e.key === "PageUp") move(-Math.floor(CONTAINER_HEIGHT / ROW_HEIGHT));
      else if (e.key === "Home") move(-focusIdx);
      else if (e.key === "End") move(sorted.length - 1 - focusIdx);
      else if (e.key === " ") {
        e.preventDefault();
        const row = sorted[focusIdx];
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(row.id)) next.delete(row.id);
          else next.add(row.id);
          return next;
        });
      }
    },
    [focusIdx, sorted],
  );

  return (
    <div className="space-y-4">
      <Toolbar
        totalRows={allRows.length}
        filteredCount={sorted.length}
        selectedCount={selected.size}
        query={query}
        onQueryChange={setQuery}
        onExport={onCsvExport}
        onReset={onReset}
        genTime={genTime}
      />

      <div
        ref={containerRef}
        role="grid"
        aria-rowcount={sorted.length + 1}
        aria-colcount={columnsState.length}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="relative rounded-lg border border-border bg-card overflow-auto focus:outline-none"
        style={{ height: CONTAINER_HEIGHT + HEADER_HEIGHT + 2 }}
      >
        <div style={{ width: TOTAL_WIDTH, minWidth: "100%" }}>
          <HeaderRow
            columns={columnsState}
            sort={sort}
            onSortToggle={onSortToggle}
          />

          {paddingTop > 0 && <div style={{ height: paddingTop }} aria-hidden />}

          {visibleRows.map((row, i) => {
            const indexInSorted = visibleStart + i;
            const isSelected = selected.has(row.id);
            const isFocused = focusIdx === indexInSorted;
            return (
              <BodyRow
                key={row.id}
                row={row}
                columns={columnsState}
                isSelected={isSelected}
                isFocused={isFocused}
                ariaRowIndex={indexInSorted + 2}
                onClick={(e) => onRowClick(e, row, indexInSorted)}
              />
            );
          })}

          {paddingBottom > 0 && (
            <div style={{ height: paddingBottom }} aria-hidden />
          )}
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed">
        <span className="text-foreground">키보드</span> · 그리드 안을 포커스한
        상태에서 <kbd className="font-mono text-[10px] px-1 border border-border rounded">↑</kbd>
        <kbd className="font-mono text-[10px] px-1 border border-border rounded">↓</kbd>
        <kbd className="font-mono text-[10px] px-1 border border-border rounded">PgUp</kbd>
        <kbd className="font-mono text-[10px] px-1 border border-border rounded">PgDn</kbd>
        <kbd className="font-mono text-[10px] px-1 border border-border rounded">Home</kbd>
        <kbd className="font-mono text-[10px] px-1 border border-border rounded">End</kbd>
        로 이동, <kbd className="font-mono text-[10px] px-1 border border-border rounded">Space</kbd>
        로 선택. 마우스는 클릭 + Shift·⌘/Ctrl 조합 사용.
      </p>
    </div>
  );
}

function Toolbar({
  totalRows,
  filteredCount,
  selectedCount,
  query,
  onQueryChange,
  onExport,
  onReset,
  genTime,
}: {
  totalRows: number;
  filteredCount: number;
  selectedCount: number;
  query: string;
  onQueryChange: (v: string) => void;
  onExport: () => void;
  onReset: () => void;
  genTime: number | null;
}) {
  const nf = new Intl.NumberFormat("ko-KR");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="이름·부서·이메일·도시 검색…"
        spellCheck={false}
        className="h-9 flex-1 min-w-[220px] rounded border border-border/60 bg-background/60 px-3 text-sm text-foreground focus:outline-none focus:border-foreground/40 transition-colors"
      />

      <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
        <span>
          <span className="text-foreground">{nf.format(filteredCount)}</span>
          <span className="text-muted">/{nf.format(totalRows)}</span>
        </span>
        <span className="text-muted">·</span>
        <span>
          선택 <span className="text-foreground">{nf.format(selectedCount)}</span>
        </span>
        {genTime !== null && (
          <>
            <span className="text-muted">·</span>
            <span title="10만 로우 생성 시간">
              gen {genTime.toFixed(1)}ms
            </span>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 h-8 font-mono text-[11px] text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <span aria-hidden>↓</span> CSV
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 h-8 font-mono text-[11px] text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <span aria-hidden>↻</span> 초기화
        </button>
      </div>
    </div>
  );
}

function HeaderRow({
  columns,
  sort,
  onSortToggle,
}: {
  columns: typeof defaultColumns;
  sort: SortState;
  onSortToggle: (k: ColumnKey) => void;
}) {
  return (
    <div
      role="row"
      className="sticky top-0 z-10 flex bg-card border-b border-border"
      style={{ height: HEADER_HEIGHT }}
    >
      {columns.map((col) => {
        const isSorted = sort?.key === col.key;
        const indicator = !isSorted ? "" : sort?.direction === "asc" ? "▲" : "▼";
        return (
          <button
            key={col.key}
            type="button"
            role="columnheader"
            aria-sort={
              isSorted
                ? sort!.direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none"
            }
            onClick={() => onSortToggle(col.key)}
            className={`flex items-center px-3 font-mono text-[11px] uppercase tracking-widest border-r border-border/60 last:border-r-0 h-full hover:text-foreground transition-colors ${
              isSorted ? "text-foreground" : "text-muted"
            } ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"}`}
            style={{ width: col.width, flexShrink: 0 }}
          >
            <span>{col.header}</span>
            {indicator && (
              <span className="ml-1.5 text-[9px] opacity-70">{indicator}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function BodyRow({
  row,
  columns,
  isSelected,
  isFocused,
  ariaRowIndex,
  onClick,
}: {
  row: Employee;
  columns: typeof defaultColumns;
  isSelected: boolean;
  isFocused: boolean;
  ariaRowIndex: number;
  onClick: (e: ReactMouseEvent) => void;
}) {
  return (
    <div
      role="row"
      aria-rowindex={ariaRowIndex}
      aria-selected={isSelected}
      onClick={onClick}
      className={`flex border-b border-border/40 cursor-pointer transition-colors ${
        isSelected
          ? "bg-foreground/[0.06]"
          : isFocused
            ? "bg-foreground/[0.02]"
            : "hover:bg-foreground/[0.02]"
      } ${isFocused ? "outline outline-1 -outline-offset-1 outline-foreground/25" : ""}`}
      style={{ height: ROW_HEIGHT }}
    >
      {columns.map((col) => {
        const raw = row[col.key];
        const text = col.render
          ? col.render(row)
          : typeof raw === "boolean"
            ? undefined
            : String(raw);
        const align =
          col.align === "right"
            ? "justify-end tabular-nums"
            : col.align === "center"
              ? "justify-center"
              : "justify-start";
        return (
          <div
            role="gridcell"
            key={col.key}
            className={`flex items-center px-3 text-[13px] border-r border-border/30 last:border-r-0 ${align} ${
              col.key === "email"
                ? "font-mono text-muted text-[12px]"
                : col.key === "id"
                  ? "font-mono text-muted"
                  : "text-foreground"
            }`}
            style={{ width: col.width, flexShrink: 0 }}
          >
            {col.key === "active" ? (
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                  row.active
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
                }`}
              >
                {row.active ? "재직" : "휴직"}
              </span>
            ) : (
              <span className="truncate">{text}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
