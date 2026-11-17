#!/usr/bin/env python3
"""Render every Mermaid diagram in the repository to an image file.

Diagrams are discovered dynamically -- there is no hard-coded list of
files to process:

* every Markdown file below ``devdocs/`` is scanned for ```mermaid
  fenced code blocks;
* every ``.mmd`` file in the repository is used directly as a diagram
  source.

Each Mermaid source is written to its own ``.mmd`` file inside the work
directory and rendered with ``mmdc`` (the Mermaid CLI) at the requested
scale.  The output format is selected with ``--format``/``-f`` and
defaults to ``png``.

Example
-------
    python scripts/render_mermaid.py --scale 3
"""

from __future__ import annotations

import re
import shutil
import subprocess
from collections.abc import Sequence
from pathlib import Path

import typer

app = typer.Typer(
    add_completion=False,
    help="Render Mermaid diagrams discovered in the repository to image files.",
)

#: Directory names that are never scanned for sources.
EXCLUDED_DIRS = frozenset(
    {
        ".git",
        ".hg",
        ".svn",
        ".venv",
        "venv",
        "env",
        "build",
        "dist",
        "node_modules",
        "__pycache__",
        ".mypy_cache",
        ".pytest_cache",
        ".ruff_cache",
        ".tox",
        ".idea",
        ".vscode",
    }
)

#: Matches ```mermaid ... ``` fenced blocks in Markdown.
MERMAID_FENCE_RE = re.compile(
    r"^[ \t]*```[ \t]*mermaid[^\n]*\n(?P<body>.*?)^[ \t]*```",
    re.DOTALL | re.IGNORECASE | re.MULTILINE,
)


def _is_excluded(path: Path, root: Path) -> bool:
    """Return ``True`` when *path* lives inside an excluded directory."""
    try:
        parts = path.relative_to(root).parts
    except ValueError:
        parts = path.parts
    return any(part in EXCLUDED_DIRS for part in parts)


def _is_within(path: Path, directory: Path) -> bool:
    """Return ``True`` when *path* is located below *directory*."""
    try:
        path.resolve().relative_to(directory.resolve())
    except ValueError:
        return False
    return True


def find_markdown_files(devdocs_dir: Path) -> list[Path]:
    """Recursively find Markdown files below *devdocs_dir*."""
    if not devdocs_dir.is_dir():
        return []
    return sorted(
        path
        for path in devdocs_dir.rglob("*.md")
        if path.is_file() and not _is_excluded(path, devdocs_dir)
    )


def find_mmd_files(repo_root: Path, extra_excludes: Sequence[Path] = ()) -> list[Path]:
    """Recursively find ``.mmd`` files below *repo_root*."""
    results: list[Path] = []
    for path in repo_root.rglob("*.mmd"):
        if not path.is_file():
            continue
        if _is_excluded(path, repo_root):
            continue
        if any(_is_within(path, directory) for directory in extra_excludes):
            continue
        results.append(path)
    return sorted(results)


def extract_mermaid_blocks(markdown_text: str) -> list[str]:
    """Return the body of every ```mermaid fence in *markdown_text*."""
    blocks: list[str] = []
    for match in MERMAID_FENCE_RE.finditer(markdown_text):
        body = match.group("body").strip("\n").rstrip()
        if body.strip():
            blocks.append(body)
    return blocks


def _slug(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-")
    return value or "diagram"


def _relative_stem(path: Path, root: Path) -> str:
    try:
        relative = path.relative_to(root)
    except ValueError:
        relative = path
    return _slug(str(relative.with_suffix("")))


def _write_source(work_dir: Path, name: str, source: str) -> Path:
    work_dir.mkdir(parents=True, exist_ok=True)
    target = work_dir / f"{name}.mmd"
    target.write_text(source.rstrip() + "\n", encoding="utf-8")
    return target


def _render(
    mmdc: str,
    source: Path,
    output: Path,
    scale: float,
    background: str,
    image_format: str,
    puppeteer_config: Path | None,
) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    command = [
        mmdc,
        "--input",
        str(source),
        "--output",
        str(output),
        "--outputFormat",
        image_format,
        "--scale",
        str(scale),
        "--backgroundColor",
        background,
    ]
    if puppeteer_config is not None:
        command += ["--puppeteerConfigFile", str(puppeteer_config)]
    subprocess.run(command, check=True)


@app.command()
def main(
    scale: float = typer.Option(
        2.0,
        "--scale",
        "-s",
        min=1.0,
        help="Scale factor passed to mmdc (2-3 recommended).",
    ),
    output_dir: Path = typer.Option(
        Path("devdocs/system/diagrams"),
        "--output-dir",
        "-o",
        help="Directory that receives the rendered image files (--format, default png).",
    ),
    work_dir: Path = typer.Option(
        Path("build/mermaid/src"),
        "--work-dir",
        help="Directory that receives the extracted .mmd sources.",
    ),
    devdocs_dir: Path = typer.Option(
        Path("devdocs"),
        "--devdocs-dir",
        help="Directory scanned recursively for Markdown files.",
    ),
    repo_root: Path = typer.Option(
        Path("."),
        "--repo-root",
        help="Repository root scanned recursively for .mmd files.",
    ),
    mmdc: str = typer.Option(
        "mmdc",
        "--mmdc",
        help="Path to the Mermaid CLI executable.",
    ),
    background: str = typer.Option(
        "transparent",
        "--background",
        "-b",
        help="Background colour passed to mmdc.",
    ),
    image_format: str = typer.Option(
        "png",
        "--format",
        "-f",
        help="Output format passed to mmdc (png, svg, pdf, jpg).",
    ),
    puppeteer_config: Path | None = typer.Option(
        None,
        "--puppeteer-config",
        "-p",
        help="Optional Puppeteer configuration file for mmdc.",
    ),
) -> None:
    """Discover and render every Mermaid diagram in the repository."""
    repo_root = repo_root.resolve()
    devdocs_dir = devdocs_dir.resolve()
    output_dir = output_dir.resolve()
    work_dir = work_dir.resolve()

    if shutil.which(mmdc) is None and not Path(mmdc).exists():
        typer.secho(
            f"error: mmdc executable not found: {mmdc}",
            fg=typer.colors.RED,
            err=True,
        )
        raise typer.Exit(code=1)

    jobs: list[tuple[str, str]] = []

    for markdown in find_markdown_files(devdocs_dir):
        blocks = extract_mermaid_blocks(markdown.read_text(encoding="utf-8"))
        stem = _relative_stem(markdown, repo_root)
        for index, block in enumerate(blocks, start=1):
            jobs.append((f"{stem}-{index}", block))

    for mmd in find_mmd_files(repo_root, extra_excludes=(work_dir, output_dir)):
        jobs.append((_relative_stem(mmd, repo_root), mmd.read_text(encoding="utf-8")))

    if not jobs:
        typer.secho("No Mermaid diagrams found.", fg=typer.colors.YELLOW)
        raise typer.Exit(code=0)

    rendered = 0
    for name, source in jobs:
        source_path = _write_source(work_dir, name, source)
        output_path = output_dir / f"{name}.{image_format}"
        _render(
            mmdc,
            source_path,
            output_path,
            scale,
            background,
            image_format,
            puppeteer_config,
        )
        rendered += 1
        typer.echo(f"rendered {output_path}")

    typer.secho(f"Rendered {rendered} diagram(s).", fg=typer.colors.GREEN)


if __name__ == "__main__":
    app()
