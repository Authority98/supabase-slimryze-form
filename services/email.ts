interface SendEmailParams {
  firstName: string;
  email: string;
  role: string;
  industry: string;
  weight: string;
  weightGoals: string;
  weightHistory: string;
  medications: string[];
  conditions: string[];
  thyroidHistory: string;
  pregnancyStatus: string;
  readiness: string;
}

export async function sendAssessmentEmail(data: SendEmailParams) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send email");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
