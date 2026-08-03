# Skill IQ — Design System

Extracted from `Skill IQ Board.html`, a Claude Design page export (the "demand index" board).
Every value below is taken verbatim from that file — colors, type, spacing and behaviour — so this
document describes the system as built, not as imagined.

The source design has no CSS classes and no custom properties: it is 144 inline `style` attributes
on a single page. This document is the reusable system recovered from that markup.

---

## 1. Foundations

### 1.1 Color

The palette is a near-monochrome print-lab grey stack plus three semantic trend colors. There is no
neutral ramp — every neutral tone is the ink color at a different alpha.

| Role | Value | Notes |
|---|---|---|
| Ink | `#121722` | Primary text, dark fills, inverted buttons. Most-used color (25 uses). |
| Paper | `#e8ecf1` | Page background, and text color when placed on ink. |
| Panel | `#f4f7fa` | Every raised surface: cards, tiles, table body, code block. |
| Panel hover | `#fff` | Only ever a hover state, never a resting fill. |
| Rising | `#1c7a4a` | Green. |
| Falling | `#bc3b2f` | Red. |
| Flat (fill) | `#b08214` | Amber, used for bars, sparklines, borders. |
| Flat (text) | `#8a6510` | Darker amber, used **only** for type and 1px pill borders. |

**The two-amber rule is deliberate and load-bearing.** The source keeps two maps:

```js
TR     = { up: '#1c7a4a', flat: '#8a6510', down: '#bc3b2f' }  // text, pill borders
TRFILL = { up: '#1c7a4a', flat: '#b08214', down: '#bc3b2f' }  // bars, sparklines, top borders
```

Green and red are identical in both. Amber darkens for type so it holds contrast against `#f4f7fa`,
while the fill stays brighter so bars remain legible at 9px tall. Reuse both maps; do not collapse
them into one.

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
| `40px/1.06` | Closing CTA heading |
| `38px/1` | Section heading |
| `32px/1.06` | Methodology heading |
| `30px/1` | Stat tile value |
| `26px/1` | Certificate pay figure |
| `20px/1` | Brand wordmark |
| `19px/1.2` | Card title |
| `19px/1.1` | Table row primary cell |
| `15px/1` | Footer value |

**JetBrains Mono scale**

| Weight / size / line-height | Use |
|---|---|
| `300 15px/1.7` | Hero lede |
| `400 15px/1.1` | Skill name |
| `300 13.5px/1.75` | Methodology body |
| `400 13px/1` | Table secondary cell |
| `300 12.5px/1.6` | Section description |
| `400 12.5px/1` | Chip label; delta value |
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
| `13px` (400) | `.14em` | Trend column header |
| `11–11.5px` (400) | `.12em` | Button label |
| `10.5px` | `.14em` | Nav link |
| `10px` | `.24em` | Eyebrow above the hero headline |
| `10px` | `.2em` | Section micro-label |
| `10px` | `.16em` | Right-aligned section meta; card issuer |
| `9.5px` (400) | `.12em` | Trend pill |
| `9px` | `.18em` | Stat tile label; table column header |
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

Layouts are asymmetric on purpose; nothing is a plain equal split except the trend columns.

| Layout | Template |
|---|---|
| Hero | `1.15fr .85fr` |
| Trend columns | `repeat(3,1fr)`, gap `16px` |
| Certificate grid | `repeat(4,1fr)`, gap `1px` |
| Roles table | `1.3fr 1.1fr .8fr .8fr 104px`, gap `16px` |
| Methodology | `1fr .9fr`, gap `36px` |
| Footer | `1.5fr .8fr .8fr .9fr` |

---

## 2. Signature techniques

Four tricks give the system its character. Reproduce these exactly.

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

Used for the stat tile grid (`1fr 1fr`) and the certificate grid (`repeat(4,1fr)`).

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

### 2.4 Accent-capped panel

Trend columns are identified by a 3px top border in the trend's **fill** color, over the panel
surface — no other chrome, no heading color beyond the label itself:

```css
border-top: 3px solid #1c7a4a;  /* or #b08214 / #bc3b2f */
background: #f4f7fa;
```

---

## 3. Components

### 3.1 Trend pill

Outlined, never filled. Color and border are the same value, from the `TR` (text) map.

