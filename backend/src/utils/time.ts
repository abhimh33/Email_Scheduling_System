export const formatHourKey = (date: Date) => {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}-${hh}`;
};

export const msUntilNextHour = (date: Date) => {
  const next = new Date(date);
  next.setUTCMinutes(60, 0, 0);
  return next.getTime() - date.getTime();
};
