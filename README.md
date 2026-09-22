# Pravidhi CRM

**Pravidh Solutions' sales, lead intelligence, outreach and customer-conversion operating system.**

Pravidh CRM is a security-first CRM designed to connect lead discovery, qualification, outreach, follow-ups, sales pipeline, proposals and onboarding in one auditable system.

> The goal is not simply to store contacts. It is to turn verified business signals into measurable sales workflows while preventing duplicate outreach, protecting data and preserving an audit trail.

## Why it exists

Traditional CRMs often become passive databases. Pravidhi CRM is designed as an operational system:

~~~text
Business signal
      ↓
Lead discovery
      ↓
Verification + deduplication
      ↓
Qualification + service fit
      ↓
Personalized outreach
      ↓
Reply / engagement
      ↓
Follow-up
      ↓
Discovery meeting
      ↓
Qualified opportunity
      ↓
Proposal / SOW
      ↓
Negotiation
      ↓
Won
      ↓
Onboarding
      ↓
Delivery + retention
~~~

Every important transition is represented as structured CRM data instead of relying on spreadsheets or memory.

---

## Architecture

~~~text
                    PRAVIDH CRM

              ┌────────────────────┐
              │ Next.js Dashboard  │
              │ React + TypeScript │
              └─────────┬──────────┘
                        │ HTTPS / JWT
                        ▼
              ┌────────────────────┐
              │ Supabase Edge API  │
              │ crm-api            │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │ PostgreSQL + RLS   │
              └─────────┬──────────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
    Companies        Contacts          Leads
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                 Deals / Activities
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        Outreach Log           Audit Log

External integrations:
Lead sources → CRM → Email / WhatsApp → Replies → Follow-ups
                                      ↓
                              Meetings / Proposals
~~~

### Technology

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js, React, TypeScript | CRM web application |
| Database | Supabase PostgreSQL 17 | System of record |
| Authentication | Supabase Auth | Identity and sessions |
| Authorization | PostgreSQL RLS | Database-level access control |
| Backend | Supabase Edge Functions | Authenticated API/business logic |
| Email | Hostinger Mail | Pravidh outreach |
| WhatsApp | API/provider adapter | Follow-up conversations |
| AI | OpenAI-compatible layer | Research, qualification, drafting |
| Source control | GitHub | Versioned code and documentation |

---

# How it works

## 1. Lead discovery

Leads can originate from legitimate public business signals such as:

- Company websites
- Public business contact pages
- Security/compliance needs
- Cloud migration or modernization
- Application/API security requirements
- Relevant IT/security hiring
- Other legitimate business-intent signals

The CRM stores the **source URL and trigger** so the reason for qualification remains visible.

Only legitimate public business contact information should be used. Private addresses must not be inferred.

## 2. Deduplication

Before outreach, the CRM checks existing records.

Controls include:

- Contact email uniqueness
- Company matching
- Lead/channel/recipient deduplication
- Do-not-contact state
- Existing outreach history

This prevents repeated or conflicting outreach.

## 3. Qualification

A lead can contain:

- Status
- Score
- Trigger
- Service fit
- Source URL
- Company/contact information
- Contact history
- Next follow-up

The score is an operational prioritization signal, not a guarantee of conversion.

Example:

~~~text
Trigger: Security engineering hiring
Service fit: API VAPT + Cloud Security
Score: 82
Status: Researching
~~~

---

# CRM data model

## Companies

Stores the organization:

- ID
- Name
- Website
- Industry
- Location
- Created/updated timestamps

## Contacts

Stores people associated with companies:

- Company
- Name
- Job title
- Email
- Phone
- WhatsApp
- Source URL
- Consent status
- Do-not-contact flag

## Leads

Represents a sales opportunity generated from a business signal.

Fields include:

- Company
- Contact
- Status
- Score
- Trigger
- Service fit
- Source URL
- First contacted
- Last contacted
- Next follow-up
- Converted date

### Lead lifecycle

