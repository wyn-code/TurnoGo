const pad = (n: number) => String(n).padStart(2, "0");

export function buildLocalDateTimeString(date: Date, time: string): string {
  const [h, m] = time.split(":");
  const local = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Number(h),
    Number(m),
    0,
  );
  const off = local.getTimezoneOffset();
  const sign = off <= 0 ? "+" : "-";
  const abs = Math.abs(off);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${h}:${m}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

export type DateTimeRange = {
  desde: string;
  hasta: string;
};

export function getLocalDayRange(date: Date): DateTimeRange {
  return {
    desde: buildLocalDateTimeString(date, "00:00"),
    hasta: buildLocalDateTimeString(date, "23:59"),
  };
}

export function getLocalWeekRange(date: Date): DateTimeRange {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return {
    desde: buildLocalDateTimeString(start, "00:00"),
    hasta: buildLocalDateTimeString(end, "23:59"),
  };
}
