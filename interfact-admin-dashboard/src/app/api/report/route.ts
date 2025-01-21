import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // Build absolute paths relative to your project root (process.cwd())
    const oldPath = path.join(process.cwd(), 'public', 'report-check', 'reported-images', url);
    const newPath = path.join(process.cwd(), 'public', 'report-check', 'confirmed-images', url);

    fs.renameSync(oldPath, newPath);

    return NextResponse.json({ success: true, message: 'File moved successfully!' });
  } catch (err) {
    console.error('Error moving file:', err);
    return NextResponse.json(
      { success: false, message: 'Error moving file' },
      { status: 500 }
    );
  }
}
