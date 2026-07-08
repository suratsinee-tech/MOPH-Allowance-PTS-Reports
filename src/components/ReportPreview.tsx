/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Officer, MonthlyReport } from "../types";
import { THAI_MONTHS, bahtText, formatNumber, calculateDuration, getLastDayOfMonth, toThaiDigits } from "../utils";
import { Printer, Calendar, Settings, Sliders, Undo2, CreditCard, Check, Sparkles, FileDown, User, MapPin, Home, Clock } from "lucide-react";

interface ReportPreviewProps {
  officer: Officer;
  onBack: () => void;
}

export default function ReportPreview({ officer, onBack }: ReportPreviewProps) {
  // Report configurations with defaults
  const currentYearCE = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const defaultYearBE = currentYearCE + 543;

  const [selectedMonth, setSelectedMonth] = useState<number>(9); // Default to Sept as in sample
  const [selectedYearBE, setSelectedYearBE] = useState<number>(2569); // Default to 2569 as in sample
  const [documentDateStr, setDocumentDateStr] = useState<string>("");

  // Print controls
  const [useThaiNumerals, setUseThaiNumerals] = useState<boolean>(false);
  const [activeFormTab, setActiveFormTab] = useState<"all" | "allowance" | "pts">("all");

  // Editable fields within the form (pre-filled from officer but editable directly on screen)
  const [title, setTitle] = useState(officer.title);
  const [firstName, setFirstName] = useState(officer.firstName);
  const [lastName, setLastName] = useState(officer.lastName);
  const [position, setPosition] = useState(officer.position);
  const [workplace, setWorkplace] = useState(officer.workplace);
  const [province, setProvince] = useState(officer.province);
  const [gisLevel, setGisLevel] = useState(officer.gisLevel);

  // Address
  const [houseNo, setHouseNo] = useState(officer.address.houseNo);
  const [moo, setMoo] = useState(officer.address.moo);
  const [subdistrict, setSubdistrict] = useState(officer.address.subdistrict);
  const [district, setDistrict] = useState(officer.address.district);
  const [addressProvince, setAddressProvince] = useState(officer.address.province);

  // Rates
  const [allowanceRate, setAllowanceRate] = useState<number>(officer.allowanceRate);
  const [ptsRate, setPtsRate] = useState<number>(officer.ptsRate);

  // Payers
  const [fundSourceAllowance, setFundSourceAllowance] = useState(officer.fundSourceAllowance);
  const [fundSourcePts, setFundSourcePts] = useState(officer.fundSourcePts);

  // Overridden service period calculations
  const [overrideServiceTime, setOverrideServiceTime] = useState<boolean>(false);
  const [customYears, setCustomYears] = useState<number>(22);
  const [customMonths, setCustomMonths] = useState<number>(3);
  const [customDays, setCustomDays] = useState<number>(0);

  // Auto-calculation of service period up to the last day of the selected month
  const [autoYears, setAutoYears] = useState<number>(0);
  const [autoMonths, setAutoMonths] = useState<number>(0);
  const [autoDays, setAutoDays] = useState<number>(0);

  // Set default document date to the last day of the selected month
  useEffect(() => {
    const lastDayDate = getLastDayOfMonth(selectedMonth, selectedYearBE);
    setDocumentDateStr(lastDayDate);
  }, [selectedMonth, selectedYearBE]);

  // Re-calculate the automatic duration whenever month, year or officer history changes
  useEffect(() => {
    if (officer.workHistories && officer.workHistories.length > 0) {
      // Find the primary or longest active history, or accumulate.
      // Usually we calculate from the earliest start date to the end of the selected month.
      const startDates = officer.workHistories.map(h => new Date(h.startDate).getTime());
      const earliestStart = new Date(Math.min(...startDates));
      
      const lastDayStr = getLastDayOfMonth(selectedMonth, selectedYearBE);
      const end = new Date(lastDayStr);

      const duration = calculateDuration(earliestStart.toISOString().split("T")[0], lastDayStr);
      setAutoYears(duration.years);
      setAutoMonths(duration.months);
      setAutoDays(duration.days);

      // If not overridden, update custom inputs
      if (!overrideServiceTime) {
        setCustomYears(duration.years);
        setCustomMonths(duration.months);
        setCustomDays(duration.days);
      }
    }
  }, [selectedMonth, selectedYearBE, officer.workHistories, overrideServiceTime]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportDoc = () => {
    let contentHtml = "";
    const footerText = useThaiNumerals ? "ปรับปรุง ณ วันที่ ๑๘ ก.ย.๒๕๖๖" : "ปรับปรุง ณ วันที่ 18 ก.ย.2566";

    // Page 1: ใบขอรับเงินค่าตอบแทนเบี้ยเลี้ยงเหมาจ่าย (พ.ศ.2566)
    const page1Html = `
      <div class="word-page">
        <div class="text-center">
          <h2 style="margin: 2px 0; font-size: 18px; font-weight: bold;">ใบขอรับเงินค่าตอบแทนเบี้ยเลี้ยงเหมาจ่ายสำหรับเจ้าหน้าที่</h2>
          <h2 style="margin: 2px 0; font-size: 18px; font-weight: bold;">ที่ปฏิบัติงานในหน่วยบริการสังกัดกระทรวงสาธารณสุข</h2>
          <h2 style="margin: 2px 0; font-size: 18px; font-weight: bold;">พ.ศ. ${num(2566)}</h2>
          <div style="margin-top: 10px; margin-bottom: 15px; text-align: center;">
            <span>ประจำเดือน</span>
            <span class="underline-dotted" style="padding: 0 15px;">${formattedMonth}</span>
            <span>พ.ศ.</span>
            <span class="underline-dotted" style="padding: 0 15px;">${num(selectedYearBE)}</span>
          </div>
        </div>

        <div class="text-justify" style="line-height: 1.6; margin-top: 15px;">
          <p class="indent-8" style="margin: 6px 0; white-space: nowrap; font-size: 15px;">
            ข้าพเจ้า ชื่อ <span class="font-semibold underline-dotted" style="padding: 0 4px;">${title} ${firstName}</span>&nbsp;
            นามสกุล <span class="font-semibold underline-dotted" style="padding: 0 4px;">${lastName}</span>&nbsp;
            ตำแหน่ง <span class="font-semibold underline-dotted" style="padding: 0 4px;">${position}</span>
          </p>
          <p style="margin: 6px 0; white-space: nowrap; font-size: 15px;">
            ปัจจุบันปฏิบัติงานที่ รพศ./รพท./รพ./รพ.สต. <span class="font-semibold underline-dotted" style="padding: 0 4px;">${displayWorkplace}</span>&nbsp;
            จังหวัด <span class="font-semibold underline-dotted" style="padding: 0 4px;">${province}</span>&nbsp;
            ระดับ GIS <span class="font-semibold underline-dotted" style="padding: 0 4px; text-transform: uppercase;">${num(gisLevel)}</span>
          </p>
          <p style="margin: 6px 0;">
            ได้ปฏิบัติงานในหน่วยบริการหรือหน่วยบริการในเครือข่าย&nbsp;
            <span class="font-semibold underline-dotted" style="padding: 0 6px;">${num(customYears)}</span> ปี&nbsp;
            <span class="font-semibold underline-dotted" style="padding: 0 6px;">${num(customMonths)}</span> เดือน&nbsp;
            <span class="font-semibold underline-dotted" style="padding: 0 6px;">${num(customDays || " - ")}</span> วัน (นับถึงวันสิ้นเดือนที่เบิกจ่าย)&nbsp;
            ได้รับเงินจำนวน <span class="font-semibold underline-dotted" style="padding: 0 8px;">${num(formatNumber(allowanceRate))}</span> บาท&nbsp;
            (<span class="font-semibold underline-dotted" style="padding: 0 8px;">${bahtText(allowanceRate)}</span>)
          </p>
          <p class="font-bold" style="margin: 12px 0 6px 0;">
            โดยมีรายละเอียดการปฏิบัติงาน ดังต่อไปนี้ (เฉพาะสายแพทย์ตอบข้อ 1 ด้วย)
          </p>
        </div>

        <div class="text-justify" style="margin-top: 10px; font-size: 15px; line-height: 1.5;">
          <div style="margin-bottom: 8px; padding-left: 24px; position: relative;">
            <span style="position: absolute; left: 0; top: 0; font-weight: bold;">๑.</span>
            เริ่มฝึกเพิ่มพูนทักษะที่
            <div style="padding-left: 24px; margin-top: 4px;">
              <p style="margin: 4px 0;">
                รพช. <span class="underline-dotted" style="display:inline-block; width:180px;">&nbsp;</span> 
                จังหวัด <span class="underline-dotted" style="display:inline-block; width:110px;">&nbsp;</span> 
                ตั้งแต่วันที่ <span class="underline-dotted" style="display:inline-block; width:100px;">&nbsp;</span> 
                ถึงวันที่ <span class="underline-dotted" style="display:inline-block; width:100px;">&nbsp;</span>
              </p>
              <p style="margin: 4px 0;">
                รพท./รพศ. <span class="underline-dotted" style="display:inline-block; width:170px;">&nbsp;</span> 
                จังหวัด <span class="underline-dotted" style="display:inline-block; width:110px;">&nbsp;</span> 
                ตั้งแต่วันที่ <span class="underline-dotted" style="display:inline-block; width:100px;">&nbsp;</span> 
                ถึงวันที่ <span class="underline-dotted" style="display:inline-block; width:100px;">&nbsp;</span>
              </p>
              <p style="margin: 4px 0;">
                รวม <span class="underline-dotted" style="display:inline-block; width:30px; text-align:center;">&nbsp;</span> ปี 
                <span class="underline-dotted" style="display:inline-block; width:30px; text-align:center;">&nbsp;</span> เดือน 
                <span class="underline-dotted" style="display:inline-block; width:30px; text-align:center;">&nbsp;</span> วัน (กรณีนี้ให้นับการฝึกที่ รพท./รพศ. เป็นอายุราชการได้)
              </p>
            </div>
          </div>

          <div style="margin-bottom: 8px; padding-left: 24px; position: relative;">
            <span style="position: absolute; left: 0; top: 0; font-weight: bold;">๒.</span>
            ปฏิบัติงานที่ รพศ./รพท./รพช./รพ.สต. <span class="font-semibold underline-dotted" style="padding: 0 6px;">${displayWorkplace}</span>&nbsp;
            จังหวัด <span class="font-semibold underline-dotted" style="padding: 0 6px;">${province}</span>
            <div style="margin-top: 4px; padding-left: 20px;">
              ตั้งแต่วันที่ <span class="font-semibold underline-dotted" style="padding: 0 6px;">${num(officer.workHistories[0] ? officer.workHistories[0].startDate.split("-")[2] : "11")} ${THAI_MONTHS[officer.workHistories[0] ? parseInt(officer.workHistories[0].startDate.split("-")[1]) : 5]} ${num(officer.workHistories[0] ? parseInt(officer.workHistories[0].startDate.split("-")[0]) + 543 : 2547)}</span>&nbsp;
              ถึงวันที่ <span class="font-semibold underline-dotted" style="padding: 0 6px;">${num(getDayOfDocDate())} ${formattedMonth} ${num(selectedYearBE)}</span>&nbsp;
              รวม <span class="font-semibold underline-dotted" style="padding: 0 6px;">${num(customYears)}</span> ปี&nbsp;
              <span class="font-semibold underline-dotted" style="padding: 0 6px;">${num(customMonths)}</span> เดือน&nbsp;
              <span class="font-semibold underline-dotted" style="padding: 0 6px;">${num(customDays || " - ")}</span> วัน
            </div>
          </div>

          ${[3, 4, 5, 6].map((numVal) => `
            <div style="margin-bottom: 8px; padding-left: 24px; position: relative;">
              <span style="position: absolute; left: 0; top: 0; font-weight: bold;">${num(numVal)}.</span>
              ปฏิบัติงานที่ รพศ./รพท./รพช./รพ.สต. <span class="underline-dotted" style="display:inline-block; width:180px;">&nbsp;</span> จังหวัด <span class="underline-dotted" style="display:inline-block; width:110px;">&nbsp;</span>
              <div style="margin-top: 4px; padding-left: 20px;">
                ตั้งแต่วันที่ <span class="underline-dotted" style="display:inline-block; width:100px;">&nbsp;</span> ถึงวันที่ <span class="underline-dotted" style="display:inline-block; width:100px;">&nbsp;</span> รวม <span class="underline-dotted" style="display:inline-block; width:30px; text-align:center;">&nbsp;</span> ปี <span class="underline-dotted" style="display:inline-block; width:30px; text-align:center;">&nbsp;</span> เดือน <span class="underline-dotted" style="display:inline-block; width:30px; text-align:center;">&nbsp;</span> วัน
              </div>
            </div>
          `).join("")}
        </div>

        <div style="margin-top: 15px; padding-top: 8px; border-top: 1px solid #cccccc;">
          <p class="font-semibold" style="margin: 4px 0;">
            รวมทั้งสิ้น <span class="underline-dotted" style="padding: 0 12px;">${num(customYears)}</span> ปี 
            <span class="underline-dotted" style="padding: 0 12px;">${num(customMonths)}</span> เดือน 
            <span class="underline-dotted" style="padding: 0 12px;">${num(customDays || " - ")}</span> วัน
          </p>
          <p style="font-size: 13px; margin: 4px 0; text-align: justify; line-height: 1.4;">
            (กรณีหน่วยงานเรียกเงินคืน ข้าพเจ้ายินดีชดใช้คืนตามจำนวนเงินที่ได้รับมา โดยไม่มีเงื่อนไขใดๆภายใน 15 วัน หลังจากได้รับหนังสือแจ้งจากหน่วยงาน)
          </p>
        </div>

        <div style="margin-top: 15px; text-align: center;">
          <p style="font-size: 15px; margin: 4px 0;">ข้าพเจ้าขอรับรองว่าข้อมูลดังกล่าวเป็นความจริงทุกประการ</p>
          <table class="no-border-table" style="width: 100%; margin-top: 10px;">
            <tr>
              <td style="width: 45%;"></td>
              <td style="width: 55%; text-align: center;">
                <div style="width: 280px; margin-left: auto;">
                  <p class="underline-dotted" style="display: block; margin: 6px 0;">..................................................</p>
                  <p class="font-semibold" style="margin: 4px 0;">(${title} ${firstName} ${lastName})</p>
                  <p style="font-size: 14px; margin: 4px 0;">ตำแหน่ง ${position}</p>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div style="text-align: right; margin-top: 15px; font-size: 12px; font-style: italic;">
          ${footerText}
        </div>
      </div>
    `;

    // Page 2: ใบสำคัญรับเงิน (รูปที่ ๙) - เบี้ยเลี้ยงเหมาจ่าย
    const page2Html = `
      <div class="word-page">
        <div class="text-center">
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; text-align: center;">ใบสำคัญรับเงิน (รูปที่ ๙)</h2>
        </div>

        <div style="text-align: right; margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
          <div><span style="font-weight: bold;">ที่</span> <span class="underline-dotted" style="display: inline-block; min-w-200px; text-align: left; padding: 0 8px;">${displayWorkplace}</span></div>
          <div>
            <span>วันที่</span> <span class="underline-dotted" style="display: inline-block; min-w-30px; text-align: center; padding: 0 4px;">${num(getDayOfDocDate())}</span> 
            <span>เดือน</span> <span class="underline-dotted" style="display: inline-block; min-w-80px; text-align: center; padding: 0 4px;">${formattedMonth}</span> 
            <span>พ.ศ.</span> <span class="underline-dotted" style="display: inline-block; min-w-50px; text-align: center; padding: 0 4px;">${num(selectedYearBE)}</span>
          </div>
        </div>

        <div class="text-justify" style="line-height: 1.6; margin-bottom: 15px; font-size: 16px;">
          <p class="indent-10">
            ข้าพเจ้า <span class="font-semibold underline-dotted" style="padding: 0 8px;">${title} ${firstName} ${lastName}</span> 
            บ้านเลขที่ <span class="underline-dotted" style="padding: 0 6px;">${num(houseNo)}</span> 
            หมู่ที่ <span class="underline-dotted" style="padding: 0 6px;">${num(moo)}</span> 
            ตำบล <span class="underline-dotted" style="padding: 0 6px;">${subdistrict}</span> 
            อำเภอ <span class="underline-dotted" style="padding: 0 6px;">${district}</span> 
            จังหวัด <span class="underline-dotted" style="padding: 0 6px;">${addressProvince}</span> 
            ได้รับเงินจาก <span class="font-semibold underline-dotted" style="padding: 0 8px;">${fundSourceAllowance}</span> อำเภอเดชอุดม จังหวัดอุบลราชธานี ดังรายการต่อไปนี้
          </p>
        </div>

        <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 20px; font-size: 15px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th rowspan="2" style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold; width: 70%; vertical-align: middle;">รายการ</th>
              <th colspan="2" style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; font-size: 13px;">จำนวนเงิน</th>
            </tr>
            <tr style="background-color: #f8fafc;">
              <th style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; width: 20%; font-size: 13px;">บาท</th>
              <th style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; width: 10%; font-size: 13px;">สต.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid black; padding: 15px; line-height: 1.6; height: 180px; vertical-align: top; text-align: justify;">
                - ได้รับเงินค่าตอบแทนเบี้ยเลี้ยงเหมาจ่ายสำหรับเจ้าหน้าที่ที่ปฏิบัติงานในหน่วยบริการสังกัดกระทรวงสาธารณสุขพ.ศ.2566 <br />
                ประจำเดือน <span class="font-semibold underline-dotted" style="padding: 0 4px;">${formattedMonth}</span> พ.ศ. <span class="font-semibold underline-dotted" style="padding: 0 4px;">${num(selectedYearBE)}</span> เป็นเงิน
              </td>
              <td style="border: 1px solid black; padding: 15px; vertical-align: top; text-align: right; font-weight: bold; font-size: 17px;">
                ${num(formatNumber(allowanceRate))}
              </td>
              <td style="border: 1px solid black; padding: 15px; vertical-align: top; text-align: center; font-weight: bold;">
                ${num("๐๐")}
              </td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="border: 1px solid black; padding: 8px; font-weight: bold; text-align: left;">
                รวมเงิน (ตัวอักษร) (${bahtText(allowanceRate)})
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: right; font-weight: bold; font-size: 17px;">
                ${num(formatNumber(allowanceRate))}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold;">
                ${num("๐๐")}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 15px;">
          <table class="no-border-table" style="width: 100%;">
            <tr>
              <td style="width: 50%;"></td>
              <td style="width: 50%; text-align: center;">
                <div style="width: 320px; margin-left: auto;">
                  <p style="margin: 4px 0;">(ลงชื่อ)<span class="underline-dotted" style="display:inline-block; width:150px;">&nbsp;</span>(ผู้รับเงิน)</p>
                  <p style="font-weight: bold; margin: 4px 0;">( ${title} ${firstName} ${lastName} )</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 50%; text-align: center;">
                <div style="width: 320px; margin-right: auto;">
                  <p style="margin: 4px 0;">(ลงชื่อ)<span class="underline-dotted" style="display:inline-block; width:150px;">&nbsp;</span>ผู้จ่ายเงิน</p>
                  <p style="font-size: 13px; color: #555555; margin: 4px 0;">( .................................................. )</p>
                </div>
              </td>
              <td style="width: 50%;"></td>
            </tr>
          </table>
        </div>

        <div style="text-align: right; margin-top: 25px; font-size: 12px; font-style: italic;">
          ${footerText}
        </div>
      </div>
    `;

    // Page 3: ใบสำคัญรับเงิน (รูปที่ 9) - พ.ต.ส.
    const page3Html = `
      <div class="word-page">
        <div class="text-center">
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; text-align: center;">ใบสำคัญรับเงิน (รูปที่ ๙)</h2>
        </div>

        <div style="text-align: right; margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
          <div><span style="font-weight: bold;">ที่</span> <span class="underline-dotted" style="display: inline-block; min-w-200px; text-align: left; padding: 0 8px;">${displayWorkplace}</span></div>
          <div>
            <span>วันที่</span> <span class="underline-dotted" style="display: inline-block; min-w-30px; text-align: center; padding: 0 4px;">${num(getDayOfDocDate())}</span> 
            <span>เดือน</span> <span class="underline-dotted" style="display: inline-block; min-w-80px; text-align: center; padding: 0 4px;">${formattedMonth}</span> 
            <span>พ.ศ.</span> <span class="underline-dotted" style="display: inline-block; min-w-50px; text-align: center; padding: 0 4px;">${num(selectedYearBE)}</span>
          </div>
        </div>

        <div class="text-justify" style="line-height: 1.6; margin-bottom: 15px; font-size: 16px;">
          <p class="indent-10">
            ข้าพเจ้า <span class="font-semibold underline-dotted" style="padding: 0 8px;">${title} ${firstName} ${lastName}</span> 
            อยู่บ้านเลขที่ <span class="underline-dotted" style="padding: 0 6px;">${num(houseNo)}</span> 
            หมู่ <span class="underline-dotted" style="padding: 0 6px;">${num(moo)}</span> 
            ตำบล <span class="underline-dotted" style="padding: 0 6px;">${subdistrict}</span> 
            อำเภอ <span class="underline-dotted" style="padding: 0 6px;">${district}</span> 
            จังหวัด <span class="underline-dotted" style="padding: 0 6px;">${addressProvince}</span> 
            ได้รับเงินจาก <span class="font-semibold underline-dotted" style="padding: 0 8px;">${fundSourcePts}</span> อำเภอเดชอุดม จังหวัดอุบลราชธานี ดังรายการต่อไปนี้
          </p>
        </div>

        <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 20px; font-size: 15px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th rowspan="2" style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold; width: 70%; vertical-align: middle;">รายการ</th>
              <th colspan="2" style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; font-size: 13px;">จำนวนเงิน</th>
            </tr>
            <tr style="background-color: #f8fafc;">
              <th style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; width: 20%; font-size: 13px;">บาท</th>
              <th style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; width: 10%; font-size: 13px;">สต.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid black; padding: 15px; line-height: 1.6; height: 180px; vertical-align: top; text-align: justify;">
                - ได้รับค่าตอบแทนประเภท เงินเพิ่มสำหรับตำแหน่งที่มีเหตุพิเศษของผู้ปฏิบัติงานด้านสาธารณสุข (พ.ต.ส.) <br />
                ประจำเดือน <span class="font-semibold underline-dotted" style="padding: 0 4px;">${formattedMonth}</span> พ.ศ. <span class="font-semibold underline-dotted" style="padding: 0 4px;">${num(selectedYearBE)}</span> เป็นเงิน
              </td>
              <td style="border: 1px solid black; padding: 15px; vertical-align: top; text-align: right; font-weight: bold; font-size: 17px;">
                ${num(formatNumber(ptsRate))}
              </td>
              <td style="border: 1px solid black; padding: 15px; vertical-align: top; text-align: center; font-weight: bold;">
                ${num("๐๐")}
              </td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="border: 1px solid black; padding: 8px; text-align: left;">
                <strong>จำนวนเงิน(ตัวอักษร)</strong> ( <span class="font-semibold">-${bahtText(ptsRate)}-</span> )
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: right; font-weight: bold; font-size: 17px;">
                ${num(formatNumber(ptsRate))}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold;">
                ${num("๐๐")}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 15px;">
          <table class="no-border-table" style="width: 100%;">
            <tr>
              <td style="width: 50%;"></td>
              <td style="width: 50%; text-align: center;">
                <div style="width: 320px; margin-left: auto;">
                  <p style="margin: 4px 0;">(ลงชื่อ)<span class="underline-dotted" style="display:inline-block; width:150px;">&nbsp;</span>(ผู้รับเงิน)</p>
                  <p style="font-weight: bold; margin: 4px 0;">( ${title} ${firstName} ${lastName} )</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 50%; text-align: center;">
                <div style="width: 320px; margin-right: auto;">
                  <p style="margin: 4px 0;">(ลงชื่อ)<span class="underline-dotted" style="display:inline-block; width:150px;">&nbsp;</span>ผู้จ่ายเงิน</p>
                  <p style="font-size: 13px; color: #555555; margin: 4px 0;">( .................................................. )</p>
                </div>
              </td>
              <td style="width: 50%;"></td>
            </tr>
          </table>
        </div>

        <div style="text-align: right; margin-top: 25px; font-size: 12px; font-style: italic;">
          ${footerText}
        </div>
      </div>
    `;

    if (activeFormTab === "all") {
      contentHtml = page1Html + page2Html + page3Html;
    } else if (activeFormTab === "allowance") {
      contentHtml = page1Html + page2Html;
    } else if (activeFormTab === "pts") {
      contentHtml = page3Html;
    }

    const fileContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>รายงานเบี้ยเลี้ยงและพตส - ${firstName} ${lastName}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap');
          
          body {
            font-family: "Sarabun", "TH Sarabun PSK", "TH Sarabun New", "Sarabun New", Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #000000;
          }
          
          .word-page {
            page-break-after: always;
            break-after: page;
            clear: both;
            margin: 2.2cm 2cm 1.8cm 2.8cm;
          }
          
          .text-center { text-align: center; }
          .text-justify { text-align: justify; text-justify: inter-word; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          
          .underline-dotted {
            border-bottom: 1px dotted #000000;
            text-decoration: none;
            display: inline-block;
            padding-bottom: 1px;
          }
          
          .indent-8 { text-indent: 40px; }
          .indent-10 { text-indent: 50px; }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 15px;
          }
          
          table, th, td {
            border: 1px solid #000000;
          }
          
          th, td {
            padding: 8px 12px;
            vertical-align: top;
          }
          
          .border-none { border: none !important; }
          
          .no-border-table, .no-border-table td, .no-border-table th {
            border: none !important;
          }
        </style>
      </head>
      <body>
        ${contentHtml}
      </body>
      </html>
    `;

    const blob = new Blob([fileContent], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const dateSegment = `${selectedMonth}_${selectedYearBE}`;
    const fileTitle = `รายงาน_${activeFormTab === "all" ? "ทั้งหมด" : activeFormTab === "allowance" ? "เบี้ยเลี้ยง" : "พตส"}_${firstName}_${lastName}_${dateSegment}`;
    link.download = `${fileTitle}.doc`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formattedMonth = THAI_MONTHS[selectedMonth];
  const formattedYear = selectedYearBE.toString();

  const displayWorkplace = (() => {
    if (!workplace) return "";
    if (workplace.includes("สมเด็จพระยุพราช") && !workplace.includes("โรงพยาบาล") && !workplace.includes("รพ.")) {
      return `โรงพยาบาล${workplace}`;
    }
    return workplace;
  })();

  // Address text builder
  const addressText = `บ้านเลขที่ ${houseNo} หมู่ที่ ${moo} ตำบล${subdistrict} อำเภอ${district} จังหวัด${addressProvince}`;

  // Helper to format string numbers inside templates based on numeral selection
  const num = (val: string | number) => {
    const formatted = val.toString();
    return useThaiNumerals ? toThaiDigits(formatted) : formatted;
  };

  const getDayOfDocDate = () => {
    if (!documentDateStr) return "";
    return documentDateStr.split("-")[2];
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dynamic Styling for printing */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

        /* Force TH Sarabun PSK and Sarabun for the entire document preview and print */
        .print-page, .print-page * {
          font-family: "TH Sarabun PSK", "TH Sarabun New", "Sarabun", "Sarabun New", sans-serif !important;
          color: #000000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }

        /* Web / Screen Styling */
        @media screen {
          .print-page {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            padding: 2.2cm 2cm 1.8cm 2.8cm !important; /* Left 2.8cm, Top 2.2cm, Right 2cm, Bottom 1.8cm */
            background: white !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 4px !important;
            position: relative !important;
            overflow: hidden !important;
            margin: 0 auto !important;
          }
        }

        /* Print / PDF Styling */
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important; /* using padding inside print-page instead */
          }
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: transparent !important;
            display: block !important;
          }
          .print-page {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 2.2cm 2cm 1.8cm 2.8cm !important; /* Left 2.8cm, Top 2.2cm, Right 2cm, Bottom 1.8cm */
            page-break-after: always !important;
            page-break-inside: avoid !important;
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            background: white !important;
            position: relative !important;
            overflow: hidden !important;
          }
        }

        /* Document table alignments and borders for pure black print */
        .print-page table {
          border-collapse: collapse !important;
          width: 100% !important;
        }
        .print-page th, .print-page td {
          border: 1px solid #000000 !important;
          color: #000000 !important;
        }
        .print-page .border-dotted {
          border-bottom-style: dotted !important;
          border-bottom-color: #000000 !important;
          border-bottom-width: 0.75px !important;
        }
        .print-page .border-b {
          border-bottom-style: dotted !important;
          border-bottom-color: #000000 !important;
          border-bottom-width: 0.75px !important;
          padding-bottom: 2px !important;
        }
      `}</style>

      {/* Web Header Controls */}
      <div className="no-print bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition flex items-center gap-1 text-sm font-semibold"
            >
              <Undo2 className="w-4 h-4" />
              กลับ
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <h1 className="text-base font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                <span>รายงานของ:</span>
                <span className="text-emerald-800">
                  {title} {firstName} {lastName}
                </span>
              </h1>
              <p className="text-xs text-slate-500">{position}</p>
            </div>
          </div>

          {/* Quick selections */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setActiveFormTab("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFormTab === "all"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ทั้งหมด (3 หน้า)
              </button>
              <button
                onClick={() => setActiveFormTab("allowance")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFormTab === "allowance"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1. เบี้ยเลี้ยงเหมาจ่าย
              </button>
              <button
                onClick={() => setActiveFormTab("pts")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFormTab === "pts"
                    ? "bg-white text-indigo-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2. ค่าตอบแทน พ.ต.ส.
              </button>
            </div>

            <button
              onClick={() => setUseThaiNumerals(!useThaiNumerals)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                useThaiNumerals
                  ? "bg-amber-50 border-amber-300 text-amber-800 font-bold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {useThaiNumerals ? "✓ เลขไทย (๑, ๒)" : "เลขไทย/อารบิก"}
            </button>

            <button
              onClick={handleExportDoc}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              ส่งออกไฟล์ Word (.doc)
            </button>

            <button
              onClick={handlePrint}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-emerald-700/10 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              พิมพ์รายงาน / บันทึก PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main split preview workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 print-container">
        {/* Quick inline editor */}
        <div className="no-print lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm self-start space-y-4 max-h-[85vh] overflow-y-auto sticky top-24">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Editor</h2>
          </div>

          <div className="space-y-4">
            {/* Section 1: ข้อมูลบุคคล (Personal Info) */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                ข้อมูลบุคคล & ตำแหน่ง
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">คำนำหน้า</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">ชื่อ</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-500 uppercase">นามสกุล</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-500 uppercase">ตำแหน่งราชการ</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">สถานที่ทำงาน</label>
                  <input
                    type="text"
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">จังหวัด</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-500 uppercase">ระดับ GIS</label>
                <select
                  value={gisLevel}
                  onChange={(e) => setGisLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="s">S (ทุรกันดารสูงสุด)</option>
                  <option value="b">B (ทุรกันดารปานกลาง)</option>
                  <option value="a">A (ทุรกันดารทั่วไป)</option>
                </select>
              </div>
            </div>

            {/* Section 2: ที่อยู่ตามทะเบียนบ้าน (Home Address) */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                ที่อยู่ใบสำคัญรับเงิน
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">บ้านเลขที่</label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">หมู่ที่</label>
                  <input
                    type="text"
                    value={moo}
                    onChange={(e) => setMoo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">ตำบล</label>
                  <input
                    type="text"
                    value={subdistrict}
                    onChange={(e) => setSubdistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">อำเภอ</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-500 uppercase">จังหวัดที่อยู่</label>
                <input
                  type="text"
                  value={addressProvince}
                  onChange={(e) => setAddressProvince(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Section 3: อัตราเงิน & แหล่งเงิน (Rates & Funds) */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                อัตราเบิกจ่าย & แหล่งเงิน
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">อัตราเบี้ยเลี้ยง (บาท)</label>
                  <input
                    type="number"
                    value={allowanceRate}
                    onChange={(e) => setAllowanceRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-500 uppercase">อัตรา พ.ต.ส. (บาท)</label>
                  <input
                    type="number"
                    value={ptsRate}
                    onChange={(e) => setPtsRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-500 uppercase">แหล่งจ่ายเงินเบี้ยเลี้ยง</label>
                <input
                  type="text"
                  value={fundSourceAllowance}
                  onChange={(e) => setFundSourceAllowance(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-500 uppercase">แหล่งจ่ายเงิน พ.ต.ส.</label>
                <input
                  type="text"
                  value={fundSourcePts}
                  onChange={(e) => setFundSourcePts(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Section 4: ปรับแต่งอายุราชการ (Service period override) */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  ปรับอายุงานราชการเอง
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideServiceTime}
                    onChange={(e) => setOverrideServiceTime(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {overrideServiceTime && (
                <div className="grid grid-cols-3 gap-2 animate-in slide-in-from-top-1 duration-200">
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-500 uppercase">จำนวนปี</label>
                    <input
                      type="number"
                      value={customYears}
                      onChange={(e) => setCustomYears(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500 text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-500 uppercase">เดือน</label>
                    <input
                      type="number"
                      value={customMonths}
                      onChange={(e) => setCustomMonths(Math.min(11, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500 text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-500 uppercase">วัน</label>
                    <input
                      type="number"
                      value={customDays}
                      onChange={(e) => setCustomDays(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-500 text-center font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Printable preview list */}
        <div className="lg:col-span-3 space-y-8 print-container overflow-x-auto pb-6">
          {/* ========================================================== */}
          {/* PAGE 1: ใบขอรับเงินค่าตอบแทนเบี้ยเลี้ยงเหมาจ่าย (พ.ศ.2566) */}
          {/* ========================================================== */}
          {(activeFormTab === "all" || activeFormTab === "allowance") && (
            <div className="print-page relative text-black leading-[1.45] text-[14.5px] pb-12">
              {/* Document Header */}
              <div className="text-center space-y-0.5 mb-2">
                <h2 className="text-[15.5px] font-bold">ใบขอรับเงินค่าตอบแทนเบี้ยเลี้ยงเหมาจ่ายสำหรับเจ้าหน้าที่</h2>
                <h2 className="text-[15.5px] font-bold">ที่ปฏิบัติงานในหน่วยบริการสังกัดกระทรวงสาธารณสุข</h2>
                <h2 className="text-[15.5px] font-bold">พ.ศ. {num(2566)}</h2>
              </div>
 
              {/* Monthly line */}
              <div className="flex justify-center items-center gap-1.5 mb-2.5">
                <span>ประจำเดือน</span>
                <span className="font-semibold border-b border-dotted border-black px-3 min-w-[90px] text-center">{formattedMonth}</span>
                <span>พ.ศ.</span>
                <span className="font-semibold border-b border-dotted border-black px-3 min-w-[65px] text-center">{num(selectedYearBE)}</span>
              </div>
 
              {/* Personal info paragraph */}
              <div className="space-y-1 text-justify leading-relaxed">
                <p className="indent-8 whitespace-nowrap text-[13px] md:text-[13.5px] tracking-tight">
                  ข้าพเจ้า ชื่อ <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{title} {firstName}</span>&nbsp;
                  นามสกุล <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{lastName}</span>&nbsp;
                  ตำแหน่ง <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{position}</span>
                </p>
                <p className="whitespace-nowrap text-[13px] md:text-[13.5px] tracking-tight">
                  ปัจจุบันปฏิบัติงานที่ รพศ./รพท./รพ./รพ.สต. <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{displayWorkplace}</span>&nbsp;
                  จังหวัด <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{province}</span>&nbsp;
                  ระดับ GIS <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap uppercase">{num(gisLevel)}</span>
                </p>
                <p>
                  ได้ปฏิบัติงานในหน่วยบริการหรือหน่วยบริการในเครือข่าย&nbsp;
                  <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{num(customYears)}</span> ปี&nbsp;
                  <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{num(customMonths)}</span> เดือน&nbsp;
                  <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{num(customDays || " - ")}</span> วัน (นับถึงวันสิ้นเดือนที่เบิกจ่าย)&nbsp;
                  ได้รับเงินจำนวน <span className="font-semibold border-b border-dotted border-black px-2 inline-block whitespace-nowrap">{num(formatNumber(allowanceRate))}</span> บาท&nbsp;
                  (<span className="font-semibold border-b border-dotted border-black px-2 inline-block whitespace-nowrap">{bahtText(allowanceRate)}</span>)
                </p>
 
                <p className="font-bold pt-0.5">
                  โดยมีรายละเอียดการปฏิบัติงาน ดังต่อไปนี้ (เฉพาะสายแพทย์ตอบข้อ 1 ด้วย)
                </p>
              </div>

              {/* Timeline listings (mimicking the 1-6 rules) */}
              <div className="space-y-1.5 mt-2 text-justify text-[13.5px] leading-[1.4]">
                {/* Rule 1: Internship (Doctors) - Numbered 1 */}
                <div className="pl-6 relative leading-relaxed">
                  <span className="absolute left-0 top-0 font-semibold">{num(1)}.</span>
                  ได้รับทุนเพื่อศึกษาวิชาแพทยศาสตร์ / ทันตแพทยศาสตร์ / เภสัชศาสตร์ (สำหรับแพทย์ ทันตแพทย์ เภสัชแพทย์)&nbsp;
                  เริ่มฝึกเพิ่มพูนทักษะ ณ <span className="border-b border-dotted border-black inline-block w-[180px]">&nbsp;</span> จังหวัด <span className="border-b border-dotted border-black inline-block w-[110px]">&nbsp;</span>
                  <div className="mt-0.5">
                    ตั้งแต่วันที่ <span className="border-b border-dotted border-black inline-block w-[100px]">&nbsp;</span> ถึงวันที่ <span className="border-b border-dotted border-black inline-block w-[100px]">&nbsp;</span>
                    รวม <span className="border-b border-dotted border-black inline-block w-[30px] text-center">&nbsp;</span> ปี 
                    <span className="border-b border-dotted border-black inline-block w-[30px] text-center">&nbsp;</span> เดือน 
                    <span className="border-b border-dotted border-black inline-block w-[30px] text-center">&nbsp;</span> วัน (กรณีนี้ให้นับการฝึกที่ รพท./รพศ. เป็นอายุราชการได้)
                  </div>
                </div>
 
                {/* Rule 2: Primary workspace */}
                <div className="pl-6 relative leading-relaxed">
                  <span className="absolute left-0 top-0 font-semibold">{num(2)}.</span>
                  ปฏิบัติงานที่ รพศ./รพท./รพ./รพ.สต. <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{displayWorkplace}</span>&nbsp;
                  จังหวัด <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{province}</span>
                  <div className="mt-0.5">
                    ตั้งแต่วันที่ <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{num(officer.workHistories[0] ? officer.workHistories[0].startDate.split("-")[2] : "11")} {THAI_MONTHS[officer.workHistories[0] ? parseInt(officer.workHistories[0].startDate.split("-")[1]) : 5]} {num(officer.workHistories[0] ? parseInt(officer.workHistories[0].startDate.split("-")[0]) + 543 : 2547)}</span>&nbsp;
                    ถึงวันที่ <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{num(getDayOfDocDate())} {formattedMonth} {num(selectedYearBE)}</span>&nbsp;
                    รวม <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{num(customYears)}</span> ปี&nbsp;
                    <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{num(customMonths)}</span> เดือน&nbsp;
                    <span className="font-semibold border-b border-dotted border-black px-1.5 inline-block whitespace-nowrap">{num(customDays || " - ")}</span> วัน
                  </div>
                </div>
 
                {/* Rules 3 - 6: Left empty as placeholder underlines just like the standard format */}
                {[3, 4, 5, 6].map((numVal) => (
                  <div key={numVal} className="pl-6 relative text-black leading-relaxed">
                    <span className="absolute left-0 top-0">{num(numVal)}.</span>
                    ปฏิบัติงานที่ รพศ./รพท./รพ./รพ.สต. <span className="border-b border-dotted border-black inline-block w-[180px]">&nbsp;</span> จังหวัด <span className="border-b border-dotted border-black inline-block w-[110px]">&nbsp;</span>
                    <div className="mt-0.5">
                      ตั้งแต่วันที่ <span className="border-b border-dotted border-black inline-block w-[100px]">&nbsp;</span> ถึงวันที่ <span className="border-b border-dotted border-black inline-block w-[100px]">&nbsp;</span> รวม <span className="border-b border-dotted border-black inline-block w-[30px] text-center">&nbsp;</span> ปี <span className="border-b border-dotted border-black inline-block w-[30px] text-center">&nbsp;</span> เดือน <span className="border-b border-dotted border-black inline-block w-[30px] text-center">&nbsp;</span> วัน
                    </div>
                  </div>
                ))}
              </div>
 
              {/* Total Summary */}
              <div className="mt-2 pt-1 border-t border-slate-300">
                <p className="font-semibold">
                  รวมทั้งสิ้น <span className="border-b border-dotted border-black px-3">{num(customYears)}</span> ปี 
                  <span className="border-b border-dotted border-black px-3">{num(customMonths)}</span> เดือน 
                  <span className="border-b border-dotted border-black px-3">{num(customDays || " - ")}</span> วัน
                </p>
                <p className="text-[12px] text-black mt-0.5 text-justify leading-snug">
                  (กรณีหน่วยงานเรียกเงินคืน ข้าพเจ้ายินดีชดใช้คืนตามจำนวนเงินที่ได้รับมา โดยไม่มีเงื่อนไขใดๆภายใน 15 วัน หลังจากได้รับหนังสือแจ้งจากหน่วยงาน)
                </p>
              </div>
 
              {/* Signature area */}
              <div className="mt-2 text-center space-y-1">
                <p className="text-[13.5px]">ข้าพเจ้าขอรับรองว่าข้อมูลดังกล่าวเป็นความจริงทุกประการ</p>
                
                <div className="w-[300px] ml-auto space-y-0.5 mt-1">
                  <p className="border-b border-dotted border-black pb-0.5 text-black">&nbsp;</p>
                  <p className="font-semibold whitespace-nowrap">({title} {firstName} {lastName})</p>
                  <p className="text-[13px] text-black whitespace-nowrap">ตำแหน่ง {position}</p>
                </div>
              </div>

              {/* Absolute Footer */}
              <div className="absolute bottom-1 right-2 text-[11px] text-gray-500 font-normal">
                {useThaiNumerals ? "ปรับปรุง ณ วันที่ ๑๘ ก.ย.๒๕๖๖" : "ปรับปรุง ณ วันที่ 18 ก.ย.2566"}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* PAGE 2: ใบสำคัญรับเงิน (รูปที่ ๙) - เบี้ยเลี้ยงเหมาจ่าย */}
          {/* ========================================================== */}
          {(activeFormTab === "all" || activeFormTab === "allowance") && (
            <div className="print-page text-black leading-[1.45] text-[15.5px]">
              {/* Title Header */}
              <div className="text-center mb-1">
                <h2 className="text-[18px] font-bold">ใบสำคัญรับเงิน (รูปที่ ๙)</h2>
              </div>

              {/* Hospital name and Date row */}
              <div className="flex flex-col items-end text-[16px] mb-4 space-y-1 pr-4">
                <div className="whitespace-nowrap">
                  ที่ <span className="font-semibold">{displayWorkplace}</span>
                </div>
                <div className="whitespace-nowrap">
                  วันที่...<span className="font-semibold px-1">{num(getDayOfDocDate())}</span>.....เดือน .<span className="font-semibold px-1">{formattedMonth}</span>..... พ.ศ....<span className="font-semibold px-1">{num(selectedYearBE)}</span>....
                </div>
              </div>

              {/* Main text descriptor */}
              <div className="text-[16px] leading-[1.8] text-justify mb-4">
                <p className="indent-12">
                  ข้าพเจ้า ....<span className="font-semibold">{title} {firstName}</span>............<span className="font-semibold">{lastName}</span>................ บ้านเลขที่ ....<span className="font-semibold">{num(houseNo)}</span>....หมู่ที่ ..<span className="font-semibold">{num(moo)}</span>... ตำบล ..<span className="font-semibold">{subdistrict}</span>....&nbsp;
                  อำเภอ .<span className="font-semibold">{district}</span>.. จังหวัด ..<span className="font-semibold">{addressProvince}</span>...ได้รับเงินจาก <span className="font-semibold">{fundSourceAllowance}</span>&nbsp;
                  อำเภอเดชอุดม จังหวัดอุบลราชธานี ดังรายการต่อไปนี้
                </p>
              </div>

              {/* Table details */}
              <table className="w-full border-collapse border border-black text-[14.5px] mb-6">
                <thead>
                  <tr>
                    <th rowSpan={2} className="border border-black py-2 px-4 text-center font-bold w-[70%]">รายการ</th>
                    <th colSpan={2} className="border border-black py-1 px-2 text-center font-bold">จำนวนเงิน</th>
                  </tr>
                  <tr>
                    <th className="border border-black py-1 px-2 text-center font-bold w-[20%]">บาท</th>
                    <th className="border border-black py-1 px-2 text-center font-bold w-[10%]">สต.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-4 leading-relaxed h-[320px] align-top text-left">
                      -ได้รับเงินค่าตอบแทนเบี้ยเลี้ยงเหมาจ่ายสำหรับเจ้าหน้าที่ที่ปฏิบัติงานในหน่วยบริการสังกัดกระทรวงสาธารณสุขพ.ศ.{num("๒๕๖๖")}<br />
                      ประจำเดือน ...{formattedMonth}..... พ.ศ....{num(selectedYearBE)}... เป็นเงิน
                    </td>
                    <td className="border border-black p-4 align-top text-right pr-6 font-semibold">
                      {num(formatNumber(allowanceRate))}
                    </td>
                    <td className="border border-black p-4 align-top text-center font-semibold">
                      {num("๐๐")}
                    </td>
                  </tr>
                  {/* Total row */}
                  <tr>
                    <td className="border border-black py-2 px-4 font-semibold text-left">
                      รวมเงิน (ตัวอักษร) ({bahtText(allowanceRate)})
                    </td>
                    <td className="border border-black py-2 px-4 text-right pr-6 font-semibold">
                      .... {num(formatNumber(allowanceRate))}
                    </td>
                    <td className="border border-black py-2 px-2 text-center font-semibold">
                      {num("๐๐")}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures stack aligned right-center */}
              <div className="mt-8 flex flex-col items-end pr-8 text-[15px] space-y-8">
                <div className="w-[380px] space-y-1 text-center">
                  <p className="whitespace-nowrap">
                    (ลงชื่อ)......................................................(ผู้รับเงิน)
                  </p>
                  <p className="whitespace-nowrap">
                    ( ....{title} {firstName} {lastName}.... )
                  </p>
                </div>

                <div className="w-[380px] space-y-1 text-center">
                  <p className="whitespace-nowrap">
                    (ลงชื่อ)......................................................ผู้จ่ายเงิน
                  </p>
                  <p className="whitespace-nowrap">
                    (......................................................)
                  </p>
                </div>
              </div>

              {/* Absolute Footer */}
              <div className="absolute bottom-6 right-8 text-[12px] text-black font-normal">
                {useThaiNumerals ? "ปรับปรุง ณ วันที่ ๑๘ ก.ย.๒๕๖๖" : "ปรับปรุง ณ วันที่ 18 ก.ย.2566"}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* PAGE 3: ใบสำคัญรับเงิน (รูปที่ ๙) - พ.ต.ส. */}
          {/* ========================================================== */}
          {(activeFormTab === "all" || activeFormTab === "pts") && (
            <div className="print-page text-black leading-[1.45] text-[15.5px]">
              {/* Title Header */}
              <div className="text-center mb-1">
                <h2 className="text-[18px] font-bold">ใบสำคัญรับเงิน (รูปที่ ๙)</h2>
              </div>

              {/* Hospital name and Date row */}
              <div className="flex flex-col items-end text-[16px] mb-4 space-y-1 pr-4">
                <div className="whitespace-nowrap">
                  ที่ <span className="font-semibold">{displayWorkplace}</span>
                </div>
                <div className="whitespace-nowrap">
                  วันที่...<span className="font-semibold px-1">{num(getDayOfDocDate())}</span>.....เดือน .<span className="font-semibold px-1">{formattedMonth}</span>..... พ.ศ....<span className="font-semibold px-1">{num(selectedYearBE)}</span>....
                </div>
              </div>

              {/* Main text descriptor */}
              <div className="text-[16px] leading-[1.8] text-justify mb-4">
                <p className="indent-12">
                  ข้าพเจ้า ....<span className="font-semibold">{title} {firstName}</span>............<span className="font-semibold">{lastName}</span>................ อยู่บ้านเลขที่ ....<span className="font-semibold">{num(houseNo)}</span>....หมู่ที่ ..<span className="font-semibold">{num(moo)}</span>... ตำบล ..<span className="font-semibold">{subdistrict}</span>....&nbsp;
                  อำเภอ .<span className="font-semibold">{district}</span>.. จังหวัด ..<span className="font-semibold">{addressProvince}</span>...ได้รับเงินจาก <span className="font-semibold">{fundSourcePts}</span>&nbsp;
                  อำเภอเดชอุดม จังหวัดอุบลราชธานี ดังรายการต่อไปนี้
                </p>
              </div>

              {/* Table details */}
              <table className="w-full border-collapse border border-black text-[14.5px] mb-6">
                <thead>
                  <tr>
                    <th rowSpan={2} className="border border-black py-2 px-4 text-center font-bold w-[70%]">รายการ</th>
                    <th colSpan={2} className="border border-black py-1 px-2 text-center font-bold">จำนวนเงิน</th>
                  </tr>
                  <tr>
                    <th className="border border-black py-1 px-2 text-center font-bold w-[20%]">บาท</th>
                    <th className="border border-black py-1 px-2 text-center font-bold w-[10%]">สต.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-4 leading-relaxed h-[320px] align-top text-left">
                      -ได้รับค่าตอบแทนประเภท เงินเพิ่มสำหรับตำแหน่งที่มีเหตุพิเศษของผู้ปฏิบัติงานด้านสาธารณสุข (พ.ต.ส.)<br />
                      ประจำเดือน ...{formattedMonth}..... พ.ศ....{num(selectedYearBE)}... เป็นเงิน
                    </td>
                    <td className="border border-black p-4 align-top text-right pr-6 font-semibold">
                      {num(formatNumber(ptsRate))}
                    </td>
                    <td className="border border-black p-4 align-top text-center font-semibold">
                      {num("๐๐")}
                    </td>
                  </tr>
                  {/* Total row */}
                  <tr>
                    <td className="border border-black py-2 px-4 font-semibold text-left">
                      รวมเงิน (ตัวอักษร) ({bahtText(ptsRate)})
                    </td>
                    <td className="border border-black py-2 px-4 text-right pr-6 font-semibold">
                      .... {num(formatNumber(ptsRate))}
                    </td>
                    <td className="border border-black py-2 px-2 text-center font-semibold">
                      {num("๐๐")}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures stack aligned right-center */}
              <div className="mt-8 flex flex-col items-end pr-8 text-[15px] space-y-8">
                <div className="w-[380px] space-y-1 text-center">
                  <p className="whitespace-nowrap">
                    (ลงชื่อ)......................................................(ผู้รับเงิน)
                  </p>
                  <p className="whitespace-nowrap">
                    ( ....{title} {firstName} {lastName}.... )
                  </p>
                </div>

                <div className="w-[380px] space-y-1 text-center">
                  <p className="whitespace-nowrap">
                    (ลงชื่อ)......................................................ผู้จ่ายเงิน
                  </p>
                  <p className="whitespace-nowrap">
                    (......................................................)
                  </p>
                </div>
              </div>

              {/* Absolute Footer */}
              <div className="absolute bottom-6 right-8 text-[12px] text-black font-normal">
                {useThaiNumerals ? "ปรับปรุง ณ วันที่ ๑๘ ก.ย.๒๕๖๖" : "ปรับปรุง ณ วันที่ 18 ก.ย.2566"}
              </div>
            </div>
          )}

          {/* Guidelines notes - no-print */}
          <div className="no-print bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-800 space-y-2 max-w-4xl">
            <h4 className="font-bold text-sm flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              ข้อเสนอแนะและข้อแนะนำจากกระทรวงสาธารณสุข:
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>ให้เรียงเอกสารส่งตามลำดับ: 1. ใบขอรับเงินฯ 2. ใบสำคัญรับเงิน (รูปที่ ๙) 3. สำเนาบัตรประชาชน/ใบขับขี่</li>
              <li>ใบสำคัญรับเงิน (รูปที่ ๙) และ (รูปที่ 9) แนะนำให้ใช้ลงวันที่ ณ วันที่สุดท้ายของแต่ละเดือน</li>
              <li>แพทย์และทันตแพทย์ สามารถใช้แบบฟอร์มนี้ได้เช่นกัน โดยกรอกเพิ่มในช่องเริ่มฝึกเพิ่มพูนทักษะที่ข้อ 1</li>
              <li>สามารถกด <strong>พิมพ์รายงาน / บันทึก PDF</strong> เพื่อดาวน์โหลดเก็บเป็นไฟล์เอกสารได้ทันทีผ่านระบบพิมพ์ของเว็บเบราว์เซอร์</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
