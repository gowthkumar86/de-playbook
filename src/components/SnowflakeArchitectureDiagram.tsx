import React, { useState, useEffect } from 'react';
import {
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  HardDrive,
  Sparkles,
  Server,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Info,
  Check,
  Copy,
  ChevronRight,
  Workflow,
  Compass,
  ArrowDown,
  ArrowRight,
  Sliders,
  ExternalLink,
  Code,
  Image as ImageIcon,
  X,
  BookOpen
} from 'lucide-react';
import { ArchitectureFigure } from './ArchitectureFigure';

export interface OfficialDiagramItem {
  id: string;
  title: string;
  src: string;
  badge: string;
  subtitle: string;
  description: string;
  seniorNote: string;
  tags: string[];
}

export const OFFICIAL_DIAGRAMS: OfficialDiagramItem[] = [
  {
    id: '3-layer-arch',
    title: 'Snowflake 3-Layer Architecture Overview',
    src: '/images/snowflake/architecture-overview.png',
    badge: 'CORE ENGINE BLUEPRINT',
    subtitle: 'Decoupled Cloud Services, Multi-Cluster Query Processing & Database Storage',
    description:
      'The definitive architectural blueprint illustrating the separation of Cloud Services (Authentication, Infrastructure, Optimizer, Metadata, Security), Multi-Cluster Query Processing (Virtual Warehouses), and Centralized Database Storage (Optimized Columnar Micro-Partitions).',
    seniorNote:
      'The multi-tenant Cloud Services layer acts as the brain, while independent stateless Virtual Warehouses handle query processing without data movement, accessing shared storage directly.',
    tags: ['Decoupled', 'Control Plane', 'MPP Virtual Warehouses', 'Columnar Storage']
  },
  {
    id: 'micro-partitions',
    title: 'Micro-Partitioning & Metadata Column Pruning',
    src: '/images/snowflake/tables-clustered1.png',
    badge: 'STORAGE INTERNALS',
    subtitle: 'Physical Data Layout with Embedded Min/Max Column Headers',
    description:
      'Shows how a logical table is divided into contiguous, immutable micro-partitions (50-500MB uncompressed) with columnar structure and min/max metadata registered in Cloud Services for partition pruning.',
    seniorNote:
      'No index maintenance required. The query planner compares WHERE predicates against partition headers in Cloud Services to eliminate non-matching micro-partitions prior to compute dispatch.',
    tags: ['Pax Columnar', 'Micro-Partitions', 'Min/Max Stats', 'FoundationDB']
  },
  {
    id: 'clustering-ratio',
    title: 'Clustering Depth & Overlapping Partitions',
    src: '/images/snowflake/tables-clustering-ratio.png',
    badge: 'PERFORMANCE TUNING',
    subtitle: 'Partition Overlap vs Clustering Efficiency',
    description:
      'Illustrates how wide value ranges across micro-partitions cause overlap, increasing clustering depth and forcing queries to scan more partitions than necessary.',
    seniorNote:
      'Monitor SYSTEM$CLUSTERING_DEPTH. When clustering depth approaches total micro-partitions, queries degrade to full-table scans—the signal to consider Auto-Clustering or synthetic sorting.',
    tags: ['Clustering Depth', 'Overlap', 'Auto-Clustering', 'Scan Efficiency']
  },
  {
    id: 'streams-tasks',
    title: 'Continuous CDC Data Pipeline (Streams & Tasks)',
    src: '/images/snowflake/data-pipeline-streams.png',
    badge: 'DATA ENGINEERING PIPELINE',
    subtitle: 'Event-Driven CDC Ingestion and Change Propagation',
    description:
      'Diagram of end-to-end continuous data pipelines using Snowpipe for staging ingestion, Table Streams for tracking incremental row changes (INSERT/UPDATE/DELETE), and Tasks for orchestrating transforms.',
    seniorNote:
      'Streams add ZERO physical storage overhead; they maintain an offset pointer into the source table’s immutable Time Travel history.',
    tags: ['CDC', 'Table Streams', 'Tasks', 'Snowpipe']
  },
  {
    id: 'stream-offset',
    title: 'Stream Offset & Transactional History Pointer',
    src: '/images/snowflake/table-streams-offset.png',
    badge: 'STORAGE & CDC',
    subtitle: 'Immutable Point-in-Time Change Tracking Offset',
    description:
      'Details how a Snowflake Stream creates an offset pointer into the source table snapshot history, consuming deltas transactionally on downstream DML commits.',
    seniorNote:
      'When a stream is read in a DML transaction (INSERT/MERGE), the offset advances atomically only if the transaction successfully commits.',
    tags: ['Stream Offset', 'Snapshot Isolation', 'ACID Commits']
  },
  {
    id: 'iceberg-managed',
    title: 'Apache Iceberg Tables: Snowflake as Iceberg Catalog',
    src: '/images/snowflake/tables-iceberg-snowflake-as-catalog.svg',
    badge: 'OPEN LAKEHOUSE',
    subtitle: 'Snowflake Managed Iceberg Table Architecture',
    description:
      'Architecture diagram showing Snowflake acting as the Iceberg Catalog while Parquet data and Iceberg metadata files reside in customer-managed cloud object storage.',
    seniorNote:
      'Provides read/write for Snowflake compute while enabling external engines (Spark, Trino, Flink) to read data files directly via the open Iceberg REST catalog interface.',
    tags: ['Apache Iceberg', 'Open Catalog', 'Parquet', 'Zero Lock-in']
  },
  {
    id: 'iceberg-external',
    title: 'Apache Iceberg Tables: External Catalog Integration',
    src: '/images/snowflake/tables-iceberg-external-catalog.svg',
    badge: 'OPEN LAKEHOUSE',
    subtitle: 'Unmanaged Iceberg with AWS Glue / Polaris / Hive Metastore',
    description:
      'Architecture diagram of Snowflake reading from an external Iceberg catalog (AWS Glue, Apache Polaris, Hive Metastore) with Parquet data in customer cloud storage.',
    seniorNote:
      'Snowflake acts as a high-performance compute engine over existing data lake tables without requiring data migration or ingestion pipelines.',
    tags: ['External Catalog', 'AWS Glue', 'Polaris', 'Multi-Engine']
  },
  {
    id: 'data-sharing',
    title: 'Secure Data Sharing Architecture',
    src: '/images/snowflake/data-sharing-overview.png',
    badge: 'DATA COLLABORATION',
    subtitle: 'Zero-Copy Metadata Grant to Consumer Accounts',
    description:
      'Diagram illustrating how Provider accounts grant read access to Consumer accounts via metadata shares without copying data, creating FTP pipelines, or paying egress fees.',
    seniorNote:
      'Consumers run queries using their own Virtual Warehouse compute against the provider’s shared storage; providers incur no compute charges for consumer queries.',
    tags: ['Secure Sharing', 'Reader Accounts', 'Zero-Copy', 'Cross-Account']
  },
  {
    id: 'qas',
    title: 'Query Acceleration Service (QAS) Distributed Scan',
    src: '/images/snowflake/query-acceleration-table-scan.png',
    badge: 'BURST COMPUTE',
    subtitle: 'Offloading Massive Table Scans to Serverless Compute',
    description:
      'Diagram demonstrating how a Virtual Warehouse dynamically offloads heavy table scan and filtering operations to serverless compute resources when processing large datasets.',
    seniorNote:
      'QAS prevents ad-hoc analytical queries with heavy scans from starving or blocking scheduled ETL workloads on shared warehouses.',
    tags: ['QAS', 'Serverless Burst', 'Table Scans', 'FinOps']
  }
];

