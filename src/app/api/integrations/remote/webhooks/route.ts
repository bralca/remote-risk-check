import { NextResponse } from "next/server";
import type { RemoteWebhookEvent } from "@/lib/types";
import {
  normalizeRemoteEvent,
  verifyRemoteWebhook,
  WebhookReplayGuard
} from "@/lib/webhook";

export const runtime = "nodejs";

const globalWebhookState = globalThis as typeof globalThis & {
  remoteWebhookReplayGuard?: WebhookReplayGuard;
};

const replayGuard =
  globalWebhookState.remoteWebhookReplayGuard ?? new WebhookReplayGuard();

globalWebhookState.remoteWebhookReplayGuard = replayGuard;

export async function POST(request: Request) {
  const signingKey = process.env.REMOTE_WEBHOOK_SIGNING_KEY;

  if (!signingKey) {
    return NextResponse.json(
      {
        error: "webhook_not_configured",
        message:
          "Set REMOTE_WEBHOOK_SIGNING_KEY to enable the optional Remote sandbox adapter."
      },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-remote-signature");
  const timestamp = request.headers.get("x-remote-timestamp");
  const toleranceSeconds = Number(
    process.env.REMOTE_WEBHOOK_TOLERANCE_SECONDS ?? "300"
  );

  const verification = verifyRemoteWebhook({
    rawBody,
    signature,
    timestamp,
    signingKey,
    toleranceSeconds
  });

  if (!verification.ok) {
    return NextResponse.json(
      { error: verification.reason },
      { status: 401 }
    );
  }

  if (
    !replayGuard.register(
      signature!,
      timestamp!,
      Date.now(),
      toleranceSeconds
    )
  ) {
    return NextResponse.json(
      { error: "replayed_delivery" },
      { status: 409 }
    );
  }

  let event: RemoteWebhookEvent;

  try {
    event = JSON.parse(rawBody) as RemoteWebhookEvent;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof event.event_type !== "string") {
    return NextResponse.json(
      { error: "missing_event_type" },
      { status: 422 }
    );
  }

  return NextResponse.json({
    received: true,
    normalized: normalizeRemoteEvent(event)
  });
}
