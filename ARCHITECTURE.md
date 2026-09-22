# Pravidhi CRM

Production-oriented CRM for Pravidh Solutions.

## Architecture

- Frontend: Next.js + TypeScript
- Authentication: Supabase Auth
- Database: Supabase PostgreSQL
- Authorization: PostgreSQL RLS + team_members roles
- Backend: Supabase Edge Functions
- Email: Hostinger Mail
- WhatsApp: provider/API adapter
- AI: OpenAI-compatible agent layer
- Auditability: append-only audit_log + outreach_log

## Core workflow

Lead discovery -> deduplication -> qualification -> personalized outreach -> reply detection -> follow-up -> discovery call -> qualified opportunity -> proposal -> negotiation -> won -> onboarding.

## CRM lifecycle

New -> Researching -> Contacted -> Replied -> Qualified -> Converted

Deal lifecycle:

Discovery -> Qualified -> Proposal -> Negotiation -> Won/Lost

## Security

1. Never expose Supabase service-role credentials to the browser.
2. All CRM API routes require authentication.
3. CRM data access is protected by RLS.
4. Team membership is required for operational access.
5. Outreach must check do_not_contact and deduplication before sending.
6. Every material state change should create an audit event.
7. Public business emails only; never infer private addresses.
8. Respect unsubscribe/opt-out requests.

## Backend

Supabase project: `sfvfyxbakenijowdhuqs`

CRM Edge Function:

`/functions/v1/crm-api`

Current routes:

- GET /health
- GET /pipeline
- GET /hot-leads
- GET /followups/due
- POST /leads
- PATCH /leads/:id

## Build order

1. Secure schema and RLS
2. Authenticated CRM API
3. Web dashboard
4. Lead ingestion/import
5. Email integration
6. WhatsApp adapter
7. Follow-up scheduler
8. AI qualification and personalization
9. Proposal/deal workflow
10. Reporting and observability

## Definition of done

A lead is not considered successfully converted merely because outreach was sent. Conversion requires a recorded customer/deal state and an auditable handoff to onboarding.
