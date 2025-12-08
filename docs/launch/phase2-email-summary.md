# Phase 2: Email Notifications - Implementation Summary

## Status: 🟡 Partially Complete

**Done:** Email infrastructure, templates, and integration  
**Pending:** Domain verification for production email sending

## Overview

Email notifications implemented using **Resend** for booking alerts and confirmations.

## Email Types

| Email | Trigger | Recipient | Content |
|-------|---------|-----------|---------|
| **New Booking Alert** | Customer creates booking | Business Owner | Service, date/time, customer info |
| **Booking Confirmed** | Owner confirms booking | Customer | Confirmation details + Google Calendar link |
| **Booking Cancelled** | Owner cancels booking | Customer | Cancellation notice with original details |
| **Booking Completed** | Owner marks complete | Customer | Thank you message |

**Note:** NO_SHOW status does not trigger an email (considered awkward/unnecessary).

## Architecture

```
BookingsService → EmailService → Resend API
                       ↓
              HTML Email Templates
```

## Key Files Created

| File | Purpose |
|------|---------|
| `backend/src/email/email.module.ts` | Email module (non-global, imported by BookingsModule) |
| `backend/src/email/email.service.ts` | Resend integration, send methods |
| `backend/src/email/templates/new-booking-alert.ts` | Owner notification template |
| `backend/src/email/templates/booking-confirmed.ts` | Customer confirmation template |
| `backend/src/email/templates/booking-cancelled.ts` | Customer cancellation notice |
| `backend/src/email/templates/booking-completed.ts` | Customer thank you email |
| `backend/src/common/utils/calendar.ts` | Google Calendar link generator |

## Key Files Modified

| File | Change |
|------|--------|
| `backend/src/bookings/bookings.service.ts` | Inject EmailService, send emails on status changes |
| `backend/src/bookings/bookings.module.ts` | Import EmailModule |
| `backend/src/common/index.ts` | Export calendar utility |

## Environment Variables

Add to `backend/.env`:

```env
RESEND_API_KEY=re_xxxxx          # Your Resend API key
EMAIL_FROM=BookEasy <onboarding@resend.dev>  # For testing (no verification needed)
```

## Email Flow

### New Booking (to Owner)
1. Customer creates booking via `/api/bookings`
2. `BookingsService.create()` saves booking
3. Loads business with owner relation
4. Calls `emailService.sendNewBookingAlert()` (fire-and-forget)
5. Owner receives email with booking details

### Booking Status Changes (to Customer)
1. Owner changes status via `/api/bookings/:id/status`
2. `BookingsService.updateStatus()` updates booking
3. Calls appropriate email method based on new status:
   - `CONFIRMED` → `sendBookingConfirmed()` (includes Google Calendar link)
   - `CANCELLED` → `sendBookingCancelled()`
   - `COMPLETED` → `sendBookingCompleted()`
4. Customer receives corresponding email

## Error Handling

- **Fire-and-forget**: Emails don't block the API response
- **Logging**: Failed sends are logged with error details
- **Graceful degradation**: If `RESEND_API_KEY` not set, emails are logged only (mock mode)

## Testing (Current)

Using Resend's test domain (`onboarding@resend.dev`):

1. Set `RESEND_API_KEY` in `.env`
2. Set `EMAIL_FROM=BookEasy <onboarding@resend.dev>`
3. Restart backend
4. **Limitation**: Can only send to the email associated with your Resend account
5. Use Gmail `+` aliases to test both owner and customer emails (e.g., `you+customer@gmail.com`)

## Remaining Work: Domain Verification

To send emails to any recipient (production), you must verify a domain:

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add your domain (e.g., `bookeasy.com` or `easyweek.com`)
3. Add the DNS records Resend provides:
   - SPF record
   - DKIM records
   - (Optional) DMARC record
4. Wait for verification (usually minutes, up to 24-48 hours)
5. Update `EMAIL_FROM` in production:
   ```env
   EMAIL_FROM=BookEasy <noreply@yourdomain.com>
   ```

## Resend Limits

- **Free tier**: 3,000 emails/month, 100/day
- **Testing limitation**: Without verified domain, only send to your account email
- For production: Verify domain to send to any recipient

## Notes

- **No reminders for MVP**: Render free tier sleeps, making cron unreliable
- **No database tracking**: Relies on Resend's internal retry mechanism
- **Google Calendar link**: Included in confirmation email for easy calendar add
