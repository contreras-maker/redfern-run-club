# Redfern Run Club — static site

Plain HTML/CSS. No build step, no framework, no dependencies to install.

## Files
- `index.html` — homepage
- `terms-conditions.html`
- `waiver.html` — Tally form embedded
- `styles.css` — shared styles

## Known gap
Instagram feed on the homepage is a placeholder (`.ig-placeholder` in `index.html`).
Swap it for an embed widget (e.g. SnapWidget, Elfsight) or static images when ready —
delete the placeholder `<section>` and drop the new embed in its place.

## Deploy: GitHub + Cloudflare Pages

1. Create a new empty repo on GitHub (no README/gitignore).
2. From this folder:
   ```
   git init
   git add .
   git commit -m "Initial static site"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. In Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → select the repo.
   - Build command: (leave blank)
   - Build output directory: `/`
4. Deploy. Cloudflare gives you a `*.pages.dev` URL immediately.
5. Custom domain: Pages project → Custom domains → add `redfern-run.club` and `www.redfern-run.club`.
   Cloudflare will tell you what DNS records to set — if your domain's nameservers are
   already on Cloudflare, it's one click; if not, you'll update records at your registrar.

## Ongoing updates
Prompt Claude Code from this folder ("add a new WhatsApp post to the schedule"),
review the diff, then:
```
git add .
git commit -m "update"
git push
```
Cloudflare redeploys automatically on push.
