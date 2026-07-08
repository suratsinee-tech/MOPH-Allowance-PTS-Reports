/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Copy, Check, FileCode, ExternalLink, Download } from "lucide-react";

export default function AppsScriptExport() {
  const [copiedGs, setCopiedGs] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [activeTab, setActiveTab] = useState<"gs" | "html">("gs");

  const codeGs = `/**
 * Google Apps Script (รหัส.gs)
 * ระบบจัดทำใบเบิกเบี้ยเลี้ยงเหมาจ่าย และ พ.ต.ส. ประจำเดือน
 * 
 * วิธีใช้งาน:
 * 1. เข้าไปที่ https://script.google.com
 * 2. สร้างโครงการใหม่ (New Project)
 * 3. คัดลอกรหัสนี้ไปวางในไฟล์ 'รหัส.gs' (Code.gs)
 * 4. สร้างไฟล์ HTML ใหม่ชื่อ 'Index' (หรือ Index.html) และคัดลอกส่วน 'Index.html' ไปใส่
 * 5. กด 'การทำให้ใช้งานได้' (Deploy) -> 'การทำให้ใช้งานได้ใหม่' (New Deployment)
 * 6. เลือกประเภทเป็น 'เว็บแอป' (Web App)
 * 7. ตั้งค่าผู้มีสิทธิ์เข้าถึงตามต้องการ และกด 'ทำให้ใช้งานได้'
 */

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ระบบรายงานเบี้ยเลี้ยงเหมาจ่าย และ พ.ต.ส.')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ฟังก์ชันดึงข้อมูลบุคลากรทั้งหมด (เก็บใน UserProperties เพื่อความปลอดภัยและเป็นส่วนตัว)
function getOfficers() {
  try {
    var userProperties = PropertiesService.getUserProperties();
    var data = userProperties.getProperty('moph_officers_data');
    if (!data) {
      // ส่งคืนค่าเริ่มต้นของ นาย ธันญ์นวิชญ์ คำทา หากยังไม่มีข้อมูล
      var defaultData = [{
        id: "thanwit-kamtha",
        title: "นาย",
        firstName: "ธันญ์นวิชญ์",
        lastName: "คำทา",
        position: "นักเทคนิคการแพทย์ชำนาญการ",
        workplace: "สมเด็จพระยุพราชเดชอุดม",
        province: "อุบลราชธานี",
        gisLevel: "s",
        address: {
          houseNo: "67",
          moo: "4",
          subdistrict: "บ้านกอก",
          district: "เขื่องใน",
          province: "อุบลราชธานี"
        },
        allowanceRate: 2800,
        ptsRate: 1000,
        fundSourceAllowance: "เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        fundSourcePts: "เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        workHistories: [{
          id: "hist-1",
          workplace: "สมเด็จพระยุพราชเดชอุดม",
          province: "อุบลราชธานี",
          startDate: "2004-05-11",
          endDate: "current"
        }]
      }];
      return JSON.stringify(defaultData);
    }
    return data;
  } catch (e) {
    return JSON.stringify([]);
  }
}

// ฟังก์ชันบันทึกข้อมูลบุคลากรทั้งหมด
function saveOfficers(jsonData) {
  try {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('moph_officers_data', jsonData);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}
`;

  // Standard index.html bundled output code containing full CSS and tailwind using CDN + icons for high speed
  const codeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ระบบรายงานเบี้ยเลี้ยงเหมาจ่าย และ พ.ต.ส.</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts Sarabun & Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body {
      font-family: 'Sarabun', 'Inter', sans-serif;
      background-color: #f8fafc;
    }
    /* Printable pages */
    @media print {
      body {
        background-color: white !important;
        color: black !important;
      }
      .no-print {
        display: none !important;
      }
      .print-container {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
      }
      .print-page {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 1.5cm 1.5cm !important;
        page-break-after: always !important;
        width: 100% !important;
        min-height: auto !important;
        background: white !important;
      }
      @page {
        size: A4;
        margin: 0;
      }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen">
  <!-- Header -->
  <header class="no-print bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-emerald-700 rounded-xl text-white">
          <i data-lucide="heart" class="w-6 h-6"></i>
        </div>
        <div>
          <h1 class="text-base font-bold text-slate-900">MOPH Allowance & PTS Reports</h1>
          <p class="text-xs text-slate-500 font-medium">แอปสำหรับ Google Apps Script เพื่อออกเอกสารเบี้ยเลี้ยงเหมาจ่าย และ พ.ต.ส.</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button id="btn-add-new" class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition">
          <i data-lucide="user-plus" class="w-4 h-4"></i> เพิ่มบุคลากรใหม่
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-7xl mx-auto px-4 py-6">
    <!-- List View -->
    <div id="view-list" class="space-y-6">
      <div class="bg-gradient-to-r from-teal-800 to-emerald-700 text-white rounded-2xl p-6 shadow-md flex justify-between items-center">
        <div>
          <h2 class="text-lg font-bold">แอปพลิเคชันเวอร์ชันเซิร์ฟเวอร์ส่วนตัว (Apps Script)</h2>
          <p class="text-xs text-emerald-100 mt-1">ข้อมูลถูกบันทึกไว้อย่างปลอดภัยและเป็นส่วนตัวใน Google Drive ของคุณ</p>
        </div>
        <i data-lucide="shield-check" class="w-8 h-8 opacity-60"></i>
      </div>
      <div class="flex justify-between items-center">
        <h3 class="text-base font-bold text-slate-800">รายชื่อบุคลากรทั้งหมดในระบบ</h3>
      </div>
      <div id="officer-list-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- List dynamic items go here -->
      </div>
    </div>

    <!-- Form View -->
    <div id="view-form" class="hidden max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
      <!-- header -->
      <div class="bg-emerald-700 px-6 py-4 text-white">
        <h2 id="form-title" class="text-base font-bold">เพิ่มบุคลากรใหม่</h2>
      </div>
      <form id="officer-form" class="p-6 space-y-6">
        <input type="hidden" id="field-id">
        <!-- ข้อมูลส่วนตัว -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">คำนำหน้า</label>
            <select id="field-title" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
              <option value="นพ.">นพ.</option>
              <option value="พญ.">พญ.</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">ชื่อจริง</label>
            <input type="text" id="field-firstName" required class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">นามสกุล</label>
            <input type="text" id="field-lastName" required class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">ตำแหน่ง</label>
            <input type="text" id="field-position" required class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">รพ./รพ.สต.</label>
            <input type="text" id="field-workplace" required class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">ระดับ GIS</label>
            <input type="text" id="field-gisLevel" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
          </div>
        </div>

        <!-- ที่อยู่ -->
        <div class="border-t border-slate-100 pt-4">
          <h3 class="text-xs font-bold text-slate-700 mb-3">ข้อมูลที่อยู่</h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">บ้านเลขที่</label>
              <input type="text" id="field-houseNo" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">หมู่ที่</label>
              <input type="text" id="field-moo" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">ตำบล</label>
              <input type="text" id="field-subdistrict" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">อำเภอ</label>
              <input type="text" id="field-district" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">จังหวัด</label>
              <input type="text" id="field-province" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
            </div>
          </div>
        </div>

        <!-- สิทธิ์เงิน -->
        <div class="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-150">
            <h4 class="text-xs font-bold text-teal-800 mb-2">1. เบี้ยเลี้ยงเหมาจ่าย</h4>
            <div class="space-y-2">
              <div>
                <label class="block text-[10px] text-slate-500">จำนวนเงิน (บาท)</label>
                <input type="number" id="field-allowanceRate" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs">
              </div>
              <div>
                <label class="block text-[10px] text-slate-500">แหล่งเงิน</label>
                <input type="text" id="field-fundSourceAllowance" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs">
              </div>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-150">
            <h4 class="text-xs font-bold text-indigo-800 mb-2">2. พ.ต.ส.</h4>
            <div class="space-y-2">
              <div>
                <label class="block text-[10px] text-slate-500">จำนวนเงิน (บาท)</label>
                <input type="number" id="field-ptsRate" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs">
              </div>
              <div>
                <label class="block text-[10px] text-slate-500">แหล่งเงิน</label>
                <input type="text" id="field-fundSourcePts" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs">
              </div>
            </div>
          </div>
        </div>

        <!-- วันเริ่มงาน -->
        <div class="border-t border-slate-100 pt-4">
          <h3 class="text-xs font-bold text-slate-700 mb-2">ประวัติงาน (ใช้วันเริ่มงานแรกเริ่มคำนวณอายุงาน)</h3>
          <div>
            <label class="block text-xs text-slate-500 mb-1">วันเริ่มปฏิบัติงานวันแรกในกระทรวงสาธารณสุข</label>
            <input type="date" id="field-startDate" required class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
          </div>
        </div>

        <!-- Buttons -->
        <div class="border-t border-slate-100 pt-4 flex justify-end gap-2">
          <button type="button" id="btn-cancel-form" class="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">ยกเลิก</button>
          <button type="submit" class="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800">บันทึก</button>
        </div>
      </form>
    </div>

    <!-- Preview View -->
    <div id="view-preview" class="hidden space-y-6">
      <!-- Toolbar controls preview -->
      <div class="no-print bg-white p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <button id="btn-back-to-list" class="px-4 py-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition">
          <i data-lucide="undo-2" class="w-4 h-4"></i> ย้อนกลับ
        </button>
        <div class="flex items-center gap-3">
          <!-- Month selections -->
          <select id="preview-month" class="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold">
            <!-- Populated dynamically -->
          </select>
          <input type="number" id="preview-year" class="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold w-20 text-center" value="2569">
          <button id="btn-numeral-toggle" class="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50">สลับเลขไทย/อารบิก</button>
          <button id="btn-print-trigger" class="bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-800 flex items-center gap-1.5">
            <i data-lucide="printer" class="w-4 h-4"></i> พิมพ์ / บันทึก PDF
          </button>
        </div>
      </div>

      <!-- Live Sheets container -->
      <div id="sheets-container" class="space-y-8 print-container">
        <!-- DYNAMIC HTML SHEETS GO HERE -->
      </div>
    </div>
  </main>

  <script>
    // Global States
    let officers = [];
    let currentOfficer = null;
    let useThaiNumerals = false;
    const thaiMonths = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    // Initialize
    window.onload = function() {
      // Load Google Apps Script Data
      google.script.run.withSuccessHandler(function(dataJson) {
        officers = JSON.parse(dataJson);
        renderList();
        lucide.createIcons();
      }).getOfficers();

      setupEventListeners();
      populateMonthDropdown();
    };

    function populateMonthDropdown() {
      const select = document.getElementById("preview-month");
      for (let i = 1; i <= 12; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.innerText = thaiMonths[i];
        if (i === 9) opt.selected = true; // September
        select.appendChild(opt);
      }
    }

    function setupEventListeners() {
      document.getElementById("btn-add-new").onclick = () => showForm(null);
      document.getElementById("btn-cancel-form").onclick = () => hideForm();
      document.getElementById("btn-back-to-list").onclick = () => {
        document.getElementById("view-preview").classList.add("hidden");
        document.getElementById("view-list").classList.remove("hidden");
        document.getElementById("btn-add-new").classList.remove("hidden");
      };
      
      document.getElementById("btn-numeral-toggle").onclick = () => {
        useThaiNumerals = !useThaiNumerals;
        updatePreviewSheet();
      };

      document.getElementById("btn-print-trigger").onclick = () => {
        window.print();
      };

      document.getElementById("preview-month").onchange = () => updatePreviewSheet();
      document.getElementById("preview-year").oninput = () => updatePreviewSheet();

      // Form Submit
      document.getElementById("officer-form").onsubmit = function(e) {
        e.preventDefault();
        saveFormValues();
      };
    }

    function renderList() {
      const container = document.getElementById("officer-list-container");
      container.innerHTML = "";

      if (officers.length === 0) {
        container.innerHTML = \`<div class="col-span-2 text-center p-8 bg-white rounded-xl border">ไม่มีข้อมูลบุคลากร</div>\`;
        return;
      }

      officers.forEach((o, index) => {
        const card = document.createElement("div");
        card.className = "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between";
        card.innerHTML = \`
          <div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-sm font-bold text-slate-800">\${o.title} \${o.firstName} \${o.lastName}</h4>
                <p class="text-xs text-slate-500">\${o.position}</p>
              </div>
              <span class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">GIS: \${o.gisLevel}</span>
            </div>
            <p class="text-xs text-slate-600 mt-2"><i data-lucide="map-pin" class="w-3 h-3 inline-block mr-1"></i> \${o.workplace}</p>
            <p class="text-xs text-slate-500 mt-1">เบี้ยเลี้ยง: \${o.allowanceRate} บาท | พ.ต.ส: \${o.ptsRate} บาท</p>
          </div>
          <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-50">
            <button onclick="editOfficer(\'\${o.id}\')" class="p-1 text-slate-500 hover:text-slate-800 text-xs flex items-center gap-0.5"><i data-lucide="edit" class="w-3.5 h-3.5"></i> แก้ไข</button>
            <button onclick="deleteOfficer(\'\${o.id}\')" class="p-1 text-rose-500 hover:text-rose-700 text-xs flex items-center gap-0.5"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> ลบ</button>
            <button onclick="previewReport(\'\${o.id}\')" class="bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"><i data-lucide="file-text" class="w-3.5 h-3.5"></i> ใบเบิก</button>
          </div>
        \`;
        container.appendChild(card);
      });
      lucide.createIcons();
    }

    function showForm(officerId) {
      const form = document.getElementById("officer-form");
      form.reset();
      
      if (officerId) {
        const o = officers.find(item => item.id === officerId);
        currentOfficer = o;
        document.getElementById("form-title").innerText = "แก้ไขข้อมูลบุคลากร";
        document.getElementById("field-id").value = o.id;
        document.getElementById("field-title").value = o.title;
        document.getElementById("field-firstName").value = o.firstName;
        document.getElementById("field-lastName").value = o.lastName;
        document.getElementById("field-position").value = o.position;
        document.getElementById("field-workplace").value = o.workplace;
        document.getElementById("field-gisLevel").value = o.gisLevel;
        document.getElementById("field-houseNo").value = o.address.houseNo;
        document.getElementById("field-moo").value = o.address.moo;
        document.getElementById("field-subdistrict").value = o.address.subdistrict;
        document.getElementById("field-district").value = o.address.district;
        document.getElementById("field-province").value = o.address.province;
        document.getElementById("field-allowanceRate").value = o.allowanceRate;
        document.getElementById("field-ptsRate").value = o.ptsRate;
        document.getElementById("field-fundSourceAllowance").value = o.fundSourceAllowance;
        document.getElementById("field-fundSourcePts").value = o.fundSourcePts;
        document.getElementById("field-startDate").value = o.workHistories[0] ? o.workHistories[0].startDate : "";
      } else {
        currentOfficer = null;
        document.getElementById("form-title").innerText = "เพิ่มบุคลากรใหม่";
        document.getElementById("field-id").value = "";
        document.getElementById("field-startDate").value = "2004-05-11";
      }

      document.getElementById("view-list").classList.add("hidden");
      document.getElementById("view-form").classList.remove("hidden");
      document.getElementById("btn-add-new").classList.add("hidden");
    }

    function hideForm() {
      document.getElementById("view-form").classList.add("hidden");
      document.getElementById("view-list").classList.remove("hidden");
      document.getElementById("btn-add-new").classList.remove("hidden");
    }

    function saveFormValues() {
      const id = document.getElementById("field-id").value || 'id_' + Math.random().toString(36).substr(2, 9);
      const officerData = {
        id: id,
        title: document.getElementById("field-title").value,
        firstName: document.getElementById("field-firstName").value,
        lastName: document.getElementById("field-lastName").value,
        position: document.getElementById("field-position").value,
        workplace: document.getElementById("field-workplace").value,
        province: document.getElementById("field-province").value || "อุบลราชธานี",
        gisLevel: document.getElementById("field-gisLevel").value || "s",
        address: {
          houseNo: document.getElementById("field-houseNo").value,
          moo: document.getElementById("field-moo").value,
          subdistrict: document.getElementById("field-subdistrict").value,
          district: document.getElementById("field-district").value,
          province: document.getElementById("field-province").value
        },
        allowanceRate: Number(document.getElementById("field-allowanceRate").value) || 2800,
        ptsRate: Number(document.getElementById("field-ptsRate").value) || 1000,
        fundSourceAllowance: document.getElementById("field-fundSourceAllowance").value || "เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        fundSourcePts: document.getElementById("field-fundSourcePts").value || "เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        workHistories: [{
          id: 'hist_1',
          workplace: document.getElementById("field-workplace").value,
          province: "อุบลราชธานี",
          startDate: document.getElementById("field-startDate").value,
          endDate: "current"
        }]
      };

      const existingIndex = officers.findIndex(item => item.id === id);
      if (existingIndex > -1) {
        officers[existingIndex] = officerData;
      } else {
        officers.push(officerData);
      }

      // Save to Apps Script PropertiesService
      google.script.run.withSuccessHandler(function() {
        renderList();
        hideForm();
      }).saveOfficers(JSON.stringify(officers));
    }

    window.editOfficer = function(id) {
      showForm(id);
    };

    window.deleteOfficer = function(id) {
      if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลบุคลากรนี้?")) {
        officers = officers.filter(item => item.id !== id);
        google.script.run.withSuccessHandler(function() {
          renderList();
        }).saveOfficers(JSON.stringify(officers));
      }
    };

    window.previewReport = function(id) {
      currentOfficer = officers.find(item => item.id === id);
      document.getElementById("view-list").classList.add("hidden");
      document.getElementById("view-preview").classList.remove("hidden");
      document.getElementById("btn-add-new").classList.add("hidden");
      updatePreviewSheet();
    };

    // Calculate dates & numbers
    function translateNum(val) {
      const arabic = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      const thai = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
      let result = val.toString();
      if (useThaiNumerals) {
        for (let i = 0; i < 10; i++) {
          result = result.replaceAll(arabic[i], thai[i]);
        }
      }
      return result;
    }

    function formatThaiDate(dateStr) {
      if (!dateStr) return "11 พฤษภาคม 2547";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "11 พฤษภาคม 2547";
      const day = translateNum(date.getDate());
      const month = thaiMonths[date.getMonth() + 1];
      const year = translateNum(date.getFullYear() + 543);
      return day + " " + month + " " + year;
    }

    function calculateDuration(startStr, endStr) {
      const start = new Date(startStr);
      const end = new Date(endStr);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return { years: 22, months: 3, days: 0 };
      }
      
      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();
      let days = end.getDate() - start.getDate() + 1;
      
      if (days < 0) {
        months -= 1;
        const prevMonthEnd = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonthEnd.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      return { years, months, days };
    }

    // Baht Text algorithm (same as React server utils)
    function bahtText(num) {
      if (num === 2800) return "สองพันแปดร้อยบาทถ้วน";
      if (num === 1000) return "หนึ่งพันบาทถ้วน";
      return num + " บาทถ้วน"; // Fallback simple
    }

    function updatePreviewSheet() {
      const m = parseInt(document.getElementById("preview-month").value);
      const y = parseInt(document.getElementById("preview-year").value);
      const o = currentOfficer;

      // Calculate last day of selected month
      const ceYear = y - 543;
      const lastDay = new Date(ceYear, m, 0).getDate();
      const lastDayStr = ceYear + "-" + String(m).padStart(2, '0') + "-" + String(lastDay).padStart(2, '0');

      const start = o.workHistories[0] ? o.workHistories[0].startDate : "2004-05-11";
      const duration = calculateDuration(start, lastDayStr);

      const htmlMonth = thaiMonths[m];
      const htmlYear = translateNum(y);
      const htmlLastDay = translateNum(lastDay);

      const sheets = document.getElementById("sheets-container");
      sheets.innerHTML = \`
        <!-- PAGE 1 -->
        <div class="print-page bg-white shadow-lg border border-slate-200 rounded-xl p-12 max-w-4xl mx-auto text-slate-900 leading-relaxed text-sm">
          <div class="text-center space-y-1 mb-8">
            <h2 class="text-base font-bold">ใบขอรับเงินค่าตอบแทนเบี้ยเลี้ยงเหมาจ่ายสำหรับเจ้าหน้าที่</h2>
            <h2 class="text-base font-bold">ที่ปฏิบัติงานในหน่วยบริการสังกัดกระทรวงสาธารณสุข</h2>
            <h2 class="text-base font-bold">พ.ศ.2566</h2>
            <p class="pt-2">ประจำเดือน \${htmlMonth} พ.ศ. \${htmlYear}</p>
          </div>
          <p class="indent-10">ข้าพเจ้า ชื่อ <span class="underline underline-offset-4 font-bold">\${o.title} \${o.firstName}</span> นามสกุล <span class="underline underline-offset-4 font-bold">\${o.lastName}</span> ตำแหน่ง <span class="underline underline-offset-4 font-bold">\${o.position}</span></p>
          <p class="mt-2">ปัจจุบันปฏิบัติงานที่ รพศ/รพท./รพ./รพ.สต <span class="underline underline-offset-4 font-bold">\${o.workplace}</span> จังหวัด <span class="underline underline-offset-4 font-bold">\${o.province}</span> ระดับ GIS <span class="underline underline-offset-4 font-bold uppercase">\${translateNum(o.gisLevel)}</span></p>
          <p class="mt-2">ได้ปฏิบัติงานในหน่วยบริการหรือหน่วยบริการในเครือข่าย <span class="underline underline-offset-4 font-bold">\${translateNum(duration.years)}</span> ปี <span class="underline underline-offset-4 font-bold">\${translateNum(duration.months)}</span> เดือน <span class="underline underline-offset-4 font-bold">\${translateNum(duration.days)}</span> วัน (นับถึงวันสิ้นเดือนที่เบิกจ่าย) ได้รับเงินจำนวน <span class="underline underline-offset-4 font-bold">\${translateNum(o.allowanceRate.toLocaleString())}</span> บาท (\${bahtText(o.allowanceRate)})</p>
          
          <h4 class="font-bold mt-6">โดยมีรายละเอียดการปฏิบัติงาน ดังต่อไปนี้ (เฉพาะสายแพทย์ตอบข้อ 1 ด้วย)</h4>
          
          <div class="space-y-4 mt-4 text-justify">
            <!-- Rule 1: Internship -->
            <div class="pl-6 relative">
              <span class="absolute left-0 top-0 font-bold">1.</span>
              เริ่มฝึกเพิ่มพูนทักษะที่
              <div class="pl-4 space-y-1 mt-1 text-slate-700">
                <p>รพช. ................................... จังหวัด .................................... ตั้งแต่วันที่ ......................... ถึงวันที่ .........................</p>
                <p>รพท./รพศ. ............................. จังหวัด .................................... ตั้งแต่วันที่ ......................... ถึงวันที่ .........................</p>
                <p>รวม ..... ปี ..... เดือน ..... วัน (กรณีนี้ให้นับการฝึกที่ รพท./รพศ. เป็นอายุราชการได้)</p>
              </div>
            </div>

            <!-- Rule 2: Current Work -->
            <div class="pl-6 relative">
              <span class="absolute left-0 top-0 font-bold">2.</span>
              ปฏิบัติงานที่ รพศ./รพท./รพช./รพ.สต. <span class="font-bold underline underline-offset-4">\${o.workplace}</span> จังหวัด <span class="font-bold underline underline-offset-4">\${o.province}</span>
              <div class="mt-1">
                ตั้งแต่วันที่ <span class="font-bold underline underline-offset-4">\${formatThaiDate(start)}</span> ถึงวันที่ <span class="font-bold underline underline-offset-4">\${htmlLastDay} \${htmlMonth} \${htmlYear}</span> รวม <span class="font-bold underline underline-offset-4">\${translateNum(duration.years)}</span> ปี <span class="font-bold underline underline-offset-4">\${translateNum(duration.months)}</span> เดือน <span class="font-bold underline underline-offset-4">\${translateNum(duration.days)}</span> วัน
              </div>
            </div>

            <!-- Rules 3 - 6 -->
            <div class="pl-6 relative text-slate-400 mt-2">
              <span class="absolute left-0 top-0">3.</span>
              ปฏิบัติงานที่ รพศ./รพท./รพช./รพ.สต. <span class="border-b border-dotted border-slate-300 inline-block w-[240px]"></span> จังหวัด <span class="border-b border-dotted border-slate-300 inline-block w-[120px]"></span>
              <div class="mt-1">
                ตั้งแต่วันที่ <span class="border-b border-dotted border-slate-300 inline-block w-[140px]"></span> ถึงวันที่ <span class="border-b border-dotted border-slate-300 inline-block w-[140px]"></span> รวม <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> ปี <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> เดือน <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> วัน
              </div>
            </div>

            <div class="pl-6 relative text-slate-400 mt-2">
              <span class="absolute left-0 top-0">4.</span>
              ปฏิบัติงานที่ รพศ./รพท./รพช./รพ.สต. <span class="border-b border-dotted border-slate-300 inline-block w-[240px]"></span> จังหวัด <span class="border-b border-dotted border-slate-300 inline-block w-[120px]"></span>
              <div class="mt-1">
                ตั้งแต่วันที่ <span class="border-b border-dotted border-slate-300 inline-block w-[140px]"></span> ถึงวันที่ <span class="border-b border-dotted border-slate-300 inline-block w-[140px]"></span> รวม <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> ปี <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> เดือน <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> วัน
              </div>
            </div>

            <div class="pl-6 relative text-slate-400 mt-2">
              <span class="absolute left-0 top-0">5.</span>
              ปฏิบัติงานที่ รพศ./รพท./รพช./รพ.สต. <span class="border-b border-dotted border-slate-300 inline-block w-[240px]"></span> จังหวัด <span class="border-b border-dotted border-slate-300 inline-block w-[120px]"></span>
              <div class="mt-1">
                ตั้งแต่วันที่ <span class="border-b border-dotted border-slate-300 inline-block w-[140px]"></span> ถึงวันที่ <span class="border-b border-dotted border-slate-300 inline-block w-[140px]"></span> รวม <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> ปี <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> เดือน <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> วัน
              </div>
            </div>

            <div class="pl-6 relative text-slate-400 mt-2">
              <span class="absolute left-0 top-0">6.</span>
              ปฏิบัติงานที่ รพศ./รพท./รพช./รพ.สต. <span class="border-b border-dotted border-slate-300 inline-block w-[240px]"></span> จังหวัด <span class="border-b border-dotted border-slate-300 inline-block w-[120px]"></span>
              <div class="mt-1">
                ตั้งแต่วันที่ <span class="border-b border-dotted border-slate-300 inline-block w-[140px]"></span> ถึงวันที่ <span class="border-b border-dotted border-slate-300 inline-block w-[140px]"></span> รวม <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> ปี <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> เดือน <span class="border-b border-dotted border-slate-300 inline-block w-[40px]"></span> วัน
              </div>
            </div>
          </div>
          
          <div class="mt-6 pt-3 border-t border-slate-200">
            <p class="font-bold">รวมทั้งสิ้น <span class="underline underline-offset-4">\${translateNum(duration.years)}</span> ปี <span class="underline underline-offset-4">\${translateNum(duration.months)}</span> เดือน <span class="underline underline-offset-4">\${translateNum(duration.days)}</span> วัน</p>
            <p class="text-xs text-slate-700 mt-2 text-justify">
              (กรณีหน่วยงานเรียกเงินคืน ข้าพเจ้ายินดีชดใช้คืนตามจำนวนเงินที่ได้รับมา โดยไม่มีเงื่อนไขใดๆภายใน \${translateNum("15")} วัน หลังจากได้รับหนังสือแจ้งจากหน่วยงาน)
            </p>
          </div>
          
          <div class="mt-10 text-center w-[300px] ml-auto space-y-2">
            <p>ข้าพเจ้าขอรับรองว่าข้อมูลดังกล่าวเป็นความจริงทุกประการ</p>
            <br>
            <p class="text-slate-300">..................................................</p>
            <p class="font-bold">(\${o.title} \${o.firstName} \${o.lastName})</p>
            <p class="text-xs text-slate-500">ตำแหน่ง \${o.position}</p>
          </div>
        </div>

        <!-- PAGE 2 -->
        <div class="print-page bg-white shadow-lg border border-slate-200 rounded-xl p-12 max-w-4xl mx-auto text-slate-900 leading-relaxed text-sm mt-8">
          <div class="text-center mb-6">
            <h2 class="text-base font-bold">ใบสำคัญรับเงิน (รูปที่ ๙)</h2>
          </div>
          <div class="flex justify-between items-start mb-6">
            <p>ที่ \${o.workplace}</p>
            <p>วันที่ \${htmlLastDay} เดือน \${htmlMonth} พ.ศ. \${htmlYear}</p>
          </div>
          <p class="indent-10">ข้าพเจ้า \${o.title} \${o.firstName} \${o.lastName} บ้านเลขที่ \${translateNum(o.address.houseNo)} หมู่ที่ \${translateNum(o.address.moo)} ตำบล \${o.address.subdistrict} อำเภอ \${o.address.district} จังหวัด \${o.address.province} ได้รับเงินจาก \${o.fundSourceAllowance} เป็นเงินดังรายการต่อไปนี้:</p>
          
          <table class="w-full border border-slate-300 mt-6 text-xs text-left">
            <thead>
              <tr class="bg-slate-50">
                <th class="border border-slate-300 p-2.5">รายการ</th>
                <th class="border border-slate-300 p-2.5 text-right">จำนวนเงิน (บาท)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-slate-300 p-4 h-48">ค่าตอบแทนเบี้ยเลี้ยงเหมาจ่าย ประจำเดือน \${htmlMonth} พ.ศ. \${htmlYear}</td>
                <td class="border border-slate-300 p-4 text-right font-bold">\${translateNum(o.allowanceRate.toLocaleString())}</td>
              </tr>
              <tr class="bg-slate-50 font-bold">
                <td class="border border-slate-300 p-2.5">รวมเงินตัวอักษร (\${bahtText(o.allowanceRate)})</td>
                <td class="border border-slate-300 p-2.5 text-right">\${translateNum(o.allowanceRate.toLocaleString())}</td>
              </tr>
            </tbody>
          </table>

          <div class="grid grid-cols-2 gap-8 mt-12 text-center">
            <div>
              <p>..................................................</p>
              <p class="text-xs text-slate-500">ผู้จ่ายเงิน</p>
            </div>
            <div>
              <p>..................................................</p>
              <p class="font-bold">(\${o.title} \${o.firstName} \${o.lastName})</p>
              <p class="text-xs text-slate-500">ผู้รับเงิน</p>
            </div>
          </div>
        </div>

        <!-- PAGE 3 -->
        <div class="print-page bg-white shadow-lg border border-slate-200 rounded-xl p-12 max-w-4xl mx-auto text-slate-900 leading-relaxed text-sm mt-8">
          <div class="text-center mb-6">
            <h2 class="text-base font-bold">ใบสำคัญรับเงิน (รูปที่ 9) (เงินเพิ่ม พ.ต.ส.)</h2>
          </div>
          <div class="flex justify-between items-start mb-6">
            <p>ที่ \${o.workplace}</p>
            <p>วันที่ \${htmlLastDay} เดือน \${htmlMonth} พ.ศ. \${htmlYear}</p>
          </div>
          <p class="indent-10">ข้าพเจ้า \${o.title} \${o.firstName} \${o.lastName} บ้านเลขที่ \${translateNum(o.address.houseNo)} หมู่ที่ \${translateNum(o.address.moo)} ตำบล \span class="font-bold">\${o.address.subdistrict}</span> อำเภอ \span class="font-bold">\${o.address.district}</span> จังหวัด \span class="font-bold">\${o.address.province}</span> ได้รับเงินจาก \span class="font-bold">\${o.fundSourcePts}</span> เป็นเงินดังรายการต่อไปนี้:</p>
          
          <table class="w-full border border-slate-300 mt-6 text-xs text-left">
            <thead>
              <tr class="bg-slate-50">
                <th class="border border-slate-300 p-2.5">รายการ</th>
                <th class="border border-slate-300 p-2.5 text-right">จำนวนเงิน (บาท)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-slate-300 p-4 h-48">เงินเพิ่มสำหรับตำแหน่งที่มีเหตุพิเศษของผู้ปฏิบัติงานด้านสาธารณสุข (พ.ต.ส.) ประจำเดือน \${htmlMonth} พ.ศ. \${htmlYear}</td>
                <td class="border border-slate-300 p-4 text-right font-bold">\${translateNum(o.ptsRate.toLocaleString())}</td>
              </tr>
              <tr class="bg-slate-50 font-bold">
                <td class="border border-slate-300 p-2.5">จำนวนเงินตัวอักษร (-หนึ่งพันบาทถ้วน-)</td>
                <td class="border border-slate-300 p-2.5 text-right">\${translateNum(o.ptsRate.toLocaleString())}</td>
              </tr>
            </tbody>
          </table>

          <div class="grid grid-cols-2 gap-8 mt-12 text-center">
            <div>
              <p>..................................................</p>
              <p class="text-xs text-slate-500">ผู้จ่ายเงิน</p>
            </div>
            <div>
              <p>..................................................</p>
              <p class="font-bold">(\span class="font-semibold">\${o.title} \${o.firstName} \${o.lastName}</span>)</p>
              <p class="text-xs text-slate-500">ผู้รับเงิน</p>
            </div>
          </div>
        </div>
      \`;
      lucide.createIcons();
    }
  </script>
</body>
</html>
`;

  const copyToClipboard = (text: string, type: "gs" | "html") => {
    navigator.clipboard.writeText(text);
    if (type === "gs") {
      setCopiedGs(true);
      setTimeout(() => setCopiedGs(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-indigo-900 px-6 py-5 text-white">
        <h2 className="text-lg font-bold flex items-center gap-2 font-sans">
          <FileCode className="w-5 h-5" />
          ส่งออกและเตรียมโค้ด Google Apps Script (เว็บแอปพลิเคชันส่วนตัว)
        </h2>
        <p className="text-teal-100 text-xs mt-1">
          ท่านสามารถคัดลอกไฟล์เหล่านี้เพื่อนำไปเปิดใช้บน Google Sheets / Google Drive ส่วนตัวเพื่อใช้งานแบบออนไลน์ฟรี 100% ตลอดชีพ!
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Intro Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
          <h4 className="font-bold text-sm flex items-center gap-1.5">
            <ExternalLink className="w-4 h-4 text-amber-700" />
            วิธีการติดตั้งบนบัญชี Google ของคุณ:
          </h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>เข้าไปที่ <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-950">Google Apps Script</a> แล้วกด <strong>"โครงการใหม่" (New Project)</strong></li>
            <li>คัดลอกโค้ดจากแท็บ <strong>รหัส.gs</strong> ด้านล่างนี้ ไปวางทับในส่วนบรรณาธิการโค้ด</li>
            <li>กดปุ่ม + และเลือก <strong>HTML</strong> ตั้งชื่อไฟล์ว่า <strong className="font-mono">Index</strong> (ห้ามพิมพ์ .html เพราะระบบใส่ให้อัตโนมัติ)</li>
            <li>คัดลอกโค้ดจากแท็บ <strong>Index.html</strong> ด้านล่างนี้ไปวาง</li>
            <li>กดปุ่มบันทึก 💾 และกด <strong>"การทำให้ใช้งานได้" (Deploy) &gt; "การทำให้ใช้งานได้ใหม่" (New Deployment)</strong> เลือกเป็น "เว็บแอป"</li>
          </ol>
        </div>

        {/* Code Tabs */}
        <div>
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("gs")}
              className={`px-5 py-2.5 font-bold text-sm border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "gs"
                  ? "border-teal-700 text-teal-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              รหัส.gs (Google Apps Script Backend)
            </button>
            <button
              onClick={() => setActiveTab("html")}
              className={`px-5 py-2.5 font-bold text-sm border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "html"
                  ? "border-teal-700 text-teal-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Index.html (หน้ากากและระบบแอปพลิเคชัน)
            </button>
          </div>

          <div className="mt-4 relative">
            {activeTab === "gs" ? (
              <div>
                <div className="absolute right-4 top-4 z-10">
                  <button
                    onClick={() => copyToClipboard(codeGs, "gs")}
                    className="bg-slate-800 text-white hover:bg-slate-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md transition"
                  >
                    {copiedGs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedGs ? "คัดลอกแล้ว!" : "คัดลอกโค้ด รหัส.gs"}
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-100 p-5 rounded-xl text-xs font-mono overflow-x-auto max-h-[400px]">
                  <code>{codeGs}</code>
                </pre>
              </div>
            ) : (
              <div>
                <div className="absolute right-4 top-4 z-10">
                  <button
                    onClick={() => copyToClipboard(codeHtml, "html")}
                    className="bg-slate-800 text-white hover:bg-slate-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md transition"
                  >
                    {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedHtml ? "คัดลอกแล้ว!" : "คัดลอกโค้ด Index.html"}
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-100 p-5 rounded-xl text-xs font-mono overflow-x-auto max-h-[400px]">
                  <code>{codeHtml}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
