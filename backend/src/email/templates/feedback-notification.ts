interface FeedbackNotificationParams {
  email: string;
  message: string;
  source: string;
  timestamp: string;
}

export function feedbackNotificationTemplate(params: FeedbackNotificationParams): string {
  const { email, message, source, timestamp } = params;

  // Format source for display
  const sourceDisplay = source === 'pricing_page' ? 'Pricing Page' : 
                        source === 'dashboard' ? 'Dashboard' : source;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Feedback</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px 12px 0 0; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                📬 New Feedback Received
              </h1>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <tr>
            <td>
              <!-- Meta Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="color: #6b7280; font-size: 13px;">From</span><br>
                          <a href="mailto:${email}" style="color: #7c3aed; font-size: 15px; font-weight: 500; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="color: #6b7280; font-size: 13px;">Source</span><br>
                          <span style="color: #111827; font-size: 15px;">${sourceDisplay}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="color: #6b7280; font-size: 13px;">Time</span><br>
                          <span style="color: #111827; font-size: 15px;">${timestamp}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <div style="margin-bottom: 20px;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <div style="background-color: #f9fafb; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0;">
                  <p style="color: #374151; font-size: 15px; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                Reply directly to this email to respond to the user.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                BookEasy Feedback Notification
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

