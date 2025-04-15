import {exec} from "child_process";
import { NextResponse } from "next/server";

export async function GET() {

const pythonProcess = await new Promise((resolve, reject) => {

    exec('python '+ process.env.NEXT_PUBLIC_RETRAIN_PYTHON_FILE, (error, stdout, stderr) => {
    if (error) {
        reject(error);
        return NextResponse.json({error});
    }
    resolve(stdout);
    return NextResponse.json({stdout});
    });
});
    return NextResponse.json({});
 
}