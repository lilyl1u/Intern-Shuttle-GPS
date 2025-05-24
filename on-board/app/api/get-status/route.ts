import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("onBoard")
    .select("status")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: data.status });
}
