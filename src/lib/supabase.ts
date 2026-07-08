/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import { Officer } from "../types";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Initialize Supabase Client (or null if not configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Helper to map DB record (snake_case) to Frontend Officer interface (camelCase)
export function mapFromDb(dbRecord: any): Officer {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    firstName: dbRecord.first_name,
    lastName: dbRecord.last_name,
    position: dbRecord.position,
    workplace: dbRecord.workplace,
    province: dbRecord.province,
    gisLevel: dbRecord.gis_level,
    address: {
      houseNo: dbRecord.house_no || "",
      moo: dbRecord.moo || "",
      subdistrict: dbRecord.subdistrict || "",
      district: dbRecord.district || "",
      province: dbRecord.province_address || "",
    },
    allowanceRate: Number(dbRecord.allowance_rate || 0),
    ptsRate: Number(dbRecord.pts_rate || 0),
    fundSourceAllowance: dbRecord.fund_source_allowance || "",
    fundSourcePts: dbRecord.fund_source_pts || "",
    workHistories: Array.isArray(dbRecord.work_histories)
      ? dbRecord.work_histories
      : [],
  };
}

// Helper to map Frontend Officer interface to DB record (snake_case)
export function mapToDb(officer: Officer): any {
  return {
    id: officer.id,
    title: officer.title,
    first_name: officer.firstName,
    last_name: officer.lastName,
    position: officer.position,
    workplace: officer.workplace,
    province: officer.province,
    gis_level: officer.gisLevel,
    house_no: officer.address.houseNo,
    moo: officer.address.moo,
    subdistrict: officer.address.subdistrict,
    district: officer.address.district,
    province_address: officer.address.province,
    allowance_rate: officer.allowanceRate,
    pts_rate: officer.ptsRate,
    fund_source_allowance: officer.fundSourceAllowance,
    fund_source_pts: officer.fundSourcePts,
    work_histories: officer.workHistories,
  };
}

// Fetch all officers from Supabase
export async function getOfficersFromSupabase(): Promise<Officer[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("officers")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching officers:", error);
    throw error;
  }

  return (data || []).map(mapFromDb);
}

// Save or Update an officer in Supabase
export async function upsertOfficerToSupabase(officer: Officer): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const dbData = mapToDb(officer);
  const { error } = await supabase
    .from("officers")
    .upsert(dbData, { onConflict: "id" });

  if (error) {
    console.error("Error saving officer:", error);
    throw error;
  }
}

// Delete an officer from Supabase
export async function deleteOfficerFromSupabase(id: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("officers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting officer:", error);
    throw error;
  }
}
