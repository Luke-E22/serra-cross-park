# Strong Glasgow: license note

The three `StrongGlasgow-*.ttf` files here are the free demo build of Strong Glasgow by Herofonts, downloaded from https://www.fontspace.com/strong-glasgow-font-f23385. The download's `info.txt` reads: "license: Shareware, Non-Commercial". They are for personal use and development only.

Two consequences while the demo files are in place:

- The demo draws an "HF" badge in place of each digit 0 to 9. `components/bundle.css` lends Big Shoulders Display digits to the "Strong Glasgow" family (three `@font-face` rules with `unicode-range: U+0030-0039`) so figures read correctly.
- The repo stays private.

Before launch: license Strong Glasgow for desktop and web from Herofonts, replace the three files here (web formats are fine; update `tokens.json` `type.fonts[].file` and recompile `tokens.css` if the names change), and delete the three digit rules at the top of `components/bundle.css`. `scripts/prelaunch-check.mjs` warns while the demo files are still present.
