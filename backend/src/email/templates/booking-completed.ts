interface BookingCompletedParams {
  businessName: string;
  customerName: string;
  serviceName: string;
  date: string;
  reference: string;
}

export function bookingCompletedTemplate(params: BookingCompletedParams): string {
  const {
    businessName,
    customerName,
    serviceName,
    date,
    reference,
  } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 12px 12px 0 0; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                🎉 Thank You!
              </h1>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <tr>
            <td>
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Hi <strong>${customerName}</strong>,
              </p>
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Thank you for visiting <strong>${businessName}</strong>! We hope you had a great experience.
              </p>

              <!-- Booking Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
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
                          <span style="color: #6b7280; font-size: 14px;">Date</span><br>
                          <strong style="color: #111827; font-size: 16px;">${date}</strong>
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

              <p style="color: #374151; font-size: 16px; margin: 20px 0; text-align: center;">
                We look forward to seeing you again!
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This email was sent by BookEasy on behalf of ${businessName}.
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

