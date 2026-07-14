import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";

export default function HawkimTrack() {
  const [comments, setComments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const resetInProgress = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      setLoading(true);
      try {
        const { data: connectionData, error: connectionError } = await supabase
          .from("team_members")
          .select("id, name")
          .limit(1);

        console.log("Supabase connection test:", { data: connectionData, error: connectionError });

        if (connectionError) {
          console.error("Supabase connection test failed:", {
            message: connectionError.message,
            details: connectionError.details,
            hint: connectionError.hint,
            code: connectionError.code
          });
        }

        const [cRes, tRes, mRes, sRes] = await Promise.all([
          supabase
            .from("comments")
            .select(`
              *,
              team_members (
                id,
                name
              )
            `)
            .order("created_at", { ascending: false }),
          supabase.from("tasks").select("*").order("id", { ascending: true }),
          supabase.from("team_members").select("*").order("id", { ascending: true }),
          // app_settings is a single-row table in your schema
          supabase.from("app_settings").select("*").maybeSingle(),
        ]);

        if (cRes.error) {
          console.error("Supabase comments load failed:", {
            message: cRes.error.message,
            details: cRes.error.details,
            hint: cRes.error.hint,
            code: cRes.error.code
          });
        }

        if (tRes.error) {
          console.error("Supabase tasks load failed:", {
            message: tRes.error.message,
            details: tRes.error.details,
            hint: tRes.error.hint,
            code: tRes.error.code
          });
        }

        if (mRes.error) {
          console.error("Supabase team_members load failed:", {
            message: mRes.error.message,
            details: mRes.error.details,
            hint: mRes.error.hint,
            code: mRes.error.code
          });
        }

        if (sRes.error) {
          console.error("Supabase app_settings load failed:", {
            message: sRes.error.message,
            details: sRes.error.details,
            hint: sRes.error.hint,
            code: sRes.error.code
          });
        }

        if (mounted) {
          setComments(cRes.data ?? []);
          setTasks(tRes.data ?? []);
          setMembers(mRes.data ?? []);
        }

        // app_settings is returned as a single object
        const settings = sRes.data ?? null;
        const lastReset = settings && settings.updated_at ? new Date(settings.updated_at) : null;
        const now = new Date();
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        if (!lastReset || now.getTime() - lastReset.getTime() > oneWeekMs) {
          // perform reset once
          if (!resetInProgress.current) {
            resetInProgress.current = true;
            await doWeeklyReset();
            resetInProgress.current = false;
          }
        }
      } catch (err) {
        console.error("fetchAll error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();

    // single realtime channel listening to multiple tables
    const chan = supabase.channel("public:dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => {
        fetchAll();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
        fetchAll();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "comment_likes" }, () => {
        fetchAll();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "weeks" }, () => {
        fetchAll();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, () => {
        fetchAll();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(chan);
    };
  }, []);

  

  async function doWeeklyReset() {
    try {
      // delete all comments (you can narrow criteria if needed)
      const { error: deleteErr } = await supabase.from("comments").delete().not("id", "is", null);
      if (deleteErr) {
        console.error("failed deleting comments during weekly reset:", {
          message: deleteErr.message,
          details: deleteErr.details,
          hint: deleteErr.hint,
          code: deleteErr.code
        });
      }
      // update app_settings.updated_at to indicate reset time
      const nowIso = new Date().toISOString();
      const { error: updErr } = await supabase.from("app_settings").update({ updated_at: nowIso }).eq("id", 1);
      if (updErr) {
        console.error("failed updating app_settings updated_at:", {
          message: updErr.message,
          details: updErr.details,
          hint: updErr.hint,
          code: updErr.code
        });
      }
    } catch (err) {
      console.error("weekly reset failed", err);
    }
  }

  async function addComment(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    if (!newComment.trim()) return;
    // attach current week if available
    const s = await supabase.from("app_settings").select("current_week_id").maybeSingle();
    if (s.error) {
      console.error("Supabase current week lookup failed:", {
        message: s.error.message,
        details: s.error.details,
        hint: s.error.hint,
        code: s.error.code
      });
    }
    const currentWeekId = s.data?.current_week_id ?? null;
    const selectedMemberId = null;
    const selectedTaskId = null;
    const commentText = newComment.trim();

    const { data, error } = await supabase
      .from("comments")
      .insert({
        content: commentText,
        member_id: selectedMemberId || null,
        week_id: currentWeekId || null,
        task_id: selectedTaskId || null
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase comment insert failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      alert(`Comment was not saved: ${error.message}`);
      return;
    }

    console.log("Comment saved successfully:", data);
    setNewComment("");
    setComments((current) => [data, ...current]);
  }

  async function deleteComment(id: any) {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      console.error("Supabase comment delete failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }
  }

  async function toggleTaskComplete(task: any) {
    const { error } = await supabase.from("tasks").update({ completed: !task.completed }).eq("id", task.id);
    if (error) {
      console.error("Supabase task update failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }
  }

  async function deleteTask(id: any) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Supabase task delete failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }
  }

  async function setBest(memberId: any) {
    try {
      // unset previous best
      const { error: unsetError } = await supabase.from("team_members").update({ is_best: false }).neq("id", null);
      if (unsetError) {
        console.error("Supabase best member unset failed:", {
          message: unsetError.message,
          details: unsetError.details,
          hint: unsetError.hint,
          code: unsetError.code
        });
        return;
      }
      // set new best
      const { error: setError } = await supabase.from("team_members").update({ is_best: true }).eq("id", memberId);
      if (setError) {
        console.error("Supabase best member set failed:", {
          message: setError.message,
          details: setError.details,
          hint: setError.hint,
          code: setError.code
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hawkim Track (Live)</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Comments</h2>
        <div className="mt-2">
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 border rounded"
            />
            <button type="button" onClick={addComment} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="mt-3 space-y-2">
            {loading ? (
              <div>Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-sm text-slate-600">No comments yet.</div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-2 border rounded flex justify-between">
                  <div>{c.content}</div>
                  <div className="flex gap-2">
                    <button onClick={() => deleteComment(c.id)} className="text-red-600">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">Tasks</h2>
        <div className="mt-2 space-y-2">
          {tasks.length === 0 ? (
            <div className="text-sm text-slate-600">No tasks.</div>
          ) : (
            tasks.map((t) => (
              <div key={t.id} className="p-2 border rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={!!t.completed} onChange={() => toggleTaskComplete(t)} />
                  <div className={t.completed ? "line-through text-slate-500" : ""}>{t.title ?? t.name ?? `Task ${t.id}`}</div>
                </div>
                <button className="text-red-600" onClick={() => deleteTask(t.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-semibold">Team Members</h2>
        <div className="mt-2 space-y-2">
          {members.length === 0 ? (
            <div className="text-sm text-slate-600">No team members.</div>
          ) : (
            members.map((m) => (
              <div key={m.id} className="p-2 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-slate-600">{m.role}</div>
                </div>
                <div className="flex gap-2">
                  {m.is_best && <div className="px-2 py-1 bg-yellow-300 rounded">Best</div>}
                  <button onClick={() => setBest(m.id)} className="px-2 py-1 bg-green-600 text-white rounded">Set Best</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
