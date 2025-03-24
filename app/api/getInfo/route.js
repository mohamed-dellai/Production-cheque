import { NextResponse } from 'next/server';
import { getChequeInfo } from './getInfo'
// Improved GET request handler
export async function POST(request) {
  try {
    // Extract JSON body from the request
    const body = await request.json();

    if (!body.url) {
      return NextResponse.json({ error: "Missing URL in the request body" }, { status: 400 });
    }
    const chequeInfo = await getChequeInfo(body.url,body.type,body.clientOufour);
    return NextResponse.json(chequeInfo, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