interface SubsystemItem {
  id: string;
  name: string;
  shortDesc: string;
  tag?: string;
  tagColor?: string;
  mechanics: string;
  seniorPoint: string;
  costImpact: string;
  icon: React.ElementType;
}

interface LayerData {
  id: 'services' | 'compute' | 'storage';
  title: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  colorBorder: string;
  colorBg: string;
  icon: React.ElementType;
  summary: string;
  keyStats: string[];
  subsystems: SubsystemItem[];
}

const LAYERS: LayerData[] = [
  {
    id: 'services',
    title: '1. Cloud Services Layer (Control Plane)',
    subtitle: 'Multi-Tenant · Globally Distributed · Always-On Orchestration',
    badge: 'FREE UP TO 10% COMPUTE',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    colorBorder: 'border-amber-400 dark:border-amber-700',
    colorBg: 'bg-amber-50/40 dark:bg-amber-950/20',
    icon: ShieldCheck,
    summary:
      'Brain of Snowflake running on multi-tenant stateless microservices. Backed by FoundationDB for transactional metadata. Coordinates authentication, query parsing, cost-based optimization, partition pruning, and unified governance without burning warehouse credits.',
    keyStats: ['Latency: <5ms metadata', 'Multi-tenant', 'Zero idle cost', 'FoundationDB KV'],
    subsystems: [
      {
        id: 'metadata-store',
        name: 'Metadata Store (FoundationDB)',
        shortDesc: 'Min/Max stats, partition file paths, column dictionary, version history',
        tag: 'CRITICAL',
        tagColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
        mechanics:
          'Distributed transactional key-value store holding the micro-partition catalog. Records exact min/max bounds, null counts, and distinct value cardinality per column chunk. Powers zero-cost metadata queries (COUNT(*), MAX(ts)) and compiles prune trees before compute execution.',
        seniorPoint:
          'Because metadata is decoupled, Snowflake prunes unneeded micro-partitions in Cloud Services before allocating worker threads, preventing gigabytes of wasteful I/O.',
        costImpact: 'Free metadata lookups; does not consume Virtual Warehouse credits.',
        icon: Database
      },
      {
        id: 'query-optimizer',
        name: 'Query Optimizer & Planner',
        shortDesc: 'Cost-Based Optimizer (CBO), predicate pushdown, join graph reordering',
        tag: 'CBO',
        tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
        mechanics:
          'Compiles SQL Abstract Syntax Trees (AST) into vectorized physical execution plans. Evaluates join ordering, applies transitive predicates, decides between Broadcast vs Hash distribution, and injects runtime dynamic partition filtering filters.',
        seniorPoint:
          'Interview key: Explain that the optimizer generates a deterministic execution tree and pushes partition pruning down to Cloud Services, sending only a list of micro-partition URLs to the warehouse.',
        costImpact: 'Zero direct credit consumption (covered under Cloud Services 10% allowance).',
        icon: Zap
      },
      {
        id: 'result-cache',
        name: 'Persisted Result Cache',
        shortDesc: 'Exact query syntax cache stored in Cloud Services (24h to 31 days)',
        tag: '24H CACHE',
        tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
        mechanics:
          'Retains full query result sets in Cloud Services for 24 hours (resetting each time queried, up to 31 days max). Requires 100% exact SQL string match, unchanged underlying micro-partition metadata, and compatible role context. Completely bypasses Virtual Warehouses.',
        seniorPoint:
          'Senior distinction: Result Cache lives in Cloud Services (0 warehouse credits, ~50ms return), whereas the Local SSD Cache lives on worker nodes (consumes warehouse uptime). Non-deterministic functions like CURRENT_TIMESTAMP() prevent result cache reuse.',
        costImpact: '$0.00 compute cost when hit; ideal for repetitive executive dashboards.',
        icon: HardDrive
      },
      {
        id: 'security-governance',
        name: 'Security, RBAC & Horizon',
        shortDesc: 'MFA, OAuth, Tag-based Dynamic Data Masking, Row-Access Policies & Lineage',
        tag: 'HORIZON',
        tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300',
        mechanics:
          'Evaluates discretionary access control (DAC) and role-based access control (RBAC) graphs. Dynamically injects column masking expressions and row-access filter subqueries directly into the execution plan at compile time, ensuring data never leaks to unauthorized roles.',
        seniorPoint:
          'In modern 2026 architectures, Snowflake Horizon provides unified classification, lineage, and cross-cloud governance across both internal tables and external Apache Iceberg tables.',
        costImpact: 'Zero compute overhead for policy compilation; evaluation occurs inside worker nodes.',
        icon: ShieldCheck
      },
      {
        id: 'polaris-catalog',
        name: 'Apache Polaris & Iceberg REST',
        shortDesc: 'Open Catalog specification enabling vendor-neutral multi-engine interoperability',
        tag: 'OPEN LAKEHOUSE',
        tagColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300',
        mechanics:
          'Open-source Iceberg REST catalog implementation hosted in Cloud Services. Stores snapshot manifests and pointers for Apache Iceberg tables. Allows Spark, Trino, Flink, and DuckDB to access identical storage without going through Snowflake compute.',
        seniorPoint:
          'Snowflake open-sourced Polaris to prevent Databricks Unity Catalog lock-in. It decouples the catalog plane itself from the Snowflake execution engine.',
        costImpact: 'Included in Cloud Services; eliminates cross-engine data duplication costs.',
        icon: Workflow
      },
      {
        id: 'cortex-ai',
        name: 'Cortex AI & Agentic Control',
        shortDesc: 'Cortex Analyst (Text-to-SQL), Cortex Search (Hybrid RAG) & Agent orchestration',
        tag: 'GEN AI',
        tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
        mechanics:
          'Cloud Services hosts the semantic layer and LLM orchestration gateway. Cortex Analyst accepts natural language prompts, parses semantic YAML models, and synthesizes syntactically validated SQL against table schemas.',
        seniorPoint:
          'Cortex Agents act as a multi-step cognitive loop that autonomously plans tasks, executes SQL queries via Cortex Analyst, and performs vector semantic searches via Cortex Search.',
        costImpact: 'Billed per token / prompt execution credits separate from Virtual Warehouses.',
        icon: Sparkles
      }
    ]
  },
  {
    id: 'compute',
    title: '2. Compute Processing Layer (Execution Engine)',
    subtitle: 'Stateless MPP Virtual Warehouses · Ephemeral Local SSDs · Dynamic Auto-Scaling',
    badge: 'INDEPENDENT SCALING',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-800 dark:text-blue-300',
    colorBorder: 'border-blue-400 dark:border-blue-700',
    colorBg: 'bg-blue-50/40 dark:bg-blue-950/20',
    icon: Cpu,
    summary:
      'Massively Parallel Processing (MPP) compute clusters provisioned on demand. Completely decoupled from persistent storage. Multiple isolated warehouses can read and write the exact same underlying tables simultaneously without resource starvation or query locking.',
    keyStats: ['XS to 6XL sizes', 'Local NVMe SSD Cache', 'Zero lock contention', 'Auto-suspend / resume'],
    subsystems: [
      {
        id: 'virtual-warehouses',
        name: 'Standard Virtual Warehouses (XS → 6XL)',
        shortDesc: 'T-shirt sized EC2/Azure/GCP compute clusters (1 to 512 nodes)',
        tag: 'MPP WORKERS',
        tagColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
        mechanics:
          'Pure stateless compute nodes arranged in symmetric MPP clusters. Node count doubles with each T-shirt size (XS=1, S=2, M=4, L=8, XL=16, 2XL=32, 6XL=512). Work is partitioned into threads and executed via vectorized C++ execution engines.',
        seniorPoint:
          'Scaling UP (larger warehouse) cuts execution duration of heavy single queries. Scaling OUT (multi-cluster warehouse) handles query concurrency spikes from hundreds of BI users without queuing.',
        costImpact: 'Billed per second with a 60-second minimum; auto-suspend prevents idle waste.',
        icon: Server
      },
      {
        id: 'local-ssd-cache',
        name: 'Local Worker NVMe SSD Cache',
        shortDesc: 'Ephemeral raw columnar cache on worker nodes; LRU eviction policy',
        tag: 'FAST I/O',
        tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
        mechanics:
          'When worker nodes fetch micro-partitions from remote Cloud Object Storage, they persist raw column chunks to local NVMe disks. Subsequent queries hitting the same partitions read from local SSD at multi-gigabyte/sec speeds, bypassing remote S3 bandwidth.',
        seniorPoint:
          'Crucial interview distinction: The Local SSD Cache is discarded when the warehouse suspends! For consistent BI latency on recurring reports, balance auto-suspend timeout (e.g. 5-10 min) vs cloud credit cost.',
        costImpact: 'Improves query throughput dramatically, reducing warehouse running minutes.',
        icon: HardDrive
      },
      {
        id: 'snowpark-optimized',
        name: 'Snowpark-Optimized Warehouses',
        shortDesc: '16x RAM per node + high-throughput NVMe for memory-intensive Python/ML',
        tag: '16X RAM',
        tagColor: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
        mechanics:
          'Engineered for memory-heavy workloads that exceed standard warehouse RAM ceilings. Allocates 16x memory per compute node (e.g. 1.5 TB+ on large sizes) to prevent out-of-memory errors (OOM) and local SSD disk spilling during large Python DataFrames and model training.',
        seniorPoint:
          'Use Snowpark-Optimized clusters for PySpark migrations, matrix factorization, and LLM fine-tuning. Billed at 1.5x standard warehouse credit multiplier per node.',
        costImpact: '1.5x credit rate vs standard warehouses; highly cost-effective vs failed queries.',
        icon: Cpu
      },
      {
        id: 'serverless-engine',
        name: 'Serverless Compute Fabric',
        shortDesc: 'Snowflake-managed compute for Tasks, Dynamic Tables & Auto-Clustering',
        tag: 'MANAGED',
        tagColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
        mechanics:
          'Zero-management compute pool managed directly by Snowflake. Automatically provisions just-in-time capacity for scheduled Tasks, incremental Dynamic Table refreshes, Snowpipe file ingestion, and background micro-partition compaction.',
        seniorPoint:
          'Serverless eliminates the sizing guessing game. Snowflake bills only for the exact compute milliseconds consumed, eliminating the 60-second minimum penalty of custom warehouses.',
        costImpact: 'Pay-per-second execution; managed by Snowflake with built-in resource quotas.',
        icon: Zap
      },
      {
        id: 'spcs-containers',
        name: 'Snowpark Container Services (SPCS)',
        shortDesc: 'OCI-compliant container execution on CPU & NVIDIA GPU worker pools',
        tag: 'GPU / OCI',
        tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
        mechanics:
          'Runs custom Docker containers directly within the Snowflake security boundary. Developers deploy Streamlit frontends, custom REST APIs, FastAPI microservices, and PyTorch inference pipelines on dedicated CPU and GPU compute pools.',
        seniorPoint:
          'SPCS keeps sensitive enterprise data inside Snowflake governance: no data egress across internet boundaries to third-party container runtimes or external API vendors.',
        costImpact: 'Compute pool credits charged by node type and uptime duration.',
        icon: Layers
      },
      {
        id: 'qas-acceleration',
        name: 'Query Acceleration Service (QAS) & SOS',
        shortDesc: 'Dynamic burst compute for query outlier scans + secondary point lookup indexes',
        tag: 'BURST SCAN',
        tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300',
        mechanics:
          'QAS dynamically leases serverless resources to scan massive micro-partition volumes when a query scans an unexpected outlier dataset. Search Optimization Service (SOS) maintains secondary Bloom filter search access paths for high-selectivity point queries.',
        seniorPoint:
          'Senior optimization rule: Use SOS for high-cardinality point lookups (e.g. user_id = "abc" across 10 TB tables) instead of resizing the entire warehouse.',
        costImpact: 'Targeted credit consumption; avoids permanent warehouse up-sizing.',
        icon: Sliders
      }
    ]
  },
  {
    id: 'storage',
    title: '3. Storage Layer (Data Plane)',
    subtitle: 'Immutable Cloud Object Storage · AWS S3 / Azure Blob / GCS · Infinite Durability',
    badge: 'PAX COLUMNAR MICRO-PARTITIONS',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    colorBorder: 'border-emerald-400 dark:border-emerald-700',
    colorBg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
    icon: Database,
    summary:
      'The physical persistent tier utilizing cloud object storage (S3, Blob, GCS). All data is stored in immutable, compressed, Pax-style columnar micro-partitions or open Apache Iceberg Parquet files. Data cannot be modified in-place; all updates write new versioned partitions.',
    keyStats: ['50-500MB micro-partitions', 'Immutable', '99.999999999% durability', '0-90 days Time Travel'],
    subsystems: [
      {
        id: 'micro-partitions',
        name: 'Columnar Micro-Partitions (FDN)',
        shortDesc: 'Proprietary Pax-style columnar format (50-500 MB uncompressed, 16 MB physical)',
        tag: 'IMMUTABLE',
        tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
        mechanics:
          'Each table is automatically divided into micro-partitions containing contiguous row groups stored column-by-column. Columns are individually compressed using adaptive algorithms (LZ4, ZSTD, Bit-packing, Run-length). Header contains min/max stats sent to Cloud Services.',
        seniorPoint:
          'Snowflake has NO physical index structures (no B-Trees on analytical tables). Pruning relies entirely on micro-partition clustering depth and Cloud Services min/max metadata.',
        costImpact: 'Raw cloud storage rate (~$23-$40/TB/month uncompressed compressed to 4x ratio).',
        icon: Database
      },
      {
        id: 'iceberg-storage',
        name: 'Apache Iceberg Open Tables',
        shortDesc: 'Parquet data files + Iceberg v2/v3 metadata tree in customer or managed cloud storage',
        tag: 'OPEN FORMAT',
        tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
        mechanics:
          'Directly stores data as open Apache Parquet files accompanied by snapshot metadata JSON and Avro manifest lists. Can be managed by Snowflake or registered as an unmanaged external catalog (AWS Glue, Apache Polaris).',
        seniorPoint:
          'Senior pattern: Iceberg tables prevent vendor storage lock-in. External engines (Spark, Databricks, Athena) query identical Parquet files in place without paying Snowflake egress or compute fees.',
        costImpact: 'Billed at cloud provider direct S3 storage rates when customer-managed.',
        icon: Workflow
      },
      {
        id: 'hybrid-tables',
        name: 'Hybrid Tables (Unistore OLTP)',
        shortDesc: 'Row-store engine with enforced primary keys, secondary indexes & row-level locks',
        tag: 'OLTP ROW STORE',
        tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
        mechanics:
          'Dual-storage engine architecture: transactional writes commit to an in-memory row-store backed by persistent log volumes with microsecond row-level locking. Data is automatically copied asynchronously to columnar micro-partitions for analytical scans.',
        seniorPoint:
          'Unistore bridges transactional and analytical applications in one platform, eliminating brittle reverse-ETL pipelines from PostgreSQL to the data warehouse.',
        costImpact: 'Higher storage credit cost per GB due to transactional replication and indexing.',
        icon: HardDrive
      },
      {
        id: 'time-travel',
        name: 'Time Travel & Fail-Safe Protection',
        shortDesc: '0–90 days historical point-in-time recovery + 7 days disaster recovery',
        tag: 'ZERO-COPY',
        tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
        mechanics:
          'Because micro-partitions are immutable, modifications (DML) simply write new partition versions while keeping original files. Time Travel reads partition versions active at specific timestamp, offset, or Query ID. Fail-safe provides 7-day non-configurable disaster recovery.',
        seniorPoint:
          'Zero-Copy Cloning creates instantaneous duplicate tables/schemas/databases by replicating only metadata pointers in Cloud Services—consuming ZERO additional storage until cloned data is modified.',
        costImpact: 'Storage cost charged for retained previous partition versions until Time Travel expires.',
        icon: RotateCcw
      }
    ]
  }
];

