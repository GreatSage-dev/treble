# TREBLE — Design System & Frontend Architecture

> **Document Class:** Production Design Specification  
> **Version:** 1.0  
> **Stack:** Next.js 15 · React 19 · Tailwind CSS 4 · GSAP ScrollTrigger · Framer Motion · Lenis  
> **Design DNA:** Kingsway Sovereign Spine — warm editorial with surgical amber telemetry

---

## 0. THE EMOTIONAL CONTRACT

TREBLE is not a SaaS dashboard. It is an **institutional dossier** — a document that reads like a legal filing and moves like a precision instrument.

Every pixel answers one question: *"Would a California Superior Court judge take this seriously?"*

The site must feel like opening a sealed envelope from a law firm that happens to have world-class design taste. Warm paper, not cold screens. Serif authority, not startup sans. Amber certainty, not rainbow confusion.

---

## 1. COLOR SYSTEM — THE SOVEREIGN PALETTE

Three materials. One accent. Zero noise.

```
TOKEN                 HEX         ROLE
─────────────────────────────────────────────────────────────────────
canvas-primary        #FCFCFA     Warm alabaster paper — the ground truth
canvas-secondary      #F5F5F0     Card surfaces, callout backgrounds
canvas-elevated       #FFFFFF     Elevated panels with backdrop-blur (85% alpha)

text-primary          #1A1A18     Deep charcoal — headlines, verdicts
text-secondary        #3A3A35     Pull-quotes, highlighted narrative
text-body             #555550     Paragraph copy, explanations
text-muted            #777770     Eyebrow labels, timestamps, metadata
text-faint            #9C9C94     Inactive counters, ghost panel text

accent-amber          #C47D1E     THE weapon — spine dot, eyebrows, CTAs, active borders
accent-amber-glow     #D98A28     Hover states, pulse ring
accent-amber-wash     #C47D1E1F   12% alpha — badge backgrounds, focus rings

border-subtle         #E5E5E0     Hairline structural dividers, card frames
border-spine          #D1D1CB     Dashed center spine guide

status-verified       #10B981     Emerald — live system pulses, verified badges
status-violation      #DC2626     Statutory violation flags (used sparingly)
```

### CSS Variables

```css
:root {
  --canvas:           #FCFCFA;
  --canvas-secondary: #F5F5F0;
  --canvas-elevated:  rgba(255, 255, 255, 0.85);
  --ink:              #1A1A18;
  --ink-secondary:    #3A3A35;
  --ink-body:         #555550;
  --ink-muted:        #777770;
  --amber:            #C47D1E;
  --amber-glow:       rgba(196, 125, 30, 0.35);
  --amber-wash:       rgba(196, 125, 30, 0.12);
  --border:           #E5E5E0;
  --border-spine:     #D1D1CB;
  --emerald:          #10B981;
  --violation:        #DC2626;
}
```

### The 97/3 Rule

97% of the page is `#FCFCFA` canvas and `#1A1A18` ink. Amber appears on exactly three things:
1. Eyebrow labels (`FORENSIC AUDIT · STATUTORY ENGINE · DEMAND DISPATCH`)
2. The traveling spine dot
3. Active card borders and CTA buttons

If amber is on anything else, remove it.

---

## 2. TYPOGRAPHY — THE SERIF + MONO TENSION

Two voices. One speaks with legal authority. The other speaks with machine precision.

### Font Stack

| Voice | Family | Fallback | Role |
|-------|--------|----------|------|
| **Authority** | Instrument Serif | Georgia, 'Times New Roman', serif | Headlines, section titles, verdicts, pull-quotes |
| **Machine** | JetBrains Mono | 'Cascadia Code', 'Fira Code', ui-monospace, monospace | Eyebrows, tags, statute citations, metrics, timestamps |
| **Narrative** | Inter | system-ui, -apple-system, sans-serif | Body copy, explanations, UI labels |

