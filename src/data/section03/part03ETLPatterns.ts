import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_03_TERMINOLOGIES: TermItem[] = [
  {
    term: 'REST',
    definition: 'HTTP conventions for CRUD over resources: GET reads, POST creates, PUT/PATCH update, DELETE deletes. Idempotency and safety are baked into the semantics.',
    category: 'Protocols',
  },
  {
    term: 'Idempotent HTTP method',
    definition: 'Making the same call N times has the same effect as making it once. GET, PUT, DELETE are idempotent; POST is not. This matters when you retry.',
    category: 'Protocols',
    highlight: true,
  },
  {
    term: 'Status class',
    definition: '1xx info, 2xx success, 3xx redirect, 4xx client error, 5xx server error. 4xx = don\'t retry (bug); 5xx and 429 = do retry.',
    category: 'Protocols',
  },
  {
    term: '429 Too Many Requests',
    definition: 'The server is rate-limiting you. Almost always ships with a Retry-After header (seconds or an HTTP date). Respect it.',
    category: 'Protocols',
    highlight: true,
  },
  {
    term: '503 Service Unavailable',
    definition: 'Transient — the server is temporarily unable to handle the request. Retryable, often with Retry-After.',
    category: 'Protocols',
  },
  {
    term: 'OAuth 2.0 client-credentials',
    definition: 'Machine-to-machine auth: exchange a client_id + client_secret at a token endpoint for a short-lived access_token. The default enterprise API auth pattern.',
    category: 'Authentication',
    highlight: true,
  },
  {
    term: 'Bearer token',
    definition: 'An access token sent in Authorization: Bearer <token>. Anyone holding it can act as you until it expires — treat as a live secret.',
    category: 'Authentication',
  },
  {
    term: 'Pagination',
    definition: 'The API returns results in chunks. Four common schemes: offset/limit, page number, cursor / next-token, link header.',
    category: 'Ingestion Patterns',
    highlight: true,
  },
  {
    term: 'Rate limit',
    definition: 'A ceiling on requests per unit time. Usually announced in headers (X-RateLimit-Remaining, X-RateLimit-Reset).',
    category: 'Ingestion Patterns',
  },
  {
    term: 'Backoff',
    definition: 'Waiting between retries. Exponential backoff: wait base * 2^attempt. Jitter: random noise added to backoff to prevent thundering-herd retries.',
    category: 'Resilience',
    highlight: true,
  },
  {
    term: 'Circuit breaker',
    definition: 'After N consecutive failures, stop calling for a cooldown window instead of hammering a dying dependency.',
    category: 'Resilience',
  },
  {
    term: 'Idempotency key',
    definition: 'A caller-supplied unique ID sent on POST so the server can dedupe retries. Idempotency-Key: <uuid> is the de facto header.',
    category: 'Resilience',
    highlight: true,
  },
  {
    term: 'Watermark / high-water mark',
    definition: 'The maximum value of the incremental column processed so far (usually updated_at or a monotonic ID). Next run reads where col > watermark.',
    category: 'Pipelines',
    highlight: true,
  },
  {
    term: 'Restartable',
    definition: 'The pipeline can be re-run after a crash and produce the correct final state — no duplicates, no missing rows.',
    category: 'Pipelines',
    highlight: true,
  },
  {
    term: 'Metadata-driven pipeline',
    definition: 'The pipeline\'s behavior comes from a data-driven config table (which tables to load, how, from where), not from hard-coded logic per table.',
    category: 'Pipelines',
    highlight: true,
  },
  {
    term: 'Bronze / Silver / Gold',
    definition: 'The medallion layers: raw landed (bronze), cleaned + conformed (silver), business-modeled (gold). We\'re mostly working at the bronze / silver hop in this file.',
    category: 'Architecture',
  },
];

