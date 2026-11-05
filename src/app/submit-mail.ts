export type ContactPayload = {
  type: "contact";
  name: string;
  phone: string;
  email: string;
  enquiry: string;
  message: string;
  consent: boolean;
};

export type NewsletterPayload = {
  type: "newsletter";
  email: string;
};

export type MailPayload = ContactPayload | NewsletterPayload;

export type MailResult = {
  ok: boolean;
  message?: string;
  error?: string;
};

const MAIL_ENDPOINT = "/mail/send.php";

// Requests in flight, keyed by body, so a double click or Enter+click
// can't send the same submission twice.
const inFlight = new Map<string, Promise<MailResult>>();

export function submitMail(payload: MailPayload): Promise<MailResult> {
  const body = JSON.stringify(payload);
  const pending = inFlight.get(body);

  if (pending) {
    return pending;
  }

  const request = postMail(body).finally(() => inFlight.delete(body));
  inFlight.set(body, request);
  return request;
}

async function postMail(body: string): Promise<MailResult> {
  const response = await fetch(MAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  let data: MailResult | null = null;

  try {
    data = (await response.json()) as MailResult;
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok) {
    return {
      ok: false,
      error: data?.error || "Something went wrong. Please try again.",
    };
  }

  return {
    ok: true,
    message: data.message || "Sent successfully.",
  };
}
