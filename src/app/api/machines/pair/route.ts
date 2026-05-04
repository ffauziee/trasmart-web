import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { success: false, message: "Kamu harus login terlebih dahulu." },
      { status: 401 }
    );
  }

  const { code } = await request.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { success: false, message: "Kode tidak boleh kosong." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc("pair_user_with_machine", {
    p_session_code: code.trim().toUpperCase(),
  });

  if (error) {
    console.error("Pairing error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat pairing." },
      { status: 500 }
    );
  }

  if (data?.success) {
    const machineId = data.machine_id as string;
    const { data: sessionData } = await supabase
      .from("machine_sessions")
      .select("session_code, expires_at")
      .eq("machine_id", machineId)
      .eq("status", "paired")
      .eq("user_id", user.id)
      .single();

    if (sessionData) {
      data.session_code = sessionData.session_code;
      data.expires_at = sessionData.expires_at;
    }
  }

  return NextResponse.json(data);
}
