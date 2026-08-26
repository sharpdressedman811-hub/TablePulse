# TablePulse AI — Master Build Prompt

You are acting as the CTO, senior software architect, product manager, UX designer, AI engineer, SaaS strategist, and security engineer for a startup called TablePulse AI.

Your job is to help design and build a production-ready SaaS platform for independent restaurants.

---

## IMPORTANT: READ THIS BEFORE WRITING A SINGLE LINE OF CODE

**Run Phase 0 first. If Phase 0 reveals that another company already owns the exact wedge you are considering, pivot before spending weeks coding.**

---

## 0. PHASE 0 — COMPETITIVE-GAP ANALYSIS (MANDATORY FIRST STEP)

Before writing any code, architecture, or database schema, you must complete a competitive-gap analysis. This is not optional. The goal is to verify that the wedge is defensible before committing engineering resources.

### What to research

Use web search, company websites, G2, Capterra, TechCrunch, Product Hunt, Crunchbase, and relevant review sites to answer:

1. **Direct competitors** — Who already sells an "AI intelligence layer for restaurants" that sits above the POS? For each: name, URL, funding status, pricing (if public), exact wedge.

2. **Partial competitors** — Who sells restaurant analytics/reporting SaaS that overlaps with the proposed product but is NOT positioned as an AI layer?

3. **The killer feature** — Does any competitor already offer the specific feature you are planning as your primary differentiator? If yes, who and how mature is it?

4. **The incumbent's native offering** — What does the primary POS/platform (e.g. Toast) already offer natively for free? Would a customer of that platform feel they already have this?

5. **Pricing gap** — Is the proposed price point defensible, or are competitors significantly cheaper or free?

### Output format

Produce a structured report with these sections:

- DIRECT COMPETITORS (table: name, URL, wedge, funding, pricing)
- PARTIAL COMPETITORS (table: name, URL, overlap area)
- KILLER FEATURE AUDIT — who has it, how mature
- INCUMBENT NATIVE ANALYTICS — what it already does and its blind spots
- PRICING ANALYSIS
- WEDGE VERDICT: one of → OWN IT / CONTESTED / PIVOT NEEDED
- PIVOT OPTIONS (2–3 alternatives if verdict is CONTESTED or PIVOT NEEDED)

### Decision gate

| Verdict | Action |
|---|---|
| OWN IT | Proceed to Phase 1 as planned |
| CONTESTED | Narrow the ICP (ideal customer profile) to a specific segment before proceeding. Update the product spec to reflect the narrowed focus. Then proceed to Phase 1. |
| PIVOT NEEDED | Stop. Present pivot options. Get founder sign-off on the new wedge. Restart Phase 0 for the new wedge before proceeding to Phase 1. |

**Do not proceed to Phase 1 until the decision gate is resolved.**

---

## 1. PRODUCT VISION

TablePulse AI is an AI intelligence and automation layer that sits on top of existing restaurant technology rather than replacing it.

The restaurant continues using systems such as:

- Toast
- Square
- Clover
- Lightspeed
- OpenTable
- Resy
- 7shifts
- DoorDash
- Uber Eats
- Google Business Profile
- Meta/Instagram

TablePulse connects authorized data sources, normalizes the information, analyzes it, identifies opportunities/problems, and recommends or executes actions.

The core promise is:

> "Connect your restaurant systems. TablePulse tells you what is happening, what is likely to happen, what you should do, and eventually does it for you."

Do NOT build another POS.

Build the intelligence layer above the POS.

---

## 2. CORE PRODUCT

The system should eventually analyze:

**Sales**
- Daily sales, hourly sales, average check, covers
- Revenue trends, day-of-week patterns, year-over-year comparisons
- Sales forecasting

**Menu**
- Item sales, item profitability where cost data is available
- Slow-moving items, high-performing items
- Menu engineering, suggested pricing experiments

**Reservations**
- Reservation volume, covers, no-shows, cancellations
- Seating patterns, forecasted demand

**Labor**
- Scheduled vs. actual labor, labor percentage
- Sales per labor hour, overstaffing/understaffing indicators

**Inventory**
- Ingredient usage, stock levels, waste
- Potential shortages, purchasing recommendations

**Marketing**
- Slow periods, customer segments, promotions
- Social content, email, SMS, campaign performance

---

## 3. THE KILLER FEATURE

Create an AI feature called:

**"What Should I Do Today?"**

The restaurant owner opens the application and immediately receives a prioritized operating brief.

Example:

```
TODAY'S BRIEF

Projected revenue: $11,420
Reservations: 184
Projected covers: 236
Labor: 31.8%

AI ACTIONS:

1. Lunch is tracking 17% below normal.
   Recommend a targeted 2–4 PM promotion.

2. Dinner reservations indicate a heavy 6–8 PM period.
   Maintain current staffing.

3. Salmon inventory may be insufficient for projected dinner demand.
   Verify inventory before 3 PM.

4. Tuesday margarita sales have increased 27%.
   Feature margaritas in today's social content.
```

The AI must distinguish between:
- Verified facts
- Predictions
- Recommendations
- Assumptions

The AI must NEVER invent restaurant data.

---

## 4. AI ARCHITECTURE

Do not blindly send raw restaurant data to an LLM and ask it to make decisions.

Build this architecture:

```
DATA SOURCES
↓
AUTHENTICATION
↓
PROVIDER ADAPTERS
↓
NORMALIZED DATA MODEL
↓
DATABASE
↓
DETERMINISTIC ANALYTICS
↓
FORECASTING
↓
RULES / EXCEPTION ENGINE
↓
AI INTERPRETATION
↓
RECOMMENDATIONS
↓
HUMAN APPROVAL
↓
OPTIONAL AUTOMATION
↓
RESULTS
↓
LEARNING LOOP
```

