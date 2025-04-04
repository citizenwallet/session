import "server-only";

export const sendOtpEmail = async (email: string, otp: number) => {
  const params = {
    OTP: otp,
  };

  const payload = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME,
    },
    templateId: 2,
    subject: "Brussels Pay - Login Code",
    params,
    messageVersions: [
      {
        to: [{ email }],
      },
    ],
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to email");
  }
};

export const sendOtpSMS = async (phone: string, otp: number) => {
  const payload = {
    sender: "brusselspay",
    type: "transactional",
    recipient: phone.replace("+", ""),
    tag: "logincode",
    unicodeEnabled: true,
    organisationPrefix: process.env.BREVO_SENDER_NAME,
    content: `Your login code is ${otp}`,
  };

  const response = await fetch(
    "https://api.brevo.com/v3/transactionalSMS/sms",
    {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send SMS");
  }
};
