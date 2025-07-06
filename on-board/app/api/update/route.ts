import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { id, status } = await request.json();
  if (!id || typeof status !== "number") {
    return NextResponse.json(
      { error: "Missing id or invalid status" },
      { status: 400 }
    );
  }

  // Make sure the record exists first
  const { data: existing, error: fetchError } = await supabase
    .from("onBoard")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("onBoard")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
