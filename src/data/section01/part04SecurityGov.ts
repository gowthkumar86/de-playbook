import { SectionPart } from '../../types';

export const PART_04_SECURITY_GOV_DATA: SectionPart = {
  id: 'snowflake-part-04',
  title: 'Snowflake Part 04: Security, Horizon & Modern Platform',
  partNumber: 'PART 04',
  subtitle: 'Zero-Trust Auth, Functional RBAC, Tag-Based Masking, Horizon Governance, Cortex Agents, SPCS & Disaster Recovery',
  summary: 'In-depth guide to enterprise security, data governance, and the modern Snowflake platform in 2026. Covers mandatory MFA and Key-Pair authentication, Access Role vs Functional Role RBAC patterns, Horizon tag-based column masking and row-access policies, Open Catalog (Apache Polaris) vs Horizon boundaries, Cortex Agents AI orchestration, Snowpark Container Services (SPCS) GPU pools, and Failover Groups with Client Redirect for multi-cloud disaster recovery.',
  readTimeMinutes: 25,
  terminologies: [
    {
      term: 'Authentication (AuthN)',
      definition: 'Verifying identity. In 2026, Snowflake enforces mandatory MFA for password logins, key-pair JWT for machine services, SAML SSO for humans, and PATs for HTTP integrations.',
      category: 'Security',
      highlight: true
    },
    {
      term: 'Key-Pair Authentication',
      definition: 'Cryptographic authentication where the client signs a JWT with a private RSA key, and Snowflake verifies against a registered public key. Mandatory best practice for service accounts.',
      category: 'Security',
      highlight: true
    },
    {
      term: 'Programmatic Access Token (PAT)',
      definition: 'Scoped, expirable bearer token introduced in 2025 bound to a specific role and network policy for secure HTTP API integrations.',
      category: 'Security'
    },
    {
      term: 'Role-Based Access Control (RBAC)',
      definition: 'Snowflake’s authorization model: privileges are granted exclusively to roles; roles are granted to other roles (hierarchy) or users. Privileges are never granted directly to users.',
      category: 'Security',
      highlight: true
    },
    {
      term: 'Access Role vs Functional Role',
      definition: 'The gold-standard RBAC design pattern: Access Roles (AR) hold object privileges; Functional Roles (FR) map to business job titles and inherit Access Roles.',
      category: 'Security',
      highlight: true
    },
    {
      term: 'Tag-Based Masking',
      definition: 'Attaching dynamic masking policies to Horizon tags rather than individual table columns. Any column assigned the tag automatically inherits the masking policy.',
      category: 'Governance',
      highlight: true
    },
    {
      term: 'Row-Access Policy',
      definition: 'A SQL boolean expression evaluated per row per role. Rows evaluating to FALSE are filtered out invisibly before the query result is compiled.',
      category: 'Governance'
    },
    {
      term: 'Tri-Secret Secure',
      definition: 'Enterprise+ encryption model combining customer-managed keys (BYOK via AWS KMS / Azure Key Vault / GCP KMS) with Snowflake keys for composite master key encryption.',
      category: 'Security'
    },
    {
      term: 'External Network Access',
      definition: 'Governed outbound connectivity allowing Python UDFs, Stored Procedures, and SPCS containers to access specific external APIs via Network Rules and Secrets.',
      category: 'Security'
    },
    {
      term: 'Horizon Catalog',
      definition: 'Snowflake’s unified data governance surface: data quality metrics (DMFs), column-level lineage, automated PII classification, object tags, and Trust Center.',
      category: 'Governance',
      highlight: true
    },
    {
      term: 'Cortex Agents',
      definition: 'Snowflake’s 2026-preferred agentic AI framework orchestrating multi-turn conversational reasoning, using Cortex Analyst for SQL and Cortex Search for semantic retrieval.',
      category: 'AI',
      highlight: true
    },
    {
      term: 'Snowpark Container Services (SPCS)',
      definition: 'Snowflake-managed container runtime executing custom Docker/OCI images on CPU, High-Memory, and GPU compute pools within the customer’s security boundary.',
      category: 'Compute'
    },
    {
      term: 'Failover Group',
      definition: 'A replication construct bundling multiple databases, users, roles, warehouses, and monitors into a single replicated entity that fails over atomically to a secondary account.',
      category: 'Disaster Recovery',
      highlight: true
    },
    {
      term: 'Client Redirect',
      definition: 'DNS-level connection abstraction that reroutes client application connections to the promoted secondary account during regional disaster recovery without code changes.',
      category: 'Disaster Recovery'
    }
  ],
  sections: [
    {
      heading: '1. Authentication Hardening: Mandatory MFA, Key-Pair & PATs',
      subheading: '2025–2026 Zero-Trust Machine Identity and Password Deprecation',
      content: `Snowflake implemented strict identity hardening across 2025 and 2026:
- **Mandatory MFA:** Multi-Factor Authentication is enforced by default for all interactive password logins. Passwords without MFA are deprecated.
- **Enterprise Humans:** Must authenticate via **SAML SSO** (Okta, Azure AD, Ping) with automated user and group lifecycle provisioning via SCIM.
- **Machine & Service Accounts:** **Shared passwords for automated services are strictly prohibited.** Machine accounts (Airflow, ADF, dbt, CI/CD) must authenticate via **Key-Pair Authentication** or **Programmatic Access Tokens (PATs)**.

**Key-Pair Rotation Workflow:**
Snowflake allows two public keys to be active simultaneously (\`RSA_PUBLIC_KEY\` and \`RSA_PUBLIC_KEY_2\`), enabling zero-downtime key rotation:`,
      codeSnippets: [
        {
          title: 'Configuring and Rotating RSA Key-Pair for Service Users',
          language: 'sql',
          code: `-- 1. Create Dedicated Service User without Password
CREATE USER svc_etl_orchestrator
    DEFAULT_ROLE = role_etl_runner
    DEFAULT_WAREHOUSE = etl_wh
    TYPE = SERVICE
    COMMENT = 'Service account for ADF and Airflow orchestration';

-- 2. Register Client Public Key (2048-bit or 4096-bit RSA)
ALTER USER svc_etl_orchestrator
    SET RSA_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...';

-- 3. Zero-Downtime Rotation: Register secondary key before revoking old key
ALTER USER svc_etl_orchestrator
    SET RSA_PUBLIC_KEY_2 = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEB...';

-- 4. Once clients transition to Key 2, remove Key 1
ALTER USER svc_etl_orchestrator UNSET RSA_PUBLIC_KEY;`
        }
      ],
      callouts: [
        {
          type: 'senior-line',
          title: 'Service Identity Audits',
          text: 'In an enterprise architecture review, highlight that all service principals use RSA key-pair JWT authentication bound to dedicated network policies, eliminating credential leakage risk in pipeline configuration files.'
        }
      ]
    },
    {
      heading: '2. Enterprise Authorization: The Access Role vs Functional Role Pattern',
      subheading: 'Scalable RBAC Architecture Eliminating Privilege Chaos',
      content: `In Snowflake, **privileges are never granted directly to users**. They are granted to roles, and roles are granted to users.

To scale access control across thousands of tables and hundreds of engineers, implement the **Access Role (AR) vs. Functional Role (FR)** two-tier hierarchy:

1. **Access Roles (AR):**
   - Own technical privileges on specific database objects.
   - Granular, object-centric naming: \`AR_ANALYTICS_SILVER_READ\`, \`AR_ANALYTICS_SILVER_WRITE\`, \`AR_SALES_GOLD_FULL\`.
   - Never granted directly to human users.
2. **Functional Roles (FR):**
   - Map directly to business job functions: \`FR_DATA_ANALYST\`, \`FR_DATA_ENGINEER\`, \`FR_FINANCE_AUDITOR\`.
   - Inherit one or more Access Roles via role hierarchy.
   - Human users are granted exactly one or two Functional Roles.
3. **Secondary Roles:**
   - With \`DEFAULT_SECONDARY_ROLES = ('ALL')\`, a user's session can leverage the combined privileges of all their assigned roles simultaneously without manually switching active roles with \`USE ROLE\`.`,
      codeSnippets: [
        {
          title: 'Implementing the Access Role / Functional Role Hierarchy',
          language: 'sql',
          code: `-- Step 1: Create Access Role and Grant Granular Object Privileges
CREATE ROLE ar_sales_silver_read;
GRANT USAGE ON DATABASE analytics_prod TO ROLE ar_sales_silver_read;
GRANT USAGE ON SCHEMA analytics_prod.silver TO ROLE ar_sales_silver_read;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics_prod.silver TO ROLE ar_sales_silver_read;
GRANT SELECT ON FUTURE TABLES IN SCHEMA analytics_prod.silver TO ROLE ar_sales_silver_read;

-- Step 2: Create Functional Role representing Job Title
CREATE ROLE fr_sales_data_analyst;
-- Step 3: Grant Access Role to Functional Role
GRANT ROLE ar_sales_silver_read TO ROLE fr_sales_data_analyst;
-- Step 4: Ensure SYSADMIN is the parent to maintain administrative oversight
GRANT ROLE fr_sales_data_analyst TO ROLE sysadmin;

-- Step 5: Assign Functional Role to End User
GRANT ROLE fr_sales_data_analyst TO USER alex_martinez;
ALTER USER alex_martinez SET DEFAULT_ROLE = fr_sales_data_analyst;`
        }
      ]
    },
    {
      heading: '3. Data Governance: Tag-Based Masking & Row-Access Policies',
      subheading: 'Dynamic Policy Inheritance Powered by Horizon Catalog',
      content: `**Tag-Based Dynamic Masking (The Senior Standard):**
Instead of manually binding masking policies to individual columns across hundreds of tables (which breaks as soon as a new table is created), attach the masking policy to a **Horizon Tag**.
- Create tag \`governance.pii_email\`.
- Bind dynamic masking policy \`mp_mask_email\` to the tag.
- When any engineer tags a column with \`TAG pii_email = 'EMAIL'\`, the column is instantly masked based on the querying user's active role.

**Row-Access Policies:**
Row-access policies enforce row-level multi-tenancy. A SQL boolean expression evaluates \`CURRENT_ROLE()\` against a partition/region column, filtering out unauthorized rows seamlessly.`,
      codeSnippets: [
        {
          title: 'Tag-Based Dynamic Masking Policy Implementation',
          language: 'sql',
          code: `-- 1. Define Reusable Dynamic Masking Policy
CREATE OR REPLACE MASKING POLICY governance.mask_pii_email
    AS (val STRING) RETURNS STRING ->
    CASE
        WHEN CURRENT_ROLE() IN ('ACCOUNTADMIN', 'ROLE_COMPLIANCE_OFFICER') THEN val
        WHEN CURRENT_ROLE() = 'ROLE_SUPPORT_TIER1' THEN REGEXP_REPLACE(val, '(^.).*(@.*$)', '\\1***\\2')
        ELSE '***MASKED_PII***'
    END;

-- 2. Create Horizon Governance Tag
CREATE OR REPLACE TAG governance.pii_type
    ALLOWED_VALUES 'EMAIL', 'SSN', 'PHONE', 'SALARY';

-- 3. Bind Masking Policy directly to the Tag!
ALTER TAG governance.pii_type
    SET MASKING POLICY governance.mask_pii_email;

-- 4. Tag Columns across any table (Policy automatically attaches!)
ALTER TABLE silver.customers MODIFY COLUMN email
    SET TAG governance.pii_type = 'EMAIL';

ALTER TABLE gold.payroll_contacts MODIFY COLUMN primary_email
    SET TAG governance.pii_type = 'EMAIL';`
        }
      ],
      callouts: [
        {
          type: 'senior-line',
          title: 'Tag-Based Governance Advantage',
          text: 'Tag-based masking decouples policy definitions from schema DDL. Schema evolution, migrations, and new column additions remain automatically compliant without touching security policies.'
        }
      ]
    },
    {
      heading: '4. Network Security & External Network Access',
      subheading: 'Governed Outbound API Connectivity and Inbound PrivateLink',
      content: `**Inbound Network Isolation with PrivateLink:**
Traffic between enterprise VPCs/VNets and Snowflake traverses dedicated private network backbones (AWS PrivateLink, Azure Private Link, GCP PSC), bypassing the public internet entirely.

**Governed Outbound Connectivity (External Network Access):**
When Python Stored Procedures, UDFs, or Snowpark Container Services (SPCS) need to interact with external APIs (e.g. calling an enterprise REST service, triggering a webhook, or pushing alerts to Slack), Snowflake enforces strict, audited egress controls:
1. **Network Rule:** Defines allowed hostnames and ports (\`HOST_PORT\` egress).
2. **Secret:** Securely stores API keys, OAuth tokens, or basic credentials.
3. **External Access Integration:** Binds the network rule and secrets together and authorizes specific UDFs.`,
      codeSnippets: [
        {
          title: 'Configuring Governed External Access for Python Stored Procedures',
          language: 'sql',
          code: `-- 1. Define Outbound Egress Network Rule
CREATE OR REPLACE NETWORK RULE nr_salesforce_api
    TYPE = HOST_PORT
    MODE = EGRESS
    VALUE_LIST = ('api.salesforce.com:443');

-- 2. Store API Secret Securely in Cloud Services
CREATE OR REPLACE SECRET sec_salesforce_token
    TYPE = GENERIC_STRING
    SECRET_STRING = 'oauth2_token_xyz123abc';

-- 3. Create External Access Integration (Requires ACCOUNTADMIN)
CREATE OR REPLACE EXTERNAL ACCESS INTEGRATION eai_salesforce
    ALLOWED_NETWORK_RULES = (nr_salesforce_api)
    ALLOWED_AUTHENTICATION_SECRETS = (sec_salesforce_token)
    ENABLED = TRUE;

-- 4. Attach to Python Stored Procedure
CREATE OR REPLACE PROCEDURE sp_push_order_to_crm(order_id NUMBER)
    RETURNS STRING
    LANGUAGE PYTHON
    RUNTIME_VERSION = '3.11'
    PACKAGES = ('snowflake-snowpark-python', 'requests')
    EXTERNAL_ACCESS_INTEGRATIONS = (eai_salesforce)
    SECRETS = ('cred' = sec_salesforce_token)
    HANDLER = 'main'
AS
$$
import _snowflake
import requests

def main(session, order_id):
    token = _snowflake.get_generic_secret_string('cred')
    resp = requests.post(
        'https://api.salesforce.com/orders',
        headers={'Authorization': f'Bearer {token}'},
        json={'orderId': order_id}
    )
    return resp.text
$$;`
        }
      ]
    },
    {
      heading: '5. Horizon Catalog: Lineage, Data Quality (DMFs) & Secure Data Sharing',
      subheading: 'Declarative Data Quality Monitoring, Lineage & Zero-Copy Data Sharing Across Clouds',
      content: `**Horizon Catalog** unifies Snowflake governance into a single pane of glass:
- **Data Quality Monitors (DMFs):** Declarative Data Metric Functions that compute freshness, uniqueness, and null counts automatically on a scheduled cadence.
- **Column-Level Lineage:** Automatically traces data lineage across tables, views, Dynamic Tables, and streams without third-party agents.
- **Trust Center:** Continuous automated scanning of the account for security posture vulnerabilities (e.g. users without MFA, stale service tokens).
- **Secure Data Sharing:** Grants live, read-only metadata access to consumers without copying or moving underlying micro-partitions. Consumer queries run on the consumer's own virtual warehouse compute. For non-Snowflake customers, Snowflake provisions managed **Reader Accounts**.`,
      codeSnippets: [
        {
          title: 'Attaching Scheduled Data Metric Functions (DMFs) for Automated Quality Audits',
          language: 'sql',
          code: `-- Attach Snowflake System Data Metric Functions to Target Table
ALTER TABLE silver.orders
    ADD DATA METRIC FUNCTION SNOWFLAKE.CORE.NULL_COUNT ON (customer_id)
    SCHEDULE = 'USING CRON 0 * * * * UTC';

ALTER TABLE silver.orders
    ADD DATA METRIC FUNCTION SNOWFLAKE.CORE.FRESHNESS ON (order_ts)
    SCHEDULE = 'USING CRON 0 */4 * * * UTC';

-- Query Data Quality Evaluation History
SELECT scheduled_time, metric_name, value
FROM TABLE(SNOWFLAKE.LOCAL.DATA_METRIC_FUNCTION_HISTORY(
    TARGET_NAME => 'silver.orders',
    METRIC_NAME => 'SNOWFLAKE.CORE.NULL_COUNT'
))
ORDER BY scheduled_time DESC LIMIT 10;`
        }
      ],
      figures: [
        {
          src: '/images/snowflake/data-sharing-overview.png',
          alt: 'Snowflake Secure Data Sharing and Reader Accounts Architecture',
          title: 'Secure Data Sharing: Zero-Copy Data Sharing & Reader Accounts',
          subtitle: 'Multi-Account, Multi-Cloud Live Data Sharing with Zero Storage Duplication',
          badge: 'GOVERNED DATA SHARING',
          caption: 'Snowflake Secure Data Sharing architecture: The data provider shares live access to immutable micro-partitions through Cloud Services metadata pointers. The data consumer executes queries using their own virtual warehouse with zero data movement or egress cost. Reader Accounts enable sharing with organizations that do not have a Snowflake account.',
          seniorTakeaway: 'Data sharing is zero-copy and instantaneous. Updates committed on provider tables are immediately visible to consumers. The consumer pays 100% of their own query compute credits, keeping provider cost at zero.',
          tags: ['Data Sharing', 'Zero Copy', 'Reader Accounts', 'Clean Rooms']
        }
      ]
    },
    {
      heading: '6. Cortex AI & Cortex Agents (2026 Shift)',
      subheading: 'Multi-Step Agentic Reasoning Over Structured Lakehouses and Semantic Models',
      content: `Snowflake’s AI strategy is powered by **Cortex AI**:
- **SQL LLM Functions:** \`COMPLETE()\`, \`SUMMARIZE()\`, \`SENTIMENT()\`, \`EXTRACT_ANSWER()\`, and \`EMBED_TEXT_768()\` run on managed GPU pools in the compute layer.
- **Cortex Search:** Managed hybrid lexical (BM25) and vector retrieval index for enterprise document search and RAG grounding.
- **Cortex Analyst:** Governed text-to-SQL engine that translates natural language into verified SQL queries against a semantic model YAML.
- **Cortex Agents (2026 Modern Standard):** Snowflake's premier agentic interface. Rather than running standalone text-to-SQL, Cortex Agents orchestrates multi-step planning, conversational memory, and dynamic tool calls:
  - Invokes Cortex Analyst as a structured-data query tool.
  - Invokes Cortex Search as an unstructured retrieval tool.
  - Generates verified, governed answers with strict RBAC enforcement.`,
      codeSnippets: [
        {
          title: 'Using Cortex SQL Functions for Batch Enrichment',
          language: 'sql',
          code: `-- Cortex Batch Text Enrichment
SELECT customer_id,
       support_ticket_text,
       SNOWFLAKE.CORTEX.SENTIMENT(support_ticket_text) AS sentiment_score,
       SNOWFLAKE.CORTEX.SUMMARIZE(support_ticket_text) AS ticket_summary,
       SNOWFLAKE.CORTEX.COMPLETE(
           'claude-3-5-sonnet',
           'Extract the customer churn risk (LOW, MEDIUM, HIGH) from ticket: ' || support_ticket_text
       ) AS churn_risk_assessment
FROM raw.support_tickets
WHERE ticket_date >= DATEADD(day, -1, CURRENT_DATE());`
        }
      ],
      callouts: [
        {
          type: 'interview-line',
          title: 'Cortex Architectural Positioning',
          text: 'In 2026, Cortex Agents is the preferred AI interface. Standalone Cortex Analyst still exists, but new enterprise applications target Cortex Agents to combine structured SQL generation with unstructured vector search under a unified agentic flow.'
        }
      ]
    },
    {
      heading: '7. Snowpark Container Services (SPCS) & Workspaces',
      subheading: 'General Container Compute Substrate and Modern Workspaces',
      content: `**Snowpark Container Services (SPCS):**
SPCS transforms Snowflake from a pure SQL query engine into a general-purpose secure compute platform:
- Execute any Docker/OCI container image directly on Snowflake-managed **Compute Pools**.
- Compute pool instance families: **CPU** (standard microservices), **High-Memory** (in-memory analytics), and **GPU** (LLM fine-tuning, model serving with vLLM, custom computer vision).
- Direct high-speed access to Snowflake tables via internal storage bridges without network egress.

**Snowflake Notebooks in Workspaces:**
- **Important 2026 Depreciation Notice:** Legacy Notebooks are being officially retired. Creation of new Legacy Notebooks was disabled starting **September 1, 2026**.
- All data engineering and data science notebook workloads must use **Notebooks in Workspaces**, running against either standard virtual warehouses or SPCS compute pools.`,
      callouts: [
        {
          type: 'gotcha',
          title: 'Notebooks Retirement Fact Check',
          text: 'If an interviewer asks about Snowflake Notebooks, note that Legacy Notebooks are retired as of September 2026, and enterprise data teams now standardize on Notebooks in Workspaces for multi-language development.'
        }
      ]
    },
    {
      heading: '8. Multi-Region Disaster Recovery: Failover Groups & Client Redirect',
      subheading: 'Metadata-Driven Active-Passive Lakehouse Business Continuity',
      content: `Snowflake’s disaster recovery (DR) architecture is fundamentally a **metadata synchronization operation on immutable versioned storage**, rather than a nightly bulk file copy:

**The Core DR Construct: Failover Groups:**
A Failover Group bundles multiple objects into a single replicated transaction unit:
- Databases (schemas, tables, micro-partitions, streams).
- Users, Roles, and RBAC grants.
- Warehouses and Resource Monitors.
- Continuous replication runs on a scheduled cadence (e.g. every 10 minutes) across regions or across cloud providers (AWS ↔ Azure ↔ GCP).

**Client Redirect (Zero-Downtime Failover):**
Client applications connect to Snowflake using a global connection URL (e.g. \`app.snowflakecomputing.com\`).
- When an active region experiences a cloud provider outage, the primary Failover Group is promoted in the DR account:
  \`ALTER FAILOVER GROUP fg_production PRIMARY;\`
- **Client Redirect automatically repoints the global DNS endpoint to the DR region.**
- Client applications reconnect immediately without updating configuration files or JDBC strings!`,
      codeSnippets: [
        {
          title: 'Configuring Multi-Region Failover Group and Promotion DDL',
          language: 'sql',
          code: `-- 1. In Primary Account: Create Replicated Failover Group
CREATE FAILOVER GROUP fg_analytics_production
    OBJECT_TYPES = (DATABASES, USERS, ROLES, WAREHOUSES, RESOURCE MONITORS)
    ALLOWED_DATABASES = (analytics_prod, raw_prod)
    ALLOWED_ACCOUNTS = ('acme_org.dr_azure_eastus2')
    REPLICATION_SCHEDULE = '10 MINUTE';

-- 2. In Secondary (DR) Account: Subscribe as Replica
CREATE FAILOVER GROUP fg_analytics_production
    AS REPLICA OF 'acme_org.primary_aws_uswest2.fg_analytics_production';

-- 3. Failover Execution: Promote DR Account during Regional Outage
ALTER FAILOVER GROUP fg_analytics_production PRIMARY;

-- Client Redirect handles DNS failover instantly across all client connections.`
        }
      ]
    }
  ]
};
