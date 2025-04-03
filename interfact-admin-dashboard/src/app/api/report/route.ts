import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const newFolderName = "training-base-sets"
const initialFolderName = "detected"

type FilePostProps = {
  fileName: string
  filePath: string
}

export async function POST(request: Request) {
  try {
    const { fileName, filePath } : FilePostProps = await request.json();

    
    const addressParts = filePath.split("/");
    const oldFolderIndex = addressParts.indexOf(initialFolderName);
    if (oldFolderIndex == -1){
      throw "ERROR! Expected file location not found. Please check formatting or change expected value"
    }
    addressParts[oldFolderIndex] = newFolderName;

    // The final folder (ex dark-with-train) is expected to be to be last in filePath
    const oldReportTypeFolder = addressParts[addressParts.length - 1]
    let newReportTypeFolder = oldReportTypeFolder.replace("no", "with");
    if (newReportTypeFolder == oldReportTypeFolder){
      newReportTypeFolder = oldReportTypeFolder.replace("with", "no");
    }
    addressParts[addressParts.length - 1] = newReportTypeFolder;

    const newPath = addressParts.join("/") + "/" + fileName;

    fs.renameSync(filePath, newPath);

    return NextResponse.json({ success: true, message: 'File moved successfully!' });
  } catch (err) {
    console.error('Error moving file:', err);
    return NextResponse.json(
      { success: false, message: 'Error moving file' },
      { status: 500 }
    );
  }
}
