import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { UserJSON } from "@clerk/nextjs/server";

// Use the Supabase service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function isUserEvent(evt: any): evt is { type: string; data: UserJSON } {
  return (
    (evt.type === "user.created" || evt.type === "user.updated") &&
    typeof evt.data === "object" &&
    typeof evt.data.id === "string"
  );
}

export async function POST(req: NextRequest) {
  try {
    // This will verify the signature and parse the event
    const evt = await verifyWebhook(req);

    if (!isUserEvent(evt)) {
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    const user = evt.data;
    const email = user.email_addresses?.[0]?.email_address || null;
    const currency = user.public_metadata?.currency || "INR";

    // Upsert user in Supabase
    const { error } = await supabase.from("users").upsert({
      id: user.id,
      username: user.username,
      email,
      currency,
      created_at: new Date(user.created_at).toISOString(),
      updated_at: new Date(user.updated_at).toISOString(),
      is_active: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Error verifying webhook" },
      { status: 400 }
    );
  }
}
