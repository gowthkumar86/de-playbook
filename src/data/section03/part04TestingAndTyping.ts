import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_04_TERMINOLOGIES: TermItem[] = [
  {
    term: 'Static typing vs dynamic typing',
    definition: 'Dynamic: types checked at runtime (Python default). Static: types checked before execution by a tool (mypy/pyright). Python uses type hints checked statically; runtime types remain dynamic.',
    category: 'Type System',
  },
  {
    term: 'Type hints / annotations',
    definition: 'def add(a: int, b: int) -> int syntax introduced in PEP 484. Python ignores them at runtime; linters and IDEs use them for verification.',
    category: 'Type System',
    highlight: true,
  },
  {
    term: 'Mypy / pyright',
    definition: 'Static type checkers for Python. mypy is the reference tool; pyright (powers VS Code Pylance) is faster and often stricter.',
    category: 'Type System',
  },
  {
    term: 'Duck typing vs nominal typing',
    definition: 'Nominal: type determined by explicit name / inheritance. Duck: type determined by methods/attributes present ("if it walks like a duck"). Python is historically duck-typed.',
    category: 'Type System',
  },
  {
    term: 'Structural subtyping (Protocol)',
    definition: 'Duck typing verified statically. A class matches a Protocol if it implements the required methods, without explicitly inheriting from it.',
    category: 'Type System',
    highlight: true,
  },
  {
    term: 'dataclass',
    definition: 'Stdlib decorator that auto-generates __init__, __repr__, __eq__ from type-annotated fields. Lightweight, zero dependencies, no runtime validation by default.',
    category: 'Data Modeling',
    highlight: true,
  },
  {
    term: 'Pydantic BaseModel',
    definition: 'Data parsing and validation library. Validates types at runtime, coerces compatible types, raises detailed ValidationError on bad data.',
    category: 'Data Modeling',
    highlight: true,
  },
  {
    term: 'Fixture',
    definition: 'A pytest function that provides reusable test data or setup/teardown logic. Injected into test functions by parameter name.',
    category: 'Testing',
    highlight: true,
  },
  {
    term: 'Monkeypatch / Mock',
    definition: 'Replacing a real object/function with a fake during a test. monkeypatch is pytest\'s built-in fixture; unittest.mock is the stdlib mocking library.',
    category: 'Testing',
  },
  {
    term: 'Parametrize',
    definition: '@pytest.mark.parametrize runs the same test function with multiple input/output sets. Essential for testing edge cases compactly.',
    category: 'Testing',
    highlight: true,
  },
  {
    term: 'Data quality check',
    definition: 'Validating data properties (nullability, uniqueness, ranges, foreign keys) at runtime. Fails the pipeline or routes bad rows to a quarantine.',
    category: 'Data Quality',
    highlight: true,
  },
  {
    term: 'Great Expectations / Soda / dbt test',
    definition: 'Specialized frameworks for data quality assertions. GX uses JSON expectations; Soda uses SodaCL YAML; dbt tests run SQL assertions.',
    category: 'Data Quality',
  },
  {
    term: 'Dead letter queue (DLQ)',
    definition: 'A storage destination (table, folder, queue) where rows that failed validation are parked for inspection without crashing the pipeline.',
    category: 'Data Quality',
    highlight: true,
  },
  {
    term: 'Ruff',
    definition: 'Ultra-fast Python linter and formatter written in Rust. Replaces flake8, isort, black, pyupgrade, and pydocstyle in a single tool.',
    category: 'Tooling',
    highlight: true,
  },
  {
    term: 'Quality gate / CI gate',
    definition: 'Automated check in CI that blocks merge if tests fail, types don\'t check, or linting fails. Enforces standards automatically.',
    category: 'Tooling',
  },
];

