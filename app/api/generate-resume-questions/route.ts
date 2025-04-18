import { NextRequest } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { getCurrentUser } from "@/lib/actions/auth.action"; // ✅ Imported user fetching logic

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    console.log(user); // ✅ Get current user
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const amount = formData.get("amount");

    if (!file || !amount) {
      return new Response(JSON.stringify({ success: false, error: "Missing file or amount" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    const resumeText = data.text;

    const prompt = `
Generate ${amount} interview questions based on the following resume text:
${resumeText}

Focus on technical and behavioral questions relevant to the candidate's resume.
Ask some technical questions on the tech stack the candidate's proficient in.
Return only a clean JSON array of questions like:
["Question 1", "Question 2"]
Do NOT add markdown, no triple backticks, no labels, no comments. Just pure JSON array.
    `;

    const { text: rawResponse } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    const cleaned = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const interview = {
      role: "Resume-Based",
      type: "mixed",
      level: "auto-detected",
      techstack: [],
      questions: JSON.parse(cleaned),
      userId: user?.id ?? "anonymous", // ✅ Assign current user ID
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);
    const savedInterview = { id: docRef.id, ...interview };

    return new Response(
      JSON.stringify({ success: true, questions: interview.questions, interview: savedInterview }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resume generation error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message || error }), { status: 500 });
  }
}