```
display: inline-block
padding: 4px 8px
font: 400 9.5px/1 'JetBrains Mono', monospace
letter-spacing: .12em
text-transform: uppercase
color: TR[dir]
border: 1px solid TR[dir]
background: transparent
```

Labels: `▲ Rising` · `▬ Flat` · `▼ Falling`.
As a column header the flat variant reads `▬ Holding flat`.

### 3.2 Meter bar

Track and fill, square corners, no transition.

```
track: height 9px; background rgba(18,23,34,.08)
fill:  display block; width <pct>%; height 100%; background TRFILL[dir]
```

### 3.3 Sparkline

A flex row of bars aligned to the baseline. Nine samples.

```
container: display flex; align-items flex-end; gap 2px
bar:       flex 1; height round(v/100 * H)px; background TRFILL[dir]; opacity .9; display block
```

| Context | Height | Width |
|---|---|---|
| Skill row | `24px` | `70px` |
| Certificate card | `30px` | `84px` |

### 3.4 Stat tile

Label over figure, inside a hairline grid.

```
label:  300 9px/1 mono, .18em, uppercase, rgba(18,23,34,.5)
value:  400 30px/1 'Instrument Serif', #121722, tabular-nums, margin-top 8px
```

When the value is itself a delta, its color becomes `TR.up` or `TR.down` instead of ink.

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

A `<pre>` used to expose the underlying computation. Trend words inside are colored inline with the
trend color; everything else is ink.

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

Numeric columns are right-aligned with `tabular-nums`. A 7px round dot (`border-radius:50%`,
`background: TR[dir]`) closes the trailing demand cell — the only circle in the entire system.

---

## 4. Rules and behaviour

### 4.1 Trend classification

A delta in percentage points maps to a direction through two configurable thresholds:

```js
dirOf(delta) {
  return delta >= riseThreshold ? 'up'
       : delta <= fallThreshold ? 'down'
       : 'flat';
}
```

Defaults: `riseThreshold = 3`, `fallThreshold = -2`. A zero delta renders as `±0 pts`, not `0 pts`.

### 4.2 Configurable props

The design exposes four editor controls, grouped into three sections:

| Prop | Type | Default | Range | Section |
|---|---|---|---|---|
| `liveData` | boolean | `true` | — | Behaviour |
| `showMethodology` | boolean | `true` | — | Content |
| `riseThreshold` | float | `3` | `0.5 – 10`, step `0.5`, unit `pts` | Trend rules |
| `fallThreshold` | float | `-2` | `-10 – -0.5`, step `0.5`, unit `pts` | Trend rules |

### 4.3 Interaction

Hover is expressed as a single surface change — `#f4f7fa` → `#fff` — on certificate cards and table
rows. No shadow, no lift, no color shift, no border change.

---

## 5. House style

The constraints that make it cohere. Break these and it stops looking like the same system.

1. **No rounded corners.** Every rectangle is square. The only radius in the design is the 7px
   demand dot at `50%`.
2. **No shadows.** Depth is communicated by hairlines and surface value only.
3. **No transitions.** State changes are instant.
4. **Serif for magnitude, mono for everything else.** If it's a number a reader compares, it's
   Instrument Serif with `tabular-nums`. If it's a label, a control, or prose, it's JetBrains Mono.
5. **Neutrals are alpha, not grey.** Never introduce a hex grey; use a rung on the ink ladder.
6. **Uppercase micro-labels carry the structure.** Sections are titled twice — once in serif for the
   reader, once in tracked mono for the scanner.
7. **Rules get heavier as the division gets bigger.** `.1` inside a panel, `.22` between cells,
   `.35` between sections. Keep the hierarchy legible.
8. **Color is reserved for meaning.** Green, amber and red mean rising, flat and falling — nothing
   else in the system is colored. Everything remaining is ink on paper.
9. **Show the working.** The design pairs its claims with an artefact block that exposes the inputs,
   thresholds and source count. Quantitative confidence is part of the visual language.

---

## 6. Assets

The source bundle ships ten woff2 files — the full subset range for both families:

- **Instrument Serif** — 4 files: normal and italic, each in `latin` and `latin-ext`.
- **JetBrains Mono** — 6 files: `latin`, `latin-ext`, `cyrillic`, `cyrillic-ext`, `greek`,
  `vietnamese`, all at variable weight `300 800`.

Both are available from Google Fonts, so re-hosting is optional; the `@font-face` blocks in the
export can be replaced with a standard Google Fonts link without any visual change.
