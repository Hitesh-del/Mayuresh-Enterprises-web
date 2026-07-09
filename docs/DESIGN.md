## Vibe
Modern SaaS authentication page with friendly illustration accents — clean, airy, premium startup aesthetic. The reference image drives the visual: a centered white card on a light background, framed by playful orange and dark-blue organic shapes, a peacock-feather motif, and soft decorative blobs.

## Color
- Primary: #FF6B00 (brand orange)
- On Primary: #FFFFFF
- Accent: #1E3A8A (dark blue)
- On Accent: #FFFFFF
- Background: #FAFAFA (near-white page)
- Foreground: #111827
- Muted: #6B7280
- Border: #E5E7EB
- Secondary: #FFF7ED (soft orange tint for subtle highlights)

## Typography
- Heading: Inter (family: Inter, weight: 700, url: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap)
- Body: Inter (family: Inter, weight: 400, url: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap)

## Visual Language
- Core visual signature: large floating organic blobs (orange rounded shape top-left, dark-blue wave bottom edge) plus a small peacock-feather illustration in a corner, all kept low-saturation and decorative so the form remains the focus.
- Material & depth: centered white card with a very soft shadow (`0 20px 60px rgba(0,0,0,0.08)`) and `16–20px` radius; inputs use thin `1px` neutral borders and subtle inner left icons.
- Containers & buttons: primary CTA is a solid orange pill/capsule button with a right arrow icon; secondary Google button is white with a thin border and centered Google logo; tertiary links use orange text.
- Layout rhythm: generous vertical whitespace above and below the card; logo + brand wordmark centered above the card; form fields stacked with clear label-input pairs.

## Animation
- Entrance: card fades up `translateY(16px)` to `0` with opacity `0` → `1`, `500ms ease-out`.
- Interaction: primary button lifts slightly on hover (`translateY(-2px)`); inputs show a soft orange border on focus; link hover darkens the orange shade.

## Forbidden
- No dark-mode reversal on this page (keep the provided light aesthetic).
- No heavy gradient backgrounds behind the card.
- No decorative text/marketing copy inside the auth card.

## Additional Notes
- Apply this redesigned UI only on tablet, laptop, and desktop breakpoints; keep the existing mobile login/register UI untouched.
- All existing authentication logic, form validation, API calls, Google sign-in, forgot password, loading states, and routing must remain unchanged.
- Use the existing Mayuresh Enterprises logo and tagline "Print Your Imagination".
