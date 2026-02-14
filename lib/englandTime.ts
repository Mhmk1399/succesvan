// *** تغییر: تابع برای محاسبه زمان فعلی در انگلیس ***
// جایگزین کامل این تابع
export const getLondonTime = (): Date => {
  // زمان فعلی UTC را بگیریم
  const now = new Date();

  // رشته زمانی لندن را با فرمت قابل parse بگیریم (en-US برای MM/DD/YYYY)
  const londonStr = now.toLocaleString("en-US", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const [datePart, timePart] = londonStr.split(", ");
  if (!datePart || !timePart) {
    console.error("Failed to split London time string");
    return new Date(); // fallback
  }

  const [monthStr, dayStr, yearStr] = datePart.split("/");
  const [hourStr, minuteStr, secondStr] = timePart.split(":");

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JS ماه از 0 شروع می‌شود
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const second = parseInt(secondStr, 10);

  // ساخت Date با UTC برای جلوگیری از شیفت محلی
  const londonDate = new Date(Date.UTC(year, month, day, hour, minute, second));

  return londonDate;
};
