/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Thai Month Names (1-indexed)
export const THAI_MONTHS = [
  "",
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม"
];

// Convert standard numbers to Thai digits if requested
export function toThaiDigits(numStr: string | number): string {
  const arabic = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const thai = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
  let result = numStr.toString();
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(arabic[i], thai[i]);
  }
  return result;
}

// Format numbers with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
}

// Convert monetary amount to Thai Baht text (e.g., สองพันแปดร้อยบาทถ้วน)
export function bahtText(num: number): string {
  if (isNaN(num) || num === null) return "ศูนย์บาทถ้วน";
  num = Math.round(num * 100) / 100;
  if (num === 0) return "ศูนย์บาทถ้วน";
  
  const numbers = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const units = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  
  let [bahtStr, satangStr] = num.toString().split(".");
  let bahtVal = parseInt(bahtStr, 10);
  let satangVal = satangStr ? parseInt(satangStr.substring(0, 2).padEnd(2, "0"), 10) : 0;
  
  let resultText = "";
  if (bahtVal > 0) {
    resultText = convertSegmentToText(bahtVal, numbers, units) + "บาท";
  }
  
  if (satangVal > 0) {
    resultText += convertSegmentToText(satangVal, numbers, units) + "สตางค์";
  } else {
    resultText += "ถ้วน";
  }
  
  return resultText;
}

function convertSegmentToText(num: number, numbers: string[], units: string[]): string {
  let text = "";
  let numStr = num.toString();
  let len = numStr.length;
  
  // For millions, segment and recurse
  if (len > 6) {
    const millionPart = parseInt(numStr.substring(0, len - 6), 10);
    const restPart = parseInt(numStr.substring(len - 6), 10);
    return convertSegmentToText(millionPart, numbers, units) + "ล้าน" + convertSegmentToText(restPart, numbers, units);
  }
  
  for (let i = 0; i < len; i++) {
    const digit = parseInt(numStr[i], 10);
    const pos = len - i - 1;
    if (digit !== 0) {
      let word = numbers[digit];
      let unit = units[pos];
      
      if (pos === 1 && digit === 1) {
        word = "";
      } else if (pos === 1 && digit === 2) {
        word = "ยี่";
      } else if (pos === 0 && digit === 1 && len > 1) {
        word = "เอ็ด";
      }
      text += word + unit;
    }
  }
  return text;
}

// Calculate duration in years, months, days between two dates
export function calculateDuration(startDateStr: string, endDateStr: string): { years: number; months: number; days: number } {
  if (!startDateStr || !endDateStr) return { years: 0, months: 0, days: 0 };
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return { years: 0, months: 0, days: 0 };
  }
  
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate() + 1; // Include start day
  
  if (days < 0) {
    months -= 1;
    // Get total days of previous month
    const prevMonthEnd = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonthEnd.getDate();
  }
  
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  
  return { years, months, days };
}

// Helper to get last day of a Thai Buddhist calendar month & year
export function getLastDayOfMonth(month: number, yearBE: number): string {
  const yearCE = yearBE - 543;
  // Get last day of month by setting day = 0 of next month
  const lastDay = new Date(yearCE, month, 0).getDate();
  return `${yearCE}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

// Formats CE date (YYYY-MM-DD) into Thai text date (e.g., 30 กันยายน 2569)
export function formatThaiDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const yearBE = parseInt(parts[0], 10) + 543;
  const monthIndex = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return `${day} ${THAI_MONTHS[monthIndex]} ${yearBE}`;
}
