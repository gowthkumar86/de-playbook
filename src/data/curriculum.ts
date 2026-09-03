export type SectionStatus = 'active' | 'upcoming' | 'planned';

export interface CurriculumSection {
  id: number;
  title: string;
  status: SectionStatus;
  topics: string[];
  tier?: 1 | 2 | 3;
  phase?: string;
}

export interface SectionMeta {
  id: string;
  number: number;
  title: string;
  tier: 1 | 2 | 3;
  phase: string;
  status: SectionStatus;
  topics: string[];
}

export const PHASES = [
  { id: 'phase-1', name: 'Phase 1: Foundation', sections: [0, 1, 2, 3] },
  { id: 'phase-2', name: 'Phase 2: Spark & PySpark', sections: [4, 5, 6] },
  { id: 'phase-3', name: 'Phase 3: Databricks & Lakehouse', sections: [7, 8, 9] },
  { id: 'phase-4', name: 'Phase 4: Azure Data Engineering', sections: [10, 11, 12, 13, 14] },
  { id: 'phase-5', name: 'Phase 5: Tier 2 Topics', sections: [15, 16, 17, 18, 19, 20] },
  { id: 'phase-6', name: 'Phase 6: Tier 3 Awareness', sections: [21] },
  { id: 'phase-7', name: 'Phase 7: Practical Project', sections: [22] },
  { id: 'phase-8', name: 'Phase 8: Interview Preparation', sections: [23, 24, 25, 26] },
  { id: 'phase-9', name: 'Phase 9: Revision & Readiness', sections: [27, 28, 29, 30] },
];

