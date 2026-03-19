// deno-lint-ignore-file no-explicit-any
// @ts-nocheck - Deno Edge Function uses runtime APIs not available in Node.js TypeScript
// @ts-ignore - Deno runtime types not available in Node.js TypeScript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - esm.sh module not recognized by Node.js TypeScript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── CORS Headers ─────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.glintiq.in",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

interface SignupRequest {
  full_name?: string;
  email?: string;
  institution?: string;
  referral_source?: string;
  role?: string;
}

const ALLOWED_ROLES = ["student", "teacher", "admin"];
const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @ts-ignore - Deno global not available in Node.js TypeScript
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
// @ts-ignore - Deno global not available in Node.js TypeScript
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function handleSignup(body: SignupRequest) {
  // Normalize and validate required fields
  const full_name = body.full_name?.trim() || "";
  const email = (body.email?.trim() || "").toLowerCase();
  const institution = body.institution?.trim() || "";
  const referral_source = body.referral_source?.trim() || "";
  const role = body.role?.trim() || "";

  // Validate required fields
  const errors: Record<string, string> = {};
  if (!full_name) errors.full_name = "Full name is required";
  if (!email) errors.email = "Email is required";
  if (!institution) errors.institution = "Institution is required";
  if (!role) errors.role = "Role is required";

  if (Object.keys(errors).length > 0) {
    return new Response(
      JSON.stringify({ error: "Validation error", details: errors }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate email format
  if (!VALID_EMAIL_REGEX.test(email)) {
    return new Response(
      JSON.stringify({ error: "Invalid email address" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate role
  if (!ALLOWED_ROLES.includes(role)) {
    return new Response(
      JSON.stringify({
        error: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Check for duplicate email
  const { data: existingUser, error: checkError } = await supabase
    .from("early_access_signups")
    .select("id")
    .eq("email", email)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 = no rows found, which is expected
    console.error("Database error checking for duplicates:", checkError);
    return new Response(
      JSON.stringify({ error: "Database error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "This email is already registered!" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  // Insert into database
  const { data, error } = await supabase
    .from("early_access_signups")
    .insert([
      {
        full_name,
        email,
        institution,
        referral_source: referral_source || null,
        role,
        created_at: new Date().toISOString(),
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Database insert error:", error);
    if (error.code === "23505") {
      // Duplicate key error
      return new Response(
        JSON.stringify({ error: "This email is already registered!" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to register signup" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Signup successful",
      id: data?.id,
    }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const body = await req.json();
    const response = await handleSignup(body);

    // Add CORS headers to response
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Request error:", error);
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