### Type Scale

```
ROLE                FAMILY             SIZE                    WEIGHT   LINE-HEIGHT   TRACKING
──────────────────────────────────────────────────────────────────────────────────────────────────
Hero Display        Instrument Serif   clamp(3rem, 6vw, 5rem)  400      1.05          -0.025em
Section Title       Instrument Serif   clamp(2rem, 4vw, 2.75rem) 400    1.12          -0.02em
Milestone H3        Instrument Serif   clamp(1.5rem, 2.5vw, 1.75rem) 600 1.25         -0.015em
Pull-Quote          Instrument Serif   1.35rem                 400i     1.5           -0.01em
Body                Inter              1rem (16px)             400      1.68          -0.005em
Small Body          Inter              0.875rem (14px)         400      1.6           0
Eyebrow             JetBrains Mono     0.6875rem (11px)        600      1.2           +0.15em
Code Tag            JetBrains Mono     0.75rem (12px)          500      1.4           +0.02em
Metric Value        JetBrains Mono     1.5rem (24px)           700      1.0           -0.02em
```

### The Eyebrow Pattern

Every section opens with an eyebrow label. Always uppercase. Always mono. Always amber.

```html
<span class="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-amber">
  01 // FORENSIC AUDIT ENGINE
</span>
```

### Heading Compression

Large headings use tight leading (1.05–1.12) and negative tracking. This locks glyphs into a solid architectural block instead of floating loosely. Body copy uses wide leading (1.68) for comfortable reading.

---

## 3. LAYOUT — THE SOVEREIGN SPINE ARCHITECTURE

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NAVIGATION BAR                            │
│  [TREBLE wordmark]                    [Begin Audit] CTA            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                           HERO SECTION                              │
│                    (Full viewport, pinned)                          │
│         "Your landlord kept $2,150.                                 │
│          California law says that's worth $6,450."                  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                       THE GRIEVANCE STRIP                           │
│  "$36 billion in wrongful deductions. 84% never challenged."       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│              THE SPINE — ALTERNATING MILESTONES                     │
│                                                                     │
│   [LEFT CARD]              ● ·····          (empty)                │
│   01 // INTAKE               |                                     │
│                               |                                     │
│      (empty)               ● ·····      [RIGHT CARD]               │
│                               |         02 // FORENSIC AUDIT       │
│                               |                                     │
│   [LEFT CARD]              ● ·····          (empty)                │
│   03 // ENTITY RECON          |                                     │
│                               |                                     │
│      (empty)               ● ·····      [RIGHT CARD]               │
│                               |         04 // DEMAND DISPATCH      │
│                               |                                     │
│   [LEFT CARD]              ● ·····          (empty)                │
│   05 // CREDIT SHIELD         |                                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                      PROOF SECTION                                  │
│            Terminal test receipt, radical honesty table              │
├─────────────────────────────────────────────────────────────────────┤
│                         FOOTER                                      │
│       Statutory citations · GitHub · Hackathon badge                │
└─────────────────────────────────────────────────────────────────────┘
```

### Container

```css
.container-editorial {
  max-width: 1080px;        /* 67.5rem — editorial reading width */
  margin: 0 auto;
  padding-inline: clamp(24px, 4.5vw, 64px);
}
```

### Section Spacing

```
COMPONENT                   TAILWIND          VALUE
────────────────────────────────────────────────────
Hero top/bottom             py-24 lg:py-32    96px–128px
Section vertical gap        py-20 lg:py-28    80px–112px
Milestone vertical gap      space-y-32        128px
Spine-to-card gutter        px-12             48px
Card internal padding       p-6 lg:p-8        24px–32px
Eyebrow → headline          mt-3              12px
Headline → body             mt-4              16px
Body → action               mt-6              24px
```

### The Two-Column Alternating Grid

```
Desktop (≥ 768px):
  grid-template-columns: 1fr 2px 1fr
  gap-x: 48px (px-12 on each card)
  
  Odd milestones:  content left,  empty right
  Even milestones: empty left,    content right
  Center column:   the spine (2px dashed line + traveling dot)

