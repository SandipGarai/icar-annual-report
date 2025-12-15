function calculateYMDDuration(startStr, endStr) {
  if (!startStr || !endStr) return "";

  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start) || isNaN(end) || end < start) return "Invalid dates";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // ⭐ FIX: same-day should count as "1 day"
  if (years === 0 && months === 0 && days === 0) {
    return "1 day";
  }

  const parts = [];
  if (years > 0) parts.push(years + (years === 1 ? " year" : " years"));
  if (months > 0) parts.push(months + (months === 1 ? " month" : " months"));
  if (days > 0) parts.push(days + (days === 1 ? " day" : " days"));

  return parts.join(", ");
}

window.calculateYMDDuration = calculateYMDDuration;
