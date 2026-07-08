/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Officer, WorkHistory } from "../types";
import { Plus, Trash2, Calendar, MapPin, CreditCard, User } from "lucide-react";
import { calculateDuration } from "../utils";

interface OfficerFormProps {
  initialOfficer?: Officer;
  onSave: (officer: Officer) => void;
  onCancel: () => void;
}

export default function OfficerForm({ initialOfficer, onSave, onCancel }: OfficerFormProps) {
  const [title, setTitle] = useState(initialOfficer?.title || "นาย");
  const [firstName, setFirstName] = useState(initialOfficer?.firstName || "");
  const [lastName, setLastName] = useState(initialOfficer?.lastName || "");
  const [position, setPosition] = useState(initialOfficer?.position || "นักเทคนิคการแพทย์ชำนาญการ");
  const [workplace, setWorkplace] = useState(initialOfficer?.workplace || "โรงพยาบาลสมเด็จพระยุพราชเดชอุดม");
  const [province, setProvince] = useState(initialOfficer?.province || "อุบลราชธานี");
  const [gisLevel, setGisLevel] = useState(initialOfficer?.gisLevel || "s");
  
  // Address
  const [houseNo, setHouseNo] = useState(initialOfficer?.address?.houseNo || "");
  const [moo, setMoo] = useState(initialOfficer?.address?.moo || "");
  const [subdistrict, setSubdistrict] = useState(initialOfficer?.address?.subdistrict || "");
  const [district, setDistrict] = useState(initialOfficer?.address?.district || "");
  const [addressProvince, setAddressProvince] = useState(initialOfficer?.address?.province || "อุบลราชธานี");

  // Rates and Funds
  const [allowanceRate, setAllowanceRate] = useState(initialOfficer?.allowanceRate || 2800);
  const [ptsRate, setPtsRate] = useState(initialOfficer?.ptsRate || 1000);
  const [fundSourceAllowance, setFundSourceAllowance] = useState(
    initialOfficer?.fundSourceAllowance || "เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม"
  );
  const [fundSourcePts, setFundSourcePts] = useState(
    initialOfficer?.fundSourcePts || "เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม"
  );

  // Work Histories
  const [workHistories, setWorkHistories] = useState<WorkHistory[]>(
    initialOfficer?.workHistories || [
      {
        id: "default-hist",
        workplace: "โรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
        province: "อุบลราชธานี",
        startDate: "2004-05-11",
        endDate: "current"
      }
    ]
  );

  const addWorkHistory = () => {
    const newHist: WorkHistory = {
      id: Math.random().toString(36).substr(2, 9),
      workplace: "",
      province: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "current",
      isInternship: false
    };
    setWorkHistories([...workHistories, newHist]);
  };

  const removeWorkHistory = (id: string) => {
    setWorkHistories(workHistories.filter(h => h.id !== id));
  };

  const updateWorkHistory = (id: string, updatedFields: Partial<WorkHistory>) => {
    setWorkHistories(
      workHistories.map(h => (h.id === id ? { ...h, ...updatedFields } : h))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert("กรุณากรอกชื่อและนามสกุลบุคลากร");
      return;
    }

    const savedOfficer: Officer = {
      id: initialOfficer?.id || Math.random().toString(36).substr(2, 9),
      title,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      position: position.trim(),
      workplace: workplace.trim(),
      province: province.trim(),
      gisLevel: gisLevel.trim(),
      address: {
        houseNo: houseNo.trim(),
        moo: moo.trim(),
        subdistrict: subdistrict.trim(),
        district: district.trim(),
        province: addressProvince.trim()
      },
      allowanceRate: Number(allowanceRate),
      ptsRate: Number(ptsRate),
      fundSourceAllowance: fundSourceAllowance.trim(),
      fundSourcePts: fundSourcePts.trim(),
      workHistories
    };

    onSave(savedOfficer);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 px-6 py-5 text-white">
        <h2 className="text-xl font-bold font-sans flex items-center gap-2">
          <User className="w-5 h-5" />
          {initialOfficer ? "แก้ไขข้อมูลบุคลากร" : "เพิ่มบุคลากรใหม่"}
        </h2>
        <p className="text-emerald-100 text-xs mt-1">
          กรอกข้อมูลประวัติการทำงาน ที่อยู่ และอัตราสิทธิ์เพื่อใช้กรอกลงในใบเบิกจ่ายและใบรับเงินอัตโนมัติ
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Section 1: ข้อมูลทั่วไป */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            ข้อมูลทั่วไปและตำแหน่ง
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">คำนำหน้า</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ทพ.">ทพ.</option>
                <option value="ทพญ.">ทพญ.</option>
                <option value="พญ.">พญ.</option>
                <option value="นพ.">นพ.</option>
                <option value="ดร.">ดร.</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อจริง</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="เช่น ธันญ์นวิชญ์"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">นามสกุล</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="เช่น คำทา"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">ตำแหน่ง (ระบุให้ครบถ้วนตามแบบข้าราชการ/พนักงาน)</label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="เช่น นักเทคนิคการแพทย์ชำนาญการ"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">ปฏิบัติงานปัจจุบันที่ (รพ./รพ.สต.)</label>
              <input
                type="text"
                required
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
                placeholder="เช่น สมเด็จพระยุพราชเดชอุดม"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">ระดับ GIS</label>
              <input
                type="text"
                value={gisLevel}
                onChange={(e) => setGisLevel(e.target.value)}
                placeholder="เช่น s หรือ b"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center uppercase"
              />
            </div>
          </div>
        </div>

        {/* Section 2: ที่อยู่ตามทะเบียนบ้าน/สำหรับใบรับเงิน */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            ที่อยู่ (สำหรับแสดงบนใบสำคัญรับเงิน)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">บ้านเลขที่</label>
              <input
                type="text"
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                placeholder="เช่น 67"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">หมู่ที่</label>
              <input
                type="text"
                value={moo}
                onChange={(e) => setMoo(e.target.value)}
                placeholder="เช่น 4"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">ตำบล</label>
              <input
                type="text"
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                placeholder="เช่น บ้านกอก"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">อำเภอ</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="เช่น เขื่องใน"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">จังหวัด</label>
              <input
                type="text"
                value={addressProvince}
                onChange={(e) => setAddressProvince(e.target.value)}
                placeholder="เช่น อุบลราชธานี"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: อัตราเงินค่าตอบแทนและแหล่งทุน */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            อัตราค่าตอบแทนรายเดือนและแหล่งเงินจ่าย
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                1. สิทธิ์เบี้ยเลี้ยงเหมาจ่าย (พ.ศ. 2566)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">จำนวนเงิน (บาท)</label>
                  <input
                    type="number"
                    value={allowanceRate}
                    onChange={(e) => setAllowanceRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-right"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">ได้รับเงินจากแหล่งใด</label>
                  <input
                    type="text"
                    value={fundSourceAllowance}
                    onChange={(e) => setFundSourceAllowance(e.target.value)}
                    placeholder="เช่น เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม"
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                2. สิทธิ์ พ.ต.ส. (ผู้ปฏิบัติงานด้านสาธารณสุข)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">จำนวนเงิน (บาท)</label>
                  <input
                    type="number"
                    value={ptsRate}
                    onChange={(e) => setPtsRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-right"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">ได้รับเงินจากแหล่งใด</label>
                  <input
                    type="text"
                    value={fundSourcePts}
                    onChange={(e) => setFundSourcePts(e.target.value)}
                    placeholder="เช่น เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม"
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: ประวัติการทำงาน */}
        <div>
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              ประวัติการทำงาน (ใช้คำนวณอายุงานอัตโนมัติ)
            </h3>
            <button
              type="button"
              onClick={addWorkHistory}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5 transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              เพิ่มช่วงเวลางาน
            </button>
          </div>

          <div className="space-y-4">
            {workHistories.map((hist, index) => {
              // Quick preview of the calculation
              const today = new Date().toISOString().split("T")[0];
              const effectiveEnd = hist.endDate === "current" ? today : hist.endDate;
              const duration = calculateDuration(hist.startDate, effectiveEnd);

              return (
                <div key={hist.id} className="relative bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      ลำดับ {index + 1}
                    </span>
                    {workHistories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkHistory(hist.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mr-16">
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">หน่วยบริการ / โรงพยาบาล</label>
                      <input
                        type="text"
                        required
                        value={hist.workplace}
                        onChange={(e) => updateWorkHistory(hist.id, { workplace: e.target.value })}
                        placeholder="เช่น รพ.สมเด็จพระยุพราชเดชอุดม"
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">จังหวัด</label>
                      <input
                        type="text"
                        required
                        value={hist.province}
                        onChange={(e) => updateWorkHistory(hist.id, { province: e.target.value })}
                        placeholder="เช่น อุบลราชธานี"
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">ตั้งแต่วันที่</label>
                      <input
                        type="date"
                        required
                        value={hist.startDate}
                        onChange={(e) => updateWorkHistory(hist.id, { startDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">ถึงวันที่</label>
                      <div className="flex items-center gap-1.5">
                        {hist.endDate === "current" ? (
                          <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-lg py-1.5 px-3 text-xs text-emerald-800 font-medium">
                            ปัจจุบัน (ต่อเนื่อง)
                          </div>
                        ) : (
                          <input
                            type="date"
                            required
                            value={hist.endDate}
                            onChange={(e) => updateWorkHistory(hist.id, { endDate: e.target.value })}
                            className="flex-1 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            updateWorkHistory(hist.id, {
                              endDate: hist.endDate === "current" ? new Date().toISOString().split("T")[0] : "current"
                            })
                          }
                          className="text-[10px] px-2 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 font-medium text-slate-600"
                        >
                          {hist.endDate === "current" ? "ระบุวันที่สิ้นสุด" : "ตั้งเป็นปัจจุบัน"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hist.isInternship || false}
                        onChange={(e) => updateWorkHistory(hist.id, { isInternship: e.target.checked })}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>เป็นหลักสูตรเพิ่มพูนทักษะแพทย์ (เฉพาะสายแพทย์ตอบข้อ 1)</span>
                    </label>

                    <div className="text-slate-600 font-medium bg-emerald-50/50 text-emerald-800 px-2.5 py-1 rounded-md text-[11px]">
                      อายุงานช่วงนี้: <strong className="font-semibold font-mono text-emerald-950">{duration.years}</strong> ปี <strong className="font-semibold font-mono text-emerald-950">{duration.months}</strong> เดือน <strong className="font-semibold font-mono text-emerald-950">{duration.days}</strong> วัน
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-emerald-700/10"
        >
          {initialOfficer ? "บันทึกการแก้ไข" : "เพิ่มบุคลากร"}
        </button>
      </div>
    </form>
  );
}
