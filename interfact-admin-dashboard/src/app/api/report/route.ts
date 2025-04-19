import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';


type FilePostProps = {
  fileName: string
  filePath: string
}

export async function POST(request: Request) {
  try {
    const { fileName, filePath } : FilePostProps = await request.json();

    // Correct the filepath (expected to be ./detected/ID/....)
    const correctedFilePath = path.join(process.cwd(), 'public', 'report-check', filePath, fileName);
    
    
    let newPath = filePath.replace("no", "with");
    if (newPath == filePath){
      newPath = filePath.replace("with", "no");
    }
    newPath = newPath.replace("detected", "training-base-sets")

    const finalFullPath =  path.join(process.cwd(), 'public', 'report-check', newPath, fileName);

    fs.renameSync(correctedFilePath, finalFullPath);

    return NextResponse.json({ success: true, message: 'File moved successfully!' });
  } catch (err) {
    console.error('Error moving file:', err);
    return NextResponse.json(
      { success: false, message: 'Error moving file' },
      { status: 500 }
    );
  }
}
