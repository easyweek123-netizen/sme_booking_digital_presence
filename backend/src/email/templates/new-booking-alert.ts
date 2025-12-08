interface NewBookingAlertParams {
  businessName: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  reference: string;
}

export function newBookingAlertTemplate(params: NewBookingAlertParams): string {
  const {
    businessName,
    customerName,
    customerEmail,
    serviceName,
    date,
    time,
    reference,
  } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px 12px 0 0; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                📅 New Booking Request
              </h1>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <tr>
            <td>
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                You have a new booking request for <strong>${businessName}</strong>:
              </p>

              <!-- Booking Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Service</span><br>
                          <strong style="color: #111827; font-size: 16px;">${serviceName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Date & Time</span><br>
                          <strong style="color: #111827; font-size: 16px;">${date}</strong><br>
                          <span style="color: #374151; font-size: 15px;">${time}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Customer</span><br>
                          <strong style="color: #111827; font-size: 16px;">${customerName}</strong><br>
                          <a href="mailto:${customerEmail}" style="color: #059669; font-size: 14px;">${customerEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Reference</span><br>
                          <strong style="color: #111827; font-size: 16px; font-family: monospace;">${reference}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
                Log in to your BookEasy dashboard to confirm or manage this booking.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This email was sent by BookEasy. You're receiving this because you own ${businessName}.
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

