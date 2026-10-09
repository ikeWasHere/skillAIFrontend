# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Job seekers and working professionals in or entering data roles, who want to see which jobs, skills
and certificates are actually in demand.

They arrive at a decision point — before committing time or money to a course, a certificate, or a
role to target — and the question is where to spend limited study hours. They are deciding for
themselves, not for a team, so the product has to be convincing to a single person acting on their
own judgment rather than defensible to a budget holder.

## Product Purpose

Show which skills and certificates employers in the data job market actually ask for, measured by
how often live postings name them, so someone can choose what to learn next based on measured
demand rather than opinion — and then see the postings themselves.

Success is a visitor leaving with a changed or confirmed decision about what to study next. The
product has done its job when someone reallocates their next block of study time because of what
they saw.

## Positioning

Demand is **measured from live job postings, and the method is published**. The differentiator is
not the ranking — rankings are commodity content — it is the pairing of each figure with the
working behind it: the window, the sample size, and a path back to the postings the figure came
from.

The mechanism a neighboring product could not truthfully copy is the pipeline: TheirStack's job
postings API feeding a Databricks medallion architecture, with the application reading the curated
gold layer. That is what makes "measured, not opinion" a true statement rather than a slogan.

The competitive set is opinion-driven "top 10 skills for 2026" listicles and static salary reports.
Both state an opinion or a stale snapshot; this states a measured share of live postings and shows
the postings it was measured from.

## Operating Context

Someone is choosing between courses, certificates, or target roles, usually with a fixed and small
amount of time to invest. They are comparing options that all sound plausible, and the market
signal is the tiebreaker.

The current surface is a public landing page that presents the index directly — the data is the
pitch, so there is no gap between marketing and product — plus a jobs page that lists the postings
behind any figure on it.

## Capabilities and Constraints

**Confirmed today**

- A React 19 / TypeScript / Vite / Tailwind v4 / React Router single-page app with two routes:
  `/` (the skill board) and `/jobs` (postings).
- Live data from the Skill IQ API: `/api/filters`, `/api/skills`, `/api/certifications` and
  `/api/jobs`. All access is in `src/lib/api.ts`.
- Skills are ranked by occurrence: the share of the role's postings in the window that name the
  skill. Skills at **90% or more** are core skills and are starred above the rest. The threshold is
  `CORE_THRESHOLD_PCT` in `src/lib/skills.ts`.
- Every skill links to `/jobs` filtered to the postings that name it. The jobs page filters by role,
  skill, certificate, industry and posting window, and every option comes from the API, so a filter
  can only hold a value the data contains.
- The board uses the API's default 90-day window; the jobs page defaults to the same window so a
  skill's share and its posting count agree.

**Data path**

- TheirStack API → Databricks (medallion architecture) → the Skill IQ API, which reads the **gold
  layer**; bronze and silver are not application-facing.
- Caching strategy and refresh cadence for the API have not been documented here.

**Explicitly undecided**

- Geographic and role scope beyond US data roles — whether that is a beachhead or the permanent
  boundary.
- Refresh cadence, and whether the page should state when the data was last refreshed.
- Business model and pricing.
- Accounts, saved roles and searches, alerts — none scoped.
- Whether skills should regain a direction over time (rising or falling share). The API still sends
  a trend field per skill; the UI deliberately ignores it.

## Brand Commitments

- **Name:** Skill IQ. **Tagline:** "Demand Index".
- **Voice:** plain, quantitative, and self-auditing. It states a number, then states how the number
  was produced. It does not hype, and it does not use urgency or fear about careers as a lever.
  Established by the existing copy and treated as binding.
- The visual system is documented separately in [DESIGN.md](DESIGN.md) and is not restated here.

## Evidence on Hand

- Every figure on the page now comes from the live API. Samples are small (tens of postings per
  role per window), and some roles currently return no skills at all; the page shows an empty state
  rather than a placeholder.
- Skill names come from the pipeline's taxonomy as-is, including casing and some off-domain matches.
  Cleaning them is a pipeline concern, not a frontend one.
- No testimonials, customers, case studies, press, logos, or benchmarks exist. Future work must not
  invent them.
- The design system in DESIGN.md is real and was extracted from an approved design.

## Product Principles

1. **Measured, not asserted.** The product's value is telling someone how often employers actually
   ask for a skill. A ranking without a measured share behind it is the commodity we are competing
   against.
2. **Show the working.** Every figure carries its window and sample size, and leads back to the
   postings behind it. The method being inspectable is the product, not a footnote.
3. **Serve the next decision.** Every feature should shorten the path to "spend your next hours
   here." If it does not change a learning decision, it is decoration.
4. **Never present sample or modeled data as observed.** Disclosure travels with the number, and the
   burden is on us to label it, not on the reader to notice.
5. **Freshness is a feature.** The core claim is "live postings." Stale data does not degrade the
   product gracefully — it falsifies the promise.
