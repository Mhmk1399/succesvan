import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a form parser. Extract van rental reservation details from user speech. Return JSON with these fields (use null if not mentioned):
- office: "london" or "manchester"
- pickupDate: "YYYY-MM-DD" format
- returnDate: "YYYY-MM-DD" format
- vehicleType: "van", "minibus", or "coach"
- driverAge: number

Return ONLY valid JSON, no other text.`,
          },
          {
            role: "user",
            content: transcript,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error parsing voice:", error);
    return NextResponse.json(
      { error: "Failed to parse voice input" },
      { status: 500 }
    );
  }
}
