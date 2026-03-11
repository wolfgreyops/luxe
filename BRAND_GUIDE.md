# LUXE Brand Guide

## Brand Overview

**LUXE** is a premium digital print partner for apparel businesses. We provide superior print quality and reliable fulfillment for brands, promotional companies, and team dealers who refuse to compromise on quality.

**Tagline:** *Premium Digital Print*

**Brand Promise:** *Elevate Your Product Line*

---

## Brand Positioning

### Target Audience

**Apparel Brands**
- Independent clothing brands building a premium reputation
- Streetwear labels seeking superior print quality
- Fashion entrepreneurs scaling their product lines

**Promotional Companies**
- Corporate merchandise providers serving demanding clients
- Event and marketing firms needing reliable fulfillment
- Agencies requiring consistent quality across large orders

**Team Dealers**
- Athletic apparel distributors serving schools and leagues
- Spirit wear providers needing durable, wash-resistant prints
- Uniform suppliers requiring premium presentation

### Brand Personality
- **Professional** — Reliable partner, not just a vendor
- **Premium** — Quality that elevates your brand
- **Confident** — Proven results, no excuses
- **Efficient** — Streamlined processes, fast turnarounds

### Key Differentiators
- 1200 DPI precision printing — detail your clients will notice
- Premium heavyweight cotton blanks — quality they can feel
- Superior wash durability vs standard DTF — prints that last
- Dedicated account support — a partner who knows your business
- Scalable fulfillment — from samples to bulk runs

---

## Logo

### Primary Logo
The wordmark **LUXE** is the primary brand identifier.

```
L U X E
```

### Logo Specifications
- **Font:** Futura Condensed Bold (fallback: Oswald 700)
- **Letter Spacing:** 12px (0.75em)
- **Case:** ALL CAPS
- **Color:** Gold (#C9A96E) on dark backgrounds

### Clear Space
Maintain clear space equal to the height of the letter "L" on all sides.

### Minimum Size
- Digital: 80px width
- Print: 0.75 inches width

### Logo Don'ts
- Never alter letter spacing
- Never use drop shadows
- Never stretch or distort
- Never use colors outside the approved palette

---

## Color Palette

### Primary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Gold** | `#C9A96E` | 201, 169, 110 | Primary accent, logo, CTAs |
| **Black** | `#0A0A0A` | 10, 10, 10 | Primary background |
| **White** | `#FFFFFF` | 255, 255, 255 | Secondary background, text |

### Secondary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Gold Light** | `#E8D5A8` | 232, 213, 168 | Hover states, highlights |
| **Gold Dark** | `#8B7342` | 139, 115, 66 | Shadows, depth |
| **Dark** | `#111111` | 17, 17, 17 | Secondary backgrounds |
| **Dark 2** | `#161616` | 22, 22, 22 | Sidebar, panels |
| **Dark 3** | `#1E1E1E` | 30, 30, 30 | Input fields, cards |

### Neutral Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Grey** | `#888888` | 136, 136, 136 | Body text on dark |
| **Light Grey** | `#CCCCCC` | 204, 204, 204 | Navigation, labels |
| **Muted** | `#555555` | 85, 85, 85 | Placeholder text |

### Color Application
- Dark backgrounds with gold accents create the signature LUXE look
- Use white backgrounds sparingly for contrast sections
- Gold should be used intentionally — less is more

---

## Typography

### Primary Typeface — Headings
**Futura Condensed Bold** (fallback: Oswald 700)

- Used for: Logo, H1, H2, H3, navigation, buttons
- Style: Uppercase, condensed, bold
- Letter spacing: 3-12px depending on size

### Secondary Typeface — Body
**Inter**

- Used for: Body copy, descriptions, labels
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold)
- Letter spacing: 0.5-1px

### Type Scale

