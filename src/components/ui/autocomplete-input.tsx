import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteInputProps {
  value: string;
  onValueChange: (value: string) => void;
  options: AutocompleteOption[];
  onSelect: (option: AutocompleteOption) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  emptyText?: string;
  debounceMs?: number;
  inputClassName?: string;
  containerClassName?: string;
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (delay <= 0) return;

    const timeoutId = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return delay <= 0 ? value : debounced;
}

export function AutocompleteInput({
  value,
  onValueChange,
  options,
  onSelect,
  placeholder,
  icon,
  loading = false,
  emptyText = "Sin resultados",
  debounceMs = 300,
  inputClassName,
  containerClassName,
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const optionId = (optionValue: string) => `${listboxId}-option-${optionValue}`;

  const debouncedValue = useDebouncedValue(value, debounceMs);
  const isDebouncing = debounceMs > 0 && value.trim() !== debouncedValue.trim();

  const filtered = useMemo(() => {
    const query = normalize(debouncedValue.trim());
    if (!query) return [];
    return options.filter((option) => normalize(option.label).includes(query));
  }, [options, debouncedValue]);

  const [lastFiltered, setLastFiltered] = useState(filtered);
  if (lastFiltered !== filtered) {
    setLastFiltered(filtered);
    setHighlightedIndex(0);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasQuery = value.trim() !== "";
  const showDropdown = open && hasQuery;
  const isLoading = loading || isDebouncing;

  const handleSelect = (option: AutocompleteOption) => {
    onValueChange(option.label);
    onSelect(option);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filtered.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[highlightedIndex];
      if (option) handleSelect(option);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", containerClassName)}>
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
      )}

      <Input
        value={value}
        onChange={(event) => {
          setOpen(true);
          onValueChange(event.target.value);
        }}
        onFocus={() => hasQuery && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          showDropdown && filtered[highlightedIndex]
            ? optionId(filtered[highlightedIndex].value)
            : undefined
        }
        className={cn("pl-10", inputClassName)}
      />

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-popover text-popover-foreground py-1 shadow-lg"
        >
          {isLoading ? (
            <li className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 shrink-0 animate-spin" />
              Cargando...
            </li>
          ) : filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {emptyText}
            </li>
          ) : (
            filtered.map((option, index) => {
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={option.value}
                  id={optionId(option.value)}
                  role="option"
                  aria-selected={isHighlighted}
                >
                  <button
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelect(option);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "block w-full px-3 py-2 text-left text-sm",
                      isHighlighted
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteInput;
