import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data, error } = await supabase.from("rol").select("*");

  if (error) {
    return NextResponse.json(
      {
        conectado: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    conectado: true,
    data,
  });
}