~~~text
NEW
 ↓
RESEARCHING
 ↓
CONTACTED
 ↓
REPLIED
 ↓
QUALIFIED
 ↓
CONVERTED

Alternative:
DISQUALIFIED
~~~

## Deals

A deal represents a commercial opportunity after qualification.

~~~text
DISCOVERY
 ↓
QUALIFIED
 ↓
PROPOSAL
 ↓
NEGOTIATION
 ├──→ WON
 └──→ LOST
~~~

Deals contain:

- Lead
- Company
- Deal name
- Stage
- Value
- Currency
- Expected close date

## Activities

Chronological sales history:

- Note
- Email
- WhatsApp
- Call
- Meeting
- Follow-up
- Proposal
- Payment

This lets the CRM answer: what happened, who acted, through which channel, and when?

## Outreach log

Outbound email/WhatsApp actions record:

- Lead
- Contact
- Channel
- Recipient
- Subject
- Message
- Sent time
- Provider status
- External provider ID

A uniqueness constraint prevents duplicate lead/channel/recipient records.

## Audit log

Material CRM changes can record:

- Actor
- Action
- Entity type
- Entity ID
- Previous data
- New data
- Timestamp

This provides accountability for automated operations.

---

# Security model

Security is a first-class requirement.

## Authentication

The web application is designed to use Supabase Auth sessions. The CRM API validates authenticated identity.

## Authorization

Operational access requires an active team_members record.

Supported roles:

- admin
- sales
- viewer

## Row Level Security

RLS is enabled on operational CRM tables. Access therefore does not depend only on frontend checks.

**Never expose the Supabase service-role key in browser code.**

## API security

The crm-api Edge Function requires JWT verification.

API base:

~~~text
https://sfvfyxbakenijowdhuqs.supabase.co/functions/v1/crm-api
~~~

---

# Current API

| Method | Route | Purpose |
|---|---|---|
| GET | /health | Authenticated service health |
| GET | /pipeline | Pipeline records |
| GET | /hot-leads | Active high-score leads |
| GET | /followups/due | Due follow-ups |
| POST | /leads | Create lead/contact/company |
| PATCH | /leads/:id | Update lead |

### Create lead example

~~~json
{
  "company_name": "Example Technologies",
  "website": "https://example.com",
  "industry": "SaaS",
  "location": "Bengaluru, Karnataka, India",
  "contact_name": "CTO",
  "job_title": "Chief Technology Officer",
  "email": "business@example.com",
  "source_url": "https://example.com/careers",
  "trigger": "Security engineering hiring",
  "service_fit": "API VAPT",
  "score": 82
}
~~~

### Update lead

PATCH /leads/:id supports:

- status
- score
- trigger
- service_fit
- source_url
- next_follow_up_at
- first_contacted_at
- last_contacted_at
- converted_at

---

# Dashboard

The repository contains a Next.js dashboard foundation connected to the real CRM API.

Current UI includes:

- Command Center
- Navigation
- Hot-lead table
- Lead score/status
- Company/industry/location
- Contact/email
- Trigger
- Service fit
- API refresh

The UI is intentionally connected to the CRM API rather than populated with fake lead records.

---

# Automation architecture

The intended operating loop is:

~~~text
Public business signal
        ↓
Lead discovery
        ↓
Verification + deduplication
        ↓
AI qualification + service matching
        ↓
CRM
        ↓
Email / WhatsApp
        ↓
Reply / engagement
        ↓
Follow-up scheduler
        ↓
Discovery meeting
        ↓
Proposal / SOW
        ↓
Deal / payment
        ↓
Customer onboarding
~~~

Automation should preserve human control around important commercial decisions.

## Outreach safeguards

Automated outreach must enforce:

1. Duplicate prevention
2. Do-not-contact checks
3. Opt-out handling
4. Public business contact requirements
5. Source traceability
6. Outreach logging
7. Provider response logging
8. Follow-up timing controls
9. No uncontrolled generic blasting
10. Human review for sensitive/high-value opportunities

