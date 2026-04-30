import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { success: false, message: "Kamu harus login terlebih dahulu." },
      { status: 401 }
    );
  }

  const now = new Date().toISOString();

  const { data: session, error } = await supabase
    .from("machine_sessions")
    .select("session_code, status, expires_at, machine_id")
    .eq("user_id", user.id)
    .eq("status", "paired")
    .gt("expires_at", now)
    .single();

  if (error || !session) {
    return NextResponse.json({ success: false, paired: false });
  }

  return NextResponse.json({
    success: true,
    paired: true,
    session_code: session.session_code,
    status: session.status,
    expires_at: session.expires_at,
    machine_id: session.machine_id,
  });
}
