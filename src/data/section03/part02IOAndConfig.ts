import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_02_TERMINOLOGIES: TermItem[] = [
  {
    term: 'Text mode vs binary mode',
    definition: 'open(path) defaults to text mode ("r") — bytes are decoded via an encoding, and line endings are normalized to \\n. Binary mode ("rb") returns raw bytes with no decoding.',
    category: 'File I/O',
  },
  {
    term: 'Encoding',
    definition: 'The rule mapping bytes ↔ characters. utf-8 is the only correct default in DE. latin-1 never fails but silently corrupts non-ASCII.',
    category: 'File I/O',
    highlight: true,
  },
  {
    term: 'BOM (Byte Order Mark)',
    definition: 'A 2–3-byte marker at the start of some files (\\ufeff). Excel writes CSVs with a BOM; Python read as utf-8 keeps the BOM in the first column name. Use utf-8-sig to strip it.',
    category: 'File I/O',
    highlight: true,
  },
  {
    term: 'Newline (\\n vs \\r\\n)',
    definition: 'Unix uses \\n, Windows uses \\r\\n. Text mode hides the difference on read; binary mode does not. For CSVs specifically, always open with newline="" — csv handles line endings itself.',
    category: 'File I/O',
  },
  {
    term: 'NDJSON / JSONL',
    definition: 'Newline-delimited JSON: one JSON object per line. The DE-standard shape because each line is independently parseable and files stream.',
    category: 'Data Formats',
    highlight: true,
  },
  {
    term: 'Parquet',
    definition: 'Columnar, compressed, splittable binary file format. The default lake file format. Column-pruned, predicate-pushed, ~5–10× smaller than CSV.',
    category: 'Data Formats',
    highlight: true,
  },
  {
    term: 'Schema evolution',
    definition: 'Handling files whose columns changed over time (added, dropped, renamed, retyped). Parquet + Delta support this natively; CSV does not.',
    category: 'Data Formats',
  },
  {
    term: 'Idempotent write',
    definition: 'A write that produces the same target state whether it runs once or five times. Overwrite-by-partition and MERGE are idempotent; append is not.',
    category: 'Storage Mechanics',
    highlight: true,
  },
  {
    term: 'Atomic write',
    definition: 'A write where readers never see a half-written file. Achieved by writing to a temp path and renaming into place.',
    category: 'Storage Mechanics',
    highlight: true,
  },
  {
    term: 'Structured logging',
    definition: 'Log records emitted as key-value pairs (usually JSON) so an observability system can index and filter them. Contrast with free-text "print statements."',
    category: 'Observability',
    highlight: true,
  },
  {
    term: 'Log level',
    definition: 'The severity band: DEBUG < INFO < WARNING < ERROR < CRITICAL. Handlers filter by level.',
    category: 'Observability',
  },
  {
    term: 'Handler / formatter / filter',
    definition: 'The three plug-in points on a logger. Handler = destination (stdout, file, HTTP). Formatter = layout. Filter = decide which records pass.',
    category: 'Observability',
  },
  {
    term: 'Config precedence',
    definition: 'The order in which config sources override each other. DE-standard: defaults < config file < env vars < CLI flags.',
    category: 'Configuration',
    highlight: true,
  },
  {
    term: '12-factor config',
    definition: 'The rule that config lives in the environment, not in code. All secrets and per-environment values are injected at runtime.',
    category: 'Configuration',
  },
  {
    term: 'Secret',
    definition: 'Any credential you would not paste into a PR — passwords, tokens, connection strings. Never lives in code, in a repo, or in a log line.',
    category: 'Security',
    highlight: true,
  },
];