The deterministic analytics layer must calculate verified metrics before AI interpretation.

---

## 5. PROVIDER ARCHITECTURE

Every external platform must be isolated behind an adapter.

Create an interface similar to:

```
RestaurantProvider
  get_restaurant()
  get_locations()
  get_orders()
  get_payments()
  get_menu()
  get_labor()
  get_inventory()
  get_customers()
  get_reservations()
```

Do not allow Toast-specific data structures to leak throughout the application.

The core application must operate on a normalized TablePulse data model.

---

## 6. TOAST INTEGRATION

Toast should be the first major integration.

Use Toast's official API/integration mechanisms.

- Do NOT scrape Toast.
- Do NOT fabricate API endpoints.
- Do NOT hard-code credentials.
- Do NOT assume undocumented permissions.

Where access or documentation is required, create a clearly marked integration placeholder and explain exactly what credentials/scopes/configuration are required.

Build the Toast adapter separately from the rest of the application.

---

## 7. FIRST FIVE UI SCREENS

**Screen 1 — Command Center**
- Today's revenue, revenue vs. normal, covers, reservations, labor %, projected revenue, alerts, AI recommendations
- Owner understands restaurant health in under 30 seconds

**Screen 2 — AI Action Plan**
Every recommendation must contain: Problem / Evidence / Recommendation / Expected impact / Confidence / Action button

**Screen 3 — Revenue Intelligence**
Sales graph, hourly performance, day-of-week performance, covers, average check, revenue forecast, historical comparison

**Screen 4 — Labor Intelligence**
Scheduled labor, actual labor, labor %, sales/labor hour, forecasted demand, staffing recommendations

**Screen 5 — Marketing**
AI identifies revenue opportunities → CREATE CAMPAIGN → AI generates offer, headline, social caption, email, SMS, short-form video concept, image/video prompt → human approval before publishing

---

## 8. AI RESTAURANT VIDEO ENGINE

Future module: **TablePulse Creative**

Restaurants upload food photos, restaurant photos, existing videos, logo, menu, brand information.

System creates: Instagram Reels, TikTok videos, Facebook videos, Story content, promotional graphics.

Do not make false claims about menu items.

---

## 9. DASHBOARD DESIGN PHILOSOPHY

```
WHAT'S HAPPENING
WHY IT'S HAPPENING
WHAT SHOULD I DO?
DO IT
```

Professional, modern, extremely simple, mobile responsive, fast, data-driven. Avoid cluttered enterprise dashboards.

---

## 10. TECHNOLOGY STACK

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Python, FastAPI
- **Database**: PostgreSQL
- **Authentication**: Secure managed authentication system
- **Payments**: Stripe
- **Background processing**: Redis + Celery or equivalent managed queue
- **Infrastructure**: AWS, GCP, Azure, or comparable production cloud
- **AI**: Provider abstraction layer so the underlying model can be changed later

Use environment variables for all secrets. Never commit credentials.

---

## 11. DATABASE

Design a multi-tenant SaaS database with at minimum:

Users, Organizations, Restaurants, Locations, Integrations, Integration credentials/tokens, Orders, Order items, Menu items, Customers, Reservations, Covers, Labor records, Inventory, Sales metrics, AI recommendations, Campaigns, Campaign results, Audit logs, Subscriptions

Every restaurant must be logically isolated from every other restaurant.

---

## 12. SECURITY

- Encryption in transit and at rest
- Secure token storage, OAuth where applicable
- Role-based access control, tenant isolation
- Audit logging, rate limiting, input validation
- Secret management, secure webhook validation
- Least-privilege API scopes
- Do not store unnecessary customer information
- Build toward privacy compliance

---

## 13. MONETIZATION

Stripe subscription plans:

| Plan | Price |
|---|---|
| STARTER | $299/month |
| INTELLIGENCE | $399/month |
| GROWTH | $449/month |

Add-ons:
- AI Marketing Automation: +$99/month
- AI Creative/Video: +$149/month
- Multi-location: Custom pricing

Also support: free trial, upgrade, downgrade, cancellation, billing portal.

Do not hard-code prices throughout the application. Store pricing configuration centrally.

---

## 14. MVP STRATEGY

The first MVP must contain:

1. Restaurant account
2. Authentication
3. Dashboard
4. Mock restaurant data
5. Normalized data model
6. Analytics engine
7. AI recommendations
8. Subscription system
9. Toast adapter architecture
10. One real integration when credentials/access are available

The goal is to prove that restaurant owners will pay for the intelligence before building a massive integration ecosystem.

---

## 15. DEVELOPMENT PHASES

| Phase | Description |
|---|---|
| **Phase 0** | Competitive-gap analysis (MANDATORY — see top of document) |
| **Phase 1** | Application shell |
| **Phase 2** | Authentication and multi-tenancy |
| **Phase 3** | PostgreSQL schema |
| **Phase 4** | Mock restaurant data |
| **Phase 5** | Command Center |
| **Phase 6** | Deterministic analytics |
| **Phase 7** | AI recommendation system |
| **Phase 8** | Stripe billing |
| **Phase 9** | Toast integration adapter |
| **Phase 10** | Production Toast integration (after appropriate access is obtained) |
| **Phase 11** | Marketing automation |
| **Phase 12** | AI creative/video generation |

---

## 16. DEVELOPMENT RULE

Do not give vague instructions such as "Set up the backend."

Instead, for every task:

1. State exactly what file to create
2. Provide the complete code
3. State exactly where the code goes
4. List dependencies to install
5. Explain how to run it
6. Explain how to test it
7. Describe what successful output looks like
8. State what to build next
