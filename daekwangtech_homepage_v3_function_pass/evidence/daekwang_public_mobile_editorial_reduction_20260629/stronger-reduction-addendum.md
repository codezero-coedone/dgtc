# Stronger Reduction Addendum

A second pass was applied after user requested stronger reduction.

## Homepage mobile visible counts at 390px
- Product preview items: 2
- Quality preview items: 1
- Facility preview section: hidden on homepage mobile
- Process steps on homepage: 3
- Notice items on homepage: 3
- Trust/stat block: hidden on homepage mobile

## Guard results
- Desktop home remains full: products 5, quality 4, facility 1, notices 4, process steps 6.
- Process route remains dedicated page: hasProcessPage=true, hasProcessBand=false.
- App shell / bottom dock / fake KR / public ADMIN remained absent.
- Console errors: 0
- Horizontal overflow: 0

## Build
- Static check: PASS
- Vite build: PASS
- Tailwind content warning remains existing P2.