| Element | Size | Weight | Spacing | Case |
|---------|------|--------|---------|------|
| Hero H1 | clamp(5rem, 15vw, 14rem) | 700 | 20px | UPPER |
| Section H2 | 3.5rem | 700 | 10px | UPPER |
| H3 | 2rem | 700 | 6px | UPPER |
| H4 (Labels) | 0.75rem | 600 | 4px | UPPER |
| Navigation | 0.85rem | 500 | 3px | UPPER |
| Body | 1rem | 400 | 0.5px | Sentence |
| Small | 0.75rem | 400 | 0.5px | Sentence |

### Typography Don'ts
- Never use lowercase for headings
- Never reduce letter spacing below specified values
- Never use fonts outside the approved family

---

## Buttons & CTAs

### Primary Button (Outline)
```css
.btn-gold {
    padding: 16px 55px;
    border: 1px solid #C9A96E;
    color: #C9A96E;
    background: transparent;
    font-family: 'Futura', 'Oswald', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 600;
}
```
**Hover:** Gold fill with black text

### Secondary Button (Solid)
```css
.btn-gold-solid {
    padding: 16px 55px;
    background: #C9A96E;
    border: 1px solid #C9A96E;
    color: #0A0A0A;
    font-family: 'Futura', 'Oswald', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 600;
}
```
**Hover:** Lighten to #E8D5A8

---

## Visual Elements

