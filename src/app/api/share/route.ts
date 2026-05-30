import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { docId, title, prdContent, workflowContent } = await req.json();

  if (!docId || !prdContent) {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  const { error } = await supabase.from("share_links").insert({
    user_id: userData.user.id,
    doc_id: docId,
    token,
    title: title || "Untitled",
    prd_content: prdContent,
    workflow_content: workflowContent || "",
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ token, url: `/share/${token}` });
}
