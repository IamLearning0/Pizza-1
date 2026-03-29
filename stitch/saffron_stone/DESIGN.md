# Design System Strategy: The Artisanal Fusion

## 1. Overview & Creative North Star: "The Digital Spice Merchant"
This design system is built on the concept of **"The Digital Spice Merchant."** It rejects the sterile, cookie-cutter aesthetic of modern "Big Pizza" in favor of an editorial experience that feels as curated as a fusion menu. We fuse the rustic, hand-crafted soul of Indian street signage with the high-end precision of Italian fine dining.

**The Creative North Star** is to move away from a "flat grid" and toward a **"Layered Canvas."** We break the standard digital template by using intentional asymmetry, generous white space (the "Warm Cream" breathing room), and overlapping elements. Imagine a high-end food magazine where a photograph of a wood-fired pizza slightly overlaps a bold, hand-painted headline—this is our benchmark for digital layouts.

---

## 2. Colors & Tonal Depth
Our palette is a high-contrast dialogue between earth and fire. We utilize Material Design 3 naming conventions to ensure a systematic application of this vibrant identity.

### Palette Roles
- **Primary (`#b91e0d` - Tomato Red):** Used for critical brand actions and high-energy focal points.
- **Secondary (`#8f4e00` - Deep Saffron):** The "soul" color. Use this for accents, specialized UI chips, and decorative elements.
- **Surface (`#fff9f0` - Warm Cream):** Our canvas. This is not "white"; it is a textured, paper-like background that softens the high-contrast charcoal text.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to separate sections. We define boundaries through **Background Color Shifts**. 
*   Place a `surface-container-low` section against a `surface` background. 
*   Use a `surface-container-highest` background for an "Order Now" sidebar. 
*   Boundaries should feel organic, not clinical.

### Signature Textures
To avoid a "flat" digital look, use a subtle linear gradient on primary CTAs transitioning from `primary` (#b91e0d) to `primary_container` (#ff9583) at a 135-degree angle. This mimics the natural variation of a tomato sauce or hand-dyed textile.

---

## 3. Typography: Editorial Authority
The typography is a conversation between heritage and clarity.

*   **Display & Headline (Newsreader):** This serif evokes the character of hand-painted signage. Use `display-lg` (3.5rem) and `headline-lg` (2.0rem) with tighter letter-spacing (-0.02em) to create a "locked-in" editorial look.
*   **UI & Body (Plus Jakarta Sans):** A clean, modern sans-serif that ensures high readability for menus and checkout flows. 

**Pro-Tip:** For hero sections, use "Newsreader" in Italic for a single word within a sentence to add a bespoke, artisanal flair (e.g., "The *Original* Bombay Crust").

---

## 4. Elevation & Depth: The Layering Principle
We move beyond drop shadows. Hierarchy is achieved through **Tonal Layering** and **Glassmorphism**.

*   **The Layering Stack:** 
    1.  Base: `surface` (#fff9f0)
    2.  Section: `surface-container-low` (#f9f3ea)
    3.  Card/Floating Element: `surface-container-lowest` (#ffffff)
*   **Ambient Shadows:** If a shadow is required for a floating Cart button, use a `16px` blur with 6% opacity, tinted with `on_surface` (#1d1b16). This creates a "glow" rather than a "drop."
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at **15% opacity**. Never use a 100% opaque border.
*   **Glassmorphism:** For top navigation bars, use `surface` at 80% opacity with a `20px` backdrop-blur. This allows the vibrant food photography to bleed through the UI, making the interface feel integrated with the product.

---

## 5. Components

### Buttons: The Artisanal Trigger
*   **Primary:** Background: `primary` (#b91e0d). Text: `on_primary` (#ffffff). Border-radius: `md` (0.75rem).
*   **Secondary:** Background: `secondary_container` (#fe9832). Text: `on_secondary_container` (#683700). 
*   **Interaction:** On hover, apply a subtle scale-up (1.02x) rather than a simple color change to simulate a physical "press."

### Cards: No-Divider Layouts
*   **Rules:** Forbid the use of divider lines. 
*   **Structure:** Use `spacing-6` (2rem) between the pizza image and the title. Use a background shift (`surface-container-low`) to group items in a list.
*   **Accents:** Incorporate a subtle, low-opacity pattern inspired by Indian textiles (Bandhani or Ikat) as a background-mask on the right edge of cards.

### Input Fields
*   **Visuals:** Use "Soft Fields." No hard borders. Background should be `surface-container-highest` with a `sm` (0.25rem) radius.
*   **Focus State:** The field should transition to a `ghost-border` of `primary` at 20% opacity.

### Featured Component: "The Spice Level Toggle"
A custom-designed radio group using saffron and red gradients to indicate heat levels, utilizing the `secondary` and `primary` tokens to create a visual heat-map.

---

## 6. Do's and Don'ts

### Do:
*   **Do** overlap typography over images. Use `display-lg` text over a pizza cutout.
*   **Do** use asymmetrical spacing. A left margin of `spacing-8` and a right margin of `spacing-12` creates a dynamic, high-end feel.
*   **Do** use `surface_tint` sparingly for small iconography to draw the eye.

### Don't:
*   **Don't** use 1px black borders. It breaks the artisanal feel and looks "default."
*   **Don't** use pure black (#000000). Always use `on_background` (#1d1b16) for a softer, charcoal-ink appearance.
*   **Don't** use standard "Material Blue" for links. All interactive elements must stay within the Saffron/Tomato/Charcoal spectrum.
*   **Don't** use sharp corners. Everything must have at least a `sm` (0.25rem) radius to maintain the "soft" hand-crafted aesthetic.

---

## 7. Spacing Logic
The spacing scale is based on a **0.35rem base unit**.
*   Use `spacing-10` (3.5rem) for major section padding to ensure the "Editorial Breathing Room."
*   Use `spacing-2` (0.7rem) for tight groupings, like a price next to a menu item name.