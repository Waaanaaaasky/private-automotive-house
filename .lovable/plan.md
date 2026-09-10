# PRIVATE AUTOMOTIVE Landing Page

## Goal
Create a premium, minimalist one-page brand site that feels like a discreet collector house, not a dealership or marketplace.

## What will be built
- Floating glass navigation with desktop links, mobile menu, and private inquiry action.
- Cinematic full-screen introduction using an abstract, non-identifiable automotive environment.
- Five focused content movements: introduction, brand statement with private services, philosophy, experience, and inquiry/final contact.
- Elegant private inquiry form with the requested fields and inquiry types.
- Final contact area and minimal footer with the supplied Instagram, phone number, location, and 2026 copyright.
- Slow reveal, restrained parallax, and subtle glass motion with reduced-motion support.

## Official logo handling
- Add a dedicated owner-facing logo upload control.
- Store the uploaded transparent PNG or SVG so the same official file appears in navigation, introduction, loading screen, final contact area, footer, and mobile menu.
- Preserve the original file, proportions, transparency, and aspect ratio using contained responsive sizing.
- Keep logo access centralized so it can be replaced without changing page sections.
- Do not generate, trace, stylize, filter, or recreate the logo. Until it is uploaded, reserved logo areas will remain neutral and use the brand name only as ordinary page copy, never as a substitute logo.

## Visual direction
- Near-black architectural palette using #050505, #080808, and #0D0D0D translated into semantic theme tokens.
- Restrained translucent black surfaces, 20–30px blur, hairline white borders, soft shadows, and small corner radii.
- Manrope-led typography with thin, spacious display headlines and disciplined uppercase labels.
- Generated cinematic automotive-detail backgrounds that imply bodywork, reflections, carbon texture, and partial lighting without depicting a recognizable model.

## Technical details
- Build within the existing TanStack Start and Tailwind v4 structure.
- Use Lovable Cloud storage for the official logo and private inquiry submissions, with validation and restricted upload access.
- Add per-page title, description, Open Graph, and Twitter metadata.
- Validate desktop and mobile layouts, navigation, logo replacement, form behavior, and motion accessibility.
