# Shaheed — Portfolio

Open `index.html` in any modern browser. No build step or dependencies.

```
index.html        structure and content
css/styles.css    theme, layout, animations, responsive rules
js/main.js        particles, typewriter, scroll reveal, tilt, magnetic buttons, filters
images/           put profile.jpg here
```

## Replace the placeholders
1. **Profile photo**: replace `images/profile.jpg` (square, about 700px) to change the hero portrait.
2. **Contact details**: search for `ssemandamuhammad004@gmail.com` and `0749 362 303` (HTML and `js/main.js`).
3. **Stats**: the `data-count` values in the hero (learners, workshops, domains).
4. **Skill percentages**: the `--v` value and the `<b>` label on each skill bar.
5. **Projects**: edit titles, descriptions, links and `data-cat` (training / web / ai).

## Colour tokens (top of `css/styles.css`)
`--bg #080A12`, `--bg2 #101426`, `--cyan #00E5FF`, `--violet #8B5CF6`, `--blue #3B82F6`,
`--text #F5F7FF`, `--muted #A7B0C0`.

## Notes
- Honours `prefers-reduced-motion` (static background, no typing, content shown immediately).
- Hover-only details (project descriptions) are always visible on touch devices and on keyboard focus.
- The contact form opens the visitor's email app via `mailto:`. For a hosted form, point it at a service such as Formspree.