const QUERY_FLOW_STEPS = [
  {
    step: 1,
    title: 'Client Connection & SQL Submission',
    layer: 'Cloud Services',
    desc: 'BI tool or data engineer submits `SELECT avg(amt) FROM orders WHERE dt = "2026-03-01";` via JDBC/ODBC/REST API.',
    internal: 'Cloud Services authenticates session with MFA/Key-pair, validates user privileges via RBAC graph.'
  },
  {
    step: 2,
    title: 'Result Cache Inspection',
    layer: 'Cloud Services',
    desc: 'Checks if identical query syntax was executed within past 24h with unmodified underlying tables.',
    internal: 'If cache hit: returns immediately in <50ms without waking up any Virtual Warehouse compute ($0.00 cost).'
  },
  {
    step: 3,
    title: 'Metadata Store Partition Pruning',
    layer: 'Cloud Services',
    desc: 'Optimizer queries FoundationDB metadata dictionary for column `dt` min/max boundaries.',
    internal: 'Prunes 500,000 micro-partitions down to just 18 relevant partitions! Only 18 file URLs sent to compute.'
  },
  {
    step: 4,
    title: 'Virtual Warehouse Assignment & Local Cache Check',
    layer: 'Compute Layer',
    desc: 'Stateless MPP worker nodes receive execution plan. Workers check their Local NVMe SSD cache.',
    internal: 'If partitions exist in local SSD, read at NVMe speeds. Otherwise, parallel HTTP GET fetch from S3.'
  },
  {
    step: 5,
    title: 'Storage Fetch & Vectorized Columnar Execution',
    layer: 'Storage & Compute',
    desc: 'Workers pull only requested columns (columnar projection) from Cloud Object Storage micro-partitions.',
    internal: 'Vectorized SIMD instructions compute aggregation across threads. Results returned to Cloud Services.'
  },
  {
    step: 6,
    title: 'Result Caching & Client Response',
    layer: 'Cloud Services',
    desc: 'Cloud Services streams final result set to client and stores query output in Persisted Result Cache for 24 hours.',
    internal: 'Execution stats, bytes scanned, and partitions pruned recorded to ACCOUNT_USAGE for query profiling.'
  }
];

