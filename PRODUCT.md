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

Show which skills, roles and certificates in the data job market are rising, holding flat, or
falling, so someone can choose what to learn next based on measured demand rather than opinion.

Success is a visitor leaving with a changed or confirmed decision about what to study next. The
product has done its job when someone reallocates their next block of study time because of what
they saw.

## Positioning

Demand is **measured from live job postings, and the method is published**. The differentiator is
not the ranking — rankings are commodity content — it is the pairing of a direction with the
working behind it: the window, the thresholds, the sample size, and a path back to the postings the
figure came from.

The mechanism a neighboring product could not truthfully copy is the pipeline: TheirStack's job
postings API feeding a Databricks medallion architecture, with the application reading the curated
gold layer. That is what makes "measured, not opinion" a true statement rather than a slogan.

The competitive set is opinion-driven "top 10 skills for 2026" listicles and static salary reports.
Both state a snapshot; this states a direction and shows how it was derived.

## Operating Context

Someone is choosing between courses, certificates, or target roles, usually with a fixed and small
amount of time to invest. They are comparing options that all sound plausible, and the market
signal is the tiebreaker.

The current surface is a single public landing page that presents the index directly — the data is
the pitch, so there is no gap between marketing and product.

## Capabilities and Constraints

**Confirmed today**

- A React 19 / TypeScript / Vite / Tailwind v4 single-page landing surface.
- Trend classification: change in share of live postings over a 90-day rolling window against the
  previous 90 days; rise at ≥ +3 points, fall at ≤ −2 points, flat between. Defined in
  `src/lib/trend.ts`.
- Role selection re-sorts skills into rising / flat / falling; certificates and roles are ranked
  with the same classifier.
- All figures currently come from a hardcoded illustrative dataset in `src/lib/data.ts`. There is
  no backend and no network call.

**Planned data path**

- TheirStack API → Databricks (medallion architecture). The application will read from the **gold
  layer**; bronze and silver are not application-facing.
- Nothing between the gold layer and the frontend has been specified yet: no API contract, caching
  strategy, or refresh mechanism has been decided.

**Explicitly undecided**

- Geographic and role scope beyond US data roles — whether that is a beachhead or the permanent
  boundary.
- Refresh cadence. The page currently claims "Updated 06:00 UTC", which the pipeline must honor or
  the copy must change.
- Whether the promised link-through from a figure to its underlying postings gets built. The
  methodology copy commits to it: "every figure links to the postings behind it."
- Business model and pricing. The page currently claims "Free · no account", which is not yet a
  confirmed product decision.
- Accounts, saved roles, alerts on a skill changing direction — none scoped.

## Brand Commitments

- **Name:** Skill IQ. **Tagline:** "Demand Index".
- **Voice:** plain, quantitative, and self-auditing. It states a number, then states how the number
  was produced. It does not hype, and it does not use urgency or fear about careers as a lever.
  Established by the existing copy and treated as binding.
- The visual system is documented separately in [DESIGN.md](DESIGN.md) and is not restated here.

## Evidence on Hand

- **No real data yet.** Every figure on the page today is illustrative sample data, and the footer
  discloses this. That disclosure must remain until the gold layer is actually wired in.
- The following on-page numbers are **placeholders, not verified facts**, and must not be repeated
  as real anywhere else until they come from the pipeline: "341 tracked" certificates, "412 indexed"
  roles, "1,140 metros covered", "1,940 postings" in the methodology artefact, and every openings,
  salary, competition and delta figure.
- No testimonials, customers, case studies, press, logos, or benchmarks exist. Future work must not
  invent them.
- The design system in DESIGN.md is real and was extracted from an approved design.

## Product Principles

1. **Direction over snapshot.** The product's value is telling someone which way a skill is moving.
   A ranking without a direction is the commodity we are competing against.
2. **Show the working.** Every figure carries its window, threshold and sample size, and should lead
   back to the postings behind it. The method being inspectable is the product, not a footnote.
3. **Serve the next decision.** Every feature should shorten the path to "spend your next hours
   here." If it does not change a learning decision, it is decoration.
4. **Never present sample or modeled data as observed.** Disclosure travels with the number, and the
   burden is on us to label it, not on the reader to notice.
5. **Freshness is a feature.** The core claim is "live postings." Stale data does not degrade the
   product gracefully — it falsifies the promise.