### Gold Divider
A signature element used above section headers.
- Width: 50px
- Height: 2px
- Color: Gold (#C9A96E)
- Centered above headings

### Particle Animation
Subtle gold particles float upward in hero sections.
- Color: rgba(201, 169, 110, 0.1-0.4)
- Movement: Gentle upward drift
- Purpose: Adds luxury and movement without distraction

### Background Gradients
```css
radial-gradient(ellipse at 20% 50%, rgba(201,169,110,0.07) 0%, transparent 50%)
```
Used sparingly to add depth to dark sections.

### Border Accents
- Standard: 1px solid rgba(201,169,110,0.15)
- Active: 1px solid rgba(201,169,110,0.25)

---

## Imagery

### Photography Style
- High contrast, dark backgrounds
- Dramatic lighting that showcases print detail
- Macro shots of print quality and fabric texture
- Clean, professional compositions

### Product Photography
- Clean white or dark gradient backgrounds
- Consistent lighting and angles across all products
- Detail shots showing print precision
- Side-by-side quality comparisons (LUXE vs standard DTF)

### Business Context Photography
- Production facility shots (clean, professional)
- Quality control processes
- Packaging and fulfillment
- Team/partnership imagery

### Client Work Showcase
- Feature diverse print styles and applications
- Show range of garment colors and types
- Include context shots (worn, displayed, packaged)
- Highlight complex or detailed prints

### Comparison Imagery
- Before/after wash tests
- LUXE vs competitor print quality
- Detail magnification showing DPI difference
- Color vibrancy comparisons

---

## UI Components

### Form Inputs
```css
.input {
    background: #1E1E1E;
    border: 1px solid rgba(201,169,110,0.2);
    color: #FFFFFF;
    padding: 10px 12px;
}
.input:focus {
    border-color: #C9A96E;
}
```

### Sliders
- Track: Dark (#1E1E1E)
- Thumb: Gold (#C9A96E), 14px circle

### Swatches/Color Selectors
- Inactive border: rgba(255,255,255,0.1)
- Active border: Gold (#C9A96E)
- Active shadow: 0 0 0 1px #C9A96E

---

## Animation & Motion

### Transition Timing
- Standard: 0.3s ease
- Smooth: 0.4s ease
- Dramatic: 0.8s ease

### Fade Up Animation
```css
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
```

### Logo Shimmer
The LUXE wordmark features a subtle metallic shimmer effect using animated gradients, reinforcing the premium feel.

---

## Tone of Voice

### Writing Style
- **Professional** — Speak as a trusted business partner
- **Confident** — Lead with results and capabilities
- **Concise** — Respect their time, get to the point
- **Solution-oriented** — Address their business challenges

### Example Copy

**Headlines**
- *"Your Print Partner for Premium Apparel"*
- *"Elevate Your Product Line"*
- *"Print Quality That Sells"*
- *"Built for Brands That Won't Compromise"*

**Value Propositions**
- *"1200 DPI precision. Premium blanks. Prints that last."*
- *"From sample to scale — consistent quality, every run."*
- *"The print quality your brand deserves."*
- *"Stop losing customers to cracked, faded prints."*

**CTAs**
- *"Request Samples"*
- *"Get a Quote"*
- *"Start Your Order"*
- *"Talk to Our Team"*

**Trust Builders**
- *"Trusted by 500+ apparel brands"*
- *"See why dealers are switching to LUXE"*
- *"The difference is in the details"*

### Words to Use
- Premium, Professional, Reliable, Scalable, Precision
- Partner, Fulfill, Deliver, Elevate, Trust
- Durable, Vibrant, Consistent, Quality

### Words to Avoid
- Cheap, Budget, Discount, DIY, Basic
- Consumer, Retail, Hobbyist
- Maybe, Try, Hope

---

## Messaging by Audience

### For Apparel Brands
**Pain Point:** Inconsistent print quality hurts brand reputation
**Message:** *"Your brand deserves print quality that matches your vision. LUXE delivers 1200 DPI precision on premium blanks — so every piece you sell reinforces your reputation."*

**Key Benefits to Emphasize:**
- Print detail and color accuracy
- Premium blank quality
- Consistency across orders
- White-label fulfillment options

### For Promotional Companies
**Pain Point:** Client complaints about print durability and quality
**Message:** *"Stop fielding calls about cracked logos and faded prints. LUXE premium digital print survives washes and keeps your clients coming back."*

**Key Benefits to Emphasize:**
- Wash durability
- Fast turnaround times
- Volume pricing
- Reliable fulfillment

### For Team Dealers
**Pain Point:** Need durable prints for athletic wear at competitive prices
**Message:** *"From varsity to rec leagues, LUXE prints stand up to the demands of team wear. Premium quality your coaches and parents will notice."*

**Key Benefits to Emphasize:**
- Durability for athletic use
- Consistent quality across team orders
- Range of garment options
- Bulk pricing tiers

---

## Application Examples

### Website

**Navigation Bar**
- Semi-transparent dark background with blur
- Logo left, links right (Services, Pricing, Samples, Contact)
- Links in Light Grey, hover to Gold

**Hero Section**
- Full-height dark background
- Centered content with B2B headline
- Animated LUXE wordmark with gold shimmer
- Clear CTA: "Request Samples" or "Get a Quote"

**Services Section**
- White background for readability
- Feature cards highlighting capabilities
- Before/after print comparisons

**Pricing Display**
- Tiered pricing for volume orders
- Large gold numbers for impact
- Clear breakdown of what's included

**Footer**
- Dark background
- Gold logo
- Links: Services, Pricing, FAQ, Contact, Terms

### Sales Materials

**Pitch Decks**
- Dark backgrounds with gold accents
- Large product photography
- Clear value propositions per slide
- Case studies with real results

**Sample Kits**
- Premium packaging in black
- Gold foil LUXE branding
- Include printed color/quality comparison card
- Business card with account manager contact

**Trade Show Booth**
- Dark backdrop with illuminated LUXE logo
- Side-by-side print quality comparison display
- Sample garments on premium hangers
- iPad stations for instant quote requests

### Digital Communications

**Email Templates**
- Clean, minimal design
- Gold accent for CTAs only
- Professional signature with contact info
- Mobile-optimized

**Social Media**
- Focus on print quality close-ups
- Before/after comparisons
- Client success stories
- Behind-the-scenes production

---

## File Assets

### Logo Files Needed
- `luxe-logo-gold.svg` — Primary logo
- `luxe-logo-white.svg` — For dark backgrounds
- `luxe-logo-black.svg` — For light backgrounds
- `luxe-icon.svg` — Favicon/app icon (stylized "L")

### Color Swatches
Export swatches in: ASE (Adobe), CLR (macOS), and JSON formats

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026 | Initial brand guide |
| 1.1 | 2026 | Updated messaging for B2B audience (brands, promo companies, team dealers) |

---

*LUXE — Premium Digital Print*
*Your Print Partner for Premium Apparel*