export const IO_CONFIG_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'python-q7-newline-csv-trap',
    number: 7,
    question: 'Why is newline="" required when opening a CSV in Python?',
    topic: 'File Formats',
    subtopic: 'CSV Handling',
    answers: {
      basic: '"It handles line endings."',
      strong: '"The `csv` module handles line endings itself, including embedded newlines inside quoted fields. If Python also translates newlines in text mode, they collide and rows split incorrectly."',
      senior: '"Same, plus: on Windows the default text-mode translation of `\\r\\n` to `\\n` combined with the `csv` module\'s own handling causes silent row corruption — usually seen as columns shifted by one on the row after a quoted field with a newline in it. `newline=""` is not optional; it\'s part of the correct incantation for CSV, along with `encoding="utf-8-sig"` when the source is Excel."',
      interviewerIntent: 'Testing deep knowledge of CPython text mode translations, dialect edge cases, embedded newlines, and preventing subtle silent corruption in pipeline ingestion.',
      seniorKeyTakeaways: [
        'csv module implements its own newline parsing rules',
        'Text-mode translation collision causes silent column shift after quoted multiline fields',
        'Pair with encoding="utf-8-sig" to strip Excel BOMs',
      ],
    },
  },
  {
    id: 'python-q8-parquet-vs-csv',
    number: 8,
    question: 'When would you pick Parquet over CSV, and when the reverse?',
    topic: 'Storage Formats',
    subtopic: 'Parquet vs CSV',
    answers: {
      basic: '"Parquet is faster and smaller."',
      strong: '"Parquet is columnar, compressed, typed, and supports predicate pushdown. Use it for anything that will be queried by an engine. CSV is human-readable and universal, so I use it for exports to humans or for vendor drops I can\'t control."',
      senior: '"Parquet everywhere in the lake — bronze onward. CSV only at the boundary: landing files from a vendor or an export to a non-technical consumer. If a source drops CSV, I convert to Parquet in the first hop so nothing downstream pays the CSV cost. The concrete win is columnar pruning plus row-group min/max pushdown; on a wide table with a selective filter that\'s a 20–100× read reduction versus scanning CSV. The trade-off is Parquet isn\'t diffable and can\'t be opened in Notepad, which matters for on-call debugging — I keep a small `parquet-tools`-style helper handy."',
      interviewerIntent: 'Checking lakehouse architecture knowledge: columnar projection, min/max pruning at row-group level, compression ratios, and conversion at landing zones.',
      seniorKeyTakeaways: [
        'Parquet: columnar pruning + row-group min/max predicate pushdown',
        'Convert CSV to Parquet in the first hop (Landing → Bronze)',
        'Trade-off: lack of plain-text diffability requires dedicated inspection tools',
      ],
    },
  },
  {
    id: 'python-q9-production-logging',
    number: 9,
    question: 'How would you configure logging in a production DE pipeline?',
    topic: 'Observability',
    subtopic: 'Production Logging Architecture',
    answers: {
      basic: '"Use the logging module with basicConfig."',
      strong: '"Configure once at the entry point, get a module-scoped logger with `logging.getLogger(__name__)` everywhere else, use levels appropriately, and use `log.exception` inside `except` blocks so tracebacks are captured. Use `%s` formatting so messages aren\'t built when the level is off."',
      senior: '"Same, plus: emit JSON via a formatter so the aggregator can index by keys like `run_id`, `job`, `step`, `rows`, `duration_ms`. Use a `LoggerAdapter` or `contextvars` to inject `run_id`/`job` into every log line for a run without threading them through every function. Never configure logging in a library — only in the app entry point. Add a redaction filter as defense-in-depth to strip known secret patterns even if a bug tries to log one. In Databricks that\'s `dbutils.secrets.get` values, which are already redacted from cell output, but the same rule applies for any custom logs."',
      interviewerIntent: 'Assessing operational maturity: module-scoped loggers, structured JSON emission, context propagation (contextvars/LoggerAdapter), lazy formatting, and secret scrubbing.',
      seniorKeyTakeaways: [
        'Module-scoped getLogger(__name__), entry-point configuration only',
        'Structured JSON output indexed by run_id, job, step, rows, duration_ms',
        'Contextvars/LoggerAdapter for zero-overhead correlation IDs',
        'Defense-in-depth secret redaction filter',
      ],
    },
  },
  {
    id: 'python-q10-secrets-management',
    number: 10,
    question: 'Where do secrets live in your pipelines?',
    topic: 'Security & Configuration',
    subtopic: 'Secrets Lifecycle',
    answers: {
      basic: '"In environment variables."',
      strong: '"In a secret store like Azure Key Vault or Databricks Secret Scopes. Env vars in dev via `.env` (git-ignored). Never in code, never in Git, never in logs."',
      senior: '"Secret store per environment — Key Vault in Azure, Secrets Manager in AWS, Secret Scopes in Databricks — accessed via the platform\'s identity so no secret exists on disk. ADF linked services reference Key Vault directly; the pipeline never touches the raw value. In Python code I load via `pydantic-settings` with a `password: SecretStr` field so accidental `repr` doesn\'t leak it. If a secret ever appears in a repo — even in an old commit — I rotate immediately; deleting the commit is not sufficient."',
      interviewerIntent: 'Evaluating enterprise security compliance: platform managed identities, secret vaults, SecretStr masking in memory, and incident protocol (re-issuance vs commit deletion).',
      seniorKeyTakeaways: [
        'Cloud secret stores (Key Vault / Secrets Manager / Secret Scopes) backed by managed identity',
        'pydantic-settings SecretStr prevents accidental __repr__ leakage',
        'Compromise rule: immediate revocation and re-issuance (Git commit deletion is insufficient)',
      ],
    },
  },
  {
    id: 'python-q11-stream-20gb-parquet',
    number: 11,
    question: 'Walk me through streaming a 20 GB NDJSON file into partitioned Parquet without blowing memory.',
    topic: 'Streaming & Systems',
    subtopic: 'Partitioned Parquet Generation',
    answers: {
      basic: '"Read line by line, parse, write."',
      strong: '"Open the input with a with block, iterate the file object, `json.loads` each line, transform, batch into N-thousand-row `pyarrow.Table`s, and write with a `ParquetWriter`. Constant memory."',
      senior: '"Same, plus: I\'d route each row to its partition directory by the partition key — usually date — using a dict of writers keyed by partition. Write to `.tmp` per partition and `os.replace` to atomic-commit at the end so a mid-run failure never leaves a corrupt reader-visible file. Row-group size around 128 MB, compression zstd. If the source has schema drift, I pin the schema up front so the writer doesn\'t produce mixed-schema row groups, and unexpected fields go to an `_extra` map. On the observability side: log rows-in, rows-out, bytes-in, bytes-out, and duration per partition so we can catch skew before it becomes a bill."',
      interviewerIntent: 'Testing end-to-end distributed file system design: partition-aware streaming, atomic swap (.tmp + os.replace), row group sizing (128 MB), schema pinning, and per-partition metrics.',
      seniorKeyTakeaways: [
        'Partition-keyed ParquetWriter dictionary with streaming line iterator',
        'Atomic commit via .tmp file rename (os.replace)',
        'Target 128 MB row-group size with zstd compression',
        'Pin PyArrow schema to prevent incompatible row-group drift',
      ],
    },
  },
];

