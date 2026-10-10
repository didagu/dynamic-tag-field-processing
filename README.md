# Tag Picker

A Stack Overflow–style tag picker written in plain JavaScript (ES6), HTML and CSS. No framework, no build step.

[![CI](https://github.com/didagu/tag-picker/actions/workflows/ci.yml/badge.svg)](https://github.com/didagu/tag-picker/actions/workflows/ci.yml)

**Live demo:** https://didagu.github.io/tag-picker/ (redeployed on every merge to `master`)

Start typing and matching tags appear under the input, each with its description and alternative names, with the matched text underlined. Click a result (or use the arrow keys and Enter) to add it as a tag. Click the `x` on a tag to remove it. Escape clears the search.

| Stack Overflow (reference) | This project |
| --- | --- |
| ![Stack Overflow's tag field showing suggestions for "java"](images/stackoverflow.png) | ![This project's tag field showing the same suggestions](images/screenshot.png) |

## Run it

There's nothing to install. Clone the repo and open `index.html` in a browser, or serve the folder:

```bash
git clone https://github.com/didagu/tag-picker.git
cd tag-picker
python3 -m http.server 8000
```

Then go to http://localhost:8000.

## Tests

End-to-end tests use [Playwright](https://playwright.dev) and need Node.js 22 and Python 3 (for the local server):

```bash
npm install
npx playwright install chromium firefox webkit
npm test
```

The suite runs in Chromium, Firefox and WebKit, and includes [axe-core](https://github.com/dequelabs/axe-core) accessibility scans against WCAG 2.1 AA. CI runs it on every pull request. Merges to `master` deploy to GitHub Pages once the tests pass.

## How it works

| File | What it does |
| --- | --- |
| `taglist.js` | The tag data: six hard-coded sample tags, each with an id, title, description and alternative names |
| `app.js` | Renders every tag as a hidden result card, filters the cards on each keystroke and handles keyboard input |
| `Utils.js` | Builds the result cards, highlights matches, moves the active result, and adds or removes selected tags |
| `style.css` | Layout for the tags and result cards (on top of Bootstrap 3 CSS) |
| `tests/` | Playwright tests for search, selection, removal, keyboard use and accessibility |

A tag matches when the search text appears anywhere in its title or in one of its alternative names, ignoring case. Tags you've already picked are left out of the results.

## Known limitations

- Tag data is static; there's no API behind it.
- Descriptions aren't searched, only titles and alternative names.

## Nice to have

Ideas for where this could go next. None of them are started yet.

- **Reusable `<tag-picker>` web component.** Package the field as a custom element that owns its state and works inside a normal `<form>`, then publish it to npm. This would also replace the `tagList`/`utils` globals and the index-based selection tracking.
- **Live Stack Overflow tags.** Fetch tags from the Stack Exchange API as you type (debounced, with cancelled stale requests and a cache) and show each tag's question count.
- **Smarter ranking.** Order results as exact match, then prefix, then substring, then alternative name; tolerate small typos; label synonyms (e.g. "synonym of java-ee").
- **Stack Overflow-style typing.** Space or comma confirms a tag, Backspace on an empty input removes the last one, and pasting a list adds several tags at once.
- **Tag limit.** Cap the number of tags (Stack Overflow allows 5) with a clear message when it's reached.
- **Dropdown results.** Show results in an overlay under the input with a max height and shortened descriptions.
- **Drop Bootstrap 3 and add dark mode.** Only `.form-control` is used, so plain CSS can replace it.
- **Preview deploys for pull requests.** Give each PR its own URL to try before merging.
- **Linting and formatting.** Add a single tool such as Biome to keep the code style consistent.

## Feedback

Bug reports and suggestions are welcome as [GitHub issues](https://github.com/didagu/tag-picker/issues).

## License

[MIT](LICENSE)