export const TESTING_TYPING_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'python-q17-dataclass-vs-pydantic',
    number: 17,
    question: 'When do you use a dataclass vs Pydantic in a data pipeline?',
    topic: 'Data Modeling',
    subtopic: 'dataclass vs Pydantic',
    answers: {
      basic: '"Pydantic for validation, dataclass when you don\'t need validation."',
      strong: '"Pydantic at the boundaries — validating untrusted inputs like API payloads, config, or vendor files. It parses, coerces, and raises clear errors. Dataclasses inside the pipeline core for internal DTOs where data is already validated — they\'re stdlib, zero-dependency, faster, and don\'t do surprising type coercions."',
      senior: '"Same, plus the performance dimension: Pydantic v2 is fast (written in Rust), but creating 1M Pydantic models in a loop still has noticeable overhead compared to tuples or dataclasses with `slots=True`. In a hot transform loop processing millions of records, I use dicts, tuples, or `slots=True` dataclasses. Pydantic is for the ingest boundary: parse raw JSON into a validated model, then convert to internal representation. For config, always `pydantic-settings` because environment variables are untrusted strings that need parsing and validation."',
      interviewerIntent: 'Assessing boundary validation architecture, runtime cost of model instantiation, slots=True memory optimization, and strictness in ETL hot paths.',
      seniorKeyTakeaways: [
        'Pydantic at system boundaries for schema validation and coercion',
        'dataclass(slots=True) for internal DTOs with minimal instantiation overhead',
        'Avoid creating millions of Pydantic model instances in hot transform loops',
      ],
    },
  },
  {
    id: 'python-q18-unit-testing-pipeline',
    number: 18,
    question: 'How do you unit test a data pipeline that talks to an external API and a database?',
    topic: 'Testing Strategy',
    subtopic: 'Mocking & Integration Testing',
    answers: {
      basic: '"Use mocks for the API and a test database."',
      strong: '"Separate business logic from I/O. Transform functions are pure and tested with standard pytest without mocks. The API client is tested using `responses` to mock HTTP responses with realistic payloads, errors, and pagination. The DB sink is tested with an in-memory database like SQLite or DuckDB for fast local tests, plus an integration test against a real DB in CI using testcontainers."',
      senior: '"Same, plus testing failure modes: (1) Test that the API client retries on `429` with backoff and doesn\'t retry on `400`. (2) Test that the paginator terminates correctly when `next_cursor` is null and doesn\'t infinite-loop on cyclic cursors. (3) Test idempotency: run the sink twice with the same data and assert row counts and state match. (4) Use `pytest.fixture` with `tmp_path` for all file-based tests so tests are isolated and run in parallel with `pytest-xdist`. Never use `unittest.mock.patch` with string paths if I can pass a mock session directly via dependency injection."',
      interviewerIntent: 'Testing functional core / imperative shell separation, response mocking, integration testing with ephemeral engines, and idempotency verification.',
      seniorKeyTakeaways: [
        'Isolate pure transforms from I/O layers (functional core / imperative shell)',
        'Mock HTTP via responses/respx; verify status triage (429 retried, 400 rejected)',
        'Local integration tests with DuckDB/SQLite or ephemeral containers',
        'Verify idempotency by asserting identical state after repeated sink execution',
      ],
    },
  },
  {
    id: 'python-q19-type-hints-in-de',
    number: 19,
    question: 'Why bother with type hints in Python if Python doesn\'t enforce them at runtime?',
    topic: 'Type Systems',
    subtopic: 'Static Type Checking in Pipelines',
    answers: {
      basic: '"They make the code easier to read and IDEs help you."',
      strong: '"Type hints catch bugs before code runs — wrong argument types, `None` errors, typos in dict keys. Run `mypy` or `pyright` in CI to enforce them as a build gate. They also serve as machine-checked documentation that doesn\'t go stale like docstrings."',
      senior: '"In DE specifically, data flows through many stages and changes shape. Without types, a function expecting a `dict` gets passed a `list[dict]` and you only find out after a 45-minute pipeline run crashes at 3 a.m. With `mypy` in CI: (1) `Optional[T]` forces you to handle `None` before accessing attributes — eliminating the #1 runtime error. (2) `Protocol` lets you define interfaces for sources/sinks without tight inheritance coupling. (3) Type hints make refactoring safe — rename a parameter or change a return type and the type checker finds every broken call site instantly. The cost is typing a few extra characters; the savings is hours of debugging distributed failures."',
      interviewerIntent: 'Evaluating operational prevention: elimination of NoneType attribute errors, structural subtyping via Protocol, and static refactoring guarantees.',
      seniorKeyTakeaways: [
        'Optional[T] eliminates the #1 runtime failure: NoneType has no attribute',
        'Protocol enforces structural subtyping without rigid inheritance trees',
        'Static type checkers catch signature regressions before launching cluster jobs',
      ],
    },
  },
  {
    id: 'python-q20-bad-data-handling',
    number: 20,
    question: 'How do you handle bad data in an ingestion pipeline without crashing the entire batch?',
    topic: 'Data Quality',
    subtopic: 'Dead-Letter Queues & Quarantines',
    answers: {
      basic: '"Use try/except and skip the bad rows."',
      strong: '"Validate each row against a schema. Valid rows go to the main pipeline; invalid rows go to a quarantine table or dead-letter queue (DLQ) with the error reason, source file, and timestamp. Log the reject count. If the reject rate exceeds a threshold (e.g., 5%), abort the pipeline to catch upstream schema changes."',
      senior: '"A three-tier strategy: (1) Parse defensively at the boundary using Pydantic or a schema validator. Valid rows continue to staging. (2) Quarantined rows are written to a sidecar DLQ path (e.g., `bronze/quarantine/{table}/date={today}/`) with original payload, error message, failing field, and ingest timestamp. They are queryable for debugging. (3) Circuit breaker: compute `reject_rate = len(rejected) / total`. If `reject_rate > threshold`, raise an alert and halt — a 50% reject rate means the vendor changed their format, not that 50% of users are corrupt. Emit metrics: `rows_in`, `rows_valid`, `rows_quarantined`. Replay tooling: a script that reads the quarantine, applies a patch/fix, and re-injects to staging."',
      interviewerIntent: 'Checking production data governance: DLQ isolation, structured error auditing, circuit breaker reject-rate thresholds, and operational replay capability.',
      seniorKeyTakeaways: [
        'Split stream: valid to staging, invalid to queryable sidecar DLQ',
        'Circuit breaker on reject rate threshold (e.g., >5% halts pipeline)',
        'DLQ metadata: raw payload, exception reason, failing field, ingest timestamp',
        'Operational replay script for re-injecting patched records',
      ],
    },
  },
  {
    id: 'python-q21-ci-cd-quality-gates',
    number: 21,
    question: 'What quality gates would you set up in CI/CD for a data engineering repo?',
    topic: 'CI/CD & DevOps',
    subtopic: 'Pipeline Quality Gates',
    answers: {
      basic: '"Run tests and check for syntax errors."',
      strong: '"Four automated gates on every PR: (1) Formatting and linting with Ruff (catches style, unused imports, common bugs). (2) Static type checking with Mypy or Pyright (strict mode). (3) Unit tests with pytest including coverage threshold (e.g., 80%). (4) Integration tests against local containers or ephemeral services for DB/storage interactions."',
      senior: '"Same four, plus DE-specific gates: (5) Schema validation tests — verify that model definitions match the target warehouse/lake schemas (e.g., check DDL or migration files). (6) SQL linting with SQLFluff for any raw SQL / dbt models in the repo. (7) Security scanning with Bandit or pip-audit for vulnerable dependencies. (8) Pre-commit hooks for developers so failures are caught locally before pushing. The CI pipeline runs in under 3 minutes because Ruff is instant, pytest runs in parallel with `pytest-xdist`, and dependency caching is configured. A PR cannot merge unless all gates are green. No exceptions for hotfixes — hotfixes that skip CI cause the next incident."',
      interviewerIntent: 'Assessing enterprise engineering rigor: multi-tiered automated gating, SQLFluff linting, dependency vulnerability audits, and fast feedback loops.',
      seniorKeyTakeaways: [
        'Ruff (lint/format) + mypy/pyright (types) + pytest (tests with coverage)',
        'DE gates: SQLFluff for SQL models, schema contract tests, pip-audit for CVEs',
        'Pre-commit hooks for fast local iteration; sub-3-minute CI execution target',
      ],
    },
  },
];

