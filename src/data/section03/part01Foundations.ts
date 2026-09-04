import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_01_TERMINOLOGIES: TermItem[] = [
  {
    term: 'Object',
    definition: 'Everything in Python. Every value — 42, "x", a function, a class, a module — is an object with an identity (id()), a type (type()), and a value.',
    category: 'Core Model',
    highlight: true,
  },
  {
    term: 'Reference',
    definition: 'A name (variable) is a label bound to an object, not a box that holds the object. a = b makes a point to the same object as b, not a copy of it.',
    category: 'Core Model',
    highlight: true,
  },
  {
    term: 'Mutable / immutable',
    definition: 'Immutable objects (int, float, str, tuple, frozenset, bytes) cannot change in place. Mutable objects (list, dict, set, most user classes) can. This distinction drives most Python bugs interviewers ask about.',
    category: 'Core Model',
    highlight: true,
  },
  {
    term: 'Hashable',
    definition: 'An object whose __hash__ is stable for its lifetime and whose __eq__ is consistent with it. Immutable built-ins are hashable; mutable ones aren\'t. Only hashable objects can be dict keys or set members.',
    category: 'Data Structures',
  },
  {
    term: 'Iterable',
    definition: 'Any object that can produce an iterator via iter(obj). list, dict, str, files, generators, range.',
    category: 'Iteration',
  },
  {
    term: 'Iterator',
    definition: 'An object with __next__() that returns the next value or raises StopIteration. Iterators are single-pass and stateful.',
    category: 'Iteration',
    highlight: true,
  },
  {
    term: 'Generator',
    definition: 'A function that uses yield. Calling it returns an iterator that produces values lazily, one at a time, holding almost no memory. The workhorse of streaming pipelines.',
    category: 'Iteration',
    highlight: true,
  },
  {
    term: 'Comprehension',
    definition: 'Compact syntax for building a list, dict, set, or generator by iterating and filtering. Faster than the equivalent for loop because the loop is executed in the C layer.',
    category: 'Execution',
  },
  {
    term: 'First-class function',
    definition: 'Functions in Python are objects — you can pass them, return them, store them in a dict. This is what makes decorators, callbacks, and functional patterns possible.',
    category: 'Functions',
  },
  {
    term: 'Closure',
    definition: 'A nested function that captures variables from its enclosing scope. Lives on after the outer function returns.',
    category: 'Functions',
  },
  {
    term: 'Decorator',
    definition: 'A callable that takes a function and returns a (usually wrapped) function. @retry on top of def fetch(): ... is just fetch = retry(fetch).',
    category: 'Functions',
    highlight: true,
  },
  {
    term: 'LEGB',
    definition: 'Name resolution order: Local → Enclosing → Global → Built-in. Not "the file" — the function scope chain.',
    category: 'Execution',
  },
  {
    term: 'GIL (Global Interpreter Lock)',
    definition: 'CPython\'s mutex that lets only one thread execute Python bytecode at a time. This is why threads help I/O-bound work but not CPU-bound work. Multiprocessing sidesteps it.',
    category: 'Concurrency',
    highlight: true,
  },
  {
    term: 'EAFP / LBYL',
    definition: '"Easier to Ask Forgiveness than Permission" (try/except around the operation) vs. "Look Before You Leap" (if key in d: ...). Python idiom is EAFP; it\'s faster on the happy path and race-free.',
    category: 'Idioms',
  },
  {
    term: 'Duck typing',
    definition: '"If it walks like a duck…" — the object\'s behavior matters, not its declared type. Interfaces are implicit. Type hints are for tooling, not enforcement.',
    category: 'Type System',
  },
  {
    term: '__init__ / __new__',
    definition: '__new__ allocates the object, __init__ initializes it. You will almost never override __new__.',
    category: 'OOP',
  },
  {
    term: 'Dunder / magic method',
    definition: 'Methods with double underscores like __len__, __iter__, __eq__, __hash__. They plug your class into the language\'s built-in protocols.',
    category: 'OOP',
  },
  {
    term: 'Dataclass',
    definition: 'A class where @dataclass auto-generates __init__, __repr__, and __eq__ from type-annotated attributes. The DE default for "value objects" (records, config, DTOs).',
    category: 'OOP & Modeling',
    highlight: true,
  },
  {
    term: 'Context manager',
    definition: 'Any object usable in with — implements __enter__ and __exit__. Guarantees cleanup (file close, connection release, span end) even on exception.',
    category: 'Resource Management',
    highlight: true,
  },
];