A sent message does **not** equal a conversion. Conversion requires an actual qualified commercial outcome recorded in CRM.

---

# Database

Supabase project:

~~~text
pravidh-crm
~~~

Region:

~~~text
ap-south-1
~~~

PostgreSQL:

~~~text
17
~~~

Core tables:

~~~text
companies
contacts
leads
deals
activities
outreach_log
audit_log
team_members
~~~

Operational views:

~~~text
crm_pipeline
crm_hot_leads
crm_due_followups
~~~

---

# Environment

Copy .env.example to .env.local.

Example:

~~~env
NEXT_PUBLIC_CRM_API_URL=https://sfvfyxbakenijowdhuqs.supabase.co/functions/v1/crm-api
NEXT_PUBLIC_SUPABASE_URL=https://sfvfyxbakenijowdhuqs.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
~~~

Never commit:

- Service-role keys
- Private API keys
- Mail passwords
- WhatsApp credentials
- Production secrets
- Customer credentials

---

# Local development

~~~bash
npm install
npm run dev
npm run build
npm start
~~~

---

# Repository structure

~~~text
Pravidhi-CRM/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── docs/
│   └── API.md
├── .env.example
├── ARCHITECTURE.md
├── next-env.d.ts
├── package.json
├── tsconfig.json
└── README.md
~~~

---

# Deployment model

~~~text
Internet
   ↓
Next.js CRM
   ↓ HTTPS / JWT
Supabase Edge Function
   ↓
PostgreSQL + RLS
   ↓
Email / WhatsApp / AI integrations
~~~

GitHub is the source of truth for application code and documentation.

---

# Build status

## Completed

- [x] Supabase project
- [x] PostgreSQL CRM schema
- [x] Companies
- [x] Contacts
- [x] Leads
- [x] Deals
- [x] Activities
- [x] Outreach log
- [x] Audit log
- [x] Team members
- [x] RLS foundation
- [x] Updated-at triggers
- [x] Lead creation RPC
- [x] Pipeline/hot-lead/follow-up views
- [x] Authenticated CRM Edge Function
- [x] Next.js dashboard foundation
- [x] API documentation
- [x] Architecture documentation

## Next

- [ ] Complete Supabase Auth UI/session middleware
- [ ] Full lead CRUD
- [ ] Pipeline/Kanban
- [ ] Company/contact detail pages
- [ ] Activity timeline
- [ ] Follow-up management
- [ ] Hostinger email integration
- [ ] Email reply synchronization
- [ ] WhatsApp provider adapter
- [ ] Automated follow-up scheduler
- [ ] AI lead qualification
- [ ] AI outreach personalization
- [ ] Proposal/SOW workflow
- [ ] Deal management
- [ ] Payment integration
- [ ] Reporting/analytics
- [ ] Production deployment
- [ ] Automated security/unit/integration tests

---

# Design principles

### CRM is the system of record

External channels may send or receive messages, but CRM state remains authoritative.

### Automation must be observable

Every automated action should answer:

- What happened?
- Why?
- Which lead?
- Which system?
- When?
- What did the provider return?

### Security before scale

Do not sacrifice customer data protection or credential security for automation speed.

### Human decisions remain human

AI can research, summarize, qualify, draft and recommend. Authorized team members retain control of important commercial decisions.

### Conversion is measurable

A lead becomes a customer only after an actual commercial outcome is recorded.

---

# Vision

Pravidh CRM is intended to become the operational control plane for Pravidh Solutions:

~~~text
LEAD
 ↓
INTELLIGENCE
 ↓
OUTREACH
 ↓
CONVERSATION
 ↓
OPPORTUNITY
 ↓
PROPOSAL
 ↓
CUSTOMER
 ↓
DELIVERY
 ↓
RETENTION
~~~

The system should make every stage measurable, auditable and increasingly automated without sacrificing security or human control.
