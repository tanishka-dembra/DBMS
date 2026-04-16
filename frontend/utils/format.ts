export function formatDate(value?: string) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function currencyLabel(value: string) {
  return {
    INR: "Rs.",
    USD: "$",
    EUR: "EUR"
  }[value] ?? value;
}
