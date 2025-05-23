import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const { id, status } = await req.json();

    if (!id || typeof status !== "number") {
        return NextResponse.json(
            { error: "Missing id or invalid status" },
            { status: 400 },
        );
    }

    const { data, error } = await supabase
        .from("onBoard") // your table
        .update({ status }) // column update
        .eq("id", id) // match by primary key
        .select(); // optional: returns updated row

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}
