import { describe, expect, it } from "vitest";
import {
  createRemoteSignature,
  normalizeRemoteEvent,
  verifyRemoteWebhook,
  WebhookReplayGuard
} from "../webhook";

const signingKey = "sandbox-signing-key";
const rawBody = JSON.stringify({
  event_type: "company.eor_hiring.reserve_payment_requested",
  company_id: "company-123"
});
const nowMs = 1_800_000_000_000;
const timestamp = String(nowMs / 1000);

describe("Remote-shaped webhook verification", () => {
  it("accepts a correctly signed current delivery", () => {
    const signature = createRemoteSignature(rawBody, timestamp, signingKey);

    expect(
      verifyRemoteWebhook({
        rawBody,
        signature,
        timestamp,
        signingKey,
        nowMs
      })
    ).toEqual({ ok: true });
  });

  it("rejects an invalid signature", () => {
    expect(
      verifyRemoteWebhook({
        rawBody,
        signature: "00".repeat(32),
        timestamp,
        signingKey,
        nowMs
      })
    ).toEqual({ ok: false, reason: "invalid_signature" });
  });

  it("rejects a stale timestamp", () => {
    const staleTimestamp = String(nowMs / 1000 - 301);
    const signature = createRemoteSignature(
      rawBody,
      staleTimestamp,
      signingKey
    );

    expect(
      verifyRemoteWebhook({
        rawBody,
        signature,
        timestamp: staleTimestamp,
        signingKey,
        nowMs
      })
    ).toEqual({ ok: false, reason: "stale_timestamp" });
  });

  it("rejects a replayed delivery", () => {
    const guard = new WebhookReplayGuard();
    const signature = createRemoteSignature(rawBody, timestamp, signingKey);

    expect(guard.register(signature, timestamp, nowMs)).toBe(true);
    expect(guard.register(signature, timestamp, nowMs + 1000)).toBe(false);
  });

  it("normalizes a documented event", () => {
    expect(
      normalizeRemoteEvent({
        event_type: "company.eor_hiring.reserve_payment_requested",
        company_id: "company-123"
      })
    ).toEqual({
      supported: true,
      eventType: "company.eor_hiring.reserve_payment_requested",
      entityId: "company-123",
      receivedState: "yellow"
    });
  });
});
