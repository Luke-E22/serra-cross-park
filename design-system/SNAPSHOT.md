# Snapshot of the Serra Cross Park design system

This folder is a read-only copy of the Claude Design system at
https://claude.ai/artifact/UtB96z9HZjcMmSauYGDafs (an artifact of type "Design System").

| | |
| --- | --- |
| Artifact version | 1791592653-9a7f |
| Last change in the system | 2026-10-10T00:36:50Z by Luke Erickson: "First version: Heritage Sign palette, Strong Glasgow and EB Garamond, 20 components for weddings, history and giving." |
| Fetched | 2026-10-09 (Pacific), with the Artifact tool in Claude Code |

## What maps to what

- Every file under the artifact's `project/` folder is here at the same path: `README.md` (the brand book), `tokens.json`, `design-system.json` (the index), `components/`, `fonts/`, and the four `assets/*/README.md` files.
- Images live in the artifact's asset store, not in its file list. They were downloaded by id and named from `design-system.json` (`assetGroups`): 6 logos, 20 photographs, 5 ornaments and 28 icons, 59 files in all.
- `TYPE-SKILL.md` is the Design System type's own `SKILL.md`, kept for reference on how the format works. It is not part of the brand.

## Files generated here, not in the artifact

- `tokens.css`: compiled from `tokens.json` following the type's compile rule (`:root, [data-theme="light"]` for colors and shadows, `:root` for spacing, radius, size and font families, one class per type style, one `@font-face` per font file). The artifact's page generates this file on the fly and does not publish it.
- `SNAPSHOT.md` (this file) and `fonts/LICENSE-NOTE.md`.

## Rules

- Never edit anything in this folder. Site code imports it; ported components live in `src/components/ds/` and every change to them is logged in `DESIGN-SYSTEM-CHANGES.md` at the repo root.
- To refresh, read the artifact again (its `project/design-system.json` carries `lastChange`), replace changed files here, and update the table above.
