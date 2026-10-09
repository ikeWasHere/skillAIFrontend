# Skill IQ — Design System

Extracted from `Skill IQ Board.html`, a Claude Design page export (the "demand index" board).
Every value below is taken verbatim from that file — colors, type, spacing and behaviour — so this
document describes the system as built, not as imagined.

The source design has no CSS classes and no custom properties: it is 144 inline `style` attributes
on a single page. This document is the reusable system recovered from that markup.

The source sorted skills into rising, flat and falling. The app has since dropped trend direction
in favour of a single measure — how often postings name a skill — so the trend colors, pill,
sparkline and accent caps are gone, and the semantic palette now carries different meanings (§1.1).
Components added after extraction are marked *(app)*.

---

## 1. Foundations

### 1.1 Color

The palette is a near-monochrome print-lab grey stack plus three semantic colors. There is no
neutral ramp — every neutral tone is the ink color at a different alpha.

| Role | Token | Value | Notes |
|---|---|---|---|
| Ink | `ink` | `#121722` | Primary text, dark fills, inverted buttons. Most-used color. |
| Paper | `paper` | `#e8ecf1` | Page background, and text color when placed on ink. |
| Panel | `panel` | `#f4f7fa` | Every raised surface: cards, tiles, list and table bodies, fields. |
| Panel hover | `panel-hover` | `#fff` | Only ever a hover state, never a resting fill. |
| Core (fill) | `core-fill` | `#b08214` | Amber. Core-skill meter bars. |
| Core (text) | `core-text` | `#8a6510` | Darker amber, used **only** for type: the ★ and the core group label. |
| Error | `error` | `#bc3b2f` | Red. Failed-request text and nothing else. |
| Accent | `accent` | `#1c7a4a` | Green. The default `a:hover` color for plain text links only. |

**The two-amber rule is deliberate and load-bearing.** Amber darkens for type so it holds contrast
against `#f4f7fa`, while the fill stays brighter so bars remain legible at 9px tall. Use `core-text`
for glyphs and labels and `core-fill` for areas; do not collapse them into one.

Links that are themselves surfaces (cards, list rows, buttons) set an explicit `text-ink` or
`text-paper`, which overrides the green `a:hover` from the base layer.

### 1.2 The alpha ladder

Every neutral other than the four solids above is `rgba(18,23,34,α)` — the ink color, `#121722`,
expressed as `rgb(18,23,34)`. The alpha carries the meaning, and the ladder is used consistently:

| α | Purpose |
|---|---|
| `.05` | Graph-paper background grid |
| `.08` | Meter/progress track |
| `.1` | Row divider inside a panel |
| `.14` | Inner rule within a card |
| `.16` | Rule under a panel header |
| `.2` | Footer cell divider |
| `.22` | Hairline-grid gap and its outer border |
| `.25` | Sub-section divider; unselected chip border |
| `.3` | Artefact / code block border |
| `.35` | **Major section divider** — the strongest rule in the system |
| `.4` | Tick-mark strip |
| `.45` | Placeholder text, input border, footer labels |
| `.5` | Uppercase micro-labels (the default label tone) |
| `.55` – `.62` | Secondary text: card meta, row meta, nav links, chip labels |
| `.64` – `.68` | Body copy: methodology text, hero lede |
| `.7` – `.8` | Footer values, table secondary column |

Read the ladder as depth: structural lines live below `.4`, text lives above `.45`. When you need a
new neutral, pick the nearest existing rung rather than inventing one.

### 1.3 Typography

Two families, no third.

- **Instrument Serif** — weight 400 only, normal and italic. Display headings, and *all* large
  numerals. This is what makes the board read as an index rather than a dashboard.
- **JetBrains Mono** — variable 300–800, used at 300 and 400 only. Everything else: body, labels,
  table cells, buttons, code.

Both load as woff2 via `@font-face` with `font-display: swap`. Body default:
`font-family:'JetBrains Mono',ui-monospace,monospace`.

**Instrument Serif scale**

| Size / line-height | Use |
|---|---|
| `78px/.94`, `-.015em` | Hero headline |
| `60px/.96`, `-.015em` | Jobs page headline *(app)* |
| `40px/1` | Core-skill share *(app)* |
| `40px/1.06` | Closing CTA heading |
| `38px/1` | Section heading |
| `32px/1.06` | Methodology heading |
| `30px/1` | Stat tile value |
| `26px/1` | Certificate occurrence figure |
| `22px/1.15` | Job title *(app)* |
| `20px/1.1` | Job salary range *(app)* |
| `20px/1` | Brand wordmark |
| `19px/1.2` | Card title |
| `19px/1.1` | Table row primary cell |
| `15px/1` | Footer value |

**JetBrains Mono scale**

