import { NextResponse } from 'next/server';
import dbMS from '../../../../MySqlConfig';

export async function GET() {
    try {
        const [rows] = await dbMS.query("SELECT * FROM log ORDER BY timestamp DESC");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse request body
        const { logid, status } = body; // Extract logid and new status

        console.log(logid)
        console.log(status)
        // Validate input
        if (!logid || typeof logid !== 'string') {
            return NextResponse.json({ error: "Invalid or missing logid" }, { status: 400 });
        }
        if (!status || typeof status !== 'string') {
            return NextResponse.json({ error: "Invalid or missing status" }, { status: 400 });
        }

        // Check if logid exists before updating
        const [existingLog]: any = await dbMS.query(
            "SELECT status FROM log WHERE logid = ?",
            [logid]
        );

        if (existingLog.length === 0) {
            return NextResponse.json({ error: "Log ID not found" }, { status: 404 });
        }

        // Update status in database
        const [result]: any = await dbMS.query(
            "UPDATE log SET status = ? WHERE logid = ?",
            [status, logid]
        );

        // Ensure rows were affected
        if (result?.affectedRows === 0) {
            return NextResponse.json({ error: "No change made" }, { status: 404 });
        }

        return NextResponse.json({ message: `Status updated to '${status}' for logid ${logid}` });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}