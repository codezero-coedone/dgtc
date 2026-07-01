# Parallel Subagent Findings

## Mobile UI Audit
- Homepage and subpages were visually improved but mobile pages remained long.
- Subpage feature rail consumed too much first-screen height.
- Notice chips and pagination were under 44px touch target in some rules.
- Applied: compact subpage rail, compact post-hero intro, 44px notice controls.

## Desktop Public Audit
- 1024px was treated as mobile/tablet because desktop nav was hidden below 1100px.
- Process page collapsed too early and became long.
- Company location stacked too early.
- Applied: 961px-1100px compact desktop band with visible desktop nav and denser grids.

## Functional Audit
- Unknown hash route still falls back to homepage.
- Admin login is demo-local, not server auth.
- Public notice source can diverge by browser because localStorage can override server notices.
- PWA stale-while-revalidate may show old static assets for one load after deploy.
- Applied: none in this UI/CSS circuit. These remain HOLD.

## CSS Architecture Audit
- `styles.css` has many repeated mobile/tablet media blocks.
- Broad reorder would be risky because cascade order acts as functionality.
- Applied: end-of-file winning rules only, no full CSS reorder.
