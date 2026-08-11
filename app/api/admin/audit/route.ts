// File: app/api/admin/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, recordAuditLog, getClientIp } from '@/lib/auditLogger';

// GET /api/admin/audit - Get all recorded audit logs
export async function GET() {
  const logs = getAuditLogs();
  return NextResponse.json({
    success: true,
    count: logs.length,
    logs,
  });
}

// POST /api/admin/audit - Record a new admin action into audit_logs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'admin-user', action, details, severity = 'info' } = body;

    if (!action || !details) {
      return NextResponse.json(
        { error: 'Action and details are required fields for audit log recording' },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(req);
    const userAgent = req.headers.get('user-agent') || 'Unknown Browser';

    const newLog = recordAuditLog({
      userId,
      action,
      details,
      ipAddress,
      userAgent,
      severity,
    });

    return NextResponse.json({
      success: true,
      message: 'Audit log recorded successfully',
      log: newLog,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to record audit log', message: error.message },
      { status: 500 }
    );
  }
}