export const SnowflakeArchitectureDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'official-diagrams' | 'query-flow' | 'matrix'>('architecture');
  const [selectedDiagramIndex, setSelectedDiagramIndex] = useState<number>(0);
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemItem>(
    LAYERS[0].subsystems[0]
  );
  const [inspectModalSubsystem, setInspectModalSubsystem] = useState<SubsystemItem | null>(null);
  const [activeLayerFilter, setActiveLayerFilter] = useState<'all' | 'services' | 'compute' | 'storage'>('all');
  const [currentFlowStep, setCurrentFlowStep] = useState<number>(1);
  const [isFlowPlaying, setIsFlowPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedTakeaway, setCopiedTakeaway] = useState<boolean>(false);

  const handleSelectSubsystem = (sub: SubsystemItem) => {
    setSelectedSubsystem(sub);
  };

  // Auto-step flow animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFlowPlaying) {
      timer = setInterval(() => {
        setCurrentFlowStep((prev) => (prev >= QUERY_FLOW_STEPS.length ? 1 : prev + 1));
      }, 2600);
    }
    return () => clearInterval(timer);
  }, [isFlowPlaying]);

  const copyArchitecturalSummary = () => {
    const text = `SNOWFLAKE 3-LAYER DECOUPLED ARCHITECTURE (2026):
1. Cloud Services (Control Plane): Stateless multi-tenant microservices backed by FoundationDB metadata store. Handles security, RBAC, query optimization, partition pruning, result cache (24h), Horizon governance, Polaris Iceberg REST catalog, and Cortex AI.
2. Compute Processing (Execution Layer): Stateless MPP Virtual Warehouses (XS to 6XL) + Snowpark-Optimized (16x RAM) + Serverless (Tasks/Dynamic Tables) + SPCS (Containerized CPU/GPU pools). Features ephemeral local NVMe SSD caching.
3. Storage Layer (Data Plane): Immutable Cloud Object Storage (S3/Blob/GCS) holding Pax-style columnar Micro-Partitions (50-500MB), open Apache Iceberg Parquet files, Unistore Hybrid Tables (row-store OLTP), and 0-90 days Time Travel / 7-day Fail-safe.`;
    navigator.clipboard.writeText(text);
    setCopiedTakeaway(true);
    setTimeout(() => setCopiedTakeaway(false), 2200);
  };

  return (
    <div
      className={`my-8 bg-[#FFFFFF] dark:bg-[#1A1816] rounded-xl border border-[#D9D1C1] dark:border-[#38332B] shadow-sm overflow-hidden transition-all duration-200 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto max-h-[96vh] shadow-2xl' : ''
      }`}
    >
      {/* Header Bar */}
      <div className="bg-[#F4EFE6] dark:bg-[#23201C] border-b border-[#D9D1C1] dark:border-[#38332B] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#BF360C] text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                Snowflake 3-Layer Decoupled Architecture
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono-code bg-[#E9E4D9] dark:bg-[#332E27] text-[#443E37] dark:text-[#C5BCAD]">
                2026 Open Lakehouse & AI Edition
              </span>
            </div>
            <p className="text-xs text-[#5A5245] dark:text-[#A89F91]">
              Engineered decoupled control, execution, and persistent storage planes
            </p>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#E9E4D9] dark:bg-[#2D2924] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'architecture'
                ? 'bg-[#FFFFFF] dark:bg-[#1A1816] text-[#1A1A1A] dark:text-[#EDE8DF] shadow-xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('official-diagrams')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'official-diagrams'
                ? 'bg-[#FFFFFF] dark:bg-[#1A1816] text-[#BF360C] dark:text-[#E05A36] shadow-xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Official Diagrams ({OFFICIAL_DIAGRAMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('query-flow')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'query-flow'
                ? 'bg-[#FFFFFF] dark:bg-[#1A1816] text-[#BF360C] dark:text-orange-400 shadow-xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Query Lifecycle Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'matrix'
                ? 'bg-[#FFFFFF] dark:bg-[#1A1816] text-[#1A1A1A] dark:text-[#EDE8DF] shadow-xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Layer Comparison Matrix</span>
          </button>
        </div>

        {/* Utility Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={copyArchitecturalSummary}
            className="p-1.5 rounded-md hover:bg-[#E9E4D9] dark:hover:bg-[#332E27] text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            title="Copy architectural summary"
          >
            {copiedTakeaway ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-1.5 rounded-md hover:bg-[#E9E4D9] dark:hover:bg-[#332E27] text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5">
        {/* VIEW 1: FULL ARCHITECTURAL BLUEPRINT */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[#5A5245] dark:text-[#A89F91] font-mono-code uppercase text-[11px]">
                  Filter Layer:
                </span>
                {(['all', 'services', 'compute', 'storage'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayerFilter(layer)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono-code transition-colors cursor-pointer capitalize ${
                      activeLayerFilter === layer
                        ? 'bg-[#1A1A1A] text-white dark:bg-[#EDE8DF] dark:text-[#1A1A1A]'
                        : 'bg-[#F4EFE6] dark:bg-[#26221D] text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9]'
                    }`}
                  >
                    {layer === 'all' ? 'All 3 Layers' : layer}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-[#8C7B65] dark:text-[#9E8F7A] font-mono-code flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-[#BF360C]" />
                <span>Click any subsystem card below to inspect internal mechanics & interview points</span>
              </div>
            </div>

            {/* Architectural Diagram Canvas */}
            <div className="space-y-4">
              {LAYERS.filter((l) => activeLayerFilter === 'all' || activeLayerFilter === l.id).map(
                (layer, lIdx) => {
                  const LayerIcon = layer.icon;
                  return (
                    <div
                      key={layer.id}
                      className={`p-5 rounded-xl border-2 ${layer.colorBorder} ${layer.colorBg} transition-all relative`}
                    >
                      {/* Layer Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 mb-4 border-b border-[#D9D1C1]/60 dark:border-[#3E382E]">
                        <div className="flex items-start space-x-3">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E1B17] border border-[#D9D1C1] dark:border-[#3E382E] shadow-xs">
                            <LayerIcon className="w-5 h-5 text-[#BF360C] dark:text-orange-400" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2.5">
                              <h4 className="text-base font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                                {layer.title}
                              </h4>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold tracking-wider ${layer.badgeBg} ${layer.badgeText}`}
                              >
                                {layer.badge}
                              </span>
                            </div>
                            <p className="text-xs text-[#5A5245] dark:text-[#A89F91] mt-0.5">
                              {layer.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Fast Key Stats Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {layer.keyStats.map((stat, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono-code bg-white/80 dark:bg-[#1E1B17]/80 border border-[#D9D1C1]/60 dark:border-[#3E382E] text-[#443E37] dark:text-[#C5BCAD]"
                            >
                              {stat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Subsystem Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {layer.subsystems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSelected = selectedSubsystem.id === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSelectSubsystem(sub)}
                              className={`p-3.5 rounded-lg transition-all cursor-pointer border text-left relative group w-full ${
                                isSelected
                                  ? 'bg-white dark:bg-[#1E1B17] border-[#BF360C] dark:border-[#E05A36] shadow-md ring-2 ring-[#BF360C]/20'
                                  : 'bg-white/90 dark:bg-[#1E1B17]/90 border-[#D9D1C1] dark:border-[#38332B] hover:border-[#8C7B65] dark:hover:border-[#6B5E4E] hover:shadow-xs'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`p-1.5 rounded-md transition-colors ${
                                      isSelected
                                        ? 'bg-[#BF360C] text-white'
                                        : 'bg-[#F4EFE6] dark:bg-[#28241F] text-[#5A5245] dark:text-[#A89F91] group-hover:text-[#BF360C]'
                                    }`}
                                  >
                                    <SubIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-xs font-semibold text-[#1A1A1A] dark:text-[#EDE8DF] line-clamp-1">
                                    {sub.name}
                                  </span>
                                </div>
                                {sub.tag && (
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold tracking-wider shrink-0 ${sub.tagColor}`}
                                  >
                                    {sub.tag}
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-[#5A5245] dark:text-[#A89F91] line-clamp-2 leading-relaxed">
                                {sub.shortDesc}
                              </p>

                              <div className="mt-2.5 pt-2 border-t border-[#D9D1C1]/40 dark:border-[#332E27] flex items-center justify-between text-[10px]">
                                <span className={`font-mono-code ${isSelected ? 'text-[#BF360C] dark:text-[#E05A36] font-bold' : 'text-[#8C7B65] dark:text-[#9E8F7A]'}`}>
                                  {isSelected ? '● Inspecting' : 'Click to inspect'}
                                </span>
                                <div className="flex items-center space-x-1.5">
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInspectModalSubsystem(sub);
                                    }}
                                    className="px-1.5 py-0.5 rounded hover:bg-[#BF360C]/10 dark:hover:bg-[#BF360C]/20 text-[#8C7B65] hover:text-[#BF360C] transition-colors"
                                    title="Open Fullscreen Inspector"
                                  >
                                    <Maximize2 className="w-3 h-3" />
                                  </span>
                                  <ChevronRight
                                    className={`w-3 h-3 transition-transform ${
                                      isSelected ? 'translate-x-0.5 text-[#BF360C]' : 'group-hover:translate-x-0.5 text-[#8C7B65]'
                                    }`}
                                  />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* INLINE LAYER INSPECTOR: Immediately visible within this layer if selected subsystem belongs here */}
                      {layer.subsystems.some((s) => s.id === selectedSubsystem.id) && (
                        <div className="mt-4 pt-4 border-t-2 border-[#BF360C]/20 dark:border-[#E05A36]/30 bg-white/95 dark:bg-[#1C1A17] p-4 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] shadow-sm animate-fadeIn">
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D9D1C1]/70 dark:border-[#332E27]">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-2 rounded-lg bg-[#BF360C] text-white">
                                {React.createElement(selectedSubsystem.icon, { className: 'w-4 h-4' })}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h5 className="text-sm font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                                    {selectedSubsystem.name}
                                  </h5>
                                  {selectedSubsystem.tag && (
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${selectedSubsystem.tagColor}`}
                                    >
                                      {selectedSubsystem.tag}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-[#8C7B65] dark:text-[#9E8F7A]">
                                  Component Internal Mechanics & Senior Interview Focus
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] font-mono-code text-[#443E37] dark:text-[#C5BCAD] px-2.5 py-1 rounded bg-[#E9E4D9] dark:bg-[#2B2722]">
                                Cost: {selectedSubsystem.costImpact}
                              </span>
                              <button
                                type="button"
                                onClick={() => setInspectModalSubsystem(selectedSubsystem)}
                                className="px-2.5 py-1 rounded bg-[#BF360C] hover:bg-[#A32E0A] text-white text-[11px] font-mono-code flex items-center space-x-1 cursor-pointer transition-colors"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>Modal View</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3 text-xs">
                            {/* Internal Mechanics */}
                            <div className="space-y-1.5 bg-[#FAF7F2] dark:bg-[#24201C] p-3.5 rounded-lg border border-[#E9E4D9] dark:border-[#332E27]">
                              <div className="flex items-center space-x-1.5 font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                                <Zap className="w-3.5 h-3.5 text-[#BF360C]" />
                                <span>How It Works Internally:</span>
                              </div>
                              <p className="text-[#5A5245] dark:text-[#A89F91] leading-relaxed">
                                {selectedSubsystem.mechanics}
                              </p>
                            </div>

                            {/* Senior Interview Talking Point */}
                            <div className="space-y-1.5 bg-amber-50/80 dark:bg-amber-950/40 p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                              <div className="flex items-center space-x-1.5 font-bold text-amber-900 dark:text-amber-300">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                <span>Senior Interview Differentiator:</span>
                              </div>
                              <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-sans italic">
                                "{selectedSubsystem.seniorPoint}"
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Directional Connector between layers */}
                      {lIdx < 2 && activeLayerFilter === 'all' && (
                        <div className="flex justify-center -mb-7 mt-3 relative z-10">
                          <div className="px-3 py-1 rounded-full bg-[#FFFFFF] dark:bg-[#1A1816] border border-[#D9D1C1] dark:border-[#38332B] shadow-xs flex items-center space-x-2 text-[11px] font-mono-code text-[#BF360C] dark:text-orange-400">
                            <span>
                              {lIdx === 0
                                ? '↓ Compiles plan & passes partition URLs'
                                : '↓ Streams columnar micro-partitions over cloud network'}
                            </span>
                            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            {/* Selected Subsystem Deep-Dive Inspector Panel */}
            <div className="bg-[#F9F7F2] dark:bg-[#151311] rounded-xl border border-[#D9D1C1] dark:border-[#38332B] p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D9D1C1] dark:border-[#332E27]">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-[#BF360C] text-white">
                    {React.createElement(selectedSubsystem.icon, { className: 'w-4 h-4' })}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                        {selectedSubsystem.name}
                      </h4>
                      {selectedSubsystem.tag && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${selectedSubsystem.tagColor}`}
                        >
                          {selectedSubsystem.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#8C7B65] dark:text-[#9E8F7A]">
                      Architectural Component Deep Dive
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono-code text-[#443E37] dark:text-[#C5BCAD] px-2.5 py-1 rounded bg-[#E9E4D9] dark:bg-[#2B2722]">
                  Cost Impact: {selectedSubsystem.costImpact}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4 text-xs">
                {/* Internal Mechanics */}
                <div className="space-y-2 bg-white dark:bg-[#1E1B17] p-4 rounded-lg border border-[#D9D1C1] dark:border-[#38332B]">
                  <div className="flex items-center space-x-1.5 font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                    <Zap className="w-3.5 h-3.5 text-[#BF360C]" />
                    <span>How It Works Internally:</span>
                  </div>
                  <p className="text-[#5A5245] dark:text-[#A89F91] leading-relaxed">
                    {selectedSubsystem.mechanics}
                  </p>
                </div>

                {/* Senior Interview Talking Point */}
                <div className="space-y-2 bg-amber-50/70 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-900/60">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-900 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Senior Interview Differentiator:</span>
                  </div>
                  <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-sans italic">
                    "{selectedSubsystem.seniorPoint}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE QUERY LIFECYCLE SIMULATOR */}
        {activeTab === 'query-flow' && (
          <div className="space-y-6">
            {/* Flow Controls */}
            <div className="bg-[#F4EFE6] dark:bg-[#23201C] p-4 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                  Query Execution Lifecycle (Step-by-Step)
                </h4>
                <p className="text-xs text-[#5A5245] dark:text-[#A89F91]">
                  Observe how a SQL query travels through Cloud Services, Virtual Warehouses, and Cloud Storage
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFlowPlaying((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    isFlowPlaying
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-[#BF360C] text-white hover:bg-[#A32E0A]'
                  }`}
                >
                  {isFlowPlaying ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isFlowPlaying ? 'Pause Simulation' : 'Auto Play Flow'}</span>
                </button>

                <button
                  onClick={() => setCurrentFlowStep(1)}
                  className="p-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] hover:bg-[#E9E4D9] dark:hover:bg-[#2B2722] text-[#5A5245] dark:text-[#A89F91] transition-colors cursor-pointer"
                  title="Reset to Step 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {QUERY_FLOW_STEPS.map((s) => {
                const isActive = currentFlowStep === s.step;
                const isPassed = currentFlowStep > s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => {
                      setIsFlowPlaying(false);
                      setCurrentFlowStep(s.step);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-white dark:bg-[#1E1B17] border-[#BF360C] dark:border-orange-500 shadow-sm ring-2 ring-[#BF360C]/20'
                        : isPassed
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-[#1E1B17] border-[#D9D1C1] dark:border-[#38332B] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-mono-code font-bold px-1.5 py-0.2 rounded ${
                          isActive
                            ? 'bg-[#BF360C] text-white'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#E9E4D9] dark:bg-[#2B2722] text-[#5A5245]'
                        }`}
                      >
                        Step {s.step}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#8C7B65] dark:text-[#9E8F7A]">
                        {s.layer}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#1A1A1A] dark:text-[#EDE8DF] line-clamp-1">
                      {s.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Visual Showcase */}
            {(() => {
              const active = QUERY_FLOW_STEPS[currentFlowStep - 1];
              return (
                <div className="bg-white dark:bg-[#1E1B17] rounded-xl border border-[#D9D1C1] dark:border-[#38332B] p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D9D1C1] dark:border-[#38332B]">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#BF360C] text-white flex items-center justify-center font-mono-code font-bold text-sm">
                        {active.step}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                          {active.title}
                        </h4>
                        <span className="text-xs font-mono-code text-[#BF360C] dark:text-orange-400">
                          Active Layer: {active.layer}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        disabled={currentFlowStep <= 1}
                        onClick={() => setCurrentFlowStep((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded text-xs border border-[#D9D1C1] dark:border-[#38332B] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        ← Prev Step
                      </button>
                      <button
                        disabled={currentFlowStep >= QUERY_FLOW_STEPS.length}
                        onClick={() => setCurrentFlowStep((p) => Math.min(QUERY_FLOW_STEPS.length, p + 1))}
                        className="px-3 py-1 rounded text-xs bg-[#BF360C] text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div className="p-4 rounded-lg bg-[#F9F7F2] dark:bg-[#151311] border border-[#D9D1C1] dark:border-[#38332B] space-y-2">
                      <div className="font-bold text-[#1A1A1A] dark:text-[#EDE8DF] flex items-center space-x-1.5">
                        <Workflow className="w-3.5 h-3.5 text-[#BF360C]" />
                        <span>Functional Action:</span>
                      </div>
                      <p className="text-[#5A5245] dark:text-[#A89F91] leading-relaxed text-sm">
                        {active.desc}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-2">
                      <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                        <span>Under the Hood (Engine Mechanics):</span>
                      </div>
                      <p className="text-blue-950/80 dark:text-blue-200/90 leading-relaxed text-sm">
                        {active.internal}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 3: ARCHITECTURE MATRIX & TRADE-OFF COMPARISON */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#D9D1C1] dark:border-[#38332B] rounded-lg">
                <thead className="bg-[#F4EFE6] dark:bg-[#23201C] text-[#1A1A1A] dark:text-[#EDE8DF] border-b border-[#D9D1C1] dark:border-[#38332B] font-mono-code uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Decoupled Layer</th>
                    <th className="p-3">Statefulness & Scaling</th>
                    <th className="p-3">Underlying Tech</th>
                    <th className="p-3">Caching Level</th>
                    <th className="p-3">Billing & Cost Model</th>
                    <th className="p-3">Senior Interview Question</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D1C1] dark:divide-[#38332B] text-[#5A5245] dark:text-[#A89F91]">
                  <tr className="hover:bg-[#F9F7F2] dark:hover:bg-[#1F1C18]">
                    <td className="p-3 font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                      1. Cloud Services (Control Plane)
                    </td>
                    <td className="p-3">Multi-tenant, globally distributed, auto-scales transparently</td>
                    <td className="p-3 font-mono-code">FoundationDB KV, C++ Optimizer, Envoy Proxy</td>
                    <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">
                      Result Cache (24h to 31d, exact syntax, $0 compute)
                    </td>
                    <td className="p-3">Free up to 10% of daily warehouse compute credits</td>
                    <td className="p-3 italic">
                      "Explain why COUNT(*) on an unclustered 10 TB table returns in 5ms without running a warehouse."
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F9F7F2] dark:hover:bg-[#1F1C18]">
                    <td className="p-3 font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                      2. Compute Layer (Execution Engine)
                    </td>
                    <td className="p-3">Stateless MPP clusters; scale UP for heavy queries, scale OUT for concurrency</td>
                    <td className="p-3 font-mono-code">EC2/Azure/GCP VMs, Vectorized SIMD engine, SPCS GPUs</td>
                    <td className="p-3 font-semibold text-blue-700 dark:text-blue-400">
                      Local NVMe SSD Cache (micro-partitions cached on workers)
                    </td>
                    <td className="p-3">Per-second billing, 60s minimum; 1 credit/hr (XS) to 128+ credits/hr (6XL)</td>
                    <td className="p-3 italic">
                      "Why does suspending a warehouse immediately evict its local SSD cache, and when should you delay auto-suspend?"
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F9F7F2] dark:hover:bg-[#1F1C18]">
                    <td className="p-3 font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                      3. Storage Layer (Data Plane)
                    </td>
                    <td className="p-3">Immutable, highly durable (99.999999999%), independent infinite storage</td>
                    <td className="p-3 font-mono-code">AWS S3 / Azure Blob / GCS; Pax columnar FDN & Iceberg Parquet</td>
                    <td className="p-3 font-semibold text-purple-700 dark:text-purple-400">
                      Remote persistent layer (source of truth for all caches)
                    </td>
                    <td className="p-3">Flat cloud storage rate (~$23-$40/TB/month compressed)</td>
                    <td className="p-3 italic">
                      "How does immutability enable Zero-Copy Cloning and Time Travel without replicating physical data?"
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Architectural Synthesis Callout */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs">
              <div className="flex items-center space-x-2 font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>The Definitive Senior Architectural Takeaway:</span>
              </div>
              <p className="text-amber-950/80 dark:text-amber-200/90 leading-relaxed">
                Traditional data warehouses (Teradata, Netezza, Redshift Classic) coupled storage and compute on the same physical server disks. If storage filled up, you were forced to buy expensive compute nodes you did not need; if analytical queries spiked, ETL ingestion stalled. Snowflake solved this by making **compute completely stateless** and **storage immutable in cloud object storage**, with **Cloud Services orchestrating metadata pruning** so worker nodes never perform wasteful full-table disk reads.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: OFFICIAL DIAGRAMS GALLERY */}
        {activeTab === 'official-diagrams' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Gallery Intro Banner */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#23201D] border border-[#E9E4D9] dark:border-[#2E2923] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif-heading font-bold text-sm text-[#1A1A1A] dark:text-[#EDE8DF]">
                  Official Architectural Schematics & Internal Blueprints
                </h4>
                <p className="text-xs text-[#5A5245] dark:text-[#A89F91] mt-0.5">
                  High-resolution visual reference diagrams illustrating Snowflake's control plane, storage partitioning, CDC pipelines, and Iceberg lakehouse catalog topologies.
                </p>
              </div>
              <div className="flex items-center space-x-2 shrink-0 text-xs font-mono-code text-[#BF360C] dark:text-[#E05A36]">
                <span className="px-2.5 py-1 rounded bg-[#BF360C]/10 dark:bg-[#BF360C]/20 font-semibold">
                  {OFFICIAL_DIAGRAMS.length} Technical Schematics
                </span>
              </div>
            </div>

            {/* Diagram Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {OFFICIAL_DIAGRAMS.map((diag, idx) => {
                const isSelected = selectedDiagramIndex === idx;
                return (
                  <button
                    key={diag.id}
                    onClick={() => setSelectedDiagramIndex(idx)}
                    className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer flex flex-col justify-between min-h-[90px] ${
                      isSelected
                        ? 'border-[#BF360C] bg-[#FFFFFF] dark:bg-[#23201D] ring-2 ring-[#BF360C]/20 shadow-xs'
                        : 'border-[#D9D1C1] dark:border-[#38332B] bg-[#F9F7F2] dark:bg-[#1A1816] hover:bg-[#FFFFFF] dark:hover:bg-[#201D1A]'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-mono-code font-bold uppercase tracking-wider block text-[#BF360C] dark:text-[#E05A36]">
                        {diag.badge}
                      </span>
                      <span className="font-serif-heading font-bold text-xs line-clamp-2 text-[#1A1A1A] dark:text-[#EDE8DF] mt-1">
                        {diag.title}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono-code text-[#8C7B65] dark:text-[#7A7062] mt-2 flex items-center justify-between">
                      <span>FIG {idx + 1}</span>
                      {isSelected && <span className="text-[#BF360C] font-bold">● Active</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Diagram Viewer */}
            {OFFICIAL_DIAGRAMS[selectedDiagramIndex] && (
              <ArchitectureFigure
                src={OFFICIAL_DIAGRAMS[selectedDiagramIndex].src}
                alt={OFFICIAL_DIAGRAMS[selectedDiagramIndex].title}
                title={OFFICIAL_DIAGRAMS[selectedDiagramIndex].title}
                subtitle={OFFICIAL_DIAGRAMS[selectedDiagramIndex].subtitle}
                badge={OFFICIAL_DIAGRAMS[selectedDiagramIndex].badge}
                caption={OFFICIAL_DIAGRAMS[selectedDiagramIndex].description}
                seniorTakeaway={OFFICIAL_DIAGRAMS[selectedDiagramIndex].seniorNote}
                tags={OFFICIAL_DIAGRAMS[selectedDiagramIndex].tags}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="bg-[#F9F7F2] dark:bg-[#151311] border-t border-[#D9D1C1] dark:border-[#38332B] px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A5245] dark:text-[#A89F91]">
        <div className="flex items-center space-x-3">
          <span className="font-mono-code text-[11px]">Snowflake Decoupled Engine Architecture v2026.1</span>
          <span className="text-[#D9D1C1] dark:text-[#38332B]">|</span>
          <span>FoundationDB Metadata · Stateless MPP · Immutable Pax Micro-Partitions</span>
        </div>
        <button
          onClick={copyArchitecturalSummary}
          className="text-xs text-[#BF360C] dark:text-orange-400 font-mono-code hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>{copiedTakeaway ? 'Copied to clipboard!' : 'Copy Architecture Summary'}</span>
          <Copy className="w-3 h-3" />
        </button>
      </div>

      {/* Subsystem Deep-Dive Full Modal */}
      {inspectModalSubsystem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setInspectModalSubsystem(null)}
        >
          <div
            className="bg-[#FFFFFF] dark:bg-[#1C1A17] rounded-2xl max-w-2xl w-full border border-[#D9D1C1] dark:border-[#3E382E] shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#F4EFE6] dark:bg-[#26221D] px-6 py-4 border-b border-[#D9D1C1] dark:border-[#38332B] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#BF360C] text-white shadow-xs">
                  {React.createElement(inspectModalSubsystem.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif-heading font-bold text-base text-[#1A1A1A] dark:text-[#EDE8DF]">
                      {inspectModalSubsystem.name}
                    </h3>
                    {inspectModalSubsystem.tag && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${inspectModalSubsystem.tagColor}`}>
                        {inspectModalSubsystem.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A5245] dark:text-[#A89F91] mt-0.5">
                    {inspectModalSubsystem.shortDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectModalSubsystem(null)}
                className="p-1.5 rounded-lg hover:bg-[#E9E4D9] dark:hover:bg-[#332E27] text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Cost Impact Banner */}
              <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#23201D] border border-[#E9E4D9] dark:border-[#2E2923] flex items-center justify-between text-xs">
                <span className="font-mono-code font-bold text-[#8C7B65] dark:text-[#9E8F7A]">
                  FINOPS & CREDIT MODEL:
                </span>
                <span className="font-mono-code text-[#BF360C] dark:text-[#E05A36] font-semibold">
                  {inspectModalSubsystem.costImpact}
                </span>
              </div>

              {/* Internal Mechanics */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm text-[#1A1A1A] dark:text-[#EDE8DF]">
                  <Zap className="w-4 h-4 text-[#BF360C]" />
                  <h4>Internal Mechanics & Low-Level Execution</h4>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#24201C] border border-[#E9E4D9] dark:border-[#332E27] text-xs leading-relaxed text-[#5A5245] dark:text-[#A89F91]">
                  {inspectModalSubsystem.mechanics}
                </div>
              </div>

              {/* Senior Interview Talking Point */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm text-amber-900 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4>Senior Interview Differentiator (Staff / Lead Level)</h4>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90 font-serif italic">
                  "{inspectModalSubsystem.seniorPoint}"
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#FAF7F2] dark:bg-[#23201D] px-6 py-3 border-t border-[#D9D1C1] dark:border-[#38332B] flex items-center justify-between">
              <span className="text-[11px] font-mono-code text-[#8C7B65] dark:text-[#7A7062]">
                Architectural Subsystem Deep Dive
              </span>
              <button
                onClick={() => setInspectModalSubsystem(null)}
                className="px-4 py-1.5 rounded-lg bg-[#1A1A1A] text-white dark:bg-[#EDE8DF] dark:text-[#1A1A1A] text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnowflakeArchitectureDiagram;
