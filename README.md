# Dynamic Tag Field

A Stack Overflow–style tag picker written in plain JavaScript (ES6), HTML and CSS. No framework, no build step.

Start typing and matching tags appear under the input, each with its description and alternative names. Click a result to add it as a tag. Click the `x` on a tag to remove it.

| Stack Overflow (reference) | This project |
| --- | --- |
| ![Stack Overflow's tag field showing suggestions for "java"](images/stackoverflow.png) | ![This project's tag field showing the same suggestions](images/screenshot.png) |

## Run it

There's nothing to install. Clone the repo and open `index.html` in a browser, or serve the folder:

```bash
git clone https://github.com/didagu/dynamic-tag-field-processing.git
cd dynamic-tag-field-processing
python3 -m http.server 8000
```

Then go to http://localhost:8000.

## How it works

| File | What it does |
| --- | --- |
| `taglist.js` | The tag data: six hard-coded sample tags, each with an id, title, description and alternative names |
| `app.js` | Renders every tag as a hidden result card, then filters the cards on each keystroke |
| `Utils.js` | Adding and removing selected tags, plus small helpers |
| `style.css` | Layout for the tags and result cards (on top of Bootstrap 3) |

A tag matches when the search text appears anywhere in its title or in one of its alternative names.

## Known limitations

- Matching is case-sensitive: `Java` finds nothing, `java` works.
- Mouse only. There's no arrow-key navigation or Enter to select.
- Highlighting the matched text in results isn't implemented yet.
- Tag data is static; there's no API behind it.

## Feedback

Bug reports and suggestions are welcome as [GitHub issues](https://github.com/didagu/dynamic-tag-field-processing/issues).
