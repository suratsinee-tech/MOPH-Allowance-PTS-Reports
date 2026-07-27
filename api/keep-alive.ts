import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  // Allow GET and POST methods
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: "Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in environment variables.",
        timestamp: new Date().toISOString(),
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query Supabase to maintain database activity and prevent project auto-pause
    const { data, error, count } = await supabase
      .from("officers")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.warn("Supabase keep-alive ping error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supabase Keep-Alive ping executed successfully. Database activity refreshed.",
      recordCount: count,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Keep-Alive serverless handler error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
}
