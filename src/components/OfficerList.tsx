/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Officer } from "../types";
import { 
  User, 
  MapPin, 
  CreditCard, 
  Edit2, 
  Trash2, 
  FileText, 
  Plus, 
  ShieldAlert, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { calculateDuration } from "../utils";

interface OfficerListProps {
  officers: Officer[];
  onSelect: (officer: Officer) => void;
  onEdit: (officer: Officer) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onLoadSamples?: () => void;
}

export default function OfficerList({ 
  officers, 
  onSelect, 
  onEdit, 
  onDelete, 
  onAddNew,
  onLoadSamples 
}: OfficerListProps) {
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [gisFilter, setGisFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "name", "allowance-desc", "pts-desc", "duration-desc"

  // Calculate total career duration for display
  const renderCareerDuration = (officer: Officer) => {
    let totalYears = 0;
    let totalMonths = 0;
    let totalDays = 0;

    officer.workHistories.forEach(hist => {
      const today = new Date().toISOString().split("T")[0];
      const effectiveEnd = hist.endDate === "current" ? today : hist.endDate;
      const duration = calculateDuration(hist.startDate, effectiveEnd);
      totalYears += duration.years;
      totalMonths += duration.months;
      totalDays += duration.days;
    });

    // Normalize months and days
    if (totalDays >= 30) {
      totalMonths += Math.floor(totalDays / 30);
      totalDays = totalDays % 30;
    }
    if (totalMonths >= 12) {
      totalYears += Math.floor(totalMonths / 12);
      totalMonths = totalMonths % 12;
    }

    return `${totalYears} ปี ${totalMonths} เดือน ${totalDays} วัน`;
  };

  // Helper to get raw total career duration in days for sorting
  const getCareerDurationDays = (officer: Officer) => {
    let totalDaysSum = 0;
    officer.workHistories.forEach(hist => {
      const today = new Date().toISOString().split("T")[0];
      const effectiveEnd = hist.endDate === "current" ? today : hist.endDate;
      const duration = calculateDuration(hist.startDate, effectiveEnd);
      totalDaysSum += duration.years * 365 + duration.months * 30 + duration.days;
    });
    return totalDaysSum;
  };

  // Filter and Sort implementation
  const filteredAndSortedOfficers = officers
    .filter(officer => {
      // 1. Search Query Filter
      const fullName = `${officer.title || ""}${officer.firstName || ""}${officer.lastName || ""}`.toLowerCase();
      const position = (officer.position || "").toLowerCase();
      const workplace = (officer.workplace || "").toLowerCase();
      const matchesSearch = 
        fullName.includes(searchQuery.toLowerCase()) ||
        position.includes(searchQuery.toLowerCase()) ||
        workplace.includes(searchQuery.toLowerCase());

      // 2. GIS Level Filter
      const matchesGis = 
        gisFilter === "all" || 
        officer.gisLevel.toLowerCase() === gisFilter.toLowerCase();

      return matchesSearch && matchesGis;
    })
    .sort((a, b) => {
      // 3. Sorting logic
      if (sortBy === "name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, "th");
      }
      if (sortBy === "allowance-desc") {
        return b.allowanceRate - a.allowanceRate;
      }
      if (sortBy === "pts-desc") {
        return b.ptsRate - a.ptsRate;
      }
      if (sortBy === "duration-desc") {
        return getCareerDurationDays(b) - getCareerDurationDays(a);
      }
      // default: "newest" (or id order if no created_at field is exported)
      return b.id.localeCompare(a.id);
    });

  return (
    <div className="space-y-6">
      {/* Stats summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">บุคลากรทั้งหมด</p>
            <p className="text-2xl font-bold text-emerald-950 mt-1 font-mono">{officers.length}</p>
          </div>
          <div className="p-2.5 bg-emerald-600 rounded-lg text-white">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 p-4 rounded-xl border border-teal-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-teal-800 font-semibold uppercase tracking-wider">เบี้ยเลี้ยงรวมรายปี (ประเมิน)</p>
            <p className="text-2xl font-bold text-teal-950 mt-1 font-mono">
              {new Intl.NumberFormat("th-TH").format(
                officers.reduce((acc, curr) => acc + curr.allowanceRate, 0) * 12
              )} <span className="text-xs font-sans font-normal text-slate-500">บาท</span>
            </p>
          </div>
          <div className="p-2.5 bg-teal-600 rounded-lg text-white">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-indigo-800 font-semibold uppercase tracking-wider">พ.ต.ส. รวมรายปี (ประเมิน)</p>
            <p className="text-2xl font-bold text-indigo-950 mt-1 font-mono">
              {new Intl.NumberFormat("th-TH").format(
                officers.reduce((acc, curr) => acc + curr.ptsRate, 0) * 12
              )} <span className="text-xs font-sans font-normal text-slate-500">บาท</span>
            </p>
          </div>
          <div className="p-2.5 bg-indigo-600 rounded-lg text-white">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main List Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">ทำเนียบบุคลากรเพื่อจัดทำรายงาน</h3>
          <p className="text-xs text-slate-500 mt-0.5">ค้นหา กรอง และเลือกรายชื่อผู้มีสิทธิ์เบิกจ่าย</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {onLoadSamples && (
            <button
              onClick={onLoadSamples}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="โหลดรายชื่อบุคลากรจำลอง 5 ตแหน่งเพื่อทดลองระบบ"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              โหลดบุคลากรจำลอง 🚀
            </button>
          )}

          <button
            onClick={onAddNew}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2 rounded-xl transition shadow-md shadow-emerald-700/10 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            เพิ่มบุคลากร
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      {officers.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาด้วย ชื่อ, นามสกุล, ตำแหน่ง หรือ รพ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* GIS Filter */}
          <div className="relative md:col-span-3 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={gisFilter}
              onChange={(e) => setGisFilter(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              <option value="all">ระดับ GIS: ทั้งหมด</option>
              <option value="s">ระดับ S (ทุรกันดารสูงสุด)</option>
              <option value="b">ระดับ B (ทุรกันดารปานกลาง)</option>
              <option value="a">ระดับ A (ทุรกันดารทั่วไป)</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="relative md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              <option value="newest">เรียงจาก: เพิ่มล่าสุด</option>
              <option value="name">เรียงจาก: ชื่อ-นามสกุล (ก-ฮ)</option>
              <option value="duration-desc">เรียงจาก: อายุราชการสะสม (มาก-น้อย)</option>
              <option value="allowance-desc">เรียงจาก: อัตราเบี้ยเลี้ยง (สูง-ต่ำ)</option>
              <option value="pts-desc">เรียงจาก: อัตรา พ.ต.ส. (สูง-ต่ำ)</option>
            </select>
          </div>
        </div>
      )}

      {officers.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-700">ไม่พบข้อมูลบุคลากรในระบบ</h4>
          <p className="text-sm text-slate-500 mt-2 text-balance leading-relaxed">
            กรุณาเพิ่มบุคลากรคนแรก หรือคลิกปุ่มโหลดบุคลากรจำลอง เพื่อตรวจสอบโครงสร้างฟอร์มของกระทรวงสาธารณสุขได้ทันที
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {onLoadSamples && (
              <button
                onClick={onLoadSamples}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-sm font-semibold border border-indigo-100 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                โหลดบุคลากรจำลอง 🚀
              </button>
            )}
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              เพิ่มบุคลากรรายบุคคล
            </button>
          </div>
        </div>
      ) : filteredAndSortedOfficers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา</h4>
          <p className="text-xs text-slate-500 mt-1">
            กรุณาทดลองล้างคำค้นหาหรือเปลี่ยนฟิลเตอร์ระดับ GIS เพื่อแสดงข้อมูลใหม่อีกครั้ง
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setGisFilter("all");
              setSortBy("newest");
            }}
            className="mt-4 inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAndSortedOfficers.map(officer => (
            <div
              key={officer.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Info block */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-sans">
                      {officer.title} {officer.firstName} {officer.lastName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{officer.position}</p>
                  </div>
                  <span className="bg-teal-50 text-teal-800 font-semibold px-2.5 py-1 rounded-lg text-xs border border-teal-100 uppercase">
                    Level GIS: {officer.gisLevel}
                  </span>
                </div>

                {/* Meta details */}
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {officer.workplace} จ.{officer.province}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      อายุราชการสะสม: <strong className="font-semibold text-slate-800">{renderCareerDuration(officer)}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="flex flex-wrap gap-x-2">
                      <span>เบี้ยเลี้ยง: <strong className="text-teal-700">{officer.allowanceRate.toLocaleString()}</strong> บาท/เดือน</span>
                      <span className="text-slate-300">|</span>
                      <span>พ.ต.ส.: <strong className="text-indigo-700">{officer.ptsRate.toLocaleString()}</strong> บาท/เดือน</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEdit(officer)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg transition"
                    title="แก้ไขข้อมูล"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(officer.id)}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="ลบข้อมูล"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onSelect(officer)}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  จัดทำและพิมพ์รายงาน
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