Mobile (< 768px):
  Single column
  Spine pinned to left edge at left: 20px
  Cards: pl-14 pr-4
  Amber dots align over left spine
```

---

## 4. THE SPINE — SCROLL ANIMATION ARCHITECTURE

The spine is the signature interaction. A vertical dashed line runs down the center of the milestone section. An amber dot lives on that line and descends as you scroll. When the dot reaches a milestone, that milestone's card activates.

### 4a. Smooth Scroll Foundation — Lenis

```typescript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 4b. The Static Spine

```css
.spine-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
  background-image: repeating-linear-gradient(
    to bottom,
    #D1D1CB 0px,
    #D1D1CB 4px,
    transparent 4px,
    transparent 10px
  );
}
```

### 4c. The Traveling Amber Dot

**Structure:**
- Outer ring: 20px, `border: 2px solid #C47D1E`, `bg: #FCFCFA`
- Inner core: 8px, `bg: #C47D1E`
- Glow: `box-shadow: 0 0 14px rgba(196, 125, 30, 0.45)`
- Position: Driven by `ScrollTrigger.create({ onUpdate })` mapping `self.progress` to Y translation

```typescript
ScrollTrigger.create({
  trigger: '.milestone-container',
  start: 'top center',
  end: 'bottom center',
  scrub: 0.3,
  onUpdate: (self) => {
    const progress = self.progress;
    const trackHeight = container.offsetHeight;
    
    // Move dot
    gsap.set('.spine-dot', { y: progress * trackHeight });
    
    // Fill line behind dot
    gsap.set('.spine-fill', { scaleY: progress });
    
    // Activate nearest milestone
    milestones.forEach((node, i) => {
      const nodeProgress = i / (milestones.length - 1);
      const distance = Math.abs(progress - nodeProgress);
      const isActive = distance < 0.08;
      
      gsap.to(node, {
        opacity: isActive ? 1 : 0.35,
        y: isActive ? 0 : 12,
        scale: isActive ? 1 : 0.98,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  },
});
```

### 4d. Milestone Card States

```
STATE          OPACITY   BLUR      TRANSLATE-Y   SCALE   BORDER COLOR
──────────────────────────────────────────────────────────────────────
Inactive       0.35      0.5px     12px          0.98    #E5E5E0
Active         1.0       0px       0px           1.0     #C47D1E
Passed         0.85      0px       0px           1.0     #E5E5E0
```

Transition: `500ms cubic-bezier(0.16, 1, 0.3, 1)` — the luxury snap. Fast attack, long smooth deceleration.

---

## 5. SECTION-BY-SECTION DESIGN

### 5a. Navigation

Minimal. Two elements. No hamburger menu needed (single-page).

```
┌──────────────────────────────────────────────────────────────┐
│  TREBLE                                    [Begin Audit →]  │
│  (Instrument Serif, 1.25rem, #1A1A18)       (mono, amber bg) │
└──────────────────────────────────────────────────────────────┘
```

- Fixed to top with `backdrop-blur-md` and `bg-[#FCFCFA]/90`
- Border-bottom: `1px solid #E5E5E0`
- Height: `64px`
- Padding: `0 clamp(24px, 4.5vw, 64px)`
- CTA button: `bg-[#1A1A18] text-[#FCFCFA] font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm`
- CTA hover: `translate-y-[-1px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-[#C47D1E]`

### 5b. Hero Section

Full viewport. Pinned during scroll. Text mask reveal on load.

**Layout:**
```
                    (centered, max-width: 720px)
                    
    01 // STATUTORY DEPOSIT DEFENSE ENGINE
    
    Your landlord kept $2,150.
    California law says
    that's worth $6,450.
    
    An autonomous legal engine that reads your deposit statement,
    finds every unlawful deduction, and dispatches a formal
    statutory demand — in under 60 seconds.
    
    [Begin Your Audit →]          [See the proof ↓]
```

