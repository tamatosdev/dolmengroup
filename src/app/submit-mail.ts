export type ContactPayload = {
  type: "contact";
  name: string;
  phone: string;
  email: string;
  enquiry: string;
  message: string;
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

export async function submitMail(payload: MailPayload): Promise<MailResult> {
  const response = await fetch(MAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
