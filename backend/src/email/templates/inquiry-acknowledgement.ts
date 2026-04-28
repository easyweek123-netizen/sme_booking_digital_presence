interface InquiryAckParams {
  name: string;
}

export function inquiryAcknowledgementTemplate(
  params: InquiryAckParams,
): string {
  const firstName = params.name.split(' ')[0] || params.name;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your inquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%); border-radius: 12px 12px 0 0; padding: 30px;">
          <tr><td align="center">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
              Thanks — we got your message
            </h1>
          </td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <tr><td>
            <p style="color: #111827; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
              Hi ${firstName},
            </p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
              Thanks for reaching out. We've received your inquiry and will get back to you within 1 business day.
            </p>
          </td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr><td align="center">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              You're receiving this because you submitted an inquiry on bookeasy.com.
            </p>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
