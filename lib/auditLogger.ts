// File: lib/auditLogger.ts
import { NextRequest } from 'next/server';

export interface AuditLogItem {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'danger';
}

// In-memory store for audit logs (persists during server runtime session)
const auditLogsStore: AuditLogItem[] = [
  {
    id: 'log-101',
    userId: 'admin-1',
    action: 'TV Channel Proxy Toggled',
    details: 'Somoy News stream proxy switched to Cloudflare HTTPS Edge Proxy',
    ipAddress: '103.145.74.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    severity: 'info',
  },
  {
    id: 'log-102',
    userId: 'system-cron',
    action: 'Weather API Sync',
    details: 'Automated weather sync executed for 64 districts via Open-Meteo',
    ipAddress: '127.0.0.1',
    userAgent: 'Internal Cron Worker v2.4',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: 'info',
  },
  {
    id: 'log-103',
    userId: 'admin-1',
    action: 'M3U Playlist Bulk Import',
    details: 'Imported 12 new HLS streams into TV Channel database',
    ipAddress: '103.145.74.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'info',
  },
  {
    id: 'log-104',
    userId: 'admin-2',
    action: 'Emergency Alert Triggered',
    details: 'Issued Level 3 Cyclone Warning for Chittagong & Cox\'s Bazar',
    ipAddress: '103.204.244.5',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    severity: 'danger',
  },
];

/**
 * Extracts the real client IP address from NextRequest headers
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Record a new audit log entry directly in server code
 */
export function recordAuditLog(log: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem {
  const newLog: AuditLogItem = {
    ...log,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };
  auditLogsStore.unshift(newLog);
  // Keep last 500 logs in memory
  if (auditLogsStore.length > 500) {
    auditLogsStore.pop();
  }
  return newLog;
}

/**
 * Retrieve recorded audit logs
 */
export function getAuditLogs(): AuditLogItem[] {
  return [...auditLogsStore];
}

/**
 * Client-side helper function to send an audit log to the API
 */
export async function logAdminAction(payload: {
  userId?: string;
  action: string;
  details: string;
  severity?: 'info' | 'warning' | 'danger';
}) {
  try {
    const res = await fetch('/api/admin/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: payload.userId || 'admin-user',
        action: payload.action,
        details: payload.details,
        severity: payload.severity || 'info',
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to log admin action:', err);
    return null;
  }
}
