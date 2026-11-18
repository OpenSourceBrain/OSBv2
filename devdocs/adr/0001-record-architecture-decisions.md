# 0001. Record architecture decisions

- Status: accepted
- Date: 2025-11-17

> Recorded retrospectively from the code; no contemporaneous discussion exists.

## Context

OSBv2's documentation grew up **after** the platform did. The evidence is in this repository:
`devdocs/session-log.md` opens with "First entry: no prior session log or log convention
existed in this repository", and its dated entries record documentation being written about
code that already existed -- the C4 diagrams were "built from evidence in this repository
(README, Helm/deploy values, OpenAPI specs and task definitions) rather than from assumption"
(`devdocs/system/README.md`), and each Level 3 diagram was added for a container that had
shipped long before (`devdocs/system/c4-level3-osb-workspaces-components.md`,
`c4-level3-accounts-api-components.md`, `c4-level3-backoffice-components.md`).

The consequence is visible in the code as well as the docs: decisions are embodied in
implementation and often only explained by a comment at the point of enforcement -- for
example the secret and service-account-token stripping on `RunNotebooksTask`
(`applications/workspaces/server/workspaces/service/workflow.py:157-173`, whose comment
explains that "clearing them in run.sh isn't enough, as the repository's code can read run.sh's
environment (/proc)") and the deliberate non-reuse of `WorkspaceService.is_authorized` for
notebook runs (`applications/workspaces/server/workspaces/controllers/workspace_run_controller.py:78-89`).
Those explanations are excellent and entirely local: nothing states the decision once, in one
place, in a form a reader can compare against a later change.

So the repository has architecture diagrams (`devdocs/system/`) and dated work notes
(`devdocs/session-log.md`), but no record of **why** a cross-service contract, storage choice
or security boundary is the way it is. A reader can only reconstruct the reasoning from the
code, and a reviewer has nothing to point at when a change contradicts an earlier choice.

## Decision

We keep a forward-only log of architecture decision records in `devdocs/adr/`, one file per
decision, named `NNNN-kebab-case-title.md` and written with the MADR-lite template described in
`devdocs/adr/README.md` (Status, Date, Context, Decision, Consequences, Alternatives
considered).

A new ADR is written at one of exactly two moments: in the same pull request as a
decision-bearing change, or once when an area is documented for the first time. Records for
decisions already embodied in the code are written retrospectively and open with the sentence
"Recorded retrospectively from the code; no contemporaneous discussion exists." Existing records
are never rewritten: when a decision is replaced, a new ADR is written and the old one's status
becomes `superseded by NNNN`.

## Consequences

- **A decision has one address.** The reasoning behind a cross-service contract, a storage
  choice or a security boundary is citable from a pull request instead of reconstructed from
  the code.
- **The cost is a per-decision writing effort, and it is paid up front.** Every decision-bearing
  change carries a small documentation obligation in the same PR; skipping it is now a review
  question rather than an afterthought.
- **The log starts thin and that is expected.** Only decisions made from now on are fully
  contemporaneous. Areas documented later get retrospective records, which are honest about
  being late but cannot recover alternatives nobody wrote down -- `Alternatives considered` will
  be weaker on those than on new records.
- **Two statuses will be used unevenly.** Most seeded records will be `accepted` on creation;
  `proposed` and `rejected` only appear once the log is in active use. This is a feature, not a
  gap, and the status field is what makes it readable.
- **It does not replace the diagrams or the session log.** `devdocs/system/` still shows the
  structure, `devdocs/session-log.md` still records what was done and when, and the ADR log holds
  the decisions. A future reader needs all three, and none should absorb another.
- **Maintenance is social, not mechanical.** Nothing enforces the rule; it holds only as long as
  review does. The two triggers above are deliberately narrow so the obligation stays small
  enough to be met.

## Alternatives considered

- **Retrofit the history.** Reconstruct ADRs for every past decision, with dates and discussion.
  Rejected: no contemporaneous discussion exists, so the result would be fiction dressed as a
  record -- exactly what the forward-only rule forbids. The retrospective single-record form
  (written late, labelled late) keeps the useful part without inventing the rest.
- **No ADR log at all; keep explaining decisions in code comments and the session log.** This is
  what the repository already does, and the comments it produces are genuinely good (see the
  `RunNotebooksTask` and `_owned_workspace` examples in Context). Rejected because local comments
  cannot be found from outside the file, cannot be compared across services, and are not
  consulted when a later change contradicts them -- which is the failure this log is meant to
  catch. Comments stay; the ADR gives them an address.
- **A heavyweight template** with sign-off lists, approvals and mandatory stakeholder sections.
  Rejected: this is a small repository whose documentation is written by the people making the
  change, and a process heavy enough to be skipped is worse than a light one that is followed.
  MADR-lite's five fields are the minimum that still forces the alternatives to be written down.
- **A single append-only `decisions.md`.** Rejected: one growing file makes a decision's history
  a chain of edits in `git log`, and the `superseded by` relationship becomes a paragraph to
  maintain by hand rather than a link between files. One file per decision keeps each record
  immutable and citation-friendly.
