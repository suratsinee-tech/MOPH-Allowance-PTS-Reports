-- SUPABASE SCHEMA FOR MOPH ALLOWANCE & PTS REPORTS
-- Copy and paste this script into your Supabase SQL Editor to initialize the tables.

-- 1. Drop existing table if exists (uncomment if resetting)
-- DROP TABLE IF EXISTS officers CASCADE;

-- 2. Create the officers table
CREATE TABLE IF NOT EXISTS officers (
  id TEXT PRIMARY KEY,                       -- Unique identifier (e.g., custom string or UUID)
  title TEXT NOT NULL,                        -- นาย / นาง / นางสาว / นพ. / พญ. etc.
  first_name TEXT NOT NULL,                   -- First name in Thai
  last_name TEXT NOT NULL,                    -- Last name in Thai
  position TEXT NOT NULL,                     -- Position/Title
  workplace TEXT NOT NULL,                    -- Hospital/Workplace
  province TEXT NOT NULL,                     -- Province of workplace
  gis_level TEXT NOT NULL,                    -- GIS Level (e.g., s, b, a)
  
  -- Address details
  house_no TEXT,
  moo TEXT,
  subdistrict TEXT,
  district TEXT,
  province_address TEXT,
  
  -- Compensation Rates
  allowance_rate INTEGER DEFAULT 0,          -- Allowance rate (e.g., 2800)
  pts_rate INTEGER DEFAULT 0,                -- PTS rate (e.g., 1000)
  fund_source_allowance TEXT,                -- Fund source for allowance
  fund_source_pts TEXT,                      -- Fund source for PTS
  
  -- Complex array of work histories stored as JSONB for flexibility and exact match with React state
  work_histories JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;

-- 4. Create public policies for full access (Create, Read, Update, Delete)
-- Note: In a production app, you might restrict these to authenticated users, 
-- but for a simple team-wide or standalone app, public read/write makes it immediately functional.
CREATE POLICY "Allow public select" ON officers FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON officers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON officers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON officers FOR DELETE USING (true);

-- 5. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_officers_modtime
    BEFORE UPDATE ON officers
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- 6. Pre-seed with the sample officer (Mr. Thanwit Kamtha)
INSERT INTO officers (
  id, title, first_name, last_name, position, workplace, province, gis_level,
  house_no, moo, subdistrict, district, province_address,
  allowance_rate, pts_rate, fund_source_allowance, fund_source_pts,
  work_histories
) VALUES (
  'thanwit-kamtha',
  'นาย',
  'ธันญ์นวิชญ์',
  'คำทา',
  'นักเทคนิคการแพทย์ชำนาญการ',
  'สมเด็จพระยุพราชเดชอุดม',
  'อุบลราชธานี',
  's',
  '67',
  '4',
  'บ้านกอก',
  'เขื่องใน',
  'อุบลราชธานี',
  2800,
  1000,
  'เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม',
  'เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม',
  '[
    {
      "id": "hist-1",
      "workplace": "สมเด็จพระยุพราชเดชอุดม",
      "province": "อุบลราชธานี",
      "startDate": "2004-05-11",
      "endDate": "current"
    }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
