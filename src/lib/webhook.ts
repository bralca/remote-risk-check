import { createHmac, timingSafeEqual } from "node:crypto";
import type { RemoteWebhookEvent } from "./types";

export const supportedRemoteEvents = new Set([
  "company.eor_hiring.verification_completed",
  "company.eor_hiring.reserve_payment_requested",
  "company.eor_hiring.additional_information_required",
  "employment.eor_hiring.invoice_created",
  "employment.eor_hiring.proof_of_payment_accepted",
  "company.activated",
  "company.archived",
  "identity_verification.verification_required"
]);

export interface VerifyWebhookOptions {
  rawBody: string;
  signature: string | null;
  timestamp: string | null;
  signingKey: string;
  nowMs?: number;
  toleranceSeconds?: number;
}

export function createRemoteSignature(
  rawBody: string,
  timestamp: string,
  signingKey: string
) {
  return createHmac("sha256", signingKey)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
}

export function verifyRemoteWebhook({
  rawBody,
  signature,
  timestamp,
  signingKey,
  nowMs = Date.now(),
  toleranceSeconds = 300
}: VerifyWebhookOptions) {
  if (!signature || !timestamp || !signingKey) {
    return { ok: false as const, reason: "missing_security_headers" };
  }

  const timestampMs = Number(timestamp) * 1000;

  if (!Number.isFinite(timestampMs)) {
    return { ok: false as const, reason: "invalid_timestamp" };
  }

  if (Math.abs(nowMs - timestampMs) > toleranceSeconds * 1000) {
    return { ok: false as const, reason: "stale_timestamp" };
  }

  const expected = createRemoteSignature(rawBody, timestamp, signingKey);
  const providedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { ok: false as const, reason: "invalid_signature" };
  }

  return { ok: true as const };
}

export function normalizeRemoteEvent(event: RemoteWebhookEvent) {
  if (!supportedRemoteEvents.has(event.event_type)) {
    return {
      supported: false as const,
      eventType: event.event_type,
      entityId: event.company_id ?? event.employment_id ?? null
    };
  }

  return {
    supported: true as const,
    eventType: event.event_type,
    entityId: event.company_id ?? event.employment_id ?? null,
    receivedState:
      event.event_type === "company.archived"
        ? "red"
        : event.event_type.includes("verification_completed") ||
            event.event_type.includes("proof_of_payment_accepted") ||
            event.event_type === "company.activated"
          ? "green"
          : "yellow"
  };
}

export class WebhookReplayGuard {
  private readonly deliveries = new Map<string, number>();

  register(
    signature: string,
    timestamp: string,
    nowMs = Date.now(),
    toleranceSeconds = 300
  ) {
    const expiryThreshold = nowMs - toleranceSeconds * 1000;

    for (const [key, receivedAt] of this.deliveries.entries()) {
      if (receivedAt < expiryThreshold) {
        this.deliveries.delete(key);
      }
    }

    const deliveryKey = `${timestamp}:${signature}`;

    if (this.deliveries.has(deliveryKey)) {
      return false;
    }

    this.deliveries.set(deliveryKey, nowMs);
    return true;
  }
}