export const ETL_PATTERNS_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'python-q12-paginated-rest-api',
    number: 12,
    question: 'How do you ingest data from a paginated REST API robustly?',
    topic: 'API Integration',
    subtopic: 'Pagination & Ingestion',
    answers: {
      basic: '"Use `requests.get` in a loop with the next page until it\'s done."',
      strong: '"Use a `Session` with connection pooling and a `urllib3.Retry` that handles `429`/`5xx` with backoff. Prefer cursor pagination for stability. Ask the server for ascending order on the watermark column so I can track the max seen. Timeouts on every call. Write to a run-scoped staging path, then MERGE into the target."',
      senior: '"Same, and I\'d factor pagination behind a generator so the caller doesn\'t know the scheme. Watermark persisted **after** the sink commits so a crash is safe. Overlap the window by a small delta so late-arriving updates are re-fetched, and rely on MERGE for idempotency — that\'s at-least-once + upsert = effectively-once. Structured JSON logs with `run_id`, `rows_in`, `rows_out`, `retries`, `duration_ms`. Fan-out only across independent partitions — never within a strict cursor stream, because the next call depends on the previous cursor."',
      interviewerIntent: 'Evaluating full-stack API integration: session pooling, scheme abstraction, commit-gated watermarking, window overlapping for CDC latency, and concurrency constraints.',
      seniorKeyTakeaways: [
        'Abstract pagination behind a generator to keep consumers scheme-agnostic',
        'Persist watermark ONLY after target sink transaction commits',
        'Overlap incremental window + MERGE sink = at-least-once to effectively-once',
        'Cursor streams are strictly sequential; fan-out only across partition boundaries',
      ],
    },
  },
  {
    id: 'python-q13-http-retry-policy',
    number: 13,
    question: "What's the correct retry policy for HTTP calls?",
    topic: 'Resilience & Networking',
    subtopic: 'Retry Policies & Jitter',
    answers: {
      basic: '"Retry a few times with a delay."',
      strong: '"Retry `429` and `5xx` only — never `4xx` bugs. Exponential backoff with jitter, capped at some max delay and max attempts. Respect `Retry-After`. Only retry `POST` if I have an idempotency key."',
      senior: '"Same, and I\'d put the retry at the lowest layer that makes sense — `urllib3.Retry` on the session for transport-level, my own decorator around code that needs custom logic. Full jitter, not equal jitter, to break thundering-herd. Deterministic idempotency keys derived from the payload — random UUIDs defeat the purpose because the server sees each retry as a new request. Circuit-break at the boundary between calls to a chronically failing dependency; for batch DE that usually means failing the run and letting the orchestrator schedule."',
      interviewerIntent: 'Testing status code triage (4xx vs 5xx/429), jitter mathematics (full jitter vs thundering-herd), and idempotency key determinism on POST retries.',
      seniorKeyTakeaways: [
        'Retry 429 and 5xx; never retry 4xx client errors (bugs)',
        'Full jitter breaks synchronized thundering-herd retry storms',
        'POST retries require deterministic payload-derived Idempotency-Key headers',
      ],
    },
  },
  {
    id: 'python-q14-idempotent-pipeline',
    number: 14,
    question: 'What makes a pipeline idempotent, and why do you care?',
    topic: 'Pipeline Architecture',
    subtopic: 'Idempotency',
    answers: {
      basic: '"Running it twice doesn\'t create duplicates."',
      strong: '"Same, and it\'s what lets me safely retry on failure. I achieve it with MERGE on a stable key, or overwrite-by-partition for append tables, or dedup on ingest with a natural event ID. Idempotency keys on outbound POSTs."',
      senior: '"Idempotency is the property that makes at-least-once delivery — which is what every real system provides — behave like exactly-once. Cheap to test: `kill -9` at every line of the pipeline; is the next run correct? Concretely: staging path per `run_id`, MERGE on PK, watermark persisted after the sink commits. The two silent killers are (1) advancing the watermark before the write, which causes gaps, and (2) a non-unique \'primary key\' that isn\'t actually unique, which causes MERGE to duplicate — I\'d validate PK uniqueness on ingest before I trust it."',
      interviewerIntent: 'Assessing understanding of distributed system reality (at-least-once delivery), state reconciliation, kill-9 resilience testing, and PK uniqueness validation.',
      seniorKeyTakeaways: [
        'Makes at-least-once delivery behave as effectively-once',
        'Staging directory keyed by run_id avoids partial file collision',
        'Two silent killers: early watermark advancement (gaps) and non-unique PKs (duplicates)',
      ],
    },
  },
  {
    id: 'python-q15-metadata-driven-framework',
    number: 15,
    question: 'Design a metadata-driven ingestion framework.',
    topic: 'System Design',
    subtopic: 'Metadata-Driven Pipelines',
    answers: {
      basic: '"A config table and a loop that reads it."',
      strong: '"A metadata table listing source, target, load type, watermark column, PK, active flag. An engine reads the active rows and processes each: pick a Source impl by `source_type`, pick a Sink impl by target, run source → staging → MERGE, update watermark, write audit."',
      senior: '"Add a `Source` and `Sink` protocol so every source/sink is interchangeable behind the engine — this is the composition-over-inheritance split from Part 01 §7.4. `run_id` for correlation. Audit (append-only) and watermark (upsert) as separate tables — different write patterns and retention. Per-table failure isolation so one bad source doesn\'t sink the batch. Structured JSON logs with `run_id`, `rows_in`, `rows_out`. Rate-limit knob per source spec, not global. Onboarding a new table is a metadata `INSERT`, not a code change — that\'s the actual promise. The failure mode I\'d design against is \'metadata drift\' — someone edits a PK or watermark column between runs; the engine should refuse to run until the new spec\'s uniqueness and monotonicity are validated on a sample."',
      interviewerIntent: 'Evaluating enterprise framework architecture: protocol decoupling, table isolation, audit vs watermark table separation, and defensive handling of metadata drift.',
      seniorKeyTakeaways: [
        'Source/Sink typing protocols for zero-inheritance pluggability',
        'Separate audit (append-only) from watermark (upsert) tables',
        'Per-table failure isolation in the driver execution loop',
        'Defend against metadata drift by validating PK uniqueness and monotonicity',
      ],
    },
  },
  {
    id: 'python-q16-secrets-and-rate-limits',
    number: 16,
    question: 'How do you handle secrets and rate-limit tokens across many concurrent workers?',
    topic: 'Security & Concurrency',
    subtopic: 'Concurrency & Token Caching',
    answers: {
      basic: '"Load them from env vars."',
      strong: '"Env vars from a secret store — Key Vault, Databricks Secret Scopes — never in code. For OAuth tokens, cache the bearer token with its expiry and refresh before it dies. For rate limits, one shared limiter."',
      senior: '"Same, plus: the token cache is guarded by a double-checked lock so a fleet of threads doesn\'t stampede the token endpoint. Refresh 60s before actual expiry to survive clock skew and in-flight requests. Token never logged, never persisted. Rate limiting is a shared `TokenBucket` per source spec, not global — different vendors have different ceilings — and the `max_workers` on the thread pool is treated as a hard rate cap that matches the vendor\'s contract. If a secret ever appears in a log or repo, rotate immediately: revoking is the fix, deleting the commit isn\'t."',
      interviewerIntent: 'Testing concurrency safety: double-checked lock pattern on OAuth token caches, clock-skew mitigation, source-scoped token buckets, and rate-limit alignment.',
      seniorKeyTakeaways: [
        'Double-checked lock pattern on thread-safe OAuth token cache',
        'Proactive token refresh 60s prior to expiry to survive in-flight latency',
        'Source-scoped TokenBucket rate limiter aligned with worker thread count',
      ],
    },
  },
];

