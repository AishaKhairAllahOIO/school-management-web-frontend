import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import type {
  BellUnreadCountResponse,
  UnifiedNotification,
  UnifiedNotificationType,
} from "../types/unified-notification.types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object"
    ? (value as UnknownRecord)
    : {};
}

function extractItems(value: unknown): unknown[] {
  const root = asRecord(value);
  const responseData = asRecord(root.data);
  const nestedData = asRecord(responseData.data);

  const candidates = [
    value,
    root.data,
    responseData.data,
    nestedData.data,
    responseData.items,
    responseData.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function booleanValue(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1") return true;
  if (value === 0 || value === "0") return false;
  return false;
}

function normalizeItem(
  item: unknown,
  type: UnifiedNotificationType,
): UnifiedNotification {
  const value = asRecord(item);
  const sourceId =
    value.id ??
    value.notification_id ??
    value.alert_id ??
    value.announcement_id ??
    crypto.randomUUID();

  return {
    id: `${type}-${String(sourceId)}`,
    sourceId: String(sourceId),
    type,
    title: stringValue(value.title, "Notification"),
    description: stringValue(
      value.description ?? value.message,
      "",
    ),
    isRead: booleanValue(value.is_read ?? value.isRead),
    createdAt: stringValue(
      value.created_at ?? value.createdAt,
      new Date(0).toISOString(),
    ),
    meta: asRecord(value.meta),
  };
}

async function safeList(
  endpoint: string,
  type: UnifiedNotificationType,
): Promise<UnifiedNotification[]> {
  try {
    const response = await axiosClient.get(endpoint);
    return extractItems(response.data).map((item) =>
      normalizeItem(item, type),
    );
  } catch {
    // Some feeds are role-specific. A forbidden feed must not prevent
    // the remaining notification types from loading.
    return [];
  }
}

export const unifiedNotificationsApi = {
  async list(): Promise<UnifiedNotification[]> {
    const [system, announcements, staffAlerts, paymentAlerts] =
      await Promise.all([
        safeList(
          API_ENDPOINTS.SYSTEM_NOTICES.LIST,
          "system",
        ),
        safeList(
          API_ENDPOINTS.COMMUNICATIONS.STAFF_ANNOUNCEMENTS,
          "announcement",
        ),
        safeList(
          API_ENDPOINTS.COMMUNICATIONS.STAFF_ALERTS,
          "alert",
        ),
        safeList(
          API_ENDPOINTS.COMMUNICATIONS.PAYMENT_ALERTS,
          "alert",
        ),
      ]);

    return [...system, ...announcements, ...staffAlerts, ...paymentAlerts]
      .filter(
        (item, index, array) =>
          array.findIndex((candidate) => candidate.id === item.id) === index,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  },

  async unreadCount(): Promise<number> {
    const response = await axiosClient.get(
      API_ENDPOINTS.COMMUNICATIONS.BELL_UNREAD_COUNT,
    );

    const root = asRecord(response.data);
    const data = asRecord(root.data);
    const nested = asRecord(data.data);
    const payload = {
      ...root,
      ...data,
      ...nested,
    } as BellUnreadCountResponse;

    return Number(payload.total_unread ?? payload.totalUnread ?? 0);
  },

  async markAllRead(): Promise<void> {
    await axiosClient.post(
      API_ENDPOINTS.COMMUNICATIONS.BELL_MARK_ALL_READ,
    );
  },
};