export const SECTIONS: SectionMeta[] = [
  {
    id: 'section-0',
    number: 0,
    title: 'How to Use This Study Guide',
    tier: 1,
    phase: 'Phase 1: Foundation',
    status: 'active',
    topics: [
      '0.1 The Mindset Shift',
      '0.2 The 5-Step Study Loop',
      '0.3 Deep vs Memorize vs Recognize',
      '0.4 Hands-On Non-Negotiables',
      '0.5 Scenario Question Diagnostic',
      '0.6 Handling "I Don\'t Know"',
      '0.7 Flagship Snowflake Story',
      '0.8 What Senior-Level Sounds Like',
      '0.9 Red Flags to Eliminate',
      '0.10 7-Day Study Schedule',
      '0.11 Ground Rules',
      '0.12 Quick Revision'
    ]
  },
  {
    id: 'section-1',
    number: 1,
    title: 'Snowflake: Architecture & Performance',
    tier: 1,
    phase: 'Phase 1: Foundation',
    status: 'upcoming',
    topics: [
      'Awaiting user data upload...'
    ]
  },
  {
    id: 'section-2',
    number: 2,
    title: 'Advanced SQL for Data Engineering',
    tier: 1,
    phase: 'Phase 1: Foundation',
    status: 'upcoming',
    topics: ['Complex Window Functions', 'Gaps and Islands', 'SCD Type 2 SQL', 'Execution Plans', 'Join Skew & Optimization', 'MERGE Idempotency']
  },
  {
    id: 'section-3',
    number: 3,
    title: 'Python for Data Engineering',
    tier: 1,
    phase: 'Phase 1: Foundation',
    status: 'upcoming',
    topics: ['Generators & Iterators', 'REST API Pagination & Retries', 'Config-Driven Ingestion', 'Pydantic/Data Validation', 'Memory Management']
  },
  {
    id: 'section-4',
    number: 4,
    title: 'PySpark Core & DataFrames',
    tier: 1,
    phase: 'Phase 2: Spark & PySpark',
    status: 'upcoming',
    topics: ['DataFrame API', 'Schema Enforcement', 'Complex Types (Arrays/Structs)', 'Windowing', 'Broadcast Joins', 'Pandas UDFs']
  },
  {
    id: 'section-5',
    number: 5,
    title: 'Apache Spark Architecture',
    tier: 1,
    phase: 'Phase 2: Spark & PySpark',
    status: 'upcoming',
    topics: ['Driver vs Executors', 'App → Job → Stage → Task', 'DAG & Catalyst Optimizer', 'Narrow vs Wide Transformations', 'Tungsten Execution']
  },
  {
    id: 'section-6',
    number: 6,
    title: 'Spark Performance Tuning & Troubleshooting',
    tier: 1,
    phase: 'Phase 2: Spark & PySpark',
    status: 'upcoming',
    topics: ['Shuffle Elimination', 'Data Skew Mitigations (Salting)', 'Driver/Executor OOM', 'AQE (Adaptive Query Execution)', 'Spark UI Forensics']
  },
  {
    id: 'section-7',
    number: 7,
    title: 'Azure Databricks & Workflows',
    tier: 1,
    phase: 'Phase 3: Databricks & Lakehouse',
    status: 'upcoming',
    topics: ['Job Clusters vs All-Purpose', 'Databricks Workflows', 'Unity Catalog Governance', 'Cluster Policies & Sizing', 'Repos & CI/CD']
  },
  {
    id: 'section-8',
    number: 8,
    title: 'Delta Lake Deep Dive',
    tier: 1,
    phase: 'Phase 3: Databricks & Lakehouse',
    status: 'upcoming',
    topics: ['_delta_log & ACID Protocol', 'OPTIMIZE & Z-ORDER', 'VACUUM & Retention', 'Schema Evolution & Enforcement', 'MERGE CDC Patterns']
  },
  {
    id: 'section-9',
    number: 9,
    title: 'Lakehouse Architecture & Medallion Pattern',
    tier: 1,
    phase: 'Phase 3: Databricks & Lakehouse',
    status: 'upcoming',
    topics: ['Bronze/Silver/Gold Layering', 'Snowflake vs Databricks Trade-offs', 'Batch vs Incremental Architecture', 'Idempotent Loading']
  },
  {
    id: 'section-10',
    number: 10,
    title: 'ADLS Gen2 Storage & Security',
    tier: 2,
    phase: 'Phase 4: Azure Data Engineering',
    status: 'planned',
    topics: ['Hierarchical Namespace', 'RBAC & ACLs', 'File Format Organization', 'Lifecycle Management']
  },
  {
    id: 'section-11',
    number: 11,
    title: 'Azure Data Factory (ADF)',
    tier: 1,
    phase: 'Phase 4: Azure Data Engineering',
    status: 'planned',
    topics: ['Linked Services & IRs', 'Pipeline Orchestration', 'Dynamic Expressions', 'Tumbling Window Triggers', 'Databricks Activities']
  },
  {
    id: 'section-12',
    number: 12,
    title: 'Metadata-Driven Ingestion Pipelines',
    tier: 1,
    phase: 'Phase 4: Azure Data Engineering',
    status: 'planned',
    topics: ['Dynamic Frameworks', 'Lookup + ForEach Scaling', 'Watermark Management', 'Audit Tables & Idempotency']
  },
  {
    id: 'section-13',
    number: 13,
    title: 'Incremental Processing Patterns',
    tier: 1,
    phase: 'Phase 4: Azure Data Engineering',
    status: 'planned',
    topics: ['High-Water Mark Tracking', 'State Store Patterns', 'Partial Failure Recovery', 'Duplicate Prevention']
  },
  {
    id: 'section-14',
    number: 14,
    title: 'Change Data Capture (CDC)',
    tier: 1,
    phase: 'Phase 4: Azure Data Engineering',
    status: 'planned',
    topics: ['Log-based vs Timestamp CDC', 'Debezium & Kafka', 'Delta & Snowflake Streams CDC', 'Soft Deletes vs Hard Deletes']
  },
  {
    id: 'section-15',
    number: 15,
    title: 'Data Modeling (OLTP vs OLAP)',
    tier: 2,
    phase: 'Phase 5: Tier 2 Topics',
    status: 'planned',
    topics: ['Star vs Snowflake Schema', 'Fact Table Granularity', 'SCD Type 1 & Type 2', 'Surrogate vs Natural Keys']
  },
  {
    id: 'section-16',
    number: 16,
    title: 'Data Quality & Observability',
    tier: 2,
    phase: 'Phase 5: Tier 2 Topics',
    status: 'planned',
    topics: ['Reconciliation Frameworks', 'Great Expectations / Soda Core', 'Circuit Breakers', 'Anomaly Detection']
  },
  {
    id: 'section-17',
    number: 17,
    title: 'Streaming & Structured Streaming',
    tier: 2,
    phase: 'Phase 5: Tier 2 Topics',
    status: 'planned',
    topics: ['Micro-batch vs Continuous', 'Checkpoints & Watermarks', 'Late-Arriving Data', 'Exactly-Once Semantics']
  },
  {
    id: 'section-18',
    number: 18,
    title: 'Enterprise API Integration',
    tier: 2,
    phase: 'Phase 5: Tier 2 Topics',
    status: 'planned',
    topics: ['OAuth2 Flows', 'Rate Limit Handling (429)', 'Cursor-based Pagination', 'Resilient Exponential Backoff']
  },
  {
    id: 'section-19',
    number: 19,
    title: 'Security, Governance & Compliance',
    tier: 2,
    phase: 'Phase 5: Tier 2 Topics',
    status: 'planned',
    topics: ['Data Masking & Row Access Policies', 'Unity Catalog Metastore', 'PII Identification', 'Audit Logging']
  },
  {
    id: 'section-20',
    number: 20,
    title: 'Snowflake + Databricks Hybrid Integration',
    tier: 2,
    phase: 'Phase 5: Tier 2 Topics',
    status: 'planned',
    topics: ['Databricks-Snowflake Connector', 'Pushdown Optimization', 'When to use which engine', 'Cost vs Performance']
  },
  {
    id: 'section-21',
    number: 21,
    title: 'Adeptia, SnapLogic & Logic Apps Awareness',
    tier: 3,
    phase: 'Phase 6: Tier 3 Awareness',
    status: 'planned',
    topics: ['Enterprise iPaaS Concepts', 'When enterprises adopt Adeptia/SnapLogic', 'ADF vs SnapLogic comparison', 'Honest interview positioning']
  },
  {
    id: 'section-22',
    number: 22,
    title: 'End-to-End Enterprise Retail Lakehouse Project',
    tier: 1,
    phase: 'Phase 7: Practical Project',
    status: 'planned',
    topics: ['Architecture Blueprint', 'ADLS + ADF + Databricks + Snowflake', 'CDC Ingestion Engine', 'Interview Walkthrough']
  },
  {
    id: 'section-23',
    number: 23,
    title: 'System Design for Data Engineering',
    tier: 1,
    phase: 'Phase 8: Interview Preparation',
    status: 'planned',
    topics: ['8-10 Production Architectures', 'Capacity Planning', 'SLA & Idempotency Design', 'Cost Estimation']
  },
  {
    id: 'section-24',
    number: 24,
    title: 'Scenario-Based Troubleshooting Scenarios',
    tier: 1,
    phase: 'Phase 8: Interview Preparation',
    status: 'planned',
    topics: ['Situation → Cause → Fix → Prevention', 'Skew Resolution', 'OOM Fixes', 'Silent Data Corruption']
  },
  {
    id: 'section-25',
    number: 25,
    title: '100 Curated Senior Technical Questions',
    tier: 1,
    phase: 'Phase 8: Interview Preparation',
    status: 'planned',
    topics: ['Basic vs Strong vs Senior Answer Model', 'SQL, Spark, Snowflake, Databricks, ADF questions']
  },
  {
    id: 'section-26',
    number: 26,
    title: '5 Mock Technical Interviews',
    tier: 1,
    phase: 'Phase 8: Interview Preparation',
    status: 'planned',
    topics: ['Progressive Difficulty Rounds', 'Infosys Senior Bar Mock Runs', 'Follow-up drills']
  },
  {
    id: 'section-27',
    number: 27,
    title: 'Production Troubleshooting Playbook',
    tier: 1,
    phase: 'Phase 9: Revision & Readiness',
    status: 'planned',
    topics: ['Emergency Runbooks', 'Spark UI Diagnostic Flowchart', 'Snowflake Query Profile Flowchart']
  },
  {
    id: 'section-28',
    number: 28,
    title: 'Last-Day High-Yield Cheat Sheets',
    tier: 1,
    phase: 'Phase 9: Revision & Readiness',
    status: 'planned',
    topics: ['Key configs', 'Commands & APIs', 'One-page summaries']
  },
  {
    id: 'section-29',
    number: 29,
    title: 'Final 7-Day Interview Countdown Schedule',
    tier: 1,
    phase: 'Phase 9: Revision & Readiness',
    status: 'planned',
    topics: ['Day-by-Day hourly breakdown', 'Coding exercises & revision checkpoints']
  },
  {
    id: 'section-30',
    number: 30,
    title: 'Brutal Readiness Assessment Checklist',
    tier: 1,
    phase: 'Phase 9: Revision & Readiness',
    status: 'planned',
    topics: ['Self-scoring evaluation', 'Gap triage (Critical vs Recoverable)', 'Infosys clearance score']
  }
];