export const PART_04_TESTING_TYPING_DATA: SectionPart = {
  id: 'python-part-04',
  title: 'Part 04: Testing, Types & Data Modeling',
  partNumber: 'Part 04: Testing & Typing',
  subtitle: 'The engineering discipline that separates production pipelines from notebook scripts — type hints, data modeling (dataclass vs Pydantic), testing strategies with pytest, runtime data quality validation, and CI/CD quality gates.',
  summary: 'In-depth coverage of Python type annotations, Protocol-based structural typing, dataclass vs Pydantic trade-offs, pytest fixture architectures and monkeypatching, runtime data quality checking with dead-letter queues, and Ruff/pre-commit CI pipelines.',
  readTimeMinutes: 30,
  terminologies: PART_04_TERMINOLOGIES,
  sections: [
    {
      heading: 'Python typing — what DE actually uses',
      subheading: 'Core annotations, structural subtyping via Protocol, generics, and mypy/pyright',
      content: `Type hints in Python are not about satisfying the compiler — Python doesn't have one. They are about **eliminating the entire class of bugs where data changes shape between pipeline steps**.

### 1.1 Why types matter in DE
In data pipelines, data passes through many transformations:
\`\`\`
API response (raw dict) → Parsed model → Cleaned record → Batched arrow table → Parquet file
\`\`\`
If step 2 expects \`{"user_id": int}\` but step 1 produces \`{"userId": str}\`, without types you find out at 3 a.m. when a downstream SQL query fails with a type mismatch. With type hints and static checking, this is caught at commit time.

---

### 1.2 The basic types you use daily

\`\`\`python
from datetime import datetime, date
from decimal import Decimal
from pathlib import Path

# Primitives
order_id: int = 12345
amount: Decimal = Decimal("99.99")
created_at: datetime = datetime(2026, 9, 4, 12, 0, 0)
source_path: Path = Path("/mnt/lake/bronze")

# Collections (Python 3.9+ built-in generics — don't import List, Dict from typing)
record_ids: list[int] = [1, 2, 3]
column_names: tuple[str, ...] = ("id", "name", "created_at")
unique_keys: set[str] = {"order_id", "customer_id"}
\`\`\`

---

### 1.3 Dicts and mappings

\`\`\`python
# Simple dict: all keys same type, all values same type
config: dict[str, str] = {"env": "prod", "region": "us-east-1"}

# Heterogeneous dict — use TypedDict for structured data
from typing import TypedDict

class RawOrder(TypedDict):
    id: int
    customerId: int
    amountUsd: float
    status: str
    createdAt: str

class CleanOrder(TypedDict):
    order_id: int
    customer_id: int
    amount_cents: int
    status: str
    created_at: datetime
\`\`\`

- \`TypedDict\` gives you type checking on dictionary keys and values without changing the runtime representation — it's still a plain \`dict\` at runtime.
- Excellent for typing JSON API responses before converting to internal models.

---

### 1.4 Optional vs Union

\`\`\`python
# Python 3.10+ union syntax: use | instead of Union/Optional from typing
middle_name: str | None = None          # preferred (replaces Optional[str])
status: str | int = "active"            # union of types

# The #1 bug type hints prevent:
def get_domain(email: str | None) -> str:
    if email is None:
        return "unknown"
    return email.split("@")[1]          # mypy flags this if you forget the \`if email is None\` check!
\`\`\`

Without the type checker, calling \`get_domain(None)\` crashes with \`AttributeError: 'NoneType' object has no attribute 'split'\`. This is the single most common error in production data pipelines.

---

### 1.5 Structural subtyping with \`Protocol\`
Instead of rigid class hierarchies, define interfaces using \`Protocol\` (PEP 544). Any class that implements the methods matches — no inheritance needed:

\`\`\`python
from typing import Protocol, Iterable

class RecordWriter(Protocol):
    """Any sink that can write records."""
    def write(self, records: Iterable[dict]) -> int: ...
    def close(self) -> None: ...

# This class matches RecordWriter without inheriting from it:
class ParquetSink:
    def write(self, records: Iterable[dict]) -> int:
        # implementation
        return 42
    def close(self) -> None:
        pass

# Type checker accepts this:
def load_data(writer: RecordWriter, data: list[dict]) -> None:
    writer.write(data)
    writer.close()

load_data(ParquetSink(), [{"a": 1}])    # passes type checking!
\`\`\`

---

### 1.6 Generics — writing reusable pipeline components

\`\`\`python
from typing import TypeVar, Iterable, Callable

T = TypeVar("T")
U = TypeVar("U")

def map_stream(fn: Callable[[T], U], source: Iterable[T]) -> Iterable[U]:
    """Apply a transform function to a stream of records."""
    for item in source:
        yield fn(item)

def batch_stream(source: Iterable[T], batch_size: int = 1000) -> Iterable[list[T]]:
    """Group an iterable into batches of fixed size."""
    batch: list[T] = []
    for item in source:
        batch.append(item)
        if len(batch) >= batch_size:
            yield batch
            batch = []
    if batch:
        yield batch
\`\`\`

---

### 1.7 Running the type checker

\`\`\`bash
# Install
pip install mypy

# Run on the codebase
mypy mypipe/ --strict
\`\`\`

In \`pyproject.toml\`:
\`\`\`toml
[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
check_untyped_defs = true
\`\`\``,
    },
    {
      heading: 'Data modeling — dataclass vs Pydantic',
      subheading: 'When to pick dataclasses, Pydantic BaseModels, NamedTuples, and validation trade-offs',
      content: `The data engineering toolkit has three primary data modeling tools. Choosing the right one is an interview staple.

### 2.1 \`dataclass\` — fast, internal, stdlib

\`\`\`python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass(frozen=True, slots=True)
class Order:
    order_id: int
    customer_id: int
    amount_usd: float
    created_at: datetime
    tags: list[str] = field(default_factory=list)

    @property
    def amount_cents(self) -> int:
        return int(round(self.amount_usd * 100))
\`\`\`

- \`frozen=True\` makes instances **immutable** (cannot modify fields after creation; hashable). Immutable data models prevent accidental mutation bugs in pipelines.
- \`slots=True\` (Python 3.10+) eliminates the per-instance \`__dict__\`, reducing memory usage by ~40% and speeding up attribute access.
- **Limitation:** No runtime type validation. \`Order(order_id="not_an_int", ...)\` succeeds without error.

---

### 2.2 \`Pydantic\` — boundary validation, parsing, serialization

\`\`\`python
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator

class OrderInbound(BaseModel):
    """Validates raw incoming data from an external API or file."""
    order_id: int = Field(..., alias="id", gt=0)
    customer_id: int = Field(..., alias="customerId", gt=0)
    amount: Decimal = Field(..., max_digits=12, decimal_places=2, gt=0)
    status: str = Field(default="PENDING")
    created_at: datetime = Field(..., alias="createdAt")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed = {"PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"}
        if v.upper() not in allowed:
            raise ValueError(f"invalid status: {v}, must be one of {allowed}")
        return v.upper()

    model_config = {"populate_by_name": True}
\`\`\`

- Parses and validates at runtime: \`OrderInbound(id="123", ...)\` coerces \`"123"\` to \`123\`.
- Raises \`ValidationError\` with field-level error details on bad input.
- Automatically handles aliases (\`customerId\` → \`customer_id\`).

---

### 2.3 \`NamedTuple\` — when tuples are enough

\`\`\`python
from typing import NamedTuple

class Coordinate(NamedTuple):
    lat: float
    lon: float
\`\`\`

Memory-lightest option. Supports tuple unpacking and indexing: \`lat, lon = coord\`.

---

### 2.4 Comparison table

| Feature | \`dataclass\` | \`Pydantic BaseModel\` | \`NamedTuple\` | Plain \`dict\` |
|---|---|---|---|---|
| Source | stdlib | \`pydantic\` (3rd party) | stdlib | stdlib |
| Runtime validation | No | Yes (strict or coerced) | No | No |
| Memory per instance | Low (\`slots=True\`) | Moderate | Lowest | High |
| Construction speed | Fast (~100ns) | Slower (~1–5µs) | Fastest (~50ns) | Fast |
| Immutability | \`frozen=True\` | \`frozen=True\` in config | Always immutable | Mutable |
| Serialization | \`asdict()\` | \`.model_dump()\`, \`.model_dump_json()\` | \`._asdict()\` | Native |
| Aliasing / coercion | Manual | Built-in | Manual | Manual |
| **Best used for** | Internal pipeline DTOs | Boundaries (API, config, ingest) | Small records, coords | Ad-hoc / bulk ETL |

---

### 2.5 The Senior Architecture Pattern: Validate at the Boundary
\`\`\`
[External World]               [Pipeline Core]
Raw JSON/CSV   ──Pydantic──>   Validated DTO   ──dataclass/dict──>   Transform & Sink
(untrusted)    (validates)     (typed)         (fast, lean)          (Parquet/Lake)
\`\`\`

Do not pass Pydantic models through every layer of a high-throughput pipeline. Validate at the boundary, convert to a dataclass or typed dict, and process at maximum speed.`,
    },
    {
      heading: 'pytest — the standard DE test framework',
      subheading: 'Fixtures, scopes, parameterization, mocking HTTP, and temp file isolation',
      content: `### 3.1 Test structure

\`\`\`
tests/
├── conftest.py              # Shared fixtures
├── unit/
│   ├── test_transforms.py   # Pure function tests (fast, no I/O)
│   ├── test_models.py       # Pydantic/dataclass validation
│   └── test_pagination.py   # Paginator logic with mocked responses
├── integration/
│   ├── test_api_client.py   # HTTP client with recorded/mocked endpoints
│   └── test_parquet_sink.py # Local DuckDB/pyarrow read/write tests
└── test_data/
    ├── sample_orders.json
    └── sample_orders.csv
\`\`\`

Run with:
\`\`\`bash
pytest tests/unit/ -v                  # unit tests only (sub-second)
pytest tests/ -v -m "not integration"  # skip slow tests
pytest --cov=mypipe --cov-report=term  # test coverage
\`\`\`

---

### 3.2 Fixtures — reusable test context

\`\`\`python
# tests/conftest.py
import pytest
from datetime import datetime

@pytest.fixture
def sample_raw_order() -> dict:
    """A realistic single raw order from the source API."""
    return {
        "id": 1001,
        "customerId": 42,
        "amountUsd": 129.99,
        "status": "shipped",
        "createdAt": "2026-09-04T10:30:00Z",
        "shippingAddress": {"country": "US", "postalCode": "94105"},
    }

@pytest.fixture
def sample_orders_batch(sample_raw_order) -> list[dict]:
    """A batch of 100 orders for volume testing."""
    return [{**sample_raw_order, "id": i} for i in range(1, 101)]
\`\`\`

**Fixture scopes:**
- \`scope="function"\` (default) — re-run for every test (clean state).
- \`scope="module"\` — run once per test file (e.g., set up a local DuckDB connection).
- \`scope="session"\` — run once per entire test run (e.g., spin up a test container).

---

### 3.3 Parametrize — test all the edge cases

\`\`\`python
# tests/unit/test_transforms.py
import pytest
from mypipe.transforms import parse_amount_to_cents

@pytest.mark.parametrize(
    "input_val, expected_cents",
    [
        (100.0, 10000),
        (0.01, 1),
        (0.0, 0),
        ("99.99", 9999),
        (1234.567, 123457),       # rounding
        (None, None),
    ],
    ids=["whole_dollar", "one_cent", "zero", "string_input", "rounding", "none_input"],
)
def test_parse_amount_to_cents(input_val, expected_cents):
    assert parse_amount_to_cents(input_val) == expected_cents
\`\`\`

\`ids=\` gives each test case a readable name in test output.

---

### 3.4 Mocking HTTP with \`responses\` (better than \`unittest.mock\`)
\`responses\` mocks requests at the HTTP layer, testing URL parsing, headers, and query parameters:

\`\`\`python
# tests/unit/test_api_client.py
import responses
from mypipe.sources.rest import fetch_orders_page

@responses.activate
def test_fetch_orders_handles_pagination():
    # Mock page 1
    responses.add(
        responses.GET,
        "https://api.example.com/orders",
        json={"data": [{"id": 1}], "next_cursor": "cur_page2"},
        status=200,
        match=[responses.matchers.query_param_matcher({"limit": "500"})],
    )
    # Mock page 2 (final)
    responses.add(
        responses.GET,
        "https://api.example.com/orders",
        json={"data": [{"id": 2}], "next_cursor": None},
        status=200,
        match=[responses.matchers.query_param_matcher({"limit": "500", "cursor": "cur_page2"})],
    )

    records = list(fetch_orders_page("https://api.example.com/orders"))
    assert len(records) == 2
    assert [r["id"] for r in records] == [1, 2]
\`\`\`

---

### 3.5 \`monkeypatch\` — replacing environment variables in tests

\`\`\`python
def test_config_loads_from_env(monkeypatch):
    monkeypatch.setenv("MYPIPE_DB_HOST", "test-db.local")
    monkeypatch.setenv("MYPIPE_DB_PORT", "5433")
    monkeypatch.setenv("MYPIPE_DB_USER", "test_user")
    monkeypatch.setenv("MYPIPE_DB_PASSWORD", "test_pass")

    settings = DbSettings()
    assert settings.host == "test-db.local"
    assert settings.port == 5433
\`\`\`

\`monkeypatch\` guarantees the env vars are restored after the test completes — no leaking between tests.

---

### 3.6 Temp files with \`tmp_path\` (built-in pytest fixture)

\`\`\`python
def test_atomic_parquet_write(tmp_path):
    output_file = tmp_path / "output.parquet"
    data = [{"id": 1, "val": "a"}, {"id": 2, "val": "b"}]

    write_parquet(data, output_file)

    assert output_file.exists()
    assert not output_file.with_suffix(".parquet.tmp").exists()  # no leftover tmp file
\`\`\``,
    },
    {
      heading: 'Testing DE pipelines — what and how to test',
      subheading: 'Testing transforms, error handling, DuckDB integration, and idempotency proofs',
      content: `### 4.1 The testing pyramid in DE

\`\`\`
       /\\
      /  \\     E2E / Pipeline Smoke Tests (few, run in CI on staging)
     /────\\    Integration Tests: DuckDB / local Parquet / mocked APIs
    /──────\\   Unit Tests: pure transforms, schema validation, edge cases
\`\`\`

- **70% Unit tests:** Transforms are pure functions (\`dict → dict\`). No I/O, no network, no database. Fast (1000s per second).
- **20% Integration tests:** Test the I/O boundaries. Write Parquet to a local temp folder, read back with DuckDB, assert row counts and types.
- **10% End-to-end smoke tests:** Run the full pipeline with a sample dataset through an ephemeral target.

---

### 4.2 Testing pure transformations

\`\`\`python
def test_flatten_order_handles_missing_address(sample_raw_order):
    sample_raw_order["shippingAddress"] = None
    result = flatten_order(sample_raw_order)
    assert result["country"] is None
    assert result["postal_code"] is None

def test_flatten_order_corrupted_amount():
    with pytest.raises(ValueError, match="invalid amount"):
        flatten_order({"id": 1, "amountUsd": "not_a_number"})
\`\`\`

---

### 4.3 Testing local sinks with DuckDB
DuckDB is the secret weapon for testing data pipelines locally — it reads Parquet files directly with SQL:

\`\`\`python
import duckdb

def test_parquet_sink_produces_correct_schema(tmp_path):
    out_dir = tmp_path / "orders"
    records = [
        {"order_id": 1, "amount": 100.50, "status": "COMPLETED"},
        {"order_id": 2, "amount": 200.00, "status": "PENDING"},
    ]
    write_parquet(records, out_dir / "part-0.parquet")

    # Query the Parquet file directly with DuckDB
    con = duckdb.connect()
    result = con.execute(f"SELECT count(*), sum(amount) FROM '{out_dir}/*.parquet'").fetchall()

    assert result[0] == (2, 300.50)
\`\`\`

---

### 4.4 Testing idempotency
To prove a pipeline step is idempotent, write a test that runs it **twice**:

\`\`\`python
def test_sink_is_idempotent(tmp_path):
    target = tmp_path / "orders_target"
    batch = [{"order_id": 1, "status": "A"}, {"order_id": 2, "status": "B"}]

    # First run
    run_merge(batch, target)
    con = duckdb.connect()
    count_1 = con.execute(f"SELECT count(*) FROM '{target}/*.parquet'").fetchone()[0]

    # Second run with same data
    run_merge(batch, target)
    count_2 = con.execute(f"SELECT count(*) FROM '{target}/*.parquet'").fetchone()[0]

    assert count_1 == count_2 == 2      # No duplicates created!
\`\`\``,
    },
    {
      heading: 'Data quality checks — runtime validation',
      subheading: 'Boundary validation, quarantine sidecars, reject-rate circuit breakers, and tools',
      content: `Unit tests verify that code works before deployment. **Data quality checks verify that data conforms at runtime.**

### 5.1 Ingest-time vs post-load checks

| Check Type | When | Action on Failure | Example |
|---|---|---|---|
| **Ingest validation** | As data enters the pipeline | Route to quarantine; abort if % too high | Null checks, type checks, enum validation |
| **Pipeline invariant** | Between pipeline steps | Fail the step immediately | \`rows_in - rows_out - rows_rejected == 0\` |
| **Warehouse assertion** | After load completes | Alert on-call; block downstream models | Uniqueness of PK, referential integrity |

---

### 5.2 Lightweight runtime checks without heavy frameworks
You don't need a heavy framework for simple checks. A clean class:

\`\`\`python
class DataQualityError(Exception): ...

class QualityChecker:
    @staticmethod
    def check_non_null(records: list[dict], fields: list[str]) -> list[dict]:
        """Verify required fields are not None."""
        failing = []
        for i, r in enumerate(records):
            for f in fields:
                if r.get(f) is None:
                    failing.append({"row_index": i, "field": f, "error": "NULL_NOT_ALLOWED"})
        return failing

    @staticmethod
    def check_unique(records: list[dict], key_field: str) -> list[dict]:
        """Verify primary key is unique."""
        seen: set = set()
        duplicates = []
        for i, r in enumerate(records):
            val = r.get(key_field)
            if val in seen:
                duplicates.append({"row_index": i, "field": key_field, "error": f"DUPLICATE_KEY: {val}"})
            seen.add(val)
        return duplicates
\`\`\`

---

### 5.3 The Quarantine / Dead-Letter pattern

\`\`\`python
from dataclasses import dataclass

@dataclass
class IngestionResult:
    valid_records: list[dict]
    quarantined_records: list[dict]

def validate_and_route(records: list[dict], threshold: float = 0.05) -> IngestionResult:
    valid: list[dict] = []
    quarantine: list[dict] = []

    for r in records:
        try:
            model = OrderInbound(**r)
            valid.append(model.model_dump())
        except Exception as e:
            quarantine.append({
                "raw_payload": r,
                "error": str(e),
                "rejected_at": datetime.utcnow().isoformat(),
            })

    total = len(records)
    if total > 0 and len(quarantine) / total > threshold:
        raise DataQualityError(
            f"Reject rate {len(quarantine)/total:.1%} exceeds threshold {threshold:.1%} "
            f"({len(quarantine)}/{total} rows rejected). Aborting."
        )

    return IngestionResult(valid_records=valid, quarantined_records=quarantine)
\`\`\`

---

### 5.4 Specialized frameworks (when to reach for them)
- **dbt tests** — Best for SQL/warehouse-level checks (uniqueness, not_null, accepted_values, relationships). If you use dbt, use dbt tests.
- **Great Expectations (GX)** — Rich assertion library with automated data docs. Good for enterprise compliance, but heavy configuration.
- **Soda Core (SodaCL)** — YAML-based data quality checks. Lightweight, readable, good for lakehouse/warehouse checks.`,
    },
    {
      heading: 'Linting, formatting, and CI gates',
      subheading: 'Ruff configuration, pre-commit hooks, and modern sub-3-minute GitHub Actions workflows',
      content: `### 6.1 Ruff — the modern standard
Ruff replaces flake8, isort, black, pyupgrade, and pydocstyle. It runs in milliseconds.

In \`pyproject.toml\`:
\`\`\`toml
[tool.ruff]
target-version = "py311"
line-length = 100

[tool.ruff.lint]
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # pyflakes (unused imports, undefined vars)
    "I",    # isort (import sorting)
    "B",    # flake8-bugbear (common bugs)
    "UP",   # pyupgrade (modernize syntax)
    "S",    # flake8-bandit (security checks)
]
ignore = ["E501"]  # line length handled by formatter
\`\`\`

Commands:
\`\`\`bash
ruff check .           # lint
ruff check --fix .     # lint and auto-fix
ruff format .          # format (replaces black)
\`\`\`

---

### 6.2 Pre-commit hooks
Run checks automatically before \`git commit\`:

\`\`\`yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [pydantic, types-requests]
\`\`\`

---

### 6.3 Minimal CI workflow (\`.github/workflows/ci.yml\`)

\`\`\`yaml
name: CI Quality Gate
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: "pip"
      - run: pip install -e ".[dev]"
      - name: Lint with Ruff
        run: ruff check . && ruff format --check .
      - name: Type check with Mypy
        run: mypy mypipe/
      - name: Run unit tests
        run: pytest tests/unit/ -v --cov=mypipe --cov-fail-under=80
\`\`\`

This runs in under 90 seconds and catches 95% of bugs before human code review.`,
    },
    {
      heading: 'Putting it together — a complete tested module',
      subheading: 'Production transform module and companion pytest suite illustrating best practices',
      content: `The implementation (\`mypipe/transforms/orders.py\`):

\`\`\`python
from __future__ import annotations
from datetime import datetime
from decimal import Decimal, InvalidOperation
from typing import TypedDict

class CleanOrder(TypedDict):
    order_id: int
    customer_id: int
    amount_cents: int
    country: str | None
    created_at: str

def parse_order(raw: dict) -> CleanOrder:
    """Parse and clean a single raw order record.
    Raises ValueError on invalid required fields.
    """
    try:
        order_id = int(raw["id"])
    except (KeyError, ValueError, TypeError) as e:
        raise ValueError(f"invalid order_id: {raw.get('id')}") from e

    try:
        customer_id = int(raw["customerId"])
    except (KeyError, ValueError, TypeError) as e:
        raise ValueError(f"invalid customer_id: {raw.get('customerId')}") from e

    try:
        amount_usd = Decimal(str(raw["amountUsd"]))
        if amount_usd <= 0:
            raise ValueError(f"amount must be positive: {amount_usd}")
        amount_cents = int(round(amount_usd * 100))
    except (KeyError, InvalidOperation) as e:
        raise ValueError(f"invalid amountUsd: {raw.get('amountUsd')}") from e

    addr = raw.get("shippingAddress") or {}
    country = addr.get("country")

    created_at = str(raw.get("createdAt", ""))
    if not created_at:
        raise ValueError("missing createdAt")

    return {
        "order_id": order_id,
        "customer_id": customer_id,
        "amount_cents": amount_cents,
        "country": country,
        "created_at": created_at,
    }
\`\`\`

The companion test suite (\`tests/unit/test_order_transform.py\`):

\`\`\`python
import pytest
from mypipe.transforms.orders import parse_order

@pytest.fixture
def valid_order() -> dict:
    return {
        "id": "1001",
        "customerId": "42",
        "amountUsd": "99.95",
        "createdAt": "2026-09-04T12:00:00Z",
        "shippingAddress": {"country": "US"},
    }

def test_parse_valid_order(valid_order):
    result = parse_order(valid_order)
    assert result["order_id"] == 1001
    assert result["customer_id"] == 42
    assert result["amount_cents"] == 9995
    assert result["country"] == "US"
    assert result["created_at"] == "2026-09-04T12:00:00Z"

def test_parse_order_without_address(valid_order):
    valid_order["shippingAddress"] = None
    result = parse_order(valid_order)
    assert result["country"] is None

@pytest.mark.parametrize(
    "corrupt_key, corrupt_val, error_match",
    [
        ("id", "not_a_number", "invalid order_id"),
        ("id", None, "invalid order_id"),
        ("customerId", "abc", "invalid customer_id"),
        ("amountUsd", "-5.00", "amount must be positive"),
        ("amountUsd", "invalid", "invalid amountUsd"),
        ("createdAt", "", "missing createdAt"),
    ],
)
def test_parse_order_rejects_bad_data(valid_order, corrupt_key, corrupt_val, error_match):
    valid_order[corrupt_key] = corrupt_val
    with pytest.raises(ValueError, match=error_match):
        parse_order(valid_order)
\`\`\``,
    },
    {
      heading: 'Common mistakes (interview traps)',
      subheading: 'Fourteen testing, typing, and data modeling anti-patterns to avoid',
      content: `| Mistake | Why it fails | Fix |
|---|---|---|
| Using Pydantic models for millions of records in a loop | High memory, slow instantiation | Validate at boundary; use dict/dataclass internally |
| No \`None\` checks on \`Optional\` fields | \`AttributeError: 'NoneType' has no attribute ...\` | Static checking with mypy forces \`if x is not None\` |
| Testing against real APIs in unit tests | Slow, flaky, requires network and credentials | Mock HTTP with \`responses\` or \`respx\` |
| Testing against production database | Modifies real data, breaks when shared | Use DuckDB locally or testcontainers |
| Relying on \`assert\` without running pytest | \`assert\` in production code can be disabled with \`-O\` | Use explicit \`raise ValueError\` in library code |
| Mocking everything in integration tests | Tests pass but real pipeline fails | Mock only external network boundaries; run real file I/O |
| Skipping type hints on function signatures | Mypy skips untyped functions by default | \`disallow_untyped_defs = true\` in mypy config |
| Hard-coding test file paths | Tests fail when run from different directories | Use \`tmp_path\` fixture for generated test files |
| No test for idempotency | Duplicate writes in production after failure | Write tests that execute the sink twice and assert count |
| Catching \`Exception\` and silently ignoring bad rows | Data loss without visibility | Route to quarantine / DLQ with error context |
| No reject-rate threshold | Upstream schema drift silently drops 90% of rows | Circuit-breaker: abort if reject rate > 5% |
| Committing without running the linter | CI breaks for everyone on simple formatting | Pre-commit hooks with Ruff |
| Using \`unittest.mock.patch\` with string import paths | Breaks silently when modules are renamed | Dependency injection: pass mocks via arguments |
| Writing tests after the pipeline is in prod | Tests never get written; regressions happen | Write transform tests alongside transform logic |`,
    },
    {
      heading: 'Follow-up questions a senior interviewer will actually ask',
      subheading: 'Tough architectural and verification questions in testing rounds',
      content: `- **"Your pipeline processes 50M rows/day. Pydantic validation adds 15 minutes. How do you optimize without losing safety?"**
- **"How do you test a pipeline step that calls a Snowflake MERGE without having a live Snowflake account in CI?"**
- **"Show me how you\'d design a test for an incremental watermark pipeline to prove it doesn\'t miss late-arriving records."**
- **"A vendor adds a new required field to their API response without notice. Walk me through what happens in your pipeline from ingest to alert."**
- **"How do you test that a retry decorator with exponential backoff actually waits the right amount of time without making the test suite slow?"**
- **"What\'s the difference between testing data pipelines and testing web applications?"**
- **"How would you implement a schema drift detection test that alerts when a source table adds or drops columns?"**`,
    },
    {
      heading: 'Hands-on exercises',
      subheading: 'Five testing, typing, and quality-checking implementation exercises',
      content: `### Exercise 1 — Pure transform test suite
Take the \`flatten_customer\` function from Part 02 §2.6. Write a comprehensive pytest test suite covering: happy path, missing optional fields, \`None\` address, corrupted types, and unexpected extra fields. Use \`@pytest.mark.parametrize\` for boundary cases. Target 100% branch coverage.

### Exercise 2 — Paginator unit test with \`responses\`
Write unit tests for the \`paginate_cursor\` function from Part 03 §3.5. Mock a 3-page API response using the \`responses\` library. Test: (a) all records yielded in order, (b) terminates when \`next_cursor\` is \`None\`, (c) raises on HTTP 500, (d) retries on HTTP 429 and eventually succeeds.

### Exercise 3 — Boundary validator with Quarantine
Implement \`validate_batch(records: list[dict], schema: type[BaseModel]) -> BatchResult\` that validates each record, separates valid records from invalid ones, writes invalid records to a \`.dlq.jsonl\` file with error metadata, and raises \`CircuitBreakerError\` if more than 10% of records fail. Write tests proving both the happy path and the circuit breaker trigger.

### Exercise 4 — Local DuckDB integration test
Write a test that: (a) generates 1,000 synthetic order records, (b) writes them to a partitioned Parquet dataset using \`pyarrow\`, (c) queries the dataset with DuckDB to verify row counts, column types, and partition pruning, (d) runs the write a second time with 100 updated records and tests MERGE behavior. Use \`tmp_path\`.

### Exercise 5 — CI quality gate setup
Create a minimal project layout with \`pyproject.toml\`, configure Ruff and Mypy with strict settings, add a pre-commit configuration, and write a GitHub Actions workflow that runs linting, type checking, and tests with coverage enforcement. Prove that a deliberate type error causes CI to fail.`,
    },
    {
      heading: 'Quick revision — the 20 bullets',
      subheading: 'Rapid 3-minute checklist of Python testing, typing, and quality engineering',
      content: `1. Type hints + static checking (mypy/pyright) eliminate runtime shape mismatch bugs.
2. Use \`str | None\` (not \`Optional[str]\`) in Python 3.10+.
3. Handling \`None\` before accessing attributes prevents the #1 production runtime error.
4. Use \`Protocol\` for structural subtyping (interfaces without inheritance).
5. \`dataclass(slots=True, frozen=True)\` for fast, memory-efficient internal DTOs.
6. \`Pydantic BaseModel\` for boundary validation (API, config, external files).
7. Validate at the boundary; process internally with lean dataclasses or dicts.
8. Structure tests: 70% pure transform unit tests, 20% integration, 10% E2E smoke.
9. Transforms should be pure functions (\`dict → dict\`) with zero I/O for instant testing.
10. Use \`responses\` or \`respx\` to mock HTTP requests at the network layer.
11. Use \`tmp_path\` fixture for isolated, parallel-safe file-based tests.
12. Use \`monkeypatch.setenv\` to safely test environment variable configuration.
13. Use \`@pytest.mark.parametrize\` to test multiple edge cases with a single test function.
14. Use DuckDB to query local Parquet files in integration tests without a cloud warehouse.
15. Test idempotency by running the sink twice and asserting identical state.
16. Never silently drop bad data; route to a quarantine / Dead Letter Queue (DLQ) with error metadata.
17. Implement a circuit breaker: abort if the reject rate exceeds a threshold (e.g., 5%).
18. Use Ruff for sub-second linting and formatting — replaces flake8, isort, and black.
19. Run mypy in strict mode in CI as a mandatory merge gate.
20. The four CI gates on every PR: **Ruff (lint) → Mypy (types) → Pytest (tests) → Coverage (threshold)**.`,
    },
  ],
};