export const FOUNDATIONS_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'python-q1-list-vs-tuple',
    number: 1,
    question: "What's the difference between a list and a tuple, and when would you use each?",
    topic: 'Data Structures',
    subtopic: 'List vs Tuple',
    answers: {
      basic: '"Lists are mutable, tuples are immutable."',
      strong: '"Lists are for homogeneous, variable-length collections you\'ll grow and mutate. Tuples are for fixed-shape records — the position has meaning. Tuples are hashable, so they work as dict keys and set members."',
      senior: '"In DE code I use tuples for composite keys — `(region, order_date)` for a bucketed groupby dict — and for multiple return values. I use lists for row buffers. For actual record objects I skip both and use a frozen dataclass, because I want field names, type hints, and `__eq__` for free, plus hashability for dedup."',
      interviewerIntent: 'Testing if you understand mutability vs immutability, memory implications, and real data engineering patterns like composite dictionary keys vs record classes.',
      seniorKeyTakeaways: [
        'Tuples for composite hashable keys: (region, order_date)',
        'Lists for dynamic row accumulation buffers',
        'Frozen dataclass with slots for production domain records',
      ],
    },
  },
  {
    id: 'python-q2-mutable-default-arg',
    number: 2,
    question: 'Why is a mutable default argument a bug?',
    topic: 'Language Foundations',
    subtopic: 'Default Arguments',
    answers: {
      basic: '"It\'s shared across calls."',
      strong: '"Default arguments are evaluated once at function-definition time, so the same list/dict object is reused on every call that doesn\'t override it."',
      senior: '"Same as strong, plus: this bites hardest in DE pipelines where a helper\'s default `buffer=[]` accumulates rows silently across job steps and shows up as duplicates in downstream tables. The fix is the `None`-sentinel pattern. For dataclass fields the analog is `field(default_factory=list)` — for the same reason."',
      interviewerIntent: 'Checking if you know when default arguments are evaluated (at `def` time in CPython) and the concrete downstream impact on ETL pipeline state.',
      seniorKeyTakeaways: [
        'Defaults evaluated once at definition time in the module namespace',
        'Use None sentinel pattern inside functions',
        'Use field(default_factory=list) for dataclasses',
      ],
    },
  },
  {
    id: 'python-q3-generators-vs-lists',
    number: 3,
    question: 'Explain generators and when you\'d use one over a list.',
    topic: 'Iteration & Streaming',
    subtopic: 'Generators',
    answers: {
      basic: '"A generator uses yield and produces values lazily."',
      strong: '"It implements the iterator protocol, so it\'s single-pass and holds only one value at a time. I use one when I don\'t need random access and the collection may not fit in memory."',
      senior: '"It\'s the canonical way to stream files or paginated APIs through a transformation pipeline in constant memory — the Python analog of Spark\'s lazy DAG. You compose them by chaining generator functions; nothing runs until something consumes the end of the chain. The trade-offs I watch for: they\'re single-pass — pass a generator into two consumers and the second sees nothing — and exceptions raised inside show up at the consumer, not the producer, which can confuse logging if you\'re not disciplined about it."',
      interviewerIntent: 'Testing memory efficiency at scale, streaming ETL architecture, and awareness of iterator pitfalls (single-pass exhaustion, deferred exceptions).',
      seniorKeyTakeaways: [
        'Lazy evaluation analog to Spark execution DAGs',
        'Constant memory O(1) streaming pipeline composition',
        'Pitfall: single-pass exhaustion when passed to multiple consumers',
      ],
    },
  },
  {
    id: 'python-q4-gil-in-practice',
    number: 4,
    question: 'What does the GIL mean for you in practice?',
    topic: 'Concurrency',
    subtopic: 'Global Interpreter Lock',
    answers: {
      basic: '"Only one thread runs Python at a time."',
      strong: '"It means threads don\'t help CPU-bound Python code, but they do help I/O-bound code because threads release the GIL while waiting on the OS."',
      senior: '"For DE that means threads (or `asyncio`) are the right tool for parallelizing HTTP calls, DB queries, and blob reads, and processes (or Spark) are the right tool for anything CPU-heavy. In practice I use `ThreadPoolExecutor` with a bounded `max_workers` that matches the source\'s rate limit, treat that number as a config knob, and reach for `asyncio` only when the library is already async or the fan-out is in the hundreds."',
      interviewerIntent: 'Testing if you can choose the correct concurrency model (ThreadPoolExecutor vs ProcessPoolExecutor vs distributed Spark) without falling for myths.',
      seniorKeyTakeaways: [
        'Threads release GIL during OS I/O wait calls (HTTP, sockets, disk)',
        'ThreadPoolExecutor with rate-limit-bounded max_workers is default for I/O fan-out',
        'Push CPU-heavy data transformations to Spark, Polars, or C extensions',
      ],
    },
  },
  {
    id: 'python-q5-stream-50gb-json',
    number: 5,
    question: 'How would you process a 50 GB JSON-lines file on a small VM?',
    topic: 'Streaming & Systems',
    subtopic: 'Large File Processing',
    answers: {
      basic: '"Read it line by line."',
      strong: '"Open the file and iterate — file objects are lazy — parse each line with `json.loads`, transform, and write. Never call `.readlines()`."',
      senior: '"Compose a generator pipeline: `read → parse → validate → transform → batch → write`. Constant memory, one pass. I\'d micro-batch on the sink with `itertools.batched` for throughput, wrap the outer loop in a context manager that tracks bytes-read and records-written for observability, and make each stage a pure function of the previous stage\'s iterator so I can unit-test them independently. If parsing itself is CPU-bound and dominates, that\'s the moment I\'d stop scaling Python and put it in Spark or use `orjson` + `ProcessPoolExecutor`."',
      interviewerIntent: 'Evaluating full-lifecycle streaming design: generator composition, micro-batching, memory bounds, observability metrics, and knowing when to hand off to distributed compute.',
      seniorKeyTakeaways: [
        'Iterate file object line-by-line (never .readlines() or json.load())',
        'Micro-batch on sink using itertools.batched(..., 50000)',
        'Instrument with bytes-in / rows-out metrics via context manager',
      ],
    },
  },
  {
    id: 'python-q6-is-vs-double-equals',
    number: 6,
    question: 'is vs == in Python?',
    topic: 'Language Foundations',
    subtopic: 'Identity vs Equality',
    answers: {
      basic: '"`is` is identity, `==` is equality."',
      strong: '"`is` compares object identity (`id(x) == id(y)`). `==` calls `__eq__`. Use `is` for singletons — `None`, `True`, `False` — and `==` for value comparison."',
      senior: '"Same, and beware: small ints and interned strings sometimes make `is` accidentally work for equal values, which teaches junior engineers the wrong lesson. The rule is simple: `x is None` for the sentinel check, `x == y` for value comparison. Getting this wrong on custom classes with overridden `__eq__` — say a `dataclass` — produces bugs that only appear when the object is reconstructed rather than reused."',
      interviewerIntent: 'Testing subtle identity traps in CPython, singleton comparisons, and handling equality in custom dataclasses.',
      seniorKeyTakeaways: [
        'is checks identity pointer (id(x) == id(y))',
        '== invokes __eq__ for structural value equality',
        'Always use is None for sentinels, never == None',
      ],
    },
  },
];

