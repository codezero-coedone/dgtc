# LOGO AUTHORITY DECISION

decision: LOGO_FIX_VALID

## Authority

The unstaged changes promote one image-based full logo authority:

`/brand/daekwang-primary-logo.png`

This matches the current `DaekwangLogoLockup.jsx` implementation, which renders:

- `<img className="dk-brand-logo__asset" src="/brand/daekwang-primary-logo.png" ... />`

## Decision answers

1. Which logo source is being promoted?
   - `/brand/daekwang-primary-logo.png`

2. Is it primary PNG, full logo, mark-only, or text-logo?
   - Primary PNG full logo.

3. Does the change affect public notice page?
   - Yes. Notice hero, empty, and not-found states move from mark/text to full image lockup.

4. Does the change affect admin topbar?
   - Yes. Admin topbar moves from mark-only to full logo lockup and receives sizing CSS.

5. Does the change affect seeded admin content?
   - Yes. The media seed source changes to the primary logo PNG.

6. Does the change remove old text-logo styling safely?
   - Yes. The current logo component is image-based and no longer emits `.dk-brand-logo__text`.

7. Does it preserve the already deployed public mobile UI circuit?
   - Yes. It does not edit `src/App.jsx` or `styles.css` from commit 20a69c9, and local visual checks show no app shell, bottom dock, public admin pill, or fake KR.

## Final interpretation

The remaining unstaged logo changes are coherent as one logo authority cleanup.

Recommended classification:

`LOGO_WORKTREE_COMMIT_READY`

Recommended action:

Make a separate logo-only commit after user approval. Do not deploy unless explicitly requested.
