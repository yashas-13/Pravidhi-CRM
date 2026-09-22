# Pravidh CRM API

Base URL:

https://sfvfyxbakenijowdhuqs.supabase.co/functions/v1/crm-api

Authentication:

`Authorization: Bearer <Supabase access token>`

## GET /health

Returns authenticated service health.

## GET /pipeline

Returns CRM pipeline records ordered by lead score.

## GET /hot-leads

Returns active leads with score >= 70 and no contact opt-out.

## GET /followups/due

Returns leads whose next_follow_up_at is due.

## POST /leads

Example:

```json
{
  "company_name": "Example Pvt Ltd",
  "website": "https://example.com",
  "industry": "SaaS",
  "location": "Bengaluru, Karnataka, India",
  "contact_name": "Security Lead",
  "job_title": "CTO",
  "email": "security@example.com",
  "source_url": "https://example.com/careers",
  "trigger": "Security engineering hiring",
  "service_fit": "API VAPT",
  "score": 82
}
```

## PATCH /leads/:id

Supported fields:

- status
- score
- trigger
- service_fit
- source_url
- next_follow_up_at
- first_contacted_at
- last_contacted_at
- converted_at

All write operations require an authenticated active CRM member.
