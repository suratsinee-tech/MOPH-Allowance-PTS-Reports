import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

function keepAlivePlugin(): Plugin {
  return {
    name: 'keep-alive-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/keep-alive', async (req, res) => {
        try {
          const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
          const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

          res.setHeader('Content-Type', 'application/json');

          if (!supabaseUrl || !supabaseKey) {
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              message: "Supabase credentials missing in environment variables.",
              timestamp: new Date().toISOString()
            }));
            return;
          }

          const supabase = createClient(supabaseUrl, supabaseKey);
          const { error, count } = await supabase
            .from("officers")
            .select("id", { count: "exact", head: true });

          if (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              error: error.message,
              code: error.code,
              timestamp: new Date().toISOString()
            }));
            return;
          }

          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            message: "Supabase Keep-Alive ping executed successfully (Dev Server).",
            recordCount: count,
            timestamp: new Date().toISOString()
          }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({
            success: false,
            error: err?.message || "Internal Server Error",
            timestamp: new Date().toISOString()
          }));
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), keepAlivePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