**Animations (sequential on page load):**
1. Eyebrow fades in + slides up (0ms delay, 600ms)
2. Headline words mask-reveal from below, staggered 40ms per word (200ms delay)
3. Body text fades in (800ms delay, 500ms)
4. Buttons slide up (1200ms delay, 400ms)

**GSAP Implementation:**
```typescript
// SplitText for headline
const headingSplit = SplitText.create('.hero-headline', {
  type: 'words,lines',
  linesClass: 'overflow-hidden block',
  mask: 'lines',
});

gsap.from(headingSplit.words, {
  yPercent: 120,
  duration: 1.1,
  ease: 'power4.out',
  stagger: 0.04,
  delay: 0.2,
});

// Hero section pins for 1 viewport of scroll, then releases
ScrollTrigger.create({
  trigger: '.hero-section',
  pin: true,
  start: 'top top',
  end: '+=100%',
  anticipatePin: 1,
});
```

### 5c. The Grievance Strip

A single horizontal band. Dark inversion for contrast shock.

```
┌─────────────────────────────────────────────────────────────────────┐
│ bg: #1A1A18                                                         │
│                                                                     │
│   $36 billion in security deposits are wrongfully withheld          │
│   across the United States every year. 84% of tenants never        │
│   challenge the deduction. Not because they're wrong —              │
│   because the process is designed to exhaust them.                  │
│                                                                     │
│   TREBLE makes exhaustion irrelevant.                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Background: `#1A1A18`
- Text: `#FCFCFA` (primary) / `#9C9C94` (secondary lines)
- Final sentence: `text-amber` (#C47D1E)
- Padding: `py-20 lg:py-28`
- Text: `Instrument Serif`, `1.35rem`, italic, `max-width: 640px`, centered
- Animation: Each line mask-reveals on scroll entry

### 5d. The Milestone Spine (5 Stages)

Each milestone is a card with this internal structure:

```
┌─────────────────────────────────────────────┐
│                                             │
│  01 // INTAKE                               │  ← Eyebrow (mono, amber)
│                                             │
│  Drop Your Statement                        │  ← Title (serif, charcoal)
│                                             │
│  Upload your deposit statement, lease,      │  ← Body (sans, muted)
│  or move-out notice. No account needed.     │
│  No signup. Just the document.              │
│                                             │
│  ┌─────────────────────────────────┐        │
│  │ ● VERIFIED  ·  < 2s processing │        │  ← Telemetry chip (mono)
│  └─────────────────────────────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

**The 5 Milestones:**

| # | Eyebrow | Title | Core Message |
|---|---------|-------|-------------|
| 01 | INTAKE | Drop Your Statement | Upload deposit statement. No account. No signup. |
| 02 | FORENSIC AUDIT | Every Dollar Examined | Statutory depreciation math applied to each line item. AB 2801 photo requirement checked. |
| 03 | ENTITY RESOLUTION | Who Actually Owns the Building | Firecrawl traces the LLC to the human. Active listings expose contradictions. |
| 04 | DEMAND DISPATCH | The 14-Day Clock Starts | Formal demand letter compiled from statute, dispatched via AgentMail, cure deadline auto-scheduled. |
| 05 | CREDIT SHIELD | Your Credit, Protected | Rosenthal Act dispute formally lodged. CCRAA § 1785.25(a) disclosure required. |

**Card CSS:**
```css
.milestone-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid #E5E5E0;
  padding: clamp(24px, 3vw, 32px);
  border-radius: 2px;
  transition: border-color 500ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

.milestone-card.active {
  border-color: #C47D1E;
  opacity: 1;
  transform: translateY(0) scale(1);
}

.milestone-card.inactive {
  border-color: #E5E5E0;
  opacity: 0.35;
  transform: translateY(12px) scale(0.98);
  filter: blur(0.5px);
}
```

### 5e. The Proof Section

Two components side by side on desktop, stacked on mobile.

**Left: Terminal Receipt**
```
┌──────────────────────────────────────────┐
│  bg: #1A1A18, font-mono, text-sm         │
│                                          │
│  $ treble audit --fixture marcus-vance   │
│                                          │
│  ✓ Paint (48mo vs 24mo life) ... $380    │
│  ✓ Cleaning (no receipt)    ... $275     │
│  ✓ Carpet (normal wear)    ... $1,200   │
│  ✓ Photo compliance (AB 2801) ... FAIL  │
│                                          │
│  Total Unlawful: $2,150.00              │
│  Treble Exposure: $6,450.00             │
│  Elapsed: 38.42ms                        │
│                                          │
│  ● ALL ASSERTIONS PASSED                 │
│                                          │
└──────────────────────────────────────────┘
```

- Mono font, `text-[#10B981]` for passes, `text-[#DC2626]` for violations
- Typing animation on scroll entry (characters appear sequentially)
- Final line pulses with emerald dot

**Right: Radical Honesty Table**
```
┌──────────────────────────────────────────┐
│  WHAT'S REAL           WHAT'S SCOPED     │
│                                          │
│  ✓ Statutory math      ○ Testnet only    │
│  ✓ Live Firecrawl      ○ No paid LLM     │
│  ✓ Live AgentMail      ○ Convex local    │
│  ✓ AB 2801 check       ○ CA only         │
│  ✓ CSLB lookup                           │
│  ✓ Rosenthal Act                         │
└──────────────────────────────────────────┘
```

- Two-column layout
- Verified items: emerald dot + `text-primary`
- Scoped items: hollow circle + `text-muted`
- No deception. No "coming soon." Just truth.

### 5f. CTA + Footer

**Final CTA block:**
```
    Your deposit is not a negotiation.
    It's math, statute, and a deadline.
    
    [Begin Your Audit →]
```

- `Instrument Serif`, `2rem`, centered
- Button: same as nav CTA but larger (`px-8 py-3.5`)

**Footer:**
- Three columns: Statutory Citations | Tech Stack | Hackathon
- `font-mono text-xs text-muted`
- Border-top: `1px solid #E5E5E0`
- Padding: `py-12`

---

## 6. ANIMATION CHOREOGRAPHY

### The Easing Library

```
NAME                    VALUE                              USE
──────────────────────────────────────────────────────────────────────
luxury-snap             cubic-bezier(0.16, 1, 0.3, 1)     Modal reveals, card activation
mechanical-shutter      cubic-bezier(0.7, 0, 0.3, 1)      Wipe transitions, strip reveals
gsap-power4-out         power4.out                         Text mask reveals
gsap-power2-inOut       power2.inOut                       Panel opacity crossfades
exponential-decel       (t) => 1.001 - Math.pow(2, -10*t)  Lenis scroll smoothing
```

### Animation Inventory

| Element | Trigger | Animation | Duration | Delay |
|---------|---------|-----------|----------|-------|
| Hero eyebrow | Page load | fadeIn + slideUp | 600ms | 0ms |
| Hero headline | Page load | SplitText mask reveal (words) | 1100ms | 200ms |
| Hero body | Page load | fadeIn | 500ms | 800ms |
| Hero buttons | Page load | slideUp | 400ms | 1200ms |
| Grievance strip lines | Scroll entry | Mask reveal per line, stagger 80ms | 1100ms | — |
| Grievance final line | Scroll entry | Color shift to amber | 600ms | 400ms after lines |
| Spine dot | Scroll progress | Y translate bound to progress | Continuous | — |
| Spine fill line | Scroll progress | scaleY bound to progress | Continuous | — |
| Milestone cards | Dot proximity | Opacity + scale + border transition | 500ms | — |
| Terminal receipt | Scroll entry | Character typing animation | 2000ms | — |
| Honesty table rows | Scroll entry | Batch stagger reveal, 120ms each | 800ms | — |
| Editorial dividers | Scroll entry | scaleX from 0 to 1, origin left | 1200ms | — |
| Footer elements | Scroll entry | fadeIn + slideUp, stagger | 600ms | — |

### ScrollTrigger Pinning Plan

```
SECTION              PIN    SCRUB    SCROLL TRAVEL    PURPOSE
──────────────────────────────────────────────────────────────────
Hero                 Yes    No       += 100vh         Holds hero while grievance slides up
Grievance            No     No       —                Normal scroll entry
Milestone Spine      No     Yes      Natural height   Dot tracks scroll through section
Proof Section        No     No       —                Normal scroll with batch reveals
CTA + Footer         No     No       —                Normal scroll
```

---

## 7. COMPONENT INVENTORY

### React Components Needed

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              Fixed nav with blur backdrop
│   │   ├── Footer.tsx              Statutory citations grid
│   │   └── Container.tsx           Editorial max-width wrapper
│   │
│   ├── hero/
│   │   ├── HeroSection.tsx         Full viewport hero with pin
│   │   └── HeroHeadline.tsx        SplitText animated headline
│   │
│   ├── grievance/
│   │   └── GrievanceStrip.tsx      Dark inversion band
│   │
│   ├── spine/
│   │   ├── SpineSection.tsx        Container for all milestones
│   │   ├── SpineLine.tsx           Dashed vertical guide
│   │   ├── SpineDot.tsx            Traveling amber dot
│   │   └── MilestoneCard.tsx       Individual milestone card
│   │
│   ├── proof/
│   │   ├── TerminalReceipt.tsx     Typing terminal animation
│   │   └── HonestyTable.tsx        Radical honesty two-column
│   │
│   ├── cta/
│   │   └── FinalCTA.tsx            Closing call to action
│   │
│   ├── audit/
│   │   ├── AuditFlow.tsx           Full-page audit wizard
│   │   ├── UploadStep.tsx          Document upload dropzone
│   │   ├── AnalysisStep.tsx        Live audit progress
│   │   ├── ResultsStep.tsx         Itemized findings display
│   │   └── DispatchStep.tsx        Demand letter preview + send
│   │
│   └── ui/
│       ├── Eyebrow.tsx             Reusable mono label
│       ├── TelemetryChip.tsx       Status badge with pulse dot
│       ├── Button.tsx              Primary + ghost variants
│       └── Divider.tsx             Animated expanding hairline
```

### The Audit Flow (Full-Page Wizard)

When the user clicks "Begin Your Audit", a full-page view slides up (or route transition). This is the actual product — not a marketing page.

**Step 1 — Upload:** Drag-and-drop zone. Accepts PDF, JPG, PNG, TXT. Clean dropzone with dashed `#E5E5E0` border. On hover, border goes amber.

**Step 2 — Analysis:** Live progress indicators. Each deduction line item appears as it's parsed. Emerald checkmarks for violations found. Mono font for dollar amounts.

**Step 3 — Results:** The dossier. Itemized table with statute citations. Total unlawful amount in large serif. Treble exposure calculated. Photo compliance (AB 2801) flagged.

**Step 4 — Dispatch:** Preview of the formal demand letter. AgentMail delivery status. 14-day cure deadline countdown displayed.

---

## 8. RESPONSIVE BREAKPOINTS

```
BREAKPOINT     WIDTH      BEHAVIOR
──────────────────────────────────────────────────────────────
Mobile         < 640px    Single column, spine on left edge, cards full-width
Tablet         640–1023px  Single column, increased padding, spine centered
Desktop        ≥ 1024px   Two-column alternating, centered spine, full choreography
```

### Mobile Adaptations:
- Hero headline: `clamp(2.25rem, 8vw, 3rem)` — still large, but fits
- Spine: Moves to `left: 20px`, thin `1px` line
- Cards: Full width with `pl-14` to clear spine
- Dots: Smaller (14px), aligned to left spine
- Grievance strip: Reduced padding `py-12`
- Terminal receipt: Full-width, horizontal scroll if needed
- All scroll animations simplified (no pin on hero for mobile)

---

## 9. PERFORMANCE BUDGET

```
METRIC                  TARGET          MECHANISM
────────────────────────────────────────────────────────────────
First Contentful Paint  < 1.2s          SSR via Next.js, no client JS for above-fold
Largest Contentful Paint < 2.0s         Font preload, no hero images
Total Bundle (JS)       < 150KB gzip    GSAP tree-shaken, Lenis ~8KB, no heavy libs
Layout Shifts           CLS < 0.05      Font-display: swap with matched fallback metrics
Scroll FPS              60fps           will-change on animated elements, GPU layers
Font Files              < 120KB total   Instrument Serif (woff2) + JetBrains Mono (woff2) + Inter (variable woff2)
```

### Font Loading Strategy

```html
<link rel="preload" href="/fonts/InstrumentSerif-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/JetBrainsMono-Variable.woff2" as="font" type="font/woff2" crossorigin>
```

Inter loaded via `next/font/google` with `display: 'swap'` and `adjustFontFallback: true`.

---

## 10. DEPENDENCY LIST

```json
{
  "gsap": "^3.12.0",
  "lenis": "^1.1.0",
  "framer-motion": "^11.0.0"
}
```

- **GSAP** — ScrollTrigger (free), SplitText (free since 3.13). Used for spine dot tracking, text mask reveals, batch staggers.
- **Lenis** — Smooth scroll normalization. Connects to GSAP ticker.
- **Framer Motion** — React-native scroll progress hooks (`useScroll`, `useTransform`). Used for the traveling dot's React binding. Lightweight alternative where GSAP imperative API is overkill.

GSAP and Framer Motion do not conflict. GSAP handles the choreographed timeline sequences. Framer Motion handles declarative React state transitions.

---

## 11. VISUAL RULES — THE NON-NEGOTIABLES

1. **No gradients.** Flat color only. Gradients signal consumer SaaS, not institutional authority.
2. **No rounded corners > 2px.** Cards use `rounded-sm` (2px). Buttons use `rounded-sm`. The terminal receipt uses `rounded-none`.
3. **No drop shadows except on hover.** At rest, cards are defined by `1px solid #E5E5E0`. On hover/active, a subtle `0 4px 12px rgba(0,0,0,0.06)` appears.
4. **No stock photography.** The only visual assets are the terminal receipt, the spine, and typography.
5. **No loading spinners.** Use skeleton states with `bg-[#F5F5F0] animate-pulse` in card shapes.
6. **No modal dialogs.** Everything happens in-page. The audit flow is a route, not a popup.
7. **No color outside the palette.** If a color isn't in Section 1, it doesn't exist.
8. **Amber means one thing: active state.** If it's not currently active, in-progress, or demanding attention, it doesn't get amber.

---

## 12. ACCESSIBILITY

- All text meets WCAG AA contrast ratios against `#FCFCFA`:
  - `#1A1A18` on `#FCFCFA` = 15.2:1 ✓
  - `#555550` on `#FCFCFA` = 7.1:1 ✓
  - `#777770` on `#FCFCFA` = 4.6:1 ✓ (AA for large text / UI)
  - `#C47D1E` on `#FCFCFA` = 4.5:1 ✓ (AA for large text / UI)
- All animations respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- Focus rings: `outline: 2px solid #C47D1E; outline-offset: 2px;`
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Skip-to-content link hidden until focused

---

*This document is the single source of truth for TREBLE's frontend. Every component, every color, every animation traces back to a line in this spec. If it's not in here, it doesn't ship.*
