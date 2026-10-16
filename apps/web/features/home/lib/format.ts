export function isPlaceholder(value?: string | null): boolean {
  return !value || value.includes("PLACEHOLDER");
}

/** Strips a leading "PLACEHOLDER ...: " reminder sentence some data files carry — the real content follows it in the same string. */
export function cleanPlaceholder(value: string | undefined | null): string | null {
  if (!value) return null;
  const stripped = value.replace(/^PLACEHOLDER[^.]*\.\s*/i, "").trim();
  return stripped.length > 0 && !isPlaceholder(stripped) ? stripped : null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonth(yyyyMm: string): string {
  const [year = "", month] = yyyyMm.split("-");
  const monthName = MONTHS[Number(month) - 1];
  return monthName ? `${monthName} ${year}` : year;
}

export function formatDateRange(startDate: string, endDate?: string | null): string {
  const start = formatMonth(startDate);
  const end = endDate ? formatMonth(endDate) : "Present";
  return `${start} — ${end}`;
}

/** Pulls the handle out of a social profile URL, e.g. https://github.com/narem-sumanth → narem-sumanth. */
export function socialHandle(url: string): string {
  try {
    const { pathname } = new URL(url);
    return pathname.replace(/^\/|\/$/g, "") || url;
  } catch {
    return url;
  }
}
