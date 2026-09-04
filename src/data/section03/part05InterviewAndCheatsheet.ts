import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_05_TERMINOLOGIES: TermItem[] = [
  {
    term: 'System design interview',
    definition: 'Architectural interview testing end-to-end ingestion frameworks, watermark management, failure isolation, and storage tradeoffs.',
    category: 'Interview Types',
    highlight: true,
  },
  {
    term: 'Live coding interview',
    definition: 'Hands-on coding round evaluating streaming generators, resilient HTTP clients, defensive JSON parsing, and test-driven development.',
    category: 'Interview Types',
  },
  {
    term: 'Rapid-fire round',
    definition: 'Fast-paced technical screening testing foundational CPython mechanics (GIL, memory, complexity, object model) in under 60 seconds per answer.',
    category: 'Interview Types',
    highlight: true,
  },
  {
    term: 'Big-O time complexity',
    definition: 'Asymptotic analysis of algorithmic execution time. dict/set lookups are O(1) average; list insertions at head are O(n).',
    category: 'Computer Science',
  },
  {
    term: 'Big-O space complexity',
    definition: 'Memory footprint scaling. Generators operate in O(1) space, while list comprehensions and .readlines() scale at O(n).',
    category: 'Computer Science',
    highlight: true,
  },
  {
    term: 'Amortized complexity',
    definition: 'The average time per operation over a sequence of operations. Python list .append() is O(1) amortized despite occasional memory reallocation.',
    category: 'Computer Science',
  },
  {
    term: 'GIL (Global Interpreter Lock)',
    definition: 'A mutex preventing multiple native OS threads from executing Python bytecodes concurrently. Released during blocking I/O and C extension execution.',
    category: 'CPython Internals',
    highlight: true,
  },
  {
    term: 'Generator pipeline',
    definition: 'Chained generator expressions and functions that stream data element-by-element with constant memory overhead regardless of input volume.',
    category: 'Design Patterns',
    highlight: true,
  },
  {
    term: 'Anti-pattern',
    definition: 'A common software development response to a recurring problem that is counterproductive and introduces silent failure modes.',
    category: 'Engineering Standards',
  },
  {
    term: 'Code smell',
    definition: 'A surface symptom in code that typically indicates a deeper architectural flaw (e.g., bare except, mutable default arguments, print in pipelines).',
    category: 'Engineering Standards',
  },
];