export const PART_02_IO_CONFIG_DATA: SectionPart = {
  id: 'python-part-02',
  title: 'Part 02: I/O, Logging & Config',
  partNumber: 'Part 02: I/O, Logging & Config',
  subtitle: 'The boring, load-bearing pieces of every production DE codebase — file I/O, JSON/CSV/Parquet, logging that survives a 3 a.m. incident, and configuration that does not ship secrets to Git.',
  summary: 'In-depth coverage of text vs binary modes, BOM handling, atomic file writing, compact NDJSON streaming, pyarrow partitioned datasets, structured JSON logging with contextvars, and 12-factor typed config with pydantic-settings.',
  readTimeMinutes: 30,
  terminologies: PART_02_TERMINOLOGIES,
  sections: [
    {
      heading: 'File I/O — the parts that go wrong at scale',
      subheading: 'Context managers, encoding rules, atomic writes, streaming transforms, and compression',
      content: `### 1.1 Always use a context manager

\`\`\`python
with open(path, "r", encoding="utf-8") as f:
    for line in f:
        process(line)
\`\`\`

- \`with\` guarantees the file closes even on exception.
- The naked \`f = open(path); ... f.close()\` pattern leaks descriptors on error — a classic bug in long-running pipelines that eventually hit "too many open files."
- **Iterate the file object.** \`.readlines()\` materializes the whole file into memory; the file object itself is a lazy iterator over lines. Same syntax, constant memory.

---

### 1.2 Always specify \`encoding\`

\`\`\`python
open(path, "r")                           # implementation-defined encoding — bug waiting to happen
open(path, "r", encoding="utf-8")         # correct
open(path, "r", encoding="utf-8-sig")     # correct for Excel-exported CSVs (strips BOM)
\`\`\`

- Without \`encoding=\`, Python 3.11+ warns; earlier versions silently used the locale (often \`cp1252\` on Windows), which produces \`UnicodeDecodeError\` in production but not on the dev's laptop.
- **Never** default to \`latin-1\` just to "make errors go away." It reads any byte sequence, so it *hides* corruption rather than reporting it.
- For control over failure mode use \`errors="strict"\` (default, correct), \`errors="replace"\` (only for logs / diagnostic reads).

---

### 1.3 Binary mode for anything that isn't text
Parquet, gzip, protobuf, images, checksums — all binary. \`open(path, "rb")\` and read \`bytes\`. Don't decode.

---

### 1.4 Paths — use \`pathlib.Path\`

\`\`\`python
from pathlib import Path

root = Path("/mnt/lake/bronze")
today = "2026-09-04"
part_path = root / "orders" / f"ingest_date={today}" / "part-00000.parquet"

part_path.parent.mkdir(parents=True, exist_ok=True)
part_path.write_bytes(payload)
\`\`\`

- \`Path\` composes with \`/\`, handles OS differences, and exposes \`.exists()\`, \`.is_dir()\`, \`.stat()\`, \`.glob()\`, \`.with_suffix()\`, \`.read_text()\`, \`.write_bytes()\`.
- \`os.path.join\` still works but is verbose. New code should use \`Path\`.

---

### 1.5 Atomic file writes
Never write directly to the final path. If the process dies mid-write, a downstream reader will see a truncated file.

\`\`\`python
import os, tempfile
from pathlib import Path

def atomic_write(path: Path, data: bytes) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_bytes(data)
    os.replace(tmp, path)                 # atomic on POSIX and Windows
\`\`\`

- \`os.replace\` is atomic within the same filesystem.
- Cloud object stores (S3, ADLS, GCS) are different — writes are eventually visible as a whole object, so this pattern is less relevant there, but it's mandatory for local staging and for HDFS-like filesystems.

---

### 1.6 Streaming large files — the pattern
The archetype for reading a huge NDJSON file, transforming, and writing NDJSON out:

\`\`\`python
import json
from pathlib import Path

def transform(rec: dict) -> dict:
    rec["amount_cents"] = int(round(rec["amount_usd"] * 100))
    return rec

def stream_transform(src: Path, dst: Path) -> int:
    n = 0
    with src.open("r", encoding="utf-8") as fin, dst.open("w", encoding="utf-8") as fout:
        for line in fin:
            rec = json.loads(line)
            out = transform(rec)
            fout.write(json.dumps(out, separators=(",", ":")) + "\\n")
            n += 1
    return n
\`\`\`

- Constant memory regardless of file size.
- \`separators=(",", ":")\` writes compact JSON — no wasted bytes on whitespace.
- Return the row count so the caller can log it.

---

### 1.7 Compressed files — read them as streams too
\`gzip\`, \`bz2\`, \`lzma\` all expose file-like objects with the same iterator protocol.

\`\`\`python
import gzip, json

with gzip.open("events.jsonl.gz", "rt", encoding="utf-8") as f:
    for line in f:
        yield json.loads(line)
\`\`\`

\`"rt"\` = read text — gzip decompresses bytes, then Python decodes the text with your encoding. Streams end to end.`,
    },
    {
      heading: "JSON — 90% of the payloads you'll ever see",
      subheading: 'loads vs load, type mappings, date serialization, and defensive flattening',
      content: `### 2.1 The two functions you'll use forever

| Function | Purpose |
|---|---|
| \`json.loads(s)\` | Parse a JSON **string** → Python object |
| \`json.dumps(o)\` | Serialize a Python **object** → JSON string |
| \`json.load(f)\` | Parse a JSON **file** (whole file) |
| \`json.dump(o, f)\` | Write a JSON **file** (whole file) |

The \`load\`/\`dump\` variants read/write the entire file at once. Fine for config; **wrong for data files** — use \`loads\`/\`dumps\` line-by-line for JSONL.

---

### 2.2 The type mapping

| JSON | Python |
|---|---|
| object | \`dict\` |
| array | \`list\` |
| string | \`str\` |
| number (int) | \`int\` |
| number (float) | \`float\` |
| \`true\` / \`false\` | \`True\` / \`False\` |
| \`null\` | \`None\` |

Things that don't round-trip natively — and interviewers love these:
- \`datetime\` → serialize with \`.isoformat()\`; parse back with \`datetime.fromisoformat()\`.
- \`Decimal\` → JSON has no exact-decimal type. Serialize as a string or use \`json.dumps(..., default=str)\` and parse back explicitly.
- \`set\` → JSON has no set; use \`list(sorted(s))\` on the way out.
- \`bytes\` → base64-encode.
- \`NaN\` / \`Infinity\` → not standard JSON. Python's \`json\` writes them by default; strict consumers reject them. Pass \`allow_nan=False\` to \`dumps\` to fail loud.

---

### 2.3 Compact vs pretty

\`\`\`python
json.dumps(obj)                             # human-ish, has spaces
json.dumps(obj, separators=(",", ":"))      # compact — the DE default for wire and disk
json.dumps(obj, indent=2, sort_keys=True)   # pretty — for logs, diffs, snapshots
\`\`\`

---

### 2.4 Streaming JSONL is the DE default, not "regular" JSON
A 5 GB single JSON array cannot be parsed without loading it whole. A 5 GB NDJSON file streams line by line. **When you control the format, always emit NDJSON for data.** Reserve pretty JSON arrays for config.

---

### 2.5 Beyond stdlib
- \`orjson\` — 2–10× faster than stdlib, correct \`datetime\` handling, always returns \`bytes\`. Use it in hot paths.
- \`ujson\` — old, has correctness quirks; only use if you've profiled and are sure.
Do **not** reach for these on day one. Stdlib \`json\` is fast enough for most transformations; the bottleneck is almost always I/O, not parsing.

---

### 2.6 Nested JSON — flatten defensively
Real payloads are nested. The senior instinct is to **flatten at the boundary** so downstream code is uniform:

\`\`\`python
def flatten_customer(rec: dict) -> dict:
    addr = rec.get("address") or {}
    return {
        "customer_id":   rec["id"],
        "email":         rec.get("email"),
        "country":       addr.get("country"),
        "postal_code":   addr.get("postalCode"),
        "created_at":    rec["createdAt"],
    }
\`\`\`

- \`rec.get("address") or {}\` — \`.get\` returns \`None\` when the key is missing *or* the value is explicitly \`null\`. \`or {}\` collapses both to an empty dict so \`.get("country")\` doesn't blow up. Interviewers ask why the \`or\` is there.
- **Don't** chain \`rec["a"]["b"]["c"]\` unless the schema is guaranteed. One missing key raises \`KeyError\` at 3 a.m.`,
    },
    {
      heading: 'CSV — still everywhere, still full of traps',
      subheading: 'DictReader, DictWriter, newline handling, casting, and Parquet comparison',
      content: `### 3.1 The right way to read

\`\`\`python
import csv
from pathlib import Path

with Path("orders.csv").open("r", encoding="utf-8-sig", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        process(row)                       # row is dict[str, str]
\`\`\`

- \`newline=""\` — required. Without it, embedded newlines inside quoted fields break rows.
- \`encoding="utf-8-sig"\` — strips Excel's BOM from the first column name.
- \`DictReader\` — rows come as \`dict\` keyed by column name. Everything is a string. Cast where needed.

---

### 3.2 The right way to write

\`\`\`python
with Path("out.csv").open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["order_id", "customer_id", "amount_usd"])
    writer.writeheader()
    writer.writerows(rows)                 # rows: Iterable[dict]
\`\`\`

\`writerows\` takes any iterable — pass a generator and it streams.

---

### 3.3 Dialects, delimiters, quoting
CSV is not one format; it's a family. Real files use tabs, pipes, semicolons, and quoting rules that differ by tool. Configure the dialect explicitly:

\`\`\`python
csv.reader(f, delimiter="|", quotechar='"', quoting=csv.QUOTE_MINIMAL)
\`\`\`

---

### 3.4 Everything is a string
CSV has no types. \`"1"\` is a string; \`"1.0"\` is a string; \`""\` is an empty string, not NULL. You must:
- Trim whitespace explicitly if the source has it.
- Cast to \`int\`/\`float\`/\`Decimal\`/\`date\` with explicit error handling.
- Decide **before ingestion** whether \`""\` means empty string or NULL. In enterprise pipelines this is almost always NULL, and you translate it early.

\`\`\`python
def to_int_or_none(s: str) -> int | None:
    s = s.strip()
    return int(s) if s else None
\`\`\`

---

### 3.5 CSV vs Parquet — the honest comparison

| Concern | CSV | Parquet |
|---|---|---|
| Human-readable | Yes | No |
| Typed | No — all strings | Yes — real column types |
| Compressed | No (unless you gzip) | Yes, per column |
| Splittable | Not reliably | Yes, at row groups |
| Schema evolution | Painful | Native |
| Predicate pushdown | No | Yes |
| Size on disk | Baseline | 5–10× smaller |
| Read speed on lakes | Slowest | Fastest |
| Use it when | Human handoff, ad-hoc export | Everything else |

> **Interview answer:** CSV is for humans and legacy vendor drops. Parquet is for engineers. If you land CSV in a data lake, convert to Parquet in the first hop.`,
    },
    {
      heading: 'Parquet — the file format of the modern lake',
      subheading: 'Columnar storage, pyarrow dataset reading, row-group sizing, and table formats',
      content: `### 4.1 Why it's the default
- **Columnar:** reads only the columns you project. A query touching 3 of 200 columns reads 3/200 of the file.
- **Compressed per column:** dictionary + RLE + Snappy/Zstd. Numbers and low-cardinality strings compress heavily.
- **Predicate pushdown:** row groups carry per-column min/max stats. A \`WHERE order_date >= '2026-09-01'\` skips entire row groups whose stats say "impossible."
- **Splittable:** an engine can hand different row groups to different workers.
- **Typed:** ints stay ints, dates stay dates, decimals stay exact. No CSV string-cast nightmares.

---

### 4.2 Reading and writing with \`pyarrow\`

\`\`\`python
import pyarrow as pa
import pyarrow.parquet as pq

# Write
table = pa.Table.from_pylist(rows)         # rows: list[dict]
pq.write_table(
    table, "orders.parquet",
    compression="zstd",                    # zstd is the modern default; snappy is the legacy default
    use_dictionary=True,
)

# Read
table = pq.read_table("orders.parquet", columns=["order_id", "amount_usd"])
rows  = table.to_pylist()
\`\`\`

- \`columns=[...]\` on read is column pruning — only those columns are decoded.
- \`compression="zstd"\` gives better ratios than snappy at similar CPU cost on modern CPUs.

---

### 4.3 Partitioned datasets

\`\`\`
lake/orders/
  ingest_date=2026-09-03/
    part-0.parquet
    part-1.parquet
  ingest_date=2026-09-04/
    part-0.parquet
\`\`\`

\`\`\`python
import pyarrow.dataset as ds

dataset = ds.dataset("lake/orders", format="parquet", partitioning="hive")
table = dataset.to_table(
    filter=(ds.field("ingest_date") == "2026-09-04") & (ds.field("region") == "US"),
    columns=["order_id", "amount_usd"],
)
\`\`\`

- \`partitioning="hive"\` reads \`key=value\` directory names automatically.
- The filter is **pushed down** — only matching directories are opened, and inside each file only matching row groups are read. This is the mechanism behind fast lake queries.

---

### 4.4 Row group size — the one knob to know
- **Small row groups** (few MB) → too many, high metadata overhead, poor compression, tiny reads.
- **Big row groups** (hundreds of MB) → each worker has to read a lot to check a predicate; skew on partitioned reads.
- **DE default:** 128 MB per row group, ~1 GB per file. Match the target engine's split size (Spark's default is 128 MB).

---

### 4.5 Delta / Iceberg / Hudi — where Parquet slots in
Delta Lake, Iceberg, and Hudi are **table formats** built *on top of* Parquet. Parquet stores the data; the table format adds a transaction log, snapshots, schema evolution, and time travel. In an interview:

> *"Parquet is the file format. Delta is the table format on top of it. Delta files on disk are Parquet plus a \`_delta_log\` transaction log."*`,
    },
    {
      heading: 'Logging — the difference between "the job failed" and "here\'s why"',
      subheading: 'Banning print, configuring module loggers, lazy formatting, and structured JSON logs',
      content: `### 5.1 Never use \`print\` for pipeline output

Reasons a senior interviewer will accept:
- \`print\` writes to stdout with no level, no timestamp, no context, and no way to filter.
- You can't route it to a log aggregator, redact secrets, or change verbosity without editing code.
- In Databricks / ADF / Airflow logs, \`print\` output and real log records get mixed; the on-call engineer can't separate them.

Use the stdlib \`logging\` module. It's boring, ubiquitous, and every observability tool understands it.

---

### 5.2 The minimum-viable senior setup
Configure once, at the entry point, and never in a library module.

\`\`\`python
# my_pipeline/main.py
import logging, sys

def configure_logging(level: str = "INFO") -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S%z",
        stream=sys.stdout,
        force=True,                        # override any prior config (e.g., in notebooks)
    )
\`\`\`

Then in every module:

\`\`\`python
# my_pipeline/sources/rest.py
import logging
log = logging.getLogger(__name__)          # module-scoped logger

def fetch(url):
    log.info("fetching url=%s", url)
    ...
\`\`\`

---

### 5.3 Levels — use them like an adult

| Level | When to emit |
|---|---|
| \`DEBUG\` | Low-level detail, off in prod. Row samples, request/response bodies (redacted). |
| \`INFO\` | Normal lifecycle events. "started", "finished", counts, durations, checkpoints. |
| \`WARNING\` | Something unexpected but not fatal. Retry attempt, degraded mode, unknown-but-safe field. |
| \`ERROR\` | The current unit of work failed. Exception details. |
| \`CRITICAL\` | Rarely used in DE — reserve for "the whole process cannot continue." |

> **Rule:** If a message is emitted for every row, it's \`DEBUG\`. \`INFO\` is for per-job / per-partition events. Anything else fills log storage and hides real signal.

---

### 5.4 Lazy formatting — the interview-tell

\`\`\`python
log.info("processed rows=%d elapsed_s=%.3f", n, elapsed)   # correct — lazy
log.info(f"processed rows={n} elapsed_s={elapsed:.3f}")    # wrong — eager
\`\`\`

The first form only builds the message string if the level is enabled. The second builds it every time even if \`DEBUG\` is off, which adds up in hot loops.

---

### 5.5 Log exceptions properly

\`\`\`python
try:
    load_partition(p)
except Exception:
    log.exception("partition load failed path=%s", p)      # includes traceback
    raise
\`\`\`

---

### 5.6 Structured logging for real observability
Emit JSON with fixed keys so the aggregator can filter on \`run_id\`, \`job\`, \`step\`, \`duration_ms\`, \`rows\`.

\`\`\`python
log.info("silver upsert done", extra={
    "run_id": run_id,
    "job": "silver_orders",
    "rows_in":  n_in,
    "rows_out": n_out,
    "duration_ms": int(elapsed * 1000),
})
\`\`\`

Combined with \`LoggerAdapter\` or \`contextvars\`, you inject \`run_id\` into every log line without threading it through every function.

---

### 5.7 Never log secrets
- No tokens, passwords, connection strings, or PII in log messages.
- Redact at the boundary. If you log a request URL, strip the query string. If you log a request body, drop the auth fields.
- Add a formatter filter that scrubs known secret patterns as defense-in-depth.`,
    },
    {
      heading: 'Configuration — the 12-factor way',
      subheading: 'Precedence orders, TOML files, env vars, typed pydantic-settings, and secrets safety',
      content: `### 6.1 The precedence rule

For every setting, the effective value is chosen by this precedence, low to high:

\`\`\`
built-in defaults  <  config file  <  environment variables  <  CLI flags
\`\`\`

- **Defaults** live in code and are safe for local dev.
- **Config file** (YAML / TOML / JSON) checked into the repo carries non-secret per-environment values.
- **Env vars** carry secrets and per-environment overrides. Set by the deployment platform.
- **CLI flags** are the highest override — the on-call engineer's escape hatch (\`--dry-run\`, \`--from-date=...\`).

---

### 6.2 File format — pick TOML or YAML, not both
- **TOML** is stdlib as of Python 3.11 (\`tomllib\`). No dependency. Great for flat/nested config.
- **YAML** is more expressive but needs \`PyYAML\` and has famous footguns (\`no\` becomes \`False\`, indentation bugs). Use \`yaml.safe_load\` **always**; never \`yaml.load\`.

\`\`\`toml
# config/prod.toml
[log]
level = "INFO"

[warehouse]
name    = "TRANSFORM_WH"
timeout = 600

[source.orders]
type       = "rest"
base_url   = "https://api.example.com"
page_size  = 500
\`\`\`

---

### 6.3 Environment variables
Access with \`os.environ\`. Distinguish "required" from "optional":

\`\`\`python
import os

def env(name: str, *, default: str | None = None, required: bool = False) -> str | None:
    val = os.environ.get(name, default)
    if required and val is None:
        raise ConfigError(f"required env var not set: {name}")
    return val

DB_HOST = env("DB_HOST", required=True)
LOG_LEVEL = env("LOG_LEVEL", default="INFO")
\`\`\`

---

### 6.4 \`.env\` files — dev only
\`python-dotenv\` loads \`.env\` into \`os.environ\` for local development. **Never** commit \`.env\`. Commit \`.env.example\` with the *names* of required variables and empty values.

---

### 6.5 Typed config with \`pydantic-settings\` (the senior default)

\`\`\`python
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class DbSettings(BaseSettings):
    host: str
    port: int = 5432
    user: str
    password: str = Field(..., repr=False)     # don't leak in __repr__

    model_config = SettingsConfigDict(env_prefix="MYPIPE_DB_", env_file=".env")

db = DbSettings()                              # reads env, validates types, fails loud
\`\`\`

---

### 6.6 Secrets — the interview-critical rules
1. **Never** in code. **Never** in Git — even in old commits (\`git log --all -S 'password'\` to audit).
2. **Never** in logs. Redact at the boundary.
3. In dev: \`.env\` (git-ignored).
4. In cloud: a real secret store — Azure Key Vault, AWS Secrets Manager, Databricks Secret Scopes, Snowflake external secrets.
5. Rotate. Any credential that has existed in a repo, however briefly, is compromised — revoke and reissue, don't just delete the commit.`,
    },
    {
      heading: 'Putting it together — a small ingest script',
      subheading: 'Production single-file ingestion blueprint: NDJSON to atomic typed Parquet',
      content: `The shape of a well-structured single-file DE script combining everything above:

\`\`\`python
"""Ingest orders NDJSON from a landing zone → typed Parquet in bronze."""
from __future__ import annotations

import json
import logging
import os
import sys
import time
from pathlib import Path
from typing import Iterable

import pyarrow as pa
import pyarrow.parquet as pq

log = logging.getLogger("ingest.orders")


class PipelineError(Exception): ...


def configure_logging(level: str) -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S%z",
        stream=sys.stdout,
        force=True,
    )


def read_ndjson(path: Path) -> Iterable[dict]:
    with path.open("r", encoding="utf-8") as f:
        for line_no, line in enumerate(f, start=1):
            try:
                yield json.loads(line)
            except json.JSONDecodeError as e:
                raise PipelineError(f"bad json at {path}:{line_no}: {e}") from e


def flatten(rec: dict) -> dict:
    addr = rec.get("shipping_address") or {}
    return {
        "order_id":     int(rec["id"]),
        "customer_id":  int(rec["customerId"]),
        "amount_usd":   float(rec["amountUsd"]),
        "country":      addr.get("country"),
        "created_at":   rec["createdAt"],
    }


def batched(it: Iterable[dict], size: int) -> Iterable[list[dict]]:
    batch: list[dict] = []
    for x in it:
        batch.append(x)
        if len(batch) >= size:
            yield batch
            batch = []
    if batch:
        yield batch


def write_parquet(rows: Iterable[dict], out_path: Path) -> int:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    tmp = out_path.with_suffix(out_path.suffix + ".tmp")
    writer: pq.ParquetWriter | None = None
    n = 0
    try:
        for batch in batched(rows, size=50_000):
            table = pa.Table.from_pylist(batch)
            if writer is None:
                writer = pq.ParquetWriter(tmp, table.schema, compression="zstd")
            writer.write_table(table)
            n += len(batch)
    finally:
        if writer is not None:
            writer.close()
    os.replace(tmp, out_path)
    return n


def main() -> int:
    configure_logging(os.environ.get("LOG_LEVEL", "INFO"))
    src = Path(os.environ["ORDERS_SRC"])
    dst = Path(os.environ["ORDERS_DST"])

    start = time.perf_counter()
    try:
        n = write_parquet((flatten(r) for r in read_ndjson(src)), dst)
    except PipelineError:
        log.exception("ingest failed src=%s dst=%s", src, dst)
        return 2

    log.info(
        "ingest done",
        extra={"src": str(src), "dst": str(dst),
               "rows": n, "duration_ms": int((time.perf_counter() - start) * 1000)},
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
\`\`\`

**What a reviewer notices:**
- Logging is configured **once** in \`main\`; every other module uses \`getLogger\`.
- Config comes from env; the script fails loud if required vars are missing.
- The transformation is a **generator pipeline**: constant memory regardless of file size.
- The Parquet write is **atomic** via \`.tmp\` + \`os.replace\`.
- Errors are wrapped with domain context (\`PipelineError\`) and preserved with \`from e\`.
- The exit code is deliberate — \`0\` success, \`2\` known failure — so the orchestrator can distinguish.`,
    },
    {
      heading: 'Common mistakes (interview traps)',
      subheading: 'Fourteen critical I/O, format, and config errors tested in senior interviews',
      content: `| Mistake | Why it fails | Fix |
|---|---|---|
| \`open(path)\` without \`encoding\` | Locale-dependent, breaks in prod | Always \`encoding="utf-8"\` |
| Reading a CSV without \`newline=""\` | Embedded newlines corrupt rows | \`open(path, newline="")\` |
| Parsing a 5 GB single JSON array | OOM | Emit / consume NDJSON |
| Chaining \`rec["a"]["b"]["c"]\` on nested JSON | \`KeyError\` when a level is missing | Flatten defensively with \`.get(...) or {}\` |
| Landing CSVs in bronze forever | Slow, untyped, big | Convert to Parquet in the first hop |
| Writing directly to the final path | Truncated file on crash | Write to \`.tmp\` + \`os.replace\` |
| Using \`print\` for pipeline output | No level, no routing, no context | \`logging.getLogger(__name__)\` |
| Calling \`logging.basicConfig\` in a library | Fights with the app config | Configure once in \`main\` |
| Using f-strings inside \`log.info(...)\` | Formats even when level is off | Use \`%s\` params |
| Catching an exception, logging text, moving on | Silent failure, no traceback | \`log.exception(...)\` and re-raise |
| Committing secrets to Git | Compromised forever | Env vars + secret store; rotate on leak |
| Hard-coding paths / URLs / thresholds | Every env needs a code change | Config file + env override |
| \`yaml.load(...)\` | Executes arbitrary Python (in old PyYAML) | Always \`yaml.safe_load(...)\` |
| Passing raw \`dict\`s of config everywhere | No validation, no types | pydantic-settings / dataclass |`,
    },
    {
      heading: 'Follow-up questions a senior interviewer will actually ask',
      subheading: 'Defending I/O trade-offs, crash recoveries, and secret leakage protocols',
      content: `- **"Your JSON has a field that's sometimes an object and sometimes an array. Handle it."**
- **"You're writing Parquet in a loop and the process crashes at 90%. What does the target directory look like, and what does the next run see?"**
- **"Show me how you'd add a \`run_id\` to every log line for the duration of a job without threading it through every call."**
- **"The CSV has amounts like \`"$1,234.56"\` and \`"(45.00)"\` for negatives. Cast them safely."**
- **"Config has 40 keys across 3 environments. Design how you'd load, override, and validate it."**
- **"Someone committed a Snowflake password to Git last week. Walk me through what you do, in order, for the next hour."**
- **"You added \`orjson\`. How do you know it was worth it?"**`,
    },
    {
      heading: 'Hands-on exercises',
      subheading: 'Five practical exercises covering atomic writers, structured logging, and schema enforcement',
      content: `### Exercise 1 — Atomic partitioned Parquet writer
Write \`write_partitioned(rows, root, partition_key)\` that takes a generator of dicts and writes them into \`root/{partition_key}={value}/part-0.parquet\`. Each partition write must be atomic (\`.tmp\` + rename). Return a dict of \`{partition_value: row_count}\`.

### Exercise 2 — Structured logging
Add a JSON formatter and a \`LoggerAdapter\` that injects \`run_id\` and \`job\` into every record. Prove with a test that a log line emitted from a nested function still carries both fields.

### Exercise 3 — Typed config loader
Using \`pydantic-settings\`, build a \`Settings\` class that loads from \`config/{env}.toml\` (env from \`APP_ENV\`) *and* env vars (with prefix \`MYPIPE_\`), env winning. Fields: \`db.host\`, \`db.port\`, \`db.password\` (SecretStr), \`warehouse.name\`, \`warehouse.timeout\`, \`log.level\`. Fail loud on a missing required value.

### Exercise 4 — CSV → Parquet converter with schema
Write \`csv_to_parquet(src, dst, schema)\` where \`schema\` is a dict \`{column: python_type}\`. Cast columns explicitly, convert empty strings to \`None\`, and emit a schema-conforming Parquet file. Reject rows with bad casts by writing them to a \`<dst>.rejects.jsonl\` sidecar with the row number and error message. Log rows-in / rows-out / rows-rejected.

### Exercise 5 — Nested JSON flattener
Write \`flatten_json(obj, sep=".")\` that turns \`{"a": {"b": [{"c": 1}, {"c": 2}]}}\` into \`[{"a.b[0].c": 1, "a.b[1].c": 2}]\` — a stream, one output dict per top-level record. Handle arrays of objects and nested objects. Add a \`max_depth\` guard to prevent runaway recursion on cyclic-looking payloads.`,
    },
    {
      heading: 'Quick revision — the 20 bullets',
      subheading: 'Rapid 3-minute checklist of production file I/O, logging, and config',
      content: `1. Always open text files with \`encoding="utf-8"\`; use \`utf-8-sig\` for Excel CSVs.
2. Always open CSVs with \`newline=""\` and use \`csv.DictReader\` / \`csv.DictWriter\`.
3. Iterate file objects — never \`.readlines()\` on a big file.
4. Use \`pathlib.Path\`, not string concatenation.
5. Atomic writes: write to \`.tmp\`, then \`os.replace\` to the final path.
6. NDJSON, not one giant JSON array, for data files.
7. \`json.dumps(..., separators=(",", ":"))\` for compact wire format.
8. \`.get("k") or {}\` when descending into optional nested objects.
9. Parquet is columnar + typed + compressed + pushdown-capable — default lake format.
10. Convert CSV → Parquet in the first hop; nothing downstream should read CSV.
11. Delta / Iceberg / Hudi are table formats on top of Parquet.
12. Never use \`print\` in a pipeline; use \`logging.getLogger(__name__)\` per module.
13. Configure logging exactly once, at the entry point.
14. Use \`%s\`-style logging args, not f-strings, for lazy formatting.
15. \`log.exception(...)\` inside \`except\` for tracebacks with context.
16. Emit JSON logs with fixed keys — \`run_id\`, \`job\`, \`step\`, \`rows\`, \`duration_ms\`.
17. Config precedence: defaults < file < env < CLI.
18. Secrets: env vars in dev via git-ignored \`.env\`; secret store in prod; rotate on leak.
19. \`pydantic-settings\` for typed, validated config with env overrides.
20. Every DE script boils down to: **read → transform (generator) → batch → atomically write → log → exit code**.`,
    },
  ],
};
