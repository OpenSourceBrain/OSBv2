# Architecture decision records

Architecture decision records (ADRs) for OSBv2: one file per decision, in this directory,
written in the same spirit as the rest of `devdocs/` -- tied to the code, not to a
conversation nobody can check.

## The forward-only rule

**This log only moves forward.** Two consequences follow, and both are binding:

1. **Never fabricate history.** Do not invent a date, a discussion, an author or a rejected
   alternative that did not happen. An ADR is not a story about the past retold for
   plausibility; it is a record of a decision.
2. **A decision found in the code may be recorded retrospectively.** When an area is first
documented and the code embodies a decision nobody wrote down, write the ADR and open it with
this exact sentence:

   > Recorded retrospectively from the code; no contemporaneous discussion exists.

   Set `Status: accepted` (the code is in force), give the current date, and state in
   `Context` that the record was written after the fact. The remaining fields describe what the
   code does and why it is defensible -- not a meeting that never took place.

Anything that would be a guess belongs in the ADR's `Context` as an open question, or in
`devdocs/session-log.md` as an observation, not in an ADR's `Decision`.

## When to write one

Exactly two triggers:

- **In the same PR as the change**, when a change settles something a reader could reasonably
disagree with: a cross-service contract, a storage or retention choice, a security boundary, a
process rule like this one. The ADR and the code land together, so the reasoning is never
separated from the commit that made it true.
- **Once, when an area is first documented**, for decisions already embodied in the code. Open
with the retrospective preamble above and land `Status: accepted`.

Do not write an ADR for a change that merely implements an existing ADR -- update nothing, cite
the ADR. When a decision is replaced, write a **new** ADR and set the old one's `Status` to
`superseded by NNNN`; never rewrite the old record's Decision or Consequences.

## File naming

`NNNN-kebab-case-title.md`, zero-padded to four digits, monotonically increasing, one number
per decision:

```
0001-record-architecture-decisions.md
0002-use-a-per-workspace-pvc.md
0003-forward-only-adr-log.md
```

Rules:

- The number is allocated when the file is created and never reused, even if the ADR is later
  superseded or rejected.
- The title is lower-case kebab-case and describes the decision, not the area
  (`use-a-per-workspace-pvc`, not `storage`).
- No dates or names in the filename; both live in the file.

## Template

MADR-lite. Copy this block into the new file and fill every field -- an empty
`Alternatives considered` is a sign the decision was not thought about:

```markdown
# NNNN. Short title in sentence case

- Status: proposed | accepted | rejected | superseded by NNNN
- Date: YYYY-MM-DD

## Context

What forces are at play: the requirement, the constraint, the code that already exists. Cite
files and symbols. If this is a retrospective record, say so here.

## Decision

What we do, in the active voice: "We store ...", "The workspaces API enforces ...". One
paragraph a reader can act on.

## Consequences

What follows -- good and bad. Name the cost: extra round-trip, new failure mode, migration,
operational burden. If something becomes harder, say so.

## Alternatives considered

Each alternative, and the concrete reason it lost. "Do nothing" counts and should usually be
listed.
```

Field meanings:

- **Status** -- `proposed` while under discussion, `accepted` once in force (this is also the
  correct status for a retrospective record), `rejected`, or `superseded by NNNN`.
- **Date** -- the date the status was set. For a retrospective record, today's date, with the
  preamble making clear the decision is older.
- **Context / Decision / Consequences / Alternatives considered** -- as described in the
  template comments above.

## Index

Append one line per ADR when the file is created. Keep it in numeric order.

| ADR | Title | Status |
| --- | --- | --- |
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | accepted |

## Related documents

- `devdocs/system/README.md` -- the C4 architecture diagrams these records explain the
  decisions behind.
- `devdocs/session-log.md` -- dated observations and work notes; the ADR log holds decisions,
  the session log holds what happened.