| Weight / size / line-height | Use |
|---|---|
| `300 15px/1.7` | Hero lede |
| `400 15px/1.3` | Core-skill name |
| `400 13px/1.3` | Ranked-list skill name *(app)* |
| `300 13.5px/1.75` | Methodology body |
| `400 13px/1` | Table secondary cell |
| `300 12.5px/1.6` | Section description |
| `400 12.5px/1` | Chip label |
| `400 12.5px/1.2` | Select value *(app)* |
| `300 12.5px/1` | Table numeral |
| `300 12px/1.75` | Artefact code block |
| `400 11–11.5px/1` | Button label |
| `300 10.5px/1` | Nav link; row meta |

Only three line-heights exist for prose — `1.6`, `1.7`, `1.75` — and everything else is set solid at
`/1`. Labels and figures never breathe; only paragraphs do.

**Numerals.** Every figure carries `font-variant-numeric: tabular-nums`. This is non-negotiable —
the design has columns of numbers that must not jitter as values change.

**Headings and paragraphs** carry `text-wrap: pretty`.

### 1.4 The micro-label

The single most characteristic element. Small, mono, 300 weight, uppercase, widely tracked, and set
at `rgba(18,23,34,.5)` unless it needs to be quieter.

Tracking widens as size shrinks:

| Size | Tracking | Use |
|---|---|---|
| `13px` (400) | `.14em` | Skill group header (`★ Core skills`, `Also in demand`) |
| `11–11.5px` (400) | `.12em` | Button label |
| `10.5px` | `.14em` | Nav link |
| `10px` | `.24em` | Eyebrow above the hero headline |
| `10px` | `.2em` | Section micro-label |
| `10px` | `.16em` | Right-aligned section meta; card issuer |
| `9.5px` (400) | `.12em` | Demand badge |
| `9px` | `.18em` | Stat tile label; table column header; field label |
| `9px` | `.2em` | Brand tagline |
| `8.5px` | `.18em` | Footer label |

### 1.5 Spacing

No formal scale, but the observed values cluster tightly and are all even:

`4 · 7 · 8 · 9 · 10 · 11 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 26 · 28 · 32 · 34 · 36 · 38 · 44 · 48 · 56`

Practical defaults drawn from usage:

- **Section padding** — `48px 44px`
- **Hero padding** — `56px 38px 44px 44px` (left), `56px 44px 44px 34px` (right)
- **Card padding** — `20px`
- **Tile padding** — `16px`
- **Row padding** — `14px 16px` (panel row), `14px 18px` (table row)
- **Footer cell padding** — `15px 18px`
- **Grid gaps** — `16px` between panels, `1px` for hairline grids, `36px` for the methodology split

### 1.6 Grid ratios

Layouts are asymmetric on purpose; equal splits are reserved for grids of like items.

| Layout | Template |
|---|---|
| Hero | `1.15fr .85fr` |
| Core-skill cards *(app)* | `repeat(auto-fit,minmax(15rem,1fr))`, gap `1px` |
| Ranked skill list *(app)* | CSS columns: 1 → 2 (`sm`) → 3 (`lg`), `.1` column rule |
| Job filters *(app)* | `repeat(5,1fr)` at `lg`; 2 columns below with Role spanning both |
| Job card *(app)* | `1fr auto`, gap `36px` |
| Certificate grid | `repeat(4,1fr)`, gap `1px` |
| Roles table | `1.3fr 1.1fr .8fr .8fr 104px`, gap `16px` |
| Methodology | `1fr .9fr`, gap `36px` |
| Footer | `1.5fr .8fr .8fr .9fr` |

---

## 2. Signature techniques

Three tricks give the system its character. Reproduce these exactly.

### 2.1 Graph paper

The whole board sits on a 32px engineering grid, drawn with two repeating gradients rather than an
image:

```css
background-image:
  repeating-linear-gradient(90deg, rgba(18,23,34,.05) 0 1px, transparent 1px 32px),
  repeating-linear-gradient(0deg,  rgba(18,23,34,.05) 0 1px, transparent 1px 32px);
```

### 2.2 Hairline grid

Panels are separated by *gaps*, not borders. A 1px gap over an ink-tinted container reads as a
perfect hairline with no double-border seams at the joins:

```css
/* container */
display: grid;
gap: 1px;
background: rgba(18,23,34,.22);
border: 1px solid rgba(18,23,34,.22);

/* every child */
background: #f4f7fa;
```

Used for the stat tile grid (`1fr 1fr`), the certificate grid (`repeat(4,1fr)`), the core-skill
cards and the job filters. Because the container is tinted, an incomplete last row shows a grey
slab: either fill it (`RowFillers` in TopCertificates), let `auto-fit` collapse empty tracks, or span
a cell so rows come out even.

### 2.3 Tick strip

A 22px measuring-rule band under the masthead — 1px marks every 16px, clipped to the bottom 6px:

