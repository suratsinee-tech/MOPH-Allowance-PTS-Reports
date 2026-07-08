/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Officer } from "./types";
import OfficerList from "./components/OfficerList";
import OfficerForm from "./components/OfficerForm";
import ReportPreview from "./components/ReportPreview";
import AppsScriptExport from "./components/AppsScriptExport";
import { 
  Users, 
  FileText, 
  UserPlus, 
  CreditCard, 
  Heart, 
  ClipboardCheck, 
  Sparkles, 
  FileCode,
  Database,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { 
  isSupabaseConfigured, 
  getOfficersFromSupabase, 
  upsertOfficerToSupabase, 
  deleteOfficerFromSupabase 
} from "./lib/supabase";

// Pre-seeded sample data matching the exact templates submitted by the user
const SAMPLE_OFFICERS: Officer[] = [
  {
    id: "thanwit-kamtha",
    title: "นาย",
    firstName: "ธันญ์นวิชญ์",
    lastName: "คำทา",
    position: "นักเทคนิคการแพทย์ชำนาญการ",
    workplace: "โรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
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
    workHistories: [
      {
        id: "hist-1",
        workplace: "โรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        province: "อุบลราชธานี",
        startDate: "2004-05-11", // 11 พฤษภาคม 2547
        endDate: "current"
      }
    ]
  }
];

export default function App() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [activeView, setActiveView] = useState<"list" | "form" | "preview" | "export">("list");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  
  // Supabase states
  const [dbStatus, setDbStatus] = useState<"not_configured" | "connecting" | "connected" | "error">("connecting");
  const [dbErrorMsg, setDbErrorMsg] = useState<string>("");
  const [showDbConfig, setShowDbConfig] = useState<boolean>(false);

  // Load from Supabase with LocalStorage fallback
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured) {
        setDbStatus("connecting");
        try {
          const dbOfficers = await getOfficersFromSupabase();
          setOfficers(dbOfficers);
          setDbStatus("connected");
          // Mirror to localStorage
          localStorage.setItem("moph_officers", JSON.stringify(dbOfficers));
        } catch (err: any) {
          console.error("Failed to connect to Supabase:", err);
          setDbStatus("error");
          setDbErrorMsg(err?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Supabase");
          
          // Fallback to local storage
          const saved = localStorage.getItem("moph_officers");
          if (saved) {
            try {
              setOfficers(JSON.parse(saved));
            } catch (e) {
              setOfficers(SAMPLE_OFFICERS);
            }
          } else {
            setOfficers(SAMPLE_OFFICERS);
          }
        }
      } else {
        setDbStatus("not_configured");
        const saved = localStorage.getItem("moph_officers");
        if (saved) {
          try {
            setOfficers(JSON.parse(saved));
          } catch (e) {
            setOfficers(SAMPLE_OFFICERS);
          }
        } else {
          setOfficers(SAMPLE_OFFICERS);
          localStorage.setItem("moph_officers", JSON.stringify(SAMPLE_OFFICERS));
        }
      }
    }
    loadData();
  }, []);

  const handleSaveOfficer = async (officer: Officer) => {
    const isEdit = !!editingOfficer;
    let updated: Officer[];
    if (isEdit) {
      updated = officers.map(o => o.id === officer.id ? officer : o);
    } else {
      updated = [...officers, officer];
    }

    if (isSupabaseConfigured && dbStatus === "connected") {
      try {
        await upsertOfficerToSupabase(officer);
        setOfficers(updated);
        localStorage.setItem("moph_officers", JSON.stringify(updated));
        setEditingOfficer(null);
        setActiveView("list");
      } catch (err: any) {
        console.error("Error saving to Supabase:", err);
        alert("ไม่สามารถบันทึกข้อมูลไปยัง Supabase ได้: " + (err?.message || "กรุณาตรวจสอบสิทธิ์การเขียนข้อมูล"));
      }
    } else {
      // Local fallback
      setOfficers(updated);
      localStorage.setItem("moph_officers", JSON.stringify(updated));
      setEditingOfficer(null);
      setActiveView("list");
    }
  };

  const handleDeleteOfficer = async (id: string) => {
    if (confirm("ยืนยันการลบรายชื่อบุคลากรรายนี้ออกจากฐานข้อมูล?")) {
      const updated = officers.filter(o => o.id !== id);
      
      if (isSupabaseConfigured && dbStatus === "connected") {
        try {
          await deleteOfficerFromSupabase(id);
          setOfficers(updated);
          localStorage.setItem("moph_officers", JSON.stringify(updated));
        } catch (err: any) {
          console.error("Error deleting from Supabase:", err);
          alert("ไม่สามารถลบข้อมูลจาก Supabase ได้: " + (err?.message || ""));
        }
      } else {
        // Local fallback
        setOfficers(updated);
        localStorage.setItem("moph_officers", JSON.stringify(updated));
      }
    }
  };

  const handleEditOfficer = (officer: Officer) => {
    setEditingOfficer(officer);
    setActiveView("form");
  };

  const handleSelectOfficer = (officer: Officer) => {
    setSelectedOfficer(officer);
    setActiveView("preview");
  };

  const handleLoadSampleData = async () => {
    const samples: Officer[] = [
      {
        id: "doctor-somrak",
        title: "พญ.",
        firstName: "สมรักษ์",
        lastName: "ดีจริง",
        position: "นายแพทย์ชำนาญการพิเศษ",
        workplace: "โรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        province: "อุบลราชธานี",
        gisLevel: "s",
        address: {
          houseNo: "123",
          moo: "1",
          subdistrict: "เดชอุดม",
          district: "เดชอุดม",
          province: "อุบลราชธานี"
        },
        allowanceRate: 2800,
        ptsRate: 10000,
        fundSourceAllowance: "เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        fundSourcePts: "เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        workHistories: [
          {
            id: "hist-doc-1",
            workplace: "โรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
            province: "อุบลราชธานี",
            startDate: "2012-04-10",
            endDate: "current"
          }
        ]
      },
      {
        id: "dentist-kreangkrai",
        title: "ทพ.",
        firstName: "เกรียงไกร",
        lastName: "รักชาติ",
        position: "ทันตแพทย์ชำนาญการพิเศษ",
        workplace: "โรงพยาบาลเดชอุดม",
        province: "อุบลราชธานี",
        gisLevel: "b",
        address: {
          houseNo: "45",
          moo: "2",
          subdistrict: "กุดประทาย",
          district: "เดชอุดม",
          province: "อุบลราชธานี"
        },
        allowanceRate: 2200,
        ptsRate: 10000,
        fundSourceAllowance: "เงินบำรุงโรงพยาบาลเดชอุดม",
        fundSourcePts: "เงินงบประมาณโรงพยาบาลเดชอุดม",
        workHistories: [
          {
            id: "hist-den-1",
            workplace: "โรงพยาบาลเดชอุดม",
            province: "อุบลราชธานี",
            startDate: "2008-01-15",
            endDate: "current"
          }
        ]
      },
      {
        id: "nurse-phatcharaporn",
        title: "นาง",
        firstName: "พัชราภรณ์",
        lastName: "แสนดี",
        position: "พยาบาลวิชาชีพชำนาญการพิเศษ",
        workplace: "โรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        province: "อุบลราชธานี",
        gisLevel: "s",
        address: {
          houseNo: "88/1",
          moo: "5",
          subdistrict: "เมืองเดช",
          district: "เดชอุดม",
          province: "อุบลราชธานี"
        },
        allowanceRate: 1800,
        ptsRate: 1500,
        fundSourceAllowance: "เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        fundSourcePts: "เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        workHistories: [
          {
            id: "hist-nur-1",
            workplace: "โรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
            province: "อุบลราชธานี",
            startDate: "2006-11-01",
            endDate: "current"
          }
        ]
      },
      {
        id: "pharmacist-adirek",
        title: "นาย",
        firstName: "อดิเรก",
        lastName: "มานะ",
        position: "เภสัชกรชำนาญการ",
        workplace: "โรงพยาบาลเดชอุดม",
        province: "อุบลราชธานี",
        gisLevel: "a",
        address: {
          houseNo: "56",
          moo: "3",
          subdistrict: "ป่าโมง",
          district: "เดชอุดม",
          province: "อุบลราชธานี"
        },
        allowanceRate: 1500,
        ptsRate: 5000,
        fundSourceAllowance: "เงินบำรุงโรงพยาบาลเดชอุดม",
        fundSourcePts: "เงินงบประมาณโรงพยาบาลเดชอุดม",
        workHistories: [
          {
            id: "hist-ph-1",
            workplace: "โรงพยาบาลเดชอุดม",
            province: "อุบลราชธานี",
            startDate: "2018-05-16",
            endDate: "current"
          }
        ]
      }
    ];

    const existingIds = new Set(officers.map(o => o.id));
    const newSamples = samples.filter(s => !existingIds.has(s.id));

    if (newSamples.length === 0) {
      alert("มีบุคลากรตัวอย่างทั้งหมดในระบบเรียบร้อยแล้ว");
      return;
    }

    const updated = [...officers, ...newSamples];
    setOfficers(updated);
    localStorage.setItem("moph_officers", JSON.stringify(updated));

    if (isSupabaseConfigured && dbStatus === "connected") {
      try {
        for (const sample of newSamples) {
          await upsertOfficerToSupabase(sample);
        }
      } catch (err) {
        console.error("Error seeding to Supabase:", err);
      }
    }
    alert(`เพิ่มรายชื่อบุคลากรจำลองสำเร็จจำนวน ${newSamples.length} รายชื่อ!`);
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50/70 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Upper Navigation Header (hidden on print) */}
      <header className="no-print bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700 rounded-xl text-white shadow-md shadow-emerald-700/10">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">MOPH Allowance & PTS Reports</h1>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  พ.ศ. 2566
                </span>
                
                {/* Supabase Status Badges */}
                {dbStatus === "connecting" && (
                  <span className="bg-amber-50 text-amber-800 border border-amber-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    กำลังเชื่อมต่อ Supabase...
                  </span>
                )}
                {dbStatus === "connected" && (
                  <span className="bg-teal-50 text-teal-800 border border-teal-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    เชื่อมต่อ Supabase สำเร็จ 🟢
                  </span>
                )}
                {dbStatus === "error" && (
                  <span 
                    className="bg-rose-50 text-rose-800 border border-rose-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-help shadow-sm"
                    title={dbErrorMsg}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Supabase ผิดพลาด (ใช้โหมดออฟไลน์) 🔴
                  </span>
                )}
                {dbStatus === "not_configured" && (
                  <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    โหมด Local (ออฟไลน์) 🟡
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">ระบบจัดทำเอกสารเบี้ยเลี้ยงเหมาจ่าย และ ค่าตอบแทน พ.ต.ส. ประจำเดือน</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView("export");
                setSelectedOfficer(null);
                setEditingOfficer(null);
              }}
              className="bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <FileCode className="w-4 h-4 text-indigo-600" />
              โค้ด Google Apps Script 💾
            </button>

            <button
              onClick={() => {
                setEditingOfficer(null);
                setActiveView("form");
              }}
              className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              เพิ่มบุคลากรใหม่
            </button>
            
            <button
              onClick={() => {
                setActiveView("list");
                setSelectedOfficer(null);
                setEditingOfficer(null);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              ทำเนียบบุคลากร
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === "list" && (
          <div className="space-y-6">
            {/* Quick Banner Alert */}
            <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-900 text-white rounded-2xl p-6 shadow-md shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border border-teal-800/25">
              <div className="space-y-2 relative z-10">
                <h2 className="text-xl font-bold font-sans flex items-center gap-2 text-white">
                  <ClipboardCheck className="w-6 h-6 text-emerald-300" />
                  โปรแกรมพิมพ์เบี้ยเลี้ยงเหมาจ่ายและเงิน พ.ต.ส.
                </h2>
                <p className="text-sm text-emerald-50/95 max-w-xl font-medium leading-relaxed">
                  หมดปัญหาการคำนวณวันสะสมและกรอกแบบฟอร์มแบบเดิม ระบบจะคำนวณอายุราชการ
                  แปลจำนวนเงินเป็นภาษาไทยให้อัตโนมัติ พร้อมส่งออกทางเครื่องพิมพ์หรือเซฟเป็นไฟล์ PDF ได้ทันที
                </p>
              </div>
              <div className="relative z-10 shrink-0">
                <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-xs space-y-1 text-white font-semibold shadow-sm">
                  <p>✔ ระบบคำนวณอายุงานอัตโนมัติ</p>
                  <p>✔ ออกแบบเอกสารแบบร่างราชการ</p>
                  <p>✔ ปรับเลขไทย/อารบิกได้เพียงปุ่มเดียว</p>
                </div>
              </div>
              {/* Decorative graphic background lines */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.4),transparent)] pointer-events-none"></div>
            </div>

            {/* Supabase Integration Helper Guide */}
            <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-700">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">การเชื่อมต่อฐานข้อมูล Supabase 🗄️</h3>
                    <p className="text-xs text-slate-500">ซิงก์ข้อมูลรายชื่อและประวัติบุคลากรแบบเรียลไทม์ผ่านคลาวด์</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {isSupabaseConfigured ? (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      กำหนดค่าคีย์ในระบบแล้ว
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-800 border border-amber-100 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      ยังไม่ได้เชื่อมต่อระบบคลาวด์
                    </span>
                  )}
                  <button
                    onClick={() => setShowDbConfig(!showDbConfig)}
                    className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    {showDbConfig ? "ซ่อนขั้นตอน ▴" : "แสดงขั้นตอน ▾"}
                  </button>
                </div>
              </div>

              {showDbConfig && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                      ขั้นตอนการตั้งค่า Environment Variables
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                      <li>เปิดเมนู <strong>Settings</strong> ของหน้าต่าง AI Studio</li>
                      <li>เพิ่มตัวแปรลับ (Secrets) สองตัวดังนี้:</li>
                      <li className="list-none pl-3 font-mono text-[10px] text-indigo-700">
                        • <code className="bg-slate-200/65 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code><br/>
                        • <code className="bg-slate-200/65 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>
                      </li>
                      <li>เมื่อใส่คีย์เสร็จแล้ว ระบบจะรีสตาร์ทและเชื่อมต่อฐานข้อมูลอัตโนมัติ!</li>
                    </ol>
                  </div>

                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                        สคริปต์สร้างตาราง SQL Schema
                      </p>
                      <p className="text-slate-600 pl-5 mt-1 leading-relaxed">
                        คุณสามารถคัดลอกไฟล์สคริปต์ SQL ของเราไปวางในช่อง <strong>SQL Editor</strong> ของหน้าเว็บ Supabase เพื่อสร้างตาราง <code>officers</code> และเปิดใช้งาน Row Level Security (RLS) ได้ในคลิกเดียว
                      </p>
                    </div>
                    <div className="pt-2 pl-5">
                      <a
                        href="/supabase_schema.sql"
                        target="_blank"
                        download="supabase_schema.sql"
                        className="inline-flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 font-semibold underline"
                      >
                        <FileCode className="w-4 h-4" />
                        เปิดดูไฟล์สคริปต์ SQL โครงสร้างฐานข้อมูล 🗄️
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <OfficerList
              officers={officers}
              onSelect={handleSelectOfficer}
              onEdit={handleEditOfficer}
              onDelete={handleDeleteOfficer}
              onAddNew={() => {
                setEditingOfficer(null);
                setActiveView("form");
              }}
              onLoadSamples={handleLoadSampleData}
            />
          </div>
        )}

        {activeView === "form" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView("list")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2"
              >
                ← กลับสู่หน้ารายชื่อ
              </button>
            </div>
            <OfficerForm
              initialOfficer={editingOfficer || undefined}
              onSave={handleSaveOfficer}
              onCancel={() => {
                setEditingOfficer(null);
                setActiveView("list");
              }}
            />
          </div>
        )}

        {activeView === "preview" && selectedOfficer && (
          <div className="space-y-4">
            <ReportPreview
              officer={selectedOfficer}
              onBack={() => {
                setSelectedOfficer(null);
                setActiveView("list");
              }}
            />
          </div>
        )}

        {activeView === "export" && (
          <div className="space-y-4 animate-in fade-in duration-250">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView("list")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2"
              >
                ← กลับสู่หน้ารายชื่อ
              </button>
            </div>
            <AppsScriptExport />
          </div>
        )}
      </main>

      {/* Footer (hidden on print) */}
      <footer className="no-print bg-white border-t border-slate-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span>© 2026 ระบบจัดเตรียมใบเบิกสาธารณสุข - กระทรวงสาธารณสุข</span>
          </div>
          <div className="flex items-center gap-3">
            <span>ปรับปรุงตามเกณฑ์ประกาศเบี้ยเลี้ยงปี พ.ศ. 2566 และ พ.ต.ส.</span>
            <span>•</span>
            <span className="font-semibold text-slate-500">เวอร์ชัน 1.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
