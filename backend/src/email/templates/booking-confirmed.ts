interface BookingConfirmedParams {
  businessName: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  reference: string;
  address?: string;
  phone?: string;
  calendarLink: string;
}

export function bookingConfirmedTemplate(params: BookingConfirmedParams): string {
  const {
    businessName,
    customerName,
    serviceName,
    date,
    time,
    reference,
    address,
    phone,
    calendarLink,
  } = params;

  const contactSection = (address || phone) ? `
    <tr>
      <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
        <span style="color: #6b7280; font-size: 14px;">Contact</span><br>
        ${address ? `<span style="color: #374151; font-size: 14px;">📍 ${address}</span><br>` : ''}
        ${phone ? `<a href="tel:${phone}" style="color: #059669; font-size: 14px;">📞 ${phone}</a>` : ''}
      </td>
    </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
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
                ✅ Booking Confirmed!
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
                Your booking at <strong>${businessName}</strong> has been confirmed!
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
                          <span style="color: #6b7280; font-size: 14px;">Reference</span><br>
                          <strong style="color: #111827; font-size: 16px; font-family: monospace;">${reference}</strong>
                        </td>
                      </tr>
                      ${contactSection}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Calendar Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${calendarLink}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      📅 Add to Google Calendar
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
                Need to make changes? Contact ${businessName} directly.
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