```css
height: 22px;
border-bottom: 1px solid rgba(18,23,34,.35);
background-image: repeating-linear-gradient(90deg, rgba(18,23,34,.4) 0 1px, transparent 1px 16px);
background-size: 100% 6px;
background-position: bottom;
background-repeat: repeat-x;
```

---

## 3. Components

### 3.1 Demand badge

Outlined, never filled, in ink — the API grades demand as a word, and there is no meaning for color
to carry.

```
display: inline-block
padding: 4px 8px
font: 400 9.5px/1 'JetBrains Mono', monospace
letter-spacing: .12em
text-transform: uppercase
color: rgba(18,23,34,.65)
border: 1px solid rgba(18,23,34,.3)
background: transparent
```

### 3.2 Meter bar

Track and fill, square corners, no transition.

```
track: height 9px (md) or 3px (sm); background rgba(18,23,34,.08)
fill:  display block; width <pct>%; height 100%
       background core-fill for a core skill, rgba(18,23,34,.45) otherwise
```

The `sm` size is for dense lists, where a 9px bar per row would outweigh the label.

### 3.3 State panel *(app)*

Loading, failure and empty all take one panel, so a section keeps its footprint while a request is
in flight.

```
border 1px solid rgba(18,23,34,.22); background #f4f7fa; padding 36px 18px; text-align center
font: 300 12.5px/1.6 mono; color rgba(18,23,34,.55), or error red on failure
```

A figure the API has no value for, or one still loading, renders as an em-dash (`—`), never as a
zero, so a pending number never reads as a real one.

### 3.4 Stat tile

Label over figure, inside a hairline grid.

```
label:  300 9px/1 mono, .18em, uppercase, rgba(18,23,34,.5)
value:  400 30px/1 'Instrument Serif', #121722, tabular-nums, margin-top 8px
```

### 3.5 Chip (selector)

A vertical stack, `gap: 4px`. Selection is a full ink inversion.

```
base:      display block; white-space nowrap; text-align left;
           padding 11px 14px; font 400 12.5px/1 mono;
           cursor pointer; border 1px solid transparent
selected:  background #121722; color #e8ecf1; border-color #121722
default:   background transparent; color rgba(18,23,34,.62); border-color rgba(18,23,34,.25)
```

### 3.6 Search bar

Two flush cells in a single bordered box — no rounding, no gap, no shadow.

```
wrapper: display flex; border 1px solid rgba(18,23,34,.45); background #f4f7fa
field:   flex 1; padding 18px 20px; 300 14px/1 mono; color rgba(18,23,34,.45)
button:  background #121722; color #e8ecf1; padding 18px 24px;
         400 11.5px/1 mono; .12em; uppercase
```

The closing CTA uses a tighter variant: padding `17px` / `17px 24px`, type at `13px` / `11px`.

### 3.7 Section header

Heading left, meta right, baselines aligned to the bottom.

```
display flex; align-items flex-end; justify-content space-between
heading: 400 38px/1 'Instrument Serif', #121722, margin 0
meta:    300 10px/1 mono, .16em, uppercase, rgba(18,23,34,.5)
```

An optional description sits under the heading at `300 12.5px/1.6 mono`, `rgba(18,23,34,.62)`.

### 3.8 Artefact block

A `<pre>` used to expose the underlying computation, in ink throughout.

```
border: 1px solid rgba(18,23,34,.3)
background: #f4f7fa
padding: 20px
font: 300 12px/1.75 'JetBrains Mono', monospace
white-space: pre; overflow: auto
```

### 3.9 Data table

Header row and body rows share one `grid-template-columns`. The header rule is `.25`; row rules are
`.1`.

```
header: padding 11px 18px; 300 9px/1 mono, .18em, uppercase, rgba(18,23,34,.5)
        border-bottom 1px solid rgba(18,23,34,.25)
row:    padding 14px 18px; align-items center
        border-bottom 1px solid rgba(18,23,34,.1)
```

Numeric columns are right-aligned with `tabular-nums`.

### 3.10 Select *(app)*

A native `<select>` — keyboard and screen-reader behaviour come for free — with the chrome stripped
back to the search bar's square bordered field. Options are always supplied, never typed, so a
filter can only hold a value the data contains. Sits in a hairline-grid cell under a field label.

```
label:  300 9px/1 mono, .18em, uppercase, rgba(18,23,34,.5); 10px above the field
field:  appearance none; border-radius 0; border 1px solid rgba(18,23,34,.45);
        background #f4f7fa; padding 11px 32px 11px 12px; 400 12.5px/1.2 mono; #121722
arrow:  "▾", 10px, rgba(18,23,34,.55), absolutely placed 12px from the right
disabled: border rgba(18,23,34,.25); text rgba(18,23,34,.45)
focus:  2px ink outline, 2px offset
```