export const PART_01_FOUNDATIONS_DATA: SectionPart = {
  id: 'python-part-01',
  title: 'Part 01: Foundations & The Python Model',
  partNumber: 'Part 01: Foundations',
  subtitle: 'The Python you actually need to defend in a senior DE interview — data structures, iteration model, functions, exceptions, generators, and just-enough OOP.',
  summary: 'A depth pass on the internal mechanics that show up in code reviews and senior system-design questions: object references, mutability traps, streaming generators, decorator mechanics, and concurrency primitives.',
  readTimeMinutes: 25,
  terminologies: PART_01_TERMINOLOGIES,
  sections: [
    {
      heading: 'The mental model that runs through everything',
      subheading: 'Four non-negotiable rules behind every weird Python bug in data pipelines',
      content: `Before we touch any topic, internalize four rules. Every "weird Python bug" in DE code comes from breaking one.

### Rule 1 — Names are references, not boxes

\`\`\`python
a = [1, 2, 3]
b = a          # b now points to the SAME list
b.append(4)
print(a)       # [1, 2, 3, 4]  — a and b are the same object
\`\`\`

- \`a = b\` never copies. It rebinds the name.
- To copy: \`b = a.copy()\` (shallow) or \`copy.deepcopy(a)\` (recursive).
- **Interview signal:** engineers who say *"I passed the dataframe into the function and the caller's version changed too"* don't understand this.

---

### Rule 2 — Mutability decides what's safe

- **Immutable** (\`int\`, \`str\`, \`tuple\`, \`frozenset\`): safe to share, safe as dict keys, safe as function defaults.
- **Mutable** (\`list\`, \`dict\`, \`set\`, most objects): unsafe to share across threads without a lock, illegal as dict keys, **catastrophic as default arguments**.

**The default-argument trap — asked in interviews on purpose:**

\`\`\`python
def append_row(row, buffer=[]):     # buffer is created ONCE at def time
    buffer.append(row)
    return buffer

append_row("a")   # ['a']
append_row("b")   # ['a', 'b']   ← same list across calls
\`\`\`

**Fix: use \`None\` as the sentinel.**

\`\`\`python
def append_row(row, buffer=None):
    if buffer is None:
        buffer = []
    buffer.append(row)
    return buffer
\`\`\`

---

### Rule 3 — Iteration is lazy where it matters

\`range\`, \`map\`, \`filter\`, \`zip\`, \`enumerate\`, \`dict.items()\`, generator expressions, and file objects are all **lazy** — they don't build the full sequence in memory. Wrapping them in \`list(...)\` materializes and defeats the point.

\`\`\`python
# Reads the whole file into RAM — bad for a 10 GB file
lines = open("events.jsonl").readlines()

# Streams one line at a time — constant memory
with open("events.jsonl") as f:
    for line in f:
        handle(line)
\`\`\`

---

### Rule 4 — Exceptions are control flow, not disasters

Python code is idiomatically written **EAFP**: try the operation, catch the specific exception. This is faster on the happy path and race-free (\`if os.path.exists(p): open(p)\` has a TOCTOU race; \`try: open(p) except FileNotFoundError:\` doesn't).

If you internalize these four rules, most Python interview traps become obvious.`,
    },
    {
      heading: 'Data structures: which one, when, and why',
      subheading: 'Choosing between lists, dicts, sets, tuples, and dataclasses in production ETL',
      content: `For DE work you use four: \`list\`, \`dict\`, \`set\`, \`tuple\`. Everything else (\`deque\`, \`Counter\`, \`defaultdict\`, \`namedtuple\`, \`frozenset\`) is a specialized case.

### 2.1 Cheat table

| Structure | Ordered? | Mutable? | Duplicates? | Lookup cost | Typical use |
|---|---|---|---|---|---|
| \`list\` | Yes (insertion) | Yes | Yes | O(n) by value, O(1) by index | Ordered sequence of records; buffer for a batch |
| \`tuple\` | Yes | No | Yes | O(n) by value | Fixed-shape record; safe key; multiple return values |
| \`dict\` | Yes (insertion, since 3.7) | Yes | Keys unique | O(1) avg | Any lookup by key; row-to-row joins in Python; config |
| \`set\` | No | Yes | No | O(1) avg | Deduplication; membership test; set arithmetic |
| \`frozenset\` | No | No | No | O(1) avg | Hashable set — usable as dict key |
| \`collections.defaultdict\` | Yes | Yes | Keys unique | O(1) avg | Grouping / bucketing without \`if key not in d\` |
| \`collections.Counter\` | Yes | Yes | Keys unique | O(1) avg | Frequency counts; top-N via \`.most_common()\` |
| \`collections.deque\` | Yes | Yes | Yes | O(1) at both ends | Sliding windows, streaming buffers |

---

### 2.2 Dictionaries — the workhorse

Dicts are the shape of almost every DE payload (JSON rows, config, metadata records).

**Key properties to know cold:**
- Keys must be **hashable**. Lists and dicts cannot be keys; tuples of hashables can.
- Iteration order is **insertion order** and has been guaranteed since Python 3.7.
- Lookup, insert, and delete are amortized **O(1)**.
- \`d.get(key, default)\` never raises. Prefer over \`d[key]\` when the key may be absent.

**Idioms that appear in senior interviews:**

\`\`\`python
# Group rows by a key (bucketing)
from collections import defaultdict
by_region = defaultdict(list)
for row in rows:
    by_region[row["region"]].append(row)

# Merge two dicts (3.9+)
merged = base | overrides

# Invert a dict (only valid if values are unique and hashable)
inverse = {v: k for k, v in d.items()}

# Safe nested get without KeyError chains
country = row.get("customer", {}).get("address", {}).get("country")
\`\`\`

**The \`dict.setdefault\` vs \`defaultdict\` question:** \`setdefault\` inserts a default the first time and returns it — useful when you need "get-or-create" for a single lookup. \`defaultdict\` is the same idea baked into the container, better when you're doing it in a loop.

---

### 2.3 Sets — the deduplicator

Sets are how you answer "did I see this key?", "what's in A but not in B?", and "what are the distinct values?" without a linear scan.

\`\`\`python
seen = set()
duplicates = []
for row in rows:
    if row["id"] in seen:
        duplicates.append(row)
    else:
        seen.add(row["id"])

# Set arithmetic for reconciliation
missing_in_target = source_ids - target_ids
extra_in_target   = target_ids - source_ids
\`\`\`

> **Warning:** \`set\` membership is only O(1) because elements are hashed. If you build a set of \`dict\`s or \`list\`s, Python will raise \`TypeError: unhashable type\`. Convert to tuples of the relevant fields.

---

### 2.4 Tuples vs lists — when to pick which

- Use a **tuple** when the shape is fixed and the meaning of each position is fixed. Function returns with two values, coordinate pairs, composite keys.
- Use a **list** when you have a homogeneous, growing/shrinking collection.

Tuples are also hashable, so they're the go-to for composite dict/set keys:

\`\`\`python
by_region_and_day = defaultdict(int)
for row in rows:
    by_region_and_day[(row["region"], row["order_date"])] += row["amount"]
\`\`\`

---

### 2.5 \`namedtuple\` and \`dataclass\` — when the row *is* a record

For "row objects" (a customer, an event, a batch descriptor), a dict is loose and error-prone. Prefer a **dataclass**:

\`\`\`python
from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True, slots=True)
class Order:
    order_id: int
    customer_id: int
    amount_usd: float
    order_date: date
\`\`\`

- \`frozen=True\` → hashable + immutable (safe as a dict key, safe across threads).
- \`slots=True\` → smaller memory, faster attribute access; important when you hold millions in memory.
- Free \`__init__\`, \`__repr__\`, \`__eq__\`.
- Type-annotated fields document intent and let mypy/pyright catch bugs statically.`,
    },
    {
      heading: 'Comprehensions — the idiomatic loop',
      subheading: 'List, dict, set comprehensions and streaming generator expressions',
      content: `Comprehensions are not "syntactic sugar" — they run the loop in C and are noticeably faster than the equivalent explicit \`for\`. Use them for **transform + filter**; drop back to a \`for\` loop when the body has side effects.

\`\`\`python
# List comprehension: transform + filter
usd_amounts = [r["amount"] for r in rows if r["currency"] == "USD"]

# Dict comprehension: reshape a dict
by_id = {r["id"]: r for r in rows}

# Set comprehension: distinct values
regions = {r["region"] for r in rows}

# Generator expression: lazy, streaming (note the parens)
total = sum(r["amount"] for r in rows if r["status"] == "PAID")
\`\`\`

**Rules for using comprehensions well:**
1. If it doesn't fit readably on two lines, write a \`for\` loop.
2. If you need side effects (\`log\`, \`write\`, \`raise\`), use a \`for\` loop.
3. If the source is huge and you only need the aggregate, use a **generator expression** (\`sum(... for ...)\`) — no intermediate list, constant memory.
4. Nested comprehensions read left-to-right like nested loops: \`[(r, i) for r in rows for i in r["items"]]\` is \`for r in rows: for i in r["items"]:\`.

**Enterprise example — flatten a JSON payload into rows without building the intermediate list:**

\`\`\`python
def flatten(orders):
    return (
        {"order_id": o["id"], "sku": item["sku"], "qty": item["qty"]}
        for o in orders
        for item in o["items"]
    )

# Streams: no memory spike even for a million orders
for row in flatten(orders):
    writer.write(row)
\`\`\``,
    },
    {
      heading: 'Functions — what interviewers actually probe',
      subheading: 'Keyword-only args, default traps, closures, decorators, and lambda discipline',
      content: `### 4.1 Arguments — positional, keyword, \`*args\`, \`**kwargs\`

You'll write this signature dozens of times in DE code:

\`\`\`python
def run_job(name, *, source, target, dry_run=False, **extra):
    ...
\`\`\`

- Anything **after \`*\`** is keyword-only. Callers *must* write \`source=...\`. This is the senior habit — it prevents "who's the third positional argument again?" bugs when the config grows.
- \`*args\` collects extra positional args as a tuple; \`**kwargs\` collects extra keyword args as a dict. Use them when you're *forwarding* to another callable (decorators, wrappers). Don't use them to be "flexible" — you lose type checking and documentation.

---

### 4.2 Default arguments — the trap and the fix
Covered in §1 but worth restating: **default arguments are evaluated once, at function-definition time.** Never use a mutable default. Use \`None\` as the sentinel.

---

### 4.3 First-class functions and closures
Functions are objects. You can store them in a dict — this replaces long \`if/elif\` chains, which come up in metadata-driven pipelines.

\`\`\`python
TRANSFORMS = {
    "trim":      lambda s: s.strip(),
    "upper":     lambda s: s.upper(),
    "iso_date":  lambda s: datetime.strptime(s, "%m/%d/%Y").date().isoformat(),
}

def apply(value, ops):
    for op in ops:
        value = TRANSFORMS[op](value)
    return value

apply("  2026-01-15  ", ["trim", "upper"])
\`\`\`

A **closure** captures variables from its enclosing scope:

\`\`\`python
def make_prefixer(prefix):
    def prefix_it(s):
        return f"{prefix}{s}"    # \`prefix\` is captured
    return prefix_it

add_env = make_prefixer("prod_")
add_env("customers")   # "prod_customers"
\`\`\`

---

### 4.4 Decorators — cross-cutting concerns in one place
A decorator is a function that wraps another function. The common DE decorators — timing, retry, logging, caching — all share this shape:

\`\`\`python
import functools, logging, time

log = logging.getLogger(__name__)

def log_duration(fn):
    @functools.wraps(fn)                  # preserve name / docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            elapsed = time.perf_counter() - start
            log.info("fn=%s elapsed_s=%.3f", fn.__name__, elapsed)
    return wrapper

@log_duration
def load_dimension(name):
    ...
\`\`\`

> **Senior line:** \`functools.wraps\` is **not optional** — without it your logs and stack traces show \`wrapper\` instead of \`load_dimension\`, and every debugging session gets 30% harder.

---

### 4.5 \`lambda\` — when it's fine, when it isn't
- **Fine:** as a one-line argument to \`sorted\`, \`map\`, \`min\`, \`max\`, \`key=\`.
  \`\`\`python
  rows.sort(key=lambda r: (r["region"], -r["amount"]))
  \`\`\`
- **Not fine:** anywhere you'd want a name, a docstring, or a stack-trace-friendly identity. Define a real function.`,
    },
    {
      heading: 'Exceptions — the DE-relevant parts',
      subheading: 'The exception hierarchy, catch-context-reraise, and custom error classes',
      content: `### 5.1 The hierarchy you should know

\`\`\`
BaseException
 └── Exception
      ├── ArithmeticError (ZeroDivisionError, OverflowError)
      ├── LookupError (KeyError, IndexError)
      ├── OSError (FileNotFoundError, PermissionError, TimeoutError, ConnectionError)
      ├── ValueError
      ├── TypeError
      ├── RuntimeError
      └── StopIteration
\`\`\`

**Rules of thumb:**
- **Catch specific exceptions.** \`except Exception:\` swallows bugs. Reserve it for the *outermost* boundary where you log and re-raise or exit.
- **Never** catch \`BaseException\`. That includes \`KeyboardInterrupt\` and \`SystemExit\`.
- \`raise\` (bare, inside \`except\`) re-raises the current exception, preserving the traceback.
- \`raise NewError(...) from original\` chains exceptions so the log shows the real root cause.

---

### 5.2 The senior pattern: catch → context → re-raise

\`\`\`python
def load_partition(path):
    try:
        return read_parquet(path)
    except FileNotFoundError as e:
        raise PipelineError(f"partition missing: {path}") from e
    except OSError as e:
        raise PipelineError(f"IO failure reading {path}: {e}") from e
\`\`\`

- You add domain context (which path, which stage).
- You preserve the root cause via \`from e\`.
- You do **not** log-and-swallow; the caller (or the orchestrator) decides retry vs fail.

---

### 5.3 \`try / except / else / finally\`
- \`else\` runs only if \`try\` succeeded — put "happy path" work here so a bug there doesn't get caught by the \`except\`.
- \`finally\` **always** runs — put cleanup here, or use a context manager.

---

### 5.4 Custom exception classes
Create a tiny hierarchy for your pipeline. It lets callers catch *your* errors without accidentally catching \`KeyError\` from a bug.

\`\`\`python
class PipelineError(Exception):
    """Base class for all pipeline-raised errors."""

class ConfigError(PipelineError):
    """Missing or invalid configuration."""

class SourceError(PipelineError):
    """Upstream source failed or returned bad data."""

class SinkError(PipelineError):
    """Target write failed."""
\`\`\`

Now the orchestrator can do:
\`\`\`python
try:
    run_pipeline(cfg)
except ConfigError:
    sys.exit(2)          # bad config → fail fast, no retry
except SourceError:
    schedule_retry()     # transient, retryable
except SinkError:
    alert_oncall()       # data may be partially written
\`\`\``,
    },
    {
      heading: 'Iterators, generators, and streaming',
      subheading: 'Constant-memory pipelines, iterator protocol, yield from, and itertools batching',
      content: `The single biggest reason Python DE code runs out of memory is that someone \`list(...)\`-ed a stream they didn't need to materialize. Understanding the iterator protocol prevents this.

### 6.1 The iterator protocol
- **Iterable** = has \`__iter__\` → returns an iterator.
- **Iterator** = has \`__next__\` → returns the next value or raises \`StopIteration\`.
- \`for x in xs:\` is sugar for \`it = iter(xs); while True: try: x = next(it) ... except StopIteration: break\`.

Iterators are **single-pass**. Once consumed, they're empty:
\`\`\`python
it = iter([1, 2, 3])
list(it)   # [1, 2, 3]
list(it)   # []          ← already exhausted
\`\`\`
This bites people who pass a generator into two consumers.

---

### 6.2 Generators — the DE workhorse
A generator is a function with \`yield\`. Calling it returns an iterator that runs the function *up to the next \`yield\`* and pauses.

\`\`\`python
def read_events(path):
    with open(path) as f:
        for line in f:                # file object is itself lazy
            yield json.loads(line)

def only_paid(events):
    for e in events:
        if e["status"] == "PAID":
            yield e

def to_rows(events):
    for e in events:
        yield {"id": e["id"], "amount": e["amount_usd"]}

# Compose: nothing is materialized, memory is constant
pipeline = to_rows(only_paid(read_events("events.jsonl")))
for row in pipeline:
    writer.write(row)
\`\`\`

> **Interview line:** this is the Python analog of Spark's lazy DAG. If the interviewer asks "how would you process a 100 GB file on a small VM?" — this is the answer for the non-Spark case: **generator pipeline, constant memory, one pass**.

---

### 6.3 \`yield from\` — delegating to another iterable
\`\`\`python
def read_partitions(paths):
    for p in paths:
        yield from read_events(p)     # flattens sub-streams into one stream
\`\`\`
Equivalent to \`for e in read_events(p): yield e\`, but faster and clearer.

---

### 6.4 \`itertools\` — the missing verbs

| Function | Use |
|---|---|
| \`itertools.islice(it, n)\` | Take the first \`n\` from a stream (safe on generators). |
| \`itertools.chain(a, b)\` | Concatenate iterables lazily. |
| \`itertools.groupby(sorted_it, key=...)\` | Group *consecutive* equal keys. Input must be sorted by key. |
| \`itertools.batched(it, n)\` *(3.12+)* | Yield fixed-size tuples — perfect for API/DB micro-batching. |
| \`itertools.takewhile / dropwhile\` | Stream slicing by predicate. |

**Batching is a workhorse.** Almost every "load a stream into a database" job uses it:
\`\`\`python
from itertools import batched   # 3.12+; else use a small helper

for chunk in batched(rows, 5000):
    cursor.executemany(INSERT_SQL, chunk)
\`\`\``,
    },
    {
      heading: 'Just-enough OOP for DE',
      subheading: 'When to reach for a class, dataclasses with slots, context managers, and composition',
      content: `You will *not* be asked to design a class hierarchy. You *will* be asked to:
1. Explain a pipeline codebase's structure.
2. Model a config / row / job descriptor.
3. Write a context manager.
4. Know when a class is warranted vs. when a function suffices.

### 7.1 When to reach for a class
Use a class when the code has **state + behavior** that belong together:
- A \`PipelineRun\` that holds run metadata and exposes \`.start()\`, \`.checkpoint()\`, \`.finish()\`.
- A \`RestClient\` that holds a session, base URL, auth, and retries — and exposes \`.get()\`, \`.post()\`.

Do **not** create a class just to group functions. That's what modules are for.

---

### 7.2 Dataclasses for records and config
\`\`\`python
from dataclasses import dataclass, field
from typing import Optional

@dataclass(frozen=True, slots=True)
class TableSpec:
    source_system: str
    source_table: str
    target_table: str
    load_type: str                     # "full" | "incremental" | "cdc"
    watermark_column: Optional[str] = None
    primary_key: list[str] = field(default_factory=list)
    active: bool = True
\`\`\`

\`field(default_factory=list)\` is the correct way to give a dataclass a per-instance empty list — it avoids the mutable-default trap.

---

### 7.3 Context managers — \`__enter__\` / \`__exit__\`
Any resource that needs deterministic cleanup should be a context manager. The senior habit is to write your own:

\`\`\`python
from contextlib import contextmanager

@contextmanager
def timed(label):
    start = time.perf_counter()
    try:
        yield
    finally:
        log.info("%s took %.3fs", label, time.perf_counter() - start)

with timed("silver_upsert"):
    run_silver_upsert()
\`\`\`

\`@contextmanager\` turns a generator into a context manager: everything before \`yield\` is \`__enter__\`, everything after is \`__exit__\`. Cleaner than writing the class by hand.

---

### 7.4 Inheritance vs composition — the safe default
Prefer **composition** (an object holds another object) over **inheritance** (an object *is a kind of* another). Deep inheritance trees are the single most common architectural regret in mid-sized Python codebases.

An acceptable one-level use: an abstract base for pluggable sources:

\`\`\`python
from abc import ABC, abstractmethod

class Source(ABC):
    @abstractmethod
    def read(self) -> Iterable[dict]: ...

class S3JsonSource(Source):
    def __init__(self, bucket, prefix): ...
    def read(self):
        for key in list_keys(self.bucket, self.prefix):
            yield from read_json_lines(self.bucket, key)

class RestSource(Source):
    def __init__(self, client, endpoint): ...
    def read(self):
        yield from paginate(self.client, self.endpoint)
\`\`\`

The pipeline consumes \`Source\` — it doesn't care which one.`,
    },
    {
      heading: 'Modules, packages, and imports',
      subheading: 'Layouts, absolute imports, circular dependency resolution, and main guards',
      content: `### 8.1 Layout
\`\`\`
my_pipeline/
├── my_pipeline/
│   ├── __init__.py
│   ├── config.py
│   ├── sources/
│   │   ├── __init__.py
│   │   ├── rest.py
│   │   └── s3_json.py
│   ├── sinks/
│   │   ├── __init__.py
│   │   └── delta.py
│   └── main.py
├── tests/
├── pyproject.toml
└── README.md
\`\`\`

---

### 8.2 Absolute vs relative imports
Inside a package, **prefer absolute imports** (\`from my_pipeline.sources.rest import RestSource\`). They survive refactoring and are unambiguous. Reserve relative imports (\`from .rest import RestSource\`) for tightly coupled siblings.

---

### 8.3 Circular imports
If \`a.py\` imports from \`b.py\` and vice versa, you get an \`ImportError\`. Fixes, in order of preference:
1. Move the shared thing into a third module.
2. Import inside the function (late import) — a legitimate escape hatch.
3. Restructure so one is clearly upstream of the other.

---

### 8.4 The \`if __name__ == "__main__":\` guard
Every runnable script needs it. Without it, importing your module *executes* the script, which breaks tests, breaks multiprocessing on macOS/Windows, and generally surprises everyone.

\`\`\`python
def main():
    ...

if __name__ == "__main__":
    main()
\`\`\``,
    },
    {
      heading: 'Concurrency — what a DE actually needs',
      subheading: 'Choosing between ThreadPoolExecutor, ProcessPoolExecutor, and asyncio for I/O fan-out',
      content: `You don't need to explain the CPython GIL in an interview. You *do* need to answer "how would you make these 200 API calls faster?" correctly.

### 9.1 The three-way choice

| Problem shape | Right tool | Reason |
|---|---|---|
| **I/O-bound** (HTTP, DB, file reads) — thread spends 90% waiting | \`concurrent.futures.ThreadPoolExecutor\` **or** \`asyncio\` | Waiting doesn't hold the GIL; many waiters in one process is cheap. |
| **CPU-bound** (parsing, hashing, ML inference) | \`concurrent.futures.ProcessPoolExecutor\` **or** move to Spark/native lib | The GIL serializes Python bytecode; threads don't help. Processes bypass it. |
| **Massive data** | Spark / Dask | You need distribution, not just concurrency. |

---

### 9.2 The safe default: \`ThreadPoolExecutor\` for I/O fan-out

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_page(page):
    return http.get(f"{url}?page={page}").json()

with ThreadPoolExecutor(max_workers=16) as pool:
    futures = {pool.submit(fetch_page, p): p for p in range(1, 201)}
    for fut in as_completed(futures):
        page = futures[fut]
        try:
            results.extend(fut.result())
        except Exception as e:
            log.exception("page %s failed", page)
            raise
\`\`\`

- \`max_workers\` is a **rate-limit lever**, not just a performance knob. Match it to the API's tolerance.
- \`as_completed\` lets you process results as they arrive; use \`map\` if order matters more than latency.

---

### 9.3 When to prefer \`asyncio\`
- Hundreds to thousands of concurrent I/O calls where thread overhead is painful.
- A library you use is already async (\`aiohttp\`, \`asyncpg\`).
- You control the whole call chain — mixing sync and async is where projects get expensive.

> **Senior line:** For most enterprise DE work with a few dozen concurrent calls, **\`ThreadPoolExecutor\` is the correct answer** and \`asyncio\` is over-engineering.`,
    },
    {
      heading: 'Performance — how a senior thinks about it',
      subheading: 'Profiling with cProfile, avoiding hot loop bottlenecks, and pushing work down',
      content: `You will not be asked to hand-optimize Python in the interview. You *will* be asked "how do you know it's slow?" and "what would you do about it?"

### 10.1 Rules of thumb
- **Never optimize without measuring.** \`cProfile\` or \`time.perf_counter()\` first.
- Prefer built-ins and comprehensions — they run in C.
- Avoid growing strings with \`+=\` in a loop → build a \`list\` and \`"".join(...)\` at the end.
- Avoid repeated attribute/global lookups in hot loops — bind them to locals.
- If the hot path is CPU-bound and single-threaded, the answer is usually **NumPy / Polars / Spark**, not "thread it harder."

---

### 10.2 The senior instinct
If your Python code is the bottleneck of a data pipeline, the right question is almost never "how do I make Python faster?" It's **"why is this transformation in Python at all?"** Push it into the SQL engine, into Spark, or into a vectorized library. Reserve Python for control flow, orchestration, and I/O glue.`,
    },
    {
      heading: 'Common mistakes (interview traps)',
      subheading: 'Twelve critical mistakes interviewers probe to distinguish junior from senior engineers',
      content: `| Mistake | Why it fails | Fix |
|---|---|---|
| Mutable default argument | Shared state across calls | \`None\` sentinel |
| \`except Exception:\` (or worse, bare \`except:\`) | Swallows bugs | Catch specific types |
| \`d[key]\` when the key may be absent | \`KeyError\` | \`d.get(key, default)\` or \`try/except KeyError\` |
| Reading a huge file with \`.readlines()\` | OOM | Iterate the file object; use generators |
| \`if x == None\` | Wrong for objects that override \`__eq__\` | \`if x is None\` |
| Modifying a list while iterating it | Skipped or duplicated elements | Iterate over a copy or build a new list |
| Using \`list\` as a set membership test | O(n) per check | Convert to a \`set\` once |
| String concatenation in a loop | O(n²) | \`"".join(parts)\` |
| Passing a generator into two consumers | Second consumer sees nothing | Materialize with \`list(...)\` **or** call the generator function again |
| Using a class where a function would do | Adds ceremony, hides logic | Use a function |
| Catching-and-swallowing exceptions to "make the pipeline resilient" | Silent data loss, no alerting | Let it raise; retry at the orchestrator layer |
| \`from module import *\` | Namespace pollution, IDE confusion | Import explicit names |`,
    },
    {
      heading: 'Follow-up questions a senior interviewer will actually ask',
      subheading: 'High-probability defensive questions in senior technical rounds',
      content: `- **"Show me how \`functools.wraps\` changes what a stack trace looks like."**
- **"You wrote a decorator. Now I want it to take arguments — \`@retry(max_attempts=5)\`. Change it."**
- **"Your generator raises halfway through. Where does the exception surface, and does the \`with\` in the producer still close the file?"**
- **"You're seeing duplicated rows in the target. The pipeline uses a helper with a default \`dict\` argument. Walk me through the bug."**
- **"You have 300 partitions to load. Threads or processes? Defend the choice."**
- **"The row objects are dicts today. Convince me to migrate to dataclasses — or convince me not to."**
- **"Where would you use \`asyncio\` in this codebase instead of \`ThreadPoolExecutor\`, and what would you *not* touch?"**`,
    },
    {
      heading: 'Hands-on exercises',
      subheading: 'Five foundational exercises to solidify stream dedup, transforms, retries, and batching',
      content: `Do these before moving to Part 02. Each should take under an hour and produces reusable code.

### Exercise 1 — Streaming dedup
Given a large JSON-lines file with an \`event_id\` field, write a generator pipeline that yields only the *first* occurrence of each \`event_id\`, in file order, in constant memory *bounded by the number of distinct ids seen*. Then extend it so the dedup window is only the last 1,000,000 ids (use a \`collections.OrderedDict\` as an LRU).

### Exercise 2 — Config-driven transform
Build a \`TRANSFORMS\` dict mapping op names → callables (\`trim\`, \`upper\`, \`iso_date\`, \`strip_currency\`, \`to_float\`) and a function \`apply(record, mapping)\` where \`mapping\` is \`{target_field: (source_field, [ops...])}\`. Reshape a list of dicts using this configuration. This is the shape of a real metadata-driven ingest transformer.

### Exercise 3 — \`@retry\` decorator
Write \`@retry(max_attempts=3, backoff=0.5, retry_on=(ConnectionError, TimeoutError))\` that retries with exponential backoff and re-raises on the final attempt. Use \`functools.wraps\`. Add a \`jitter\` parameter. Prove with a unit test that it doesn't retry \`ValueError\`.

### Exercise 4 — Batched loader
Given a generator of dicts, write \`batched_load(rows, batch_size, sink_fn)\` that calls \`sink_fn(batch)\` on each chunk and returns the total row count. Handle a partial final batch. Add a \`flush_every_seconds\` parameter that also flushes on a timer so a slow producer doesn't leave data buffered forever.

### Exercise 5 — Custom context manager
Write \`@contextmanager def audit(run_id, step): ...\` that logs \`start\`, \`end\`, \`elapsed_s\`, and — on exception — the exception type and message, then re-raises. Use it around a fake pipeline step and confirm the log shape.`,
    },
    {
      heading: 'Quick revision — the 20 bullets',
      subheading: 'Rapid 3-minute checklist of the foundational Python model',
      content: `1. Everything is an object; names are references, not copies.
2. \`int\`, \`str\`, \`tuple\`, \`frozenset\` are immutable; \`list\`, \`dict\`, \`set\` are mutable.
3. Only hashable objects can be dict keys or set members.
4. Never use a mutable default argument — use \`None\` and default inside the body.
5. Dict lookup / insert / delete is amortized O(1); iteration order = insertion order (3.7+).
6. Sets are the O(1) tool for dedup and membership.
7. Tuples of hashables are the right composite key.
8. Prefer \`@dataclass(frozen=True, slots=True)\` over dict rows for real records.
9. Comprehensions are fast; use generator expressions when the source is huge.
10. Generators + \`yield from\` + \`itertools.batched\` = constant-memory streaming pipelines.
11. Catch specific exceptions; use \`raise ... from e\` to preserve root cause.
12. Custom exception hierarchy → orchestrator can decide fail-fast vs retry.
13. First-class functions replace \`if/elif\` dispatch with a dict of callables.
14. \`functools.wraps\` is not optional in a decorator.
15. Absolute imports; guard scripts with \`if __name__ == "__main__":\`.
16. GIL: threads for I/O, processes (or Spark) for CPU.
17. \`ThreadPoolExecutor\` is the safe default for I/O fan-out; \`max_workers\` is a rate-limit knob.
18. \`is\` for \`None\`; \`==\` for value comparison.
19. Never \`readlines()\` on a big file; iterate the file object.
20. If Python is the bottleneck of a data pipeline, move the work — don't optimize Python harder.`,
    },
  ],
};
