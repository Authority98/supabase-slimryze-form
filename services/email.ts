export async function sendEmail(to: string, subject: string, text: string) {
  const API_KEY = process.env.SENDINBLUE_API_KEY;

  if (!API_KEY) {
    throw new Error("Sendinblue API key not found");
  }

  const emailPayload = {
    sender: {
      name: "SlimRyze Team",
      email: "usamashabbier@gmail.com",
    },
    to: [
      {
        email: to,
        name: to.split("@")[0],
      },
    ],
    subject,
    textContent: text,
    htmlContent: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          ${text
            .split("\n")
            .map((line) => `<p>${line}</p>`)
            .join("")}
        </body>
      </html>
    `,
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return response.json();
}
