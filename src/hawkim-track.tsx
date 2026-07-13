import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

/* Optional local fallback data (keeps UI functional if DB is empty) */
const RAW_WEEKS: any[] = [];

export default function HawkimTrack() {
  const [weeks, setWeeks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        // try to read from a table named `weeks` (adjust to your schema)
        const { data, error } = await supabase.from("weeks").select("*");
        if (error) throw error;
        if (mounted && data && data.length > 0) setWeeks(data as any[]);
        else if (mounted) setWeeks(RAW_WEEKS);
      } catch (err) {
        console.error("Supabase fetch error:", err);
        if (mounted) setWeeks(RAW_WEEKS);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hawkim Track</h1>
      {loading ? (
        <p className="text-sm text-slate-600">Loading data...</p>
      ) : weeks.length === 0 ? (
        <p className="text-sm text-slate-600">No data found. Add rows to the `weeks` table in Supabase.</p>
      ) : (
        <ul className="space-y-2">
          {weeks.map((w: any, i: number) => (
            <li key={w.id ?? i} className="p-2 border rounded">
              <strong>{w.title ?? `Week ${i + 1}`}</strong>
              <div className="text-sm text-slate-600">{w.summary ?? JSON.stringify(w)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