export const RAPID_FIRE_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'python-rf-01-dict-complexity',
    number: 22,
    question: 'What is the time complexity of dict[key] lookup in Python?',
    topic: 'Python Foundations',
    subtopic: 'Data Structures',
    answers: {
      senior: 'O(1) average, O(n) worst-case under pathological hash collisions. Python dicts use an open-addressing hash table with perturbation probing and compact array indexing.',
      interviewerIntent: 'Testing CPython hash table internals, average vs worst-case bounds, and collision resolution.',
      seniorKeyTakeaways: [
        'O(1) average via open-addressing hash table with perturbation probing',
        'O(n) worst-case under severe hash collisions',
      ],
    },
  },
  {
    id: 'python-rf-02-is-vs-equals',
    number: 23,
    question: 'What is the difference between "is" and "==" in Python?',
    topic: 'Python Foundations',
    subtopic: 'Object Model',
    answers: {
      senior: '"is" checks identity (same memory address via id()), while "==" checks equality of value (via the __eq__ method). Always use "is" for singletons like None, True, and False.',
      interviewerIntent: 'Testing understanding of pointer equality vs value equality and proper singleton comparison.',
      seniorKeyTakeaways: [
        '"is" compares object memory address (identity); "==" invokes __eq__ (value)',
        'Always use "x is None", never "x == None"',
      ],
    },
  },
  {
    id: 'python-rf-03-mutable-default-args',
    number: 24,
    question: 'Why should you never use [] as a default parameter value?',
    topic: 'Python Foundations',
    subtopic: 'Functions & Scope',
    answers: {
      senior: 'Default arguments are evaluated once when the function is defined, not when called. A mutable default like [] or {} persists across calls, causing state to leak between executions. Use def fn(items: list | None = None): items = [] if items is None else items.',
      interviewerIntent: 'Assessing knowledge of function definition time vs execution time and preventing shared state bugs.',
      seniorKeyTakeaways: [
        'Default argument objects are created once at function definition time',
        'Use None as default sentinel and instantiate mutable collections inside the body',
      ],
    },
  },
  {
    id: 'python-rf-04-mutate-during-iteration',
    number: 25,
    question: 'What happens if you modify a list or dict while iterating over it?',
    topic: 'Python Foundations',
    subtopic: 'Iterators & Collections',
    answers: {
      senior: 'For dicts and sets, CPython raises RuntimeError: dictionary/set changed size during iteration. For lists, it causes silent index skips and duplicate checks without raising an error. Iterate over a copy or use a comprehension.',
      interviewerIntent: 'Checking awareness of fail-fast iterator invariants and index shifting traps.',
      seniorKeyTakeaways: [
        'Dicts/sets fail loud with RuntimeError',
        'Lists fail silently by skipping elements due to index offset shifts',
      ],
    },
  },
  {
    id: 'python-rf-05-small-int-caching',
    number: 26,
    question: 'When does Python reuse existing integer objects instead of allocating new ones?',
    topic: 'Python Foundations',
    subtopic: 'CPython Internals',
    answers: {
      senior: 'CPython pre-allocates an array of singleton integer objects for numbers in the range [-5, 256]. Any integer in that range reuses the cached object, so a is b evaluates to True.',
      interviewerIntent: 'Testing memory optimization internals and highlighting why "is" should never be used for numeric equality.',
      seniorKeyTakeaways: [
        'CPython caches integers from -5 to 256 in a static array',
        'Illustrates why numeric comparison must always use "=="',
      ],
    },
  },
  {
    id: 'python-rf-06-slots-usage',
    number: 27,
    question: 'What is __slots__ and when would you use it in data engineering?',
    topic: 'Python Foundations',
    subtopic: 'Memory Optimization',
    answers: {
      senior: '__slots__ replaces the dynamic per-instance __dict__ with a fixed-size descriptor array. It cuts memory usage by 40–50% per instance and speeds up attribute access. Ideal for dataclasses representing millions of records in memory.',
      interviewerIntent: 'Assessing memory management at scale when handling millions of DTO records.',
      seniorKeyTakeaways: [
        'Suppresses __dict__ and __weakref__ on class instances',
        'Reduces memory footprint by 40–50% for high-volume in-memory records',
      ],
    },
  },
  {
    id: 'python-rf-07-gil-and-io',
    number: 28,
    question: 'What is the GIL, and does it block I/O operations?',
    topic: 'Concurrency',
    subtopic: 'CPython Internals',
    answers: {
      senior: 'The Global Interpreter Lock is a mutex that prevents multiple OS threads from executing Python bytecodes simultaneously. It does NOT block I/O — CPython releases the GIL during file reads, socket calls, and sleep, allowing threads to achieve genuine concurrency on I/O-bound tasks.',
      interviewerIntent: 'Distinguishing CPU-bound limitations from I/O-bound threading effectiveness.',
      seniorKeyTakeaways: [
        'GIL serializes bytecode execution on CPU-bound workloads',
        'GIL is explicitly released during blocking system I/O calls',
      ],
    },
  },
  {
    id: 'python-rf-08-garbage-collection',
    number: 29,
    question: 'How does Python\'s garbage collection work?',
    topic: 'CPython Internals',
    subtopic: 'Memory Management',
    answers: {
      senior: 'Primarily reference counting (immediate deallocation when an object\'s reference count drops to zero), supplemented by a generational cyclic garbage collector (Generations 0, 1, 2) that detects reference cycles using threshold heuristic collections.',
      interviewerIntent: 'Assessing understanding of immediate reference counting vs cyclic collector passes.',
      seniorKeyTakeaways: [
        'Reference counting provides deterministic, immediate deallocation',
        'Generational cyclic collector detects self-referential circular graphs',
      ],
    },
  },
  {
    id: 'python-rf-09-str-vs-repr',
    number: 30,
    question: 'What is the difference between __str__ and __repr__?',
    topic: 'Python Foundations',
    subtopic: 'Dunder Methods',
    answers: {
      senior: '__repr__ is for developers and debugging: unambiguous, ideally valid Python code to recreate the object. __str__ is for end-user readable output. If __str__ is undefined, Python falls back to __repr__.',
      interviewerIntent: 'Testing class design fundamentals and developer ergonomics.',
      seniorKeyTakeaways: [
        '__repr__: unambiguous representation for logging and debugging',
        '__str__: human-readable display; falls back to __repr__ if omitted',
      ],
    },
  },
  {
    id: 'python-rf-10-deepcopy-danger',
    number: 31,
    question: 'Why is copy.deepcopy dangerous in large-scale data processing?',
    topic: 'Performance',
    subtopic: 'Memory & Speed',
    answers: {
      senior: 'copy.deepcopy recursively traverses and copies the entire object graph, tracking memoized references. On deeply nested or large data structures, it is extremely slow, allocates massive memory, and can hit recursion limits. Prefer immutable data structures or explicit shallow projections.',
      interviewerIntent: 'Testing performance intuition and awareness of recursion/memory traps in pipelines.',
      seniorKeyTakeaways: [
        'Traverses full object graph with reference memoization dictionary',
        'Severe CPU and allocation overhead; favor immutable transformations',
      ],
    },
  },
  {
    id: 'python-rf-11-generator-vs-list-comp',
    number: 32,
    question: 'What is the difference between a generator expression and a list comprehension?',
    topic: 'Python Foundations',
    subtopic: 'Generators',
    answers: {
      senior: 'List comprehensions [x for x in data] evaluate eagerly, materializing all elements into memory in O(n) space. Generator expressions (x for x in data) evaluate lazily on demand, maintaining an iterator in O(1) space.',
      interviewerIntent: 'Checking understanding of lazy evaluation and memory conservation.',
      seniorKeyTakeaways: [
        'List comprehension: eager evaluation, O(n) memory allocation',
        'Generator expression: lazy iterator protocol, O(1) constant memory',
      ],
    },
  },
  {
    id: 'python-rf-12-atomic-file-writes',
    number: 33,
    question: 'How do you achieve atomic file writes on a local filesystem in Python?',
    topic: 'File I/O',
    subtopic: 'Storage Mechanics',
    answers: {
      senior: 'Write the complete payload to a temporary file in the same filesystem directory (path.with_suffix(".tmp")), flush and sync if required, then invoke os.replace(tmp, final_path). os.replace is an atomic rename syscall on POSIX and Windows.',
      interviewerIntent: 'Testing concurrency safety, crash tolerance, and knowledge of OS filesystem semantics.',
      seniorKeyTakeaways: [
        'Write to staging .tmp file in the same filesystem mount',
        'Atomic swap via os.replace avoids exposing partial files to readers',
      ],
    },
  },
  {
    id: 'python-rf-13-mandatory-utf8',
    number: 34,
    question: 'Why is encoding="utf-8" mandatory when opening text files in Python?',
    topic: 'File I/O',
    subtopic: 'Encodings',
    answers: {
      senior: 'Without encoding, Python defaults to locale.getpreferredencoding(), which varies by OS and environment (e.g., cp1252 on Windows, ANSI). Code that works locally will crash with UnicodeDecodeError in containerized or cloud environments. Always pass encoding="utf-8" (or "utf-8-sig" for Excel CSVs).',
      interviewerIntent: 'Checking production reproducibility and elimination of platform-dependent bugs.',
      seniorKeyTakeaways: [
        'Omission relies on platform locale (cp1252, ANSI), causing production crashes',
        'utf-8 is standard; utf-8-sig strips Excel Byte Order Marks',
      ],
    },
  },
  {
    id: 'python-rf-14-csv-newline-rule',
    number: 35,
    question: 'What does newline="" do when opening a CSV file in Python?',
    topic: 'File I/O',
    subtopic: 'CSV Handling',
    answers: {
      senior: 'It disables CPython\'s universal newline translation in text mode. The csv module handles its own dialect line endings and embedded newlines inside quoted fields. Without newline="", newline characters are translated twice, corrupting rows on Windows or multiline fields.',
      interviewerIntent: 'Testing dialect handling, quoted multiline CSV quirks, and platform differences.',
      seniorKeyTakeaways: [
        'Disables Python\'s universal newline translation layer',
        'Allows the csv module to handle embedded newlines in quoted fields correctly',
      ],
    },
  },
  {
    id: 'python-rf-15-ndjson-preference',
    number: 36,
    question: 'Why is NDJSON preferred over standard JSON for data pipelines?',
    topic: 'Data Formats',
    subtopic: 'JSON & Streaming',
    answers: {
      senior: 'Standard JSON arrays must be parsed into memory in their entirety before accessing a single record. NDJSON (one JSON object per line) is streaming-friendly, splittable across worker threads or Spark partitions, and appendable without re-serializing the whole file.',
      interviewerIntent: 'Assessing big data file format ergonomics and streaming ingestion capabilities.',
      seniorKeyTakeaways: [
        'NDJSON lines are independently valid, enabling line-by-line streaming',
        'Splittable for distributed engines and append-friendly without rewrites',
      ],
    },
  },
  {
    id: 'python-rf-16-parquet-speed',
    number: 37,
    question: 'What architectural features make Parquet faster than CSV for analytics?',
    topic: 'Storage Formats',
    subtopic: 'Parquet Mechanics',
    answers: {
      senior: 'Columnar layout (projects only requested columns), column-level compression (Snappy/Zstd/RLE/Dictionary), embedded type schemas (no string parsing), and row-group metadata enabling min/max statistics pushdown to skip unneeded row groups entirely.',
      interviewerIntent: 'Testing lakehouse storage format internals and query engine optimization mechanisms.',
      seniorKeyTakeaways: [
        'Columnar projection reduces read I/O to only requested attributes',
        'Min/max row-group statistics enable predicate pushdown skipping',
        'Native binary typing eliminates expensive string parsing overhead',
      ],
    },
  },
  {
    id: 'python-rf-17-retryable-http-codes',
    number: 38,
    question: 'Which HTTP status codes should an ETL ingestion script retry, and which should it never retry?',
    topic: 'API Ingestion',
    subtopic: 'Status Code Triage',
    answers: {
      senior: 'Retry transient errors: 429 (Too Many Requests), 500 (Internal Server Error), 502 (Bad Gateway), 503 (Service Unavailable), and 504 (Gateway Timeout). Never retry 4xx client errors (400, 401, 403, 404, 422) as they indicate bugs, invalid tokens, or missing resources that will fail identically.',
      interviewerIntent: 'Assessing resilience strategy and preventing retry loops on fatal bugs.',
      seniorKeyTakeaways: [
        'Retry 429 and 5xx transient server/network conditions',
        'Never retry 4xx client errors (indicates contract violations or auth failures)',
      ],
    },
  },
  {
    id: 'python-rf-18-jitter-necessity',
    number: 39,
    question: 'Why is random jitter necessary in exponential backoff algorithms?',
    topic: 'Resilience',
    subtopic: 'Backoff Mathematics',
    answers: {
      senior: 'Without jitter, all failed clients calculate identical backoff intervals and retry simultaneously, creating synchronized traffic spikes ("thundering herd") that repeatedly knock down a recovering service. Jitter spreads retry attempts smoothly across time.',
      interviewerIntent: 'Testing distributed systems resilience and network traffic smoothing.',
      seniorKeyTakeaways: [
        'Prevents synchronized retry storms ("thundering herd") against recovering services',
        'Full jitter randomizes wakeups between 0 and exponential backoff ceiling',
      ],
    },
  },
  {
    id: 'python-rf-19-idempotency-definition',
    number: 40,
    question: 'What makes a data pipeline idempotent?',
    topic: 'Pipeline Architecture',
    subtopic: 'Idempotency',
    answers: {
      senior: 'Executing the pipeline multiple times on the same input dataset produces the exact same target state as running it once. Implemented via staging-then-MERGE, overwrite-by-partition, or deduplication by deterministic primary key.',
      interviewerIntent: 'Evaluating foundational data engineering architecture for failure recovery.',
      seniorKeyTakeaways: [
        'N executions on identical input produce the same final state as 1 execution',
        'Enables safe retries without data duplication or state corruption',
      ],
    },
  },
  {
    id: 'python-rf-20-dataclass-vs-pydantic-rf',
    number: 41,
    question: 'What is the core difference between a dataclass and a Pydantic BaseModel?',
    topic: 'Data Modeling',
    subtopic: 'dataclass vs Pydantic',
    answers: {
      senior: 'dataclass is stdlib, generates boilerplate (__init__, __repr__, __eq__) with zero dependencies, but performs no runtime validation. Pydantic performs runtime parsing, type coercion, and strict validation, raising ValidationError on bad data. Use Pydantic at boundaries, dataclass in internal loops.',
      interviewerIntent: 'Checking tool selection criteria and performance/safety tradeoffs.',
      seniorKeyTakeaways: [
        'dataclass: zero runtime validation, stdlib, maximum execution speed',
        'Pydantic: runtime schema parsing and coercion, ideal for external boundaries',
      ],
    },
  },
  {
    id: 'python-rf-21-protocol-vs-abc',
    number: 42,
    question: 'Why use typing.Protocol over abc.ABC for pipeline interfaces?',
    topic: 'Type Systems',
    subtopic: 'Structural Subtyping',
    answers: {
      senior: 'Protocol enables structural subtyping (duck typing verified statically). Implementations do not need to inherit from the Protocol class, enabling third-party classes and test doubles to satisfy the interface without coupling.',
      interviewerIntent: 'Testing modern Python architectural decoupling and typing capabilities.',
      seniorKeyTakeaways: [
        'Structural subtyping (compile-time duck typing) decouples callers from classes',
        'Enables third-party types and test doubles without explicit inheritance',
      ],
    },
  },
  {
    id: 'python-rf-22-secret-handling-rf',
    number: 43,
    question: 'How do you handle secrets safely in Python data pipelines?',
    topic: 'Security',
    subtopic: 'Secrets Hygiene',
    answers: {
      senior: 'Inject via environment variables from a cloud secret store (Key Vault, Secrets Manager, Databricks Secret Scopes). Load via pydantic-settings using SecretStr so credentials cannot leak in logs or repr(). Never commit secrets to Git; rotate immediately on leak.',
      interviewerIntent: 'Testing enterprise compliance, memory hygiene, and incident protocol.',
      seniorKeyTakeaways: [
        'Cloud secret store injection via environment variables or managed identity',
        'SecretStr masking prevents accidental leak in __repr__ and stack traces',
        'Immediate revocation and rotation upon repo compromise',
      ],
    },
  },
  {
    id: 'python-rf-23-threading-vs-multiprocessing',
    number: 44,
    question: 'When should you use threading vs multiprocessing in Python?',
    topic: 'Concurrency',
    subtopic: 'Execution Models',
    answers: {
      senior: 'Use threading (ThreadPoolExecutor) for I/O-bound tasks (API calls, file downloads, DB queries) where the GIL is released. Use multiprocessing (ProcessPoolExecutor) for CPU-bound tasks (cryptographic hashing, compression, parsing) to bypass the GIL across multiple CPU cores.',
      interviewerIntent: 'Testing resource utilization models and CPython threading mechanics.',
      seniorKeyTakeaways: [
        'Threading: lightweight, shared memory, ideal for I/O-bound network calls',
        'Multiprocessing: separate memory spaces, bypasses GIL for CPU-bound math',
      ],
    },
  },
  {
    id: 'python-rf-24-nested-dict-trap',
    number: 45,
    question: 'What is the danger of chaining rec.get("a").get("b") in ingestion code?',
    topic: 'Python Foundations',
    subtopic: 'Defensive Coding',
    answers: {
      senior: 'If key "a" is missing or its value is None, rec.get("a") returns None. Calling .get("b") on None raises AttributeError: \'NoneType\' object has no attribute \'get\'. Use rec.get("a") or {} to safely collapse None to an empty dict before chained access.',
      interviewerIntent: 'Testing defensive programming against semi-structured schema variations.',
      seniorKeyTakeaways: [
        'rec.get("a") returns None when key is missing or explicit null',
        'Use (rec.get("a") or {}).get("b") to guarantee non-null dictionary calls',
      ],
    },
  },
  {
    id: 'python-rf-25-testing-without-db',
    number: 46,
    question: 'How do you test a pipeline step without connecting to a live cloud warehouse?',
    topic: 'Testing',
    subtopic: 'Integration Testing',
    answers: {
      senior: 'Separate pure transformations from I/O so business logic is unit tested instantly. For sink integration, write to local Parquet files via pyarrow and query them with in-memory DuckDB to verify row counts, column types, and partition pruning without cloud costs or credentials.',
      interviewerIntent: 'Evaluating testing architecture, fast local feedback loops, and cost awareness.',
      seniorKeyTakeaways: [
        'Isolate pure transform logic from I/O boundaries',
        'Use DuckDB + local Parquet for sub-second, credential-free integration tests',
      ],
    },
  },
];

