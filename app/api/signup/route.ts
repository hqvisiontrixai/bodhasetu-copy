import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, full_name, email, institution, referral_source, role } = body;
    
    const finalName = full_name || name;

    if (!finalName || !email || !institution || !role) {
      return NextResponse.json(
        { error: "Name, email, institution, and role are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("early_access_signups")
      .insert([{ 
        full_name: finalName.trim(), 
        email: email.trim().toLowerCase(), 
        institution: institution.trim(), 
        referral_source: referral_source || "",
        role,
        created_at: new Date().toISOString() // We can provide this manually, though default is usually set
      }])
      .select("id")
      .single();

    if (error) {
      // Handle duplicate email
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already registered!" },
          { status: 409 }
        );
      }
      throw error;
    }

    // Get queue position
    const { count } = await supabase
      .from("early_access_signups")
      .select("*", { count: "exact", head: true });

    return NextResponse.json(
      { success: true, count, data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
