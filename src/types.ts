/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WorkHistory {
  id: string;
  workplace: string; // e.g., สมเด็จพระยุพราชเดชอุดม
  province: string;  // e.g., อุบลราชธานี
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD or 'current'
  isInternship?: boolean; // Specific for doctors (เริ่มฝึกเพิ่มพูนทักษะ)
}

export interface Address {
  houseNo: string;
  moo: string;
  subdistrict: string;
  district: string;
  province: string;
}

export interface Officer {
  id: string;
  title: string;       // นาย / นาง / นางสาว / ยศ / ดร.
  firstName: string;
  lastName: string;
  position: string;    // e.g., นักเทคนิคการแพทย์ชำนาญการ
  workplace: string;   // e.g., สมเด็จพระยุพราชเดชอุดม
  province: string;    // e.g., อุบลราชธานี
  gisLevel: string;    // e.g., s, b, a
  address: Address;
  allowanceRate: number; // e.g., 2800
  ptsRate: number;       // e.g., 1000
  fundSourceAllowance: string; // e.g., เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม
  fundSourcePts: string;       // e.g., เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม
  workHistories: WorkHistory[];
}

export interface MonthlyReport {
  id: string;
  officerId: string;
  month: number;      // 1-12
  yearBE: number;     // e.g., 2569
  documentDate: string; // YYYY-MM-DD (Date of document signature, usually last day of month)
  customAllowanceRate?: number;
  customPtsRate?: number;
  customYears?: number;
  customMonths?: number;
  customDays?: number;
}
