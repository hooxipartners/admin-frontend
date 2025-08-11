import React, {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  ChangeEvent,
} from "react";

type DateInputType = "date" | "month";

export interface InputDateProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  type?: DateInputType;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

/** yyyy-MM */
function toDashYYYYMM(v?: string): string {
  if (!v) return "";
  const compact = v.replaceAll("-", "");
  if (/^\d{6}$/.test(compact)) return `${compact.slice(0, 4)}-${compact.slice(4, 6)}`;
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(v)) return v.slice(0, 7);
  return "";
}

/** yyyyMM */
function toCompactYYYYMM(v?: string): string {
  if (!v) return "";
  const dash = toDashYYYYMM(v);
  if (!dash) return "";
  return dash.replaceAll("-", "");
}

function emitChange(
  inputEl: HTMLInputElement | null,
  nextValue: string,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
) {
  if (!inputEl || !onChange) return;
  const e = {
    target: { value: nextValue } as any,
  } as ChangeEvent<HTMLInputElement>;
  onChange(e);
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((r) => {
      if (!r) return;
      if (typeof r === "function") r(node);
      else {
        try {
          (r as React.MutableRefObject<T | null>).current = node;
        } catch {}
      }
    });
  };
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(function InputDate(
  { type = "date", value = "", onChange, className = "", ...rest },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs<HTMLInputElement>(ref, inputRef), [ref]);

  const [open, setOpen] = useState(false);

  const now = new Date();
  const initialYear =
    Number((toDashYYYYMM(value) || "").slice(0, 4)) || now.getFullYear();
  const initialMonth =
    Number((toDashYYYYMM(value) || "").slice(5, 7)) || now.getMonth() + 1;

  const [yy, setYy] = useState(initialYear);
  const [mm, setMm] = useState(initialMonth);

  useEffect(() => {
    const dash = toDashYYYYMM(value);
    if (dash) {
      const y = Number(dash.slice(0, 4));
      const m = Number(dash.slice(5, 7));
      if (!Number.isNaN(y)) setYy(y);
      if (!Number.isNaN(m)) setMm(m);
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (ev: MouseEvent) => {
      const root = containerRef.current;
      if (root && !root.contains(ev.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const monthDisplay = useMemo(
    () => toDashYYYYMM(value) || `${yy}-${String(mm).padStart(2, "0")}`,
    [value, yy, mm]
  );

  const handleMonthPick = (y: number, m: number) => {
    const dashed = `${y}-${String(m).padStart(2, "0")}`;
    emitChange(inputRef.current, dashed, onChange);
    setYy(y);
    setMm(m);
    setOpen(false);
  };

  if (type === "month") {
    return (
      <div className="relative" ref={containerRef}>
        <div className="relative flex items-center">
          <input
            ref={mergedRef}
            type="text"
            readOnly
            value={monthDisplay}
            onClick={() => setOpen((v) => !v)}
            className={`pl-3 pr-10 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] outline-offset-[-1px] text-sm w-full h-[36px] min-h-[36px] cursor-pointer ${className}`}
            {...rest}
          />
          <span
            className="absolute right-3 cursor-pointer"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setOpen((v) => !v)}
          >
            {/* ✅ 기존 달력 아이콘 그대로 */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.6667 2.66602H3.33333C2.59695 2.66602 2 3.26297 2 3.99935V12.666C2 13.4024 2.59695 13.9993 3.33333 13.9993H12.6667C13.403 13.9993 14 13.4024 14 12.666V3.99935C14 3.26297 13.403 2.66602 12.6667 2.66602Z"
                stroke="#98A2B3"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6667 1.33398V4.00065"
                stroke="#98A2B3"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.33331 1.33398V4.00065"
                stroke="#98A2B3"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 6.66602H14"
                stroke="#98A2B3"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e7ec] rounded-[10px] shadow-lg z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setYy((v) => v - 1)}
              >
                ◀
              </button>
              <span className="text-sm font-medium">{yy}년</span>
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setYy((v) => v + 1)}
              >
                ▶
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((m) => {
                const active =
                  m === mm && yy === Number(monthDisplay.slice(0, 4));
                return (
                  <button
                    key={m}
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleMonthPick(yy, m)}
                    className={`p-2 text-sm rounded hover:bg-gray-100 ${
                      active ? "bg-[#141C25] text-white" : ""
                    }`}
                  >
                    {m}월
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      ref={mergedRef}
      type="date"
      value={value}
      onChange={(e) => onChange?.(e)}
      className={`pl-3 pr-3 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] outline-offset-[-1px] text-sm w-full h-[36px] min-h-[36px] ${className}`}
      {...rest}
    />
  );
});

export default InputDate;