export const PART_03_ETL_PATTERNS_DATA: SectionPart = {
  id: 'python-part-03',
  title: 'Part 03: ETL & API Integration Patterns',
  partNumber: 'Part 03: ETL Patterns',
  subtitle: 'The patterns that turn a script into a pipeline — REST API ingestion done right, pagination, rate limits, retry/backoff with jitter, idempotency, restartability, and a small metadata-driven ETL framework skeleton.',
  summary: 'Architecting industrial API ingest engines: requests.Session connection pooling, OAuth2 client-credentials with double-checked locks, cursor pagination generators, full-jitter retry decorators, token-bucket rate limiters, atomic staging + MERGE idempotency, and metadata-driven framework skeletons.',
  readTimeMinutes: 35,
  terminologies: PART_03_TERMINOLOGIES,
  sections: [
    {
      heading: 'The one HTTP library — requests (and its session)',
      subheading: 'Connection pooling, urllib3 retries, mandatory timeouts, and response validation',
      content: `Stdlib \`urllib.request\` works. Nobody uses it. In DE, the answer is \`requests\` for sync work and \`httpx\` when you need sync + async in the same client.

### 1.1 Never one-shot \`requests.get(url)\` in production

A raw \`requests.get(url)\` opens a new TCP connection, resolves DNS, does TLS handshake, sends the request, closes the socket. For a fan-out of hundreds of calls, that's absurd overhead and unnecessary load on the server.

Use a **\`Session\`**:

\`\`\`python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def make_session(*, timeout: float = 30.0) -> requests.Session:
    s = requests.Session()
    s.headers.update({"Accept": "application/json", "User-Agent": "mypipe/1.0"})

    retry = Retry(
        total=5,
        connect=5, read=5,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=frozenset({"GET", "PUT", "DELETE", "POST"}),
        backoff_factor=1.0,            # 0s, 1s, 2s, 4s, 8s (times 2^n-1)
        respect_retry_after_header=True,
    )
    adapter = HTTPAdapter(max_retries=retry, pool_connections=32, pool_maxsize=32)
    s.mount("https://", adapter)
    s.mount("http://",  adapter)
    s.request = _with_default_timeout(s.request, timeout)  # see §1.2
    return s
\`\`\`

- **Connection pooling** — \`Session\` reuses TCP + TLS, which is the single biggest speedup you'll ever get on API ingestion.
- **\`urllib3.Retry\`** — retries at the transport layer, before your code sees the error. It handles \`429\`/\`5xx\`, respects \`Retry-After\`, and does exponential backoff.
- \`allowed_methods\` — POST retries are **only safe** if you send an idempotency key. Otherwise remove POST from the set (see §5).

---

### 1.2 Always pass a \`timeout\`
The default is *no timeout*. A hung server hangs your pipeline forever.

\`\`\`python
r = session.get(url, timeout=(5, 30))    # (connect_timeout, read_timeout)
\`\`\`

Pin a project-wide default via a wrapper:

\`\`\`python
from functools import wraps

def _with_default_timeout(request_fn, default):
    @wraps(request_fn)
    def wrapper(method, url, **kwargs):
        kwargs.setdefault("timeout", default)
        return request_fn(method, url, **kwargs)
    return wrapper
\`\`\`

Every senior code review flags a \`requests\` call without a timeout.

---

### 1.3 Response handling — check, don't hope

\`\`\`python
r = session.get(url, params={"page": 1})
r.raise_for_status()                     # raises HTTPError on 4xx / 5xx
data = r.json()                          # raises ValueError on non-JSON body
\`\`\`

- \`raise_for_status()\` converts a bad status into an exception with the URL and status code baked in.
- Catch \`requests.exceptions.RequestException\` — it's the parent of all requests errors (connection, timeout, HTTP, JSON).

---

### 1.4 \`httpx\` — when you need it
Reach for \`httpx\` when:
- You want the *same* client interface across sync and async.
- You need HTTP/2.
- You want a first-class \`timeout\` object.

Otherwise \`requests\` is the default. Don't chase novelty in enterprise DE code.`,
    },
    {
      heading: 'Authentication — the four patterns you\'ll actually meet',
      subheading: 'API keys, HTTP Basic, OAuth2 client-credentials with double-checked locks, and refresh tokens',
      content: `### 2.1 API key in a header

\`\`\`python
session.headers["X-API-Key"] = os.environ["VENDOR_API_KEY"]
\`\`\`

Simplest. Key never expires; if it leaks it's a full-severity incident. Store in a secret store, load into env at runtime, rotate on schedule.

---

### 2.2 HTTP Basic

\`\`\`python
session.auth = (user, password)
\`\`\`

Sends \`Authorization: Basic base64(user:password)\` on every request. Only acceptable over HTTPS. Common in legacy vendor APIs.

---

### 2.3 OAuth 2.0 — client credentials (the enterprise default)
Machine-to-machine. You have a \`client_id\` + \`client_secret\`. You POST them to a token endpoint and get back a short-lived \`access_token\`.

\`\`\`python
import time, threading

class TokenProvider:
    """Thread-safe cached OAuth2 client-credentials token."""

    def __init__(self, token_url: str, client_id: str, client_secret: str, scope: str | None = None):
        self._token_url = token_url
        self._client_id = client_id
        self._client_secret = client_secret
        self._scope = scope
        self._token: str | None = None
        self._expires_at: float = 0.0
        self._lock = threading.Lock()
        self._session = requests.Session()

    def get(self) -> str:
        # Refresh 60s before actual expiry to avoid mid-request expiration
        if self._token and time.time() < self._expires_at - 60:
            return self._token
        with self._lock:
            if self._token and time.time() < self._expires_at - 60:
                return self._token
            self._token, self._expires_at = self._fetch()
            return self._token

    def _fetch(self) -> tuple[str, float]:
        data = {
            "grant_type": "client_credentials",
            "client_id": self._client_id,
            "client_secret": self._client_secret,
        }
        if self._scope:
            data["scope"] = self._scope
        r = self._session.post(self._token_url, data=data, timeout=(5, 15))
        r.raise_for_status()
        payload = r.json()
        return payload["access_token"], time.time() + int(payload["expires_in"])
\`\`\`

Then a small auth-attaching hook:

\`\`\`python
def bearer_auth(session: requests.Session, provider: TokenProvider) -> None:
    def _attach(request):
        request.headers["Authorization"] = f"Bearer {provider.get()}"
        return request
    session.auth = _attach
\`\`\`

- **Double-checked lock** so concurrent threads don't fetch the same token twice.
- **Refresh early** (60s before expiry) so an in-flight request doesn't fail on the boundary.
- **Never** log the token. Never persist it beyond the process.

---

### 2.4 OAuth 2.0 — authorization code + refresh token
Interactive user flow. Rare in server-side DE ingestion; more common when pulling user data from Google/Microsoft. If asked in an interview, know the flow at a high level (redirect → code → exchange for tokens → cache refresh token → use it to mint new access tokens), and know that the **refresh token itself is a long-lived secret**.`,
    },
    {
      heading: 'Pagination — the four schemes, one signature',
      subheading: 'Offset/limit drift, page numbering, cursor tokens, RFC 5988 Link headers, and watermarking',
      content: `Every public API paginates. You need to know which of these you're looking at and factor them behind a common iterator.

### 3.1 Offset / limit
\`\`\`
GET /orders?limit=500&offset=0
GET /orders?limit=500&offset=500
GET /orders?limit=500&offset=1000
\`\`\`
**Problem:** if new rows are inserted while you're paging, you get **duplicates or skips** because offsets shift. Fine for one-shot pulls; dangerous for long-running or incremental jobs.

---

### 3.2 Page number
\`\`\`
GET /orders?page=1&size=500
GET /orders?page=2&size=500
\`\`\`
Same underlying mechanic as offset — same drift risk.

---

### 3.3 Cursor / next-token (the good one)
\`\`\`
GET /orders?limit=500
→ { "data": [...], "next_cursor": "abc123" }
GET /orders?limit=500&cursor=abc123
→ { "data": [...], "next_cursor": null }
\`\`\`
- Stable under concurrent inserts.
- Server decides ordering and continuation — the client can't corrupt it.
- **Prefer this** whenever the API offers it.

---

### 3.4 \`Link\` header (RFC 5988) — GitHub-style
\`\`\`
Link: <https://api.example.com/orders?page=2>; rel="next", <...>; rel="last"
\`\`\`
Response headers include \`rel="next"\`; you follow it until it's gone.

---

### 3.5 One iterator to rule them all
The senior pattern is a generator that yields records irrespective of scheme:

\`\`\`python
def paginate_cursor(session, url, params=None, *, page_size=500):
    params = dict(params or {})
    params["limit"] = page_size
    cursor = None
    while True:
        if cursor:
            params["cursor"] = cursor
        r = session.get(url, params=params, timeout=(5, 30))
        r.raise_for_status()
        payload = r.json()
        for rec in payload["data"]:
            yield rec
        cursor = payload.get("next_cursor")
        if not cursor:
            return
\`\`\`

Caller doesn't know or care that it's cursor-based:

\`\`\`python
for order in paginate_cursor(session, "https://api.example.com/orders"):
    sink.write(order)
\`\`\`

Swap the internal implementation to \`Link\` header or offset-based — the consumer contract is unchanged. **This is what "abstract at the boundary" means in practice.**

---

### 3.6 Watermarking on top of pagination

\`\`\`python
def paginate_incremental(session, url, *, since: datetime, page_size=500):
    params = {"updated_since": since.isoformat(), "limit": page_size, "order": "updated_at:asc"}
    cursor = None
    max_seen = since
    while True:
        if cursor:
            params["cursor"] = cursor
        r = session.get(url, params=params, timeout=(5, 30))
        r.raise_for_status()
        payload = r.json()
        for rec in payload["data"]:
            ts = datetime.fromisoformat(rec["updated_at"])
            if ts > max_seen:
                max_seen = ts
            yield rec
        cursor = payload.get("next_cursor")
        if not cursor:
            break
    return max_seen
\`\`\`

**Rules that keep you out of trouble:**
1. **Ask the API for ascending order by the watermark column.** Otherwise you can't track "max seen" reliably in a stream.
2. **Persist the new watermark only after the write is committed** — otherwise a crash mid-write loses rows.
3. **Overlap the window** (e.g., pull \`since = last_max - 5 minutes\`) so late-arriving updates are re-fetched. Combined with an upsert sink, this makes the pipeline **at-least-once + idempotent = effectively-once**.`,
    },
    {
      heading: 'Retry, backoff, and rate limits — the industrial version',
      subheading: 'Application-level retries with full jitter, honoring Retry-After, and TokenBucket limiters',
      content: `The \`urllib3.Retry\` in §1.1 handles most cases. Two situations warrant an application-level retry decorator:
1. You need retries around code that's *not* a raw HTTP call (a DB write, a JSON parse of a suspect payload).
2. You want per-call custom logic (log the attempt, only retry certain exception types, custom jitter).

### 4.1 The retry decorator

\`\`\`python
import functools, random, time, logging
log = logging.getLogger(__name__)

class RetryableError(Exception):
    """Marker: caller has decided this is safe to retry."""

def retry(
    *,
    max_attempts: int = 5,
    base_delay: float = 0.5,
    max_delay: float = 60.0,
    retry_on: tuple[type[BaseException], ...] = (RetryableError,),
    jitter: float = 0.5,
):
    """Exponential backoff with full jitter."""
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return fn(*args, **kwargs)
                except retry_on as e:
                    if attempt == max_attempts:
                        log.error("giving up fn=%s attempt=%d err=%s", fn.__name__, attempt, e)
                        raise
                    delay = min(base_delay * (2 ** (attempt - 1)), max_delay)
                    delay = delay * (1 - jitter) + random.random() * delay * jitter
                    log.warning("retrying fn=%s attempt=%d in %.2fs err=%s",
                                fn.__name__, attempt, delay, e)
                    time.sleep(delay)
        return wrapper
    return decorator
\`\`\`

Then wrap only the code where retry makes sense:

\`\`\`python
@retry(max_attempts=5, retry_on=(RetryableError, requests.ConnectionError, requests.Timeout))
def fetch_page(session, url, cursor):
    r = session.get(url, params={"cursor": cursor}, timeout=(5, 30))
    if r.status_code == 429 or r.status_code >= 500:
        raise RetryableError(f"http {r.status_code}")
    r.raise_for_status()
    return r.json()
\`\`\`

**Why full jitter?**
\`sleep(base * 2^n)\` on 100 workers → they all wake at the same instant and DDoS the recovering server ("thundering herd"). Jitter randomizes the wake-up so load spreads.

---

### 4.2 Respect \`Retry-After\`
If the server hands you a hint, use it:

\`\`\`python
def _sleep_for_retry_after(response, fallback):
    ra = response.headers.get("Retry-After")
    if ra is None:
        time.sleep(fallback); return
    try:
        time.sleep(min(float(ra), 300))          # numeric seconds
    except ValueError:
        time.sleep(fallback)
\`\`\`

---

### 4.3 Client-side rate limiting with TokenBucket

\`\`\`python
import threading, time

class TokenBucket:
    """Simple thread-safe rate limiter — N tokens per second, bursts up to capacity."""

    def __init__(self, rate_per_second: float, capacity: int | None = None):
        self._rate = rate_per_second
        self._capacity = capacity or max(1, int(rate_per_second))
        self._tokens = float(self._capacity)
        self._last = time.monotonic()
        self._lock = threading.Lock()

    def take(self, n: int = 1) -> None:
        while True:
            with self._lock:
                now = time.monotonic()
                self._tokens = min(self._capacity, self._tokens + (now - self._last) * self._rate)
                self._last = now
                if self._tokens >= n:
                    self._tokens -= n
                    return
                wait = (n - self._tokens) / self._rate
            time.sleep(wait)
\`\`\`

Usage:
\`\`\`python
limiter = TokenBucket(rate_per_second=10, capacity=20)   # 10 rps, allow bursts to 20

for cursor in cursors:
    limiter.take()
    fetch_page(session, url, cursor)
\`\`\``,
    },
    {
      heading: 'Idempotency — the single most important pipeline property',
      subheading: 'Where duplicates come from, MERGE vs overwrite, and deterministic POST idempotency keys',
      content: `A pipeline is **idempotent** if running it twice on the same input produces the same final state. This is what makes retries safe.

### 5.1 Where duplicates come from
1. **The orchestrator retried a failed step** whose write partially succeeded.
2. **The API returned a page twice** because of an offset-shift under concurrent inserts.
3. **The upstream re-sent the same event** (at-least-once queue semantics).
4. **The pipeline ran on overlapping windows** by design (see §3.6).

---

### 5.2 Four ways to be idempotent

| Technique | How | When to use |
|---|---|---|
| **MERGE / UPSERT on primary key** | Target \`MERGE\` from staging on the natural key | Any table with a stable business key |
| **Overwrite by partition** | Write the full partition to a tmp path, then swap | Time-partitioned append tables |
| **Dedup on ingest** | Set on \`event_id\` before write | Event streams with duplicates |
| **Idempotency key on POST** | \`Idempotency-Key: <uuid>\` header — server dedupes | When you're the *producer* into an external API |

---

### 5.3 The write-side pattern in Python (staging + MERGE)

\`\`\`
1. Extract  → write to  s3://.../orders/staging/run_id=abc/
2. Validate → count rows, check schema, reject file if bad
3. Load     → MERGE staging INTO target ON pk
4. On success: record run_id + watermark in the audit table
5. On failure: leave staging in place; next run replays from same run_id
\`\`\`

- **Staging path is keyed by \`run_id\`.** Re-running the same \`run_id\` overwrites its own staging, so no duplicates in the staging area.
- **MERGE is idempotent** as long as the source is deterministic (same source rows → same target state).
- **Watermark is written last** so a crash before that step causes the next run to re-pull the same window — safe, because MERGE dedupes.

---

### 5.4 The \`POST\` idempotency key

\`\`\`python
for order in outbound:
    idempotency_key = f"orders:{order['id']}"          # deterministic, not a random UUID
    session.post(url, json=order, headers={"Idempotency-Key": idempotency_key})
\`\`\`

> **Senior line:** Use a **deterministic** key derived from the payload's identity — not \`uuid.uuid4()\` — so retries produce the *same* key and the server can dedupe. Random UUIDs defeat the purpose.`,
    },
    {
      heading: 'Restartability — designing for the crash you will have',
      subheading: 'Checkpoints, atomic commits, and the kill -9 mental test',
      content: `A restartable pipeline can be re-run after any failure and converge to the correct state without human editing. Three rules:

1. **Checkpoint after each durable side effect, not before.**
   - Write to target → **then** advance the watermark. Never the reverse.
2. **Make every write atomic or transactional.**
   - Files: \`.tmp\` + rename. Warehouses: single-statement \`MERGE\` or \`INSERT OVERWRITE\`.
   - Never leave a target in a "half-loaded" state.
3. **Assume every step will retry.**
   - Every side effect must be idempotent (see §5).
   - Every read must be deterministic given the same watermark + \`run_id\`.

> **The kill -9 mental test:** If I \`kill -9\` the process at each line of this pipeline, is the next run correct? If any line breaks that, add a checkpoint or make the operation atomic.`,
    },
    {
      heading: 'Metadata-driven pipeline — the framework skeleton',
      subheading: 'Source/Sink typing protocols, audit tables, watermark tables, and per-table failure isolation',
      content: `The JD's \`metadata-driven pipelines\` bullet is what you're being tested on here. Instead of writing one pipeline per source table, write **one engine** that reads a config table and drives itself.

### 7.1 The metadata contract

\`\`\`sql
CREATE TABLE ingest_metadata (
    source_system     STRING,
    source_object     STRING,
    source_type       STRING,        -- 'rest' | 's3_ndjson' | 'db'
    endpoint          STRING,        -- URL or path or query
    target_schema     STRING,
    target_table      STRING,
    load_type         STRING,        -- 'full' | 'incremental' | 'cdc'
    watermark_column  STRING,
    primary_key       ARRAY<STRING>,
    active            BOOLEAN,
    schedule          STRING,
    owner             STRING
);
\`\`\`

---

### 7.2 Framework layout

\`\`\`
mypipe/
├── mypipe/
│   ├── __init__.py
│   ├── config.py               # pydantic-settings; env, secrets
│   ├── metadata.py             # read the metadata table into TableSpec objects
│   ├── sources/
│   │   ├── base.py             # Source protocol
│   │   ├── rest.py             # REST + auth + pagination + retry
│   │   └── s3_ndjson.py        # S3 / ADLS NDJSON reader
│   ├── sinks/
│   │   ├── base.py             # Sink protocol
│   │   ├── delta.py            # Delta / Databricks sink
│   │   └── snowflake.py        # Snowflake stage + COPY + MERGE
│   ├── audit.py                # run_id, start/end/rows/status
│   ├── watermark.py            # get/put watermark
│   ├── retry.py                # decorators from §4
│   ├── run.py                  # the engine
│   └── main.py                 # CLI entry
├── tests/
└── pyproject.toml
\`\`\`

---

### 7.3 Source and Sink Protocols

\`\`\`python
from typing import Protocol, Iterable

class Source(Protocol):
    def read(self, *, since=None) -> Iterable[dict]: ...

class Sink(Protocol):
    def write(self, rows: Iterable[dict], *, run_id: str, spec) -> int: ...
\`\`\`

---

### 7.4 The engine loop

\`\`\`python
def run_one(spec, session, audit, watermark, source_factory, sink_factory) -> None:
    run_id = audit.start(spec)
    try:
        since = watermark.get(spec) if spec.load_type == "incremental" else None
        src   = source_factory(spec, session)
        sink  = sink_factory(spec)

        rows_iter = src.read(since=since)
        rows_iter = _observe(rows_iter, count_into=audit, run_id=run_id)   # tap for row count

        n = sink.write(rows_iter, run_id=run_id, spec=spec)

        # Compute new watermark from the observed max, then persist LAST.
        new_wm = audit.max_watermark(run_id, spec.watermark_column)
        if spec.load_type == "incremental" and new_wm is not None:
            watermark.put(spec, new_wm)

        audit.finish(run_id, rows=n, status="SUCCESS")
    except Exception as e:
        log.exception("run failed spec=%s.%s", spec.source_system, spec.source_object)
        audit.finish(run_id, rows=0, status="FAILED", error=str(e))
        raise


def run_all(specs, **deps):
    for spec in specs:
        if not spec.active:
            continue
        try:
            run_one(spec, **deps)
        except Exception:
            continue                       # per-table failure isolation
\`\`\`

**Design choices in this architecture:**
- **Watermark persisted last** → restartable.
- **Row count observed via generator tap** without materializing stream → constant memory.
- **Per-table isolation** → one failing upstream does not crash the entire ingestion schedule.
- **Separate audit and watermark tables** → audit is append-only; watermark is upsert.`,
    },
    {
      heading: 'Concurrency for API ingestion',
      subheading: 'Bounded ThreadPoolExecutor, partition fan-out vs cursor stream constraints',
      content: `You already know threads for I/O, processes for CPU (Part 01 §9). For API ingestion specifically:

### 8.1 Pattern: bounded \`ThreadPoolExecutor\` behind the paginator

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed

def fan_out(session, cursors, worker=8, limiter=None):
    def _one(cursor):
        if limiter: limiter.take()
        return fetch_page(session, cursor)

    with ThreadPoolExecutor(max_workers=worker) as pool:
        futures = [pool.submit(_one, c) for c in cursors]
        for fut in as_completed(futures):
            yield from fut.result()["data"]
\`\`\`

- \`max_workers\` is a **rate-limit knob**, not just a performance knob. Match it to the API's tolerance.
- Combine with the token bucket for hard ceilings.
- **Important Constraint:** For strict *cursor* pagination you *cannot* fan out — each call depends on the previous cursor. Fan-out works for **partitioned** ingestion (per-date, per-tenant, per-region) or when the API exposes shard tokens.`,
    },
    {
      heading: 'Ingest observability',
      subheading: 'Reconciliation math, metrics inventory, and zero-row-loss invariant',
      content: `Emit these on every run, ideally as structured JSON log records so they're indexable:

| Field | Purpose |
|---|---|
| \`run_id\` | Correlate logs across steps and services |
| \`source_system\`, \`source_object\` | Which contract |
| \`load_type\` | full / incremental / cdc |
| \`since\`, \`until\` | Watermark window |
| \`rows_in\`, \`rows_out\`, \`rows_rejected\` | Reconciliation |
| \`bytes_in\`, \`bytes_out\` | Throughput and cost signals |
| \`duration_ms\` | Detect regressions |
| \`retries\`, \`rate_limited_count\` | Detect upstream trouble |
| \`status\` | SUCCESS / FAILED |
| \`error_class\`, \`error_message\` | Failure triage |

> **The invariant:** \`rows_in - rows_out - rows_rejected == 0\` — always. If it's not, the pipeline lost rows silently, which is a Sev-2 in most engineering organizations.`,
    },
    {
      heading: 'Common mistakes (interview traps)',
      subheading: 'Fourteen high-frequency API, retry, and watermark mistakes',
      content: `| Mistake | Why it fails | Fix |
|---|---|---|
| \`requests.get(url)\` in a loop | New TCP + TLS each call; slow and rude | Use a \`Session\` with connection pooling |
| No \`timeout=\` | Pipeline hangs forever on a wedged server | Always pass \`timeout=(connect, read)\` |
| Retrying \`POST\` without an idempotency key | Duplicated writes downstream | Deterministic \`Idempotency-Key\` header |
| Blind \`sleep(2 ** attempt)\` on 100 workers | Thundering herd | Full jitter |
| Ignoring \`Retry-After\` | Gets you banned or 429-looped | Respect the header |
| Offset pagination on a live table | Duplicates and skips | Cursor pagination; ascending order by watermark |
| Advancing watermark before the write commits | Crash → data loss | Persist watermark **last** |
| Random UUID for idempotency key | Server can't dedupe | Deterministic key from payload identity |
| Logging the bearer token | Credential leak | Redact; scrub known secret patterns |
| Merging without a stable PK | Duplicates in target | Fix the PK before you build the pipeline |
| Retrying a \`400\` | Bug, not transient | Only retry \`429\` and \`5xx\` |
| Writing directly to the target table | Half-written state on failure | Staging path per \`run_id\`, then MERGE |
| Fan-out on strict cursor pagination | Duplicates or gaps | Fan out per-partition, not within a cursor stream |
| One giant pipeline function | Nothing testable, nothing reusable | Source/Sink protocols + engine |`,
    },
    {
      heading: 'Follow-up questions a senior interviewer will actually ask',
      subheading: 'High-probability defensive questions in senior API pipeline rounds',
      content: `- **"You're fanning out across 200 tenants. How do you avoid one tenant's rate limit poisoning the whole pool?"**
- **"The vendor's cursor changed format mid-run and now returns invalid cursors. What does your pipeline do, and what should it do?"**
- **"A \`POST\` succeeds on the server but the response times out. How does your retry logic avoid a duplicate?"**
- **"The metadata table has 300 rows. How do you keep one bad table from starving the others?"**
- **"The watermark is \`updated_at\`, and the source clock drifts by seconds. What breaks, and how do you fix it?"**
- **"The vendor doesn't paginate — the endpoint returns everything in one call, sometimes 10 GB. Rewrite the source."**
- **"The API doesn't send \`Retry-After\` on \`429\`. What's your policy?"**
- **"Show me exactly which line advances the watermark, and defend the order."**`,
    },
    {
      heading: 'Hands-on exercises',
      subheading: 'Five exercises: paginators, full-jitter retries, token buckets, and metadata engines',
      content: `### Exercise 1 — Robust paginator
Implement \`paginate(session, url, scheme)\` where \`scheme\` is one of \`"offset"\`, \`"page"\`, \`"cursor"\`, \`"link"\`. Yield records regardless of scheme. Add ascending watermark support (\`updated_since\`) for \`cursor\`. Verify that swapping schemes doesn't require changes to the consumer.

### Exercise 2 — Retry decorator
Implement \`@retry(...)\` from §4 with **full jitter** and \`Retry-After\` honoring. Prove with a unit test using a fake clock that (a) it does not retry \`ValueError\`, (b) \`Retry-After: 5\` produces a 5-second wait, (c) the total delay across 5 attempts stays under the configured cap.

### Exercise 3 — Token bucket
Implement \`TokenBucket(rate, capacity)\`. Prove with a test that N requests take at least \`(N - capacity) / rate\` seconds when \`N > capacity\`, and are essentially instantaneous when \`N <= capacity\`.

### Exercise 4 — Idempotent bronze loader
Given a REST source with cursor pagination and \`updated_at\` watermark, write a loader that (a) reads records into a staging Parquet file at \`bronze/staging/{table}/run_id={run_id}/\`, (b) MERGEs staging into \`bronze.{table}\` on PK, (c) records \`run_id\`, rows, watermark in an audit table, (d) persists the new watermark **only after** the MERGE commits. Prove idempotency by running twice on the same window.

### Exercise 5 — Metadata-driven engine
Implement the framework in §7 with two source types (\`rest\`, \`s3_ndjson\`) and one sink type (\`delta\` — mock it with local Parquet). Read the metadata from a JSON file. Add a \`--only source.object\` flag to run a subset. Prove per-table failure isolation with a test where one spec throws.`,
    },
    {
      heading: 'Quick revision — the 20 bullets',
      subheading: 'Rapid 3-minute checklist of industrial API integration and ETL engineering',
      content: `1. Use a \`requests.Session\` with an \`HTTPAdapter\` + \`Retry\`; never one-shot \`requests.get\`.
2. Always pass a \`timeout=(connect, read)\`.
3. Retry \`429\` and \`5xx\` only; never \`4xx\`.
4. Exponential backoff with **full jitter**; respect \`Retry-After\`.
5. Cursor pagination > offset/page; ascending order by watermark.
6. Factor pagination behind a generator so consumers are scheme-agnostic.
7. Watermark persisted **after** the sink commits — never before.
8. Overlap the incremental window slightly + upsert = effectively-once.
9. MERGE / upsert on PK is the default idempotency mechanism.
10. Deterministic \`Idempotency-Key\` for outbound \`POST\`s — never random UUIDs.
11. Cache OAuth bearer tokens with a double-checked lock; refresh 60s early.
12. Never log tokens; redact at the boundary.
13. Shared \`TokenBucket\` per source for hard rate ceilings; \`max_workers\` is a rate knob.
14. Fan out per-partition, not within a strict cursor stream.
15. Staging path per \`run_id\`; MERGE from staging; never write to target directly.
16. Audit table (append) and watermark table (upsert) are separate.
17. \`Source\` and \`Sink\` protocols → interchangeable behind the engine.
18. Metadata table is the contract; onboarding a table = \`INSERT\`, not code.
19. Per-table failure isolation in the engine loop.
20. Emit structured logs with \`run_id\`, \`rows_in\`, \`rows_out\`, \`retries\`, \`duration_ms\`.`,
    },
  ],
};