export const PART_05_INTERVIEW_CHEATSHEET_DATA: SectionPart = {
  id: 'python-part-05',
  title: 'Part 05: Interview Bank & Cheatsheet',
  partNumber: 'Part 05: Interview & Cheatsheet',
  subtitle: 'The comprehensive Section 03 interview preparation module — complete tiered question bank, 25-question rapid-fire cluster, scenario teardowns, printable syntax cheatsheet, and candidate green/red flags.',
  summary: 'Consolidated senior interview curriculum for Python in Data Engineering: end-to-end question index, rapid-fire technical screening questions with direct senior answers, real-world scenario teardowns (streaming log parser, rate-limited paginators, large-scale deduplication), and printable syntax references.',
  readTimeMinutes: 40,
  terminologies: PART_05_TERMINOLOGIES,
  sections: [
    {
      heading: 'The complete Section 03 question bank',
      subheading: 'Structured reference mapping across all 21 core tiered questions and rapid-fire cluster',
      content: `The Python for Data Engineering interview curriculum is organized across five focused modules:

| Part | Topic Focus | Questions Covered | Primary Evaluation Target |
|---|---|---|---|
| **Part 01** | Foundations & Memory | Q1 – Q6 | Iterators, generators, mutability, closures, GIL, memory allocation |
| **Part 02** | I/O, Logging & Config | Q7 – Q11 | Encodings, CSV quirks, Parquet vs CSV, structured logging, secrets |
| **Part 03** | ETL & API Integration | Q12 – Q16 | Sessions, pagination, jittered retries, idempotency, metadata frameworks |
| **Part 04** | Testing & Typing | Q17 – Q21 | dataclass vs Pydantic, testing pyramids, Protocol, DLQs, CI gates |
| **Part 05** | Rapid-Fire Cluster | Q22 – Q46 | 25 rapid-fire technical screening questions on CPython mechanics |

All 46 questions are active across **Read Mode**, **Flashcard Mode**, and **Quiz Mode**.`,
    },
    {
      heading: 'Live coding patterns & scenario teardowns',
      subheading: 'Four real-world production engineering challenges frequently asked in live coding rounds',
      content: `### Scenario 1: Streaming Log Parser with Aggregate Metrics

**The Problem:** Process a 50 GB log file line-by-line, parse structured fields, track error rates per service, and output a summary report without exceeding 200 MB of RAM.

\`\`\`python
import json
from collections import defaultdict
from pathlib import Path
from typing import Generator

def parse_log_stream(log_path: Path) -> Generator[dict, None, None]:
    """Stream log entries lazily with constant memory."""
    with log_path.open("r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                # Log corrupt line metadata to sidecar or stderr
                continue

def aggregate_service_metrics(log_stream: Generator[dict, None, None]) -> dict[str, dict[str, int]]:
    metrics: dict[str, dict[str, int]] = defaultdict(lambda: {"total": 0, "errors": 0})
    for entry in log_stream:
        service = entry.get("service", "unknown")
        metrics[service]["total"] += 1
        if entry.get("level") in {"ERROR", "CRITICAL"}:
            metrics[service]["errors"] += 1
    return {svc: dict(counts) for svc, counts in metrics.items()}
\`\`\`

---

### Scenario 2: Rate-Limited API Ingestion with Watermarking

**The Problem:** Pull records from a vendor API that rate-limits at 10 requests per second, pages via cursors, and requires incremental watermarking on \`updated_at\`.

\`\`\`python
from datetime import datetime
import time
import requests
from typing import Iterator

def stream_incremental_records(
    session: requests.Session,
    base_url: str,
    since: datetime,
    limiter,
) -> tuple[Iterator[dict], datetime]:
    params = {
        "updated_since": since.isoformat(),
        "limit": 100,
        "sort": "updated_at:asc",
    }
    cursor = None
    max_watermark = since

    def _generator() -> Iterator[dict]:
        nonlocal cursor, max_watermark
        while True:
            limiter.take()
            if cursor:
                params["cursor"] = cursor
            resp = session.get(base_url, params=params, timeout=(5, 30))
            resp.raise_for_status()
            payload = resp.json()

            for item in payload.get("data", []):
                item_ts = datetime.fromisoformat(item["updated_at"])
                if item_ts > max_watermark:
                    max_watermark = item_ts
                yield item

            cursor = payload.get("next_cursor")
            if not cursor:
                break

    return _generator(), max_watermark
\`\`\`

---

### Scenario 3: Memory-Efficient Stream Deduplication

**The Problem:** Deduplicate a stream of 100M string identifiers in Python when storing 100M 32-character strings in a \`set\` would consume ~8 GB of RAM.

\`\`\`python
import hashlib
from typing import Iterable, Iterator

class BloomFilterDedup:
    """Approximate deduplication for high-volume streams using bit arrays."""
    def __init__(self, size_bytes: int = 10_000_000, num_hashes: int = 4):
        self.size_bits = size_bytes * 8
        self.bit_array = bytearray(size_bytes)
        self.num_hashes = num_hashes

    def _get_bit_indices(self, item: str) -> list[int]:
        indices = []
        for seed in range(self.num_hashes):
            digest = hashlib.md5(f"{seed}:{item}".encode("utf-8")).hexdigest()
            indices.append(int(digest, 16) % self.size_bits)
        return indices

    def check_and_add(self, item: str) -> bool:
        """Returns True if item was already seen (possible false positive), False if new."""
        indices = self._get_bit_indices(item)
        already_present = True
        for idx in indices:
            byte_idx = idx // 8
            bit_mask = 1 << (idx % 8)
            if not (self.bit_array[byte_idx] & bit_mask):
                already_present = False
            self.bit_array[byte_idx] |= bit_mask
        return already_present

def deduplicate_stream(items: Iterable[str]) -> Iterator[str]:
    bloom = BloomFilterDedup()
    for item in items:
        if not bloom.check_and_add(item):
            yield item
\`\`\`

---

### Scenario 4: Schema Evolution Adapter

**The Problem:** Raw JSON events arrive from multiple application versions with varying field names and missing columns. Map them into a strictly typed relational schema.

\`\`\`python
from typing import Any

def adapt_user_event(raw: dict[str, Any]) -> dict[str, Any]:
    """Map legacy and current event structures into unified silver schema."""
    # Handle user ID aliasing
    user_id = raw.get("user_id") or raw.get("userId") or raw.get("uid")
    if user_id is None:
        raise ValueError(f"Event missing user identification: {raw}")

    # Handle timestamp variations (Unix epoch vs ISO-8601)
    raw_ts = raw.get("timestamp") or raw.get("created_at") or raw.get("ts")
    if isinstance(raw_ts, (int, float)):
        event_time = datetime.utcfromtimestamp(raw_ts).isoformat()
    elif isinstance(raw_ts, str) and raw_ts:
        event_time = raw_ts
    else:
        event_time = datetime.utcnow().isoformat()

    # Flatten nested metadata defensively
    meta = raw.get("metadata") or raw.get("context") or {}
    device = meta.get("device_type") if isinstance(meta, dict) else None

    return {
        "event_id": str(raw.get("id") or raw.get("event_id")),
        "user_id": int(user_id),
        "event_name": str(raw.get("event_name") or raw.get("event") or "unknown"),
        "event_timestamp": event_time,
        "device_type": device,
    }
\`\`\``,
    },
    {
      heading: 'Rapid-fire question cluster',
      subheading: '25 sharp, high-velocity screening questions covering CPython, I/O, networking, and data architecture',
      content: `In senior screening rounds, interviewers often execute a 10-minute "rapid fire" round testing whether candidates understand underlying CPython mechanisms rather than just framework syntax.

Review all 25 rapid-fire questions in **Flashcard Mode** or drill yourself in **Quiz Mode**. Core topics include:
- Dictionary open-addressing and perturbation hash collision internals
- Identity (\`is\`) vs equality (\`==\`) and integer singleton caching
- Mutable default parameter leaks and function definition scopes
- Memory optimization with \`__slots__\` on high-volume DTO instances
- GIL mechanics during blocking I/O syscalls vs CPU bytecode execution
- Atomic file swapping via \`os.replace\` and universal newline translation
- Columnar pruning, dictionary encoding, and min/max row group pushdown in Parquet
- Full jitter algorithms against thundering-herd retry stampedes
- SecretStr memory hygiene and immediate credential rotation workflows`,
    },
    {
      heading: 'Printable syntax & patterns cheatsheet',
      subheading: 'Production-ready syntax patterns for generators, I/O, HTTP sessions, and data validation',
      content: `### 1. File I/O & Atomic Storage
\`\`\`python
# 1.1 Read large file line-by-line (O(1) memory)
with open(path, "r", encoding="utf-8") as f:
    for line in f:
        process(line)

# 1.2 CSV with universal newline disabled
import csv
with open("data.csv", "r", encoding="utf-8-sig", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader: ...

# 1.3 Atomic File Write
import os
tmp_path = target_path.with_suffix(target_path.suffix + ".tmp")
tmp_path.write_bytes(payload)
os.replace(tmp_path, target_path)
\`\`\`

### 2. Resilient Requests Session
\`\`\`python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

s = requests.Session()
retry = Retry(
    total=5,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=frozenset({"GET", "POST", "PUT"}),
    backoff_factor=1.0,
    respect_retry_after_header=True,
)
adapter = HTTPAdapter(max_retries=retry, pool_connections=20, pool_maxsize=20)
s.mount("https://", adapter)
\`\`\`

### 3. Generator Batching
\`\`\`python
from typing import Iterable, Iterator, TypeVar
T = TypeVar("T")

def batch_stream(source: Iterable[T], size: int = 1000) -> Iterator[list[T]]:
    batch: list[T] = []
    for item in source:
        batch.append(item)
        if len(batch) >= size:
            yield batch
            batch = []
    if batch:
        yield batch
\`\`\`

### 4. Structured Logging with Context
\`\`\`python
import logging
log = logging.getLogger(__name__)

log.info("partition load complete", extra={
    "run_id": run_id,
    "table": "orders",
    "rows_in": 50000,
    "rows_out": 49950,
    "duration_ms": 1250,
})
\`\`\``,
    },
    {
      heading: 'Senior candidate signals (green flags vs red flags)',
      subheading: 'The observable behaviors that differentiate a Senior Data Engineer from a Junior developer',
      content: `| Evaluation Dimension | 🚩 Red Flag (Junior / Scripting) | 🟢 Green Flag (Senior / Production) |
|---|---|---|
| **Memory Management** | Uses \`.readlines()\` or loads whole files into lists | Uses generators, stream pipelines, and batches |
| **File I/O** | Calls \`open(f)\` without encoding or newline | Explicitly sets \`encoding="utf-8"\`, \`newline=""\`, uses \`pathlib\` |
| **Error Handling** | Bare \`except:\` that prints and continues | Specific exceptions, context-chained with \`from e\`, \`log.exception\` |
| **API Ingestion** | Uses raw \`requests.get()\` with no timeout | \`requests.Session\`, pooled adapters, explicit connect/read timeouts |
| **Retries** | Naive \`sleep(2)\` loop, retries on 400 | Exponential backoff with full jitter, respects \`Retry-After\`, retries only 429/5xx |
| **Idempotency** | Assumes append-only writes are safe | Designs for restartability: staging + MERGE, partition overwrites |
| **Data Quality** | Crashes on the first unexpected null | Validates at boundaries; quarantines bad rows with error metadata |
| **Logging** | Uses \`print()\` statements everywhere | Module-scoped loggers (\`getLogger(__name__)\`), structured JSON logging |
| **Configuration** | Hard-coded URLs, secrets committed to code | 12-factor config: \`pydantic-settings\`, SecretStr, cloud secret vaults |
| **Testing** | "I tested it in a notebook with sample data" | Pure function unit tests with pytest, HTTP mocking, local DuckDB tests |
| **Data Modeling** | Passes raw unstructured dicts everywhere | \`Pydantic\` at boundaries, lightweight \`dataclass(slots=True)\` internally |`,
    },
  ],
};