If the applied value is missing from the option list (still loading, or outside a narrowed window),
it is added as an option rather than letting the select silently display a different one.

### 3.11 Core-skill card *(app)*

A panel in the core-skill hairline grid, and a link to that skill's postings.

```
padding 20px; flex column
name:   400 15px/1.3 mono, ink; "★" at 17px in core-text, top right
share:  400 40px/1 Instrument Serif, tabular-nums, pinned to the bottom (margin-top auto)
        so a two-line name doesn't break the row; "of postings" tile label beside it
bar:    md meter, core-fill
footer: .14 rule above; "View postings →" nav label at .55, ink on hover
```

### 3.12 Ranked skill list *(app)*

One `<ol>` in a bordered panel, flowed into CSS columns so it reads top to bottom like a single
list but fills the width. Each row is a link:

```
row:   padding 10px 16px; break-inside avoid; hover background #fff
rank:  300 10.5px mono, .4, 20px wide
name:  400 13px/1.3 mono, ink;   share: 300 12px mono, .6, tabular-nums, right
bar:   sm meter, ink at .45
arrow: "→" at .3, ink on hover
```

### 3.13 Job card *(app)*

A row in a bordered results panel, separated by `.1` rules.

```
left:  company (issuer label, .55) · title (22px serif) · meta line (10.5px mono, .14em,
       uppercase, .55: seniority · workplace · posted date) · two-line excerpt (12.5px/1.6, .62)
       · "Full description" <details>, rendered with a .14 left rule
right: "Base salary" tile label over the range in 20px serif, or "Not listed" in mono at .45;
       "View posting ↗" as an inverted ink button, opening the source posting in a new tab
```

### 3.14 Pagination *(app)*

Previous and next as links (so a page can be opened in a new tab), with "Page n of N" as a meta
label between them. Links are outlined at `.25`, `.45` on hover; an unavailable direction is a
`.14`-bordered span at `.3`.

### 3.15 Masthead navigation *(app)*

Nav items are full-height cells on the right of the masthead, separated by `.35` rules. The active
route takes the chip's full ink inversion; the others sit at `.6` with the panel-hover surface.

---

## 4. Rules and behaviour

### 4.1 Core-skill threshold

A skill named in at least `CORE_THRESHOLD_PCT` (90) percent of a role's postings is a core skill:
it gets a ★ and a card above the list. Defined once in `src/lib/skills.ts`.

### 4.2 Tunable constants

| Constant | Where | Value | Effect |
|---|---|---|---|
| `CORE_THRESHOLD_PCT` | `src/lib/skills.ts` | `90` | Core-skill cutoff |
| skill limit | `useSkills` | `20` | Skills on the board (API max `50`) |
| `OPTION_LIMIT` | `useSkillIq.ts` | `50` | Options in the skill and certificate dropdowns |
| `PAGE_SIZE` | `JobsPage.tsx` | `20` | Postings per page (API max `50`) |

### 4.3 Interaction

Hover is expressed as a single surface change — `#f4f7fa` → `#fff` — on certificate cards, table
rows, core-skill cards, ranked-list rows and job cards. No shadow, no lift, no border change. Inside
a linked surface, the trailing cue (`→` or "View postings") darkens to ink.

---

## 5. House style

The constraints that make it cohere. Break these and it stops looking like the same system.

1. **No rounded corners.** Every rectangle is square, including native form controls.
2. **No shadows.** Depth is communicated by hairlines and surface value only.
3. **No transitions.** State changes are instant.
4. **Serif for magnitude, mono for everything else.** If it's a number a reader compares, it's
   Instrument Serif with `tabular-nums`. If it's a label, a control, or prose, it's JetBrains Mono.
5. **Neutrals are alpha, not grey.** Never introduce a hex grey; use a rung on the ink ladder.
6. **Uppercase micro-labels carry the structure.** Sections are titled twice — once in serif for the
   reader, once in tracked mono for the scanner.
7. **Rules get heavier as the division gets bigger.** `.1` inside a panel, `.22` between cells,
   `.35` between sections. Keep the hierarchy legible.
8. **Color is reserved for meaning.** Amber means core skill; red means a request failed; green is
   only the hover color of a plain text link. Everything remaining is ink on paper.
9. **Show the working.** Every figure carries its window, and every skill leads to the postings it
   was measured from. Quantitative confidence is part of the visual language.

---

## 6. Assets

The source bundle ships ten woff2 files — the full subset range for both families:

- **Instrument Serif** — 4 files: normal and italic, each in `latin` and `latin-ext`.
- **JetBrains Mono** — 6 files: `latin`, `latin-ext`, `cyrillic`, `cyrillic-ext`, `greek`,
  `vietnamese`, all at variable weight `300 800`.

Both are available from Google Fonts, so re-hosting is optional; the `@font-face` blocks in the
export can be replaced with a standard Google Fonts link without any visual change.
