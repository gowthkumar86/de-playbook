import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Database, HardDrive, Cpu, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface ProfileScenario {
  id: string;
  name: string;
  status: 'optimal' | 'warning' | 'critical';
  duration: string;
  warehouse: string;
  partitionsScanned: number;
  partitionsTotal: number;
  localSpillGB: number;
  remoteSpillGB: number;
  bytesScannedGB: number;
  cacheHitPct: number;
  querySummary: string;
  operatorTree: {
    step: string;
    operator: string;
    percentage: number;
    issue?: string;
  }[];
  seniorAnalysis: string;
  prescribedFix: string;
}

const SCENARIOS: ProfileScenario[] = [
  {
    id: 'optimal',
    name: 'Scenario 1: High-Efficiency Analytical Query (Optimal Pruning)',
    status: 'optimal',
    duration: '1.4s',
    warehouse: 'MEDIUM (4 nodes)',
    partitionsScanned: 18,
    partitionsTotal: 2400,
    localSpillGB: 0,
    remoteSpillGB: 0,
    bytesScannedGB: 0.35,
    cacheHitPct: 62,
    querySummary: 'SELECT store_id, SUM(order_amount) FROM retail_orders WHERE order_date >= "2024-03-01" GROUP BY 1;',
    operatorTree: [
      { step: 'Step 1', operator: 'TableScan [retail_orders]', percentage: 25 },
      { step: 'Step 2', operator: 'Aggregate [HashGroupBy]', percentage: 55 },
      { step: 'Step 3', operator: 'Result [CloudServices]', percentage: 20 }
    ],
    seniorAnalysis: 'Excellent partition pruning (18 of 2,400 partitions scanned = 0.75%). No memory pressure, zero spilling. 62% of blocks fetched from Warehouse SSD cache.',
    prescribedFix: 'No action needed. Warehouse is right-sized and query is optimal.'
  },
  {
    id: 'local-spill',
    name: 'Scenario 2: Heavy Join with Local Disk Spilling',
    status: 'warning',
    duration: '42.8s',
    warehouse: 'SMALL (2 nodes)',
    partitionsScanned: 1820,
    partitionsTotal: 2400,
    localSpillGB: 12.4,
    remoteSpillGB: 0,
    bytesScannedGB: 38.6,
    cacheHitPct: 8,
    querySummary: 'SELECT c.tier, o.order_id, o.amount FROM orders o JOIN customers c ON o.customer_id = c.customer_id;',
    operatorTree: [
      { step: 'Step 1', operator: 'TableScan [orders & customers]', percentage: 20 },
      { step: 'Step 2', operator: 'Join [HashJoin]', percentage: 65, issue: 'Hash table exceeded RAM; spilled 12.4 GB to local NVMe SSD' },
      { step: 'Step 3', operator: 'Sort [ExternalSort]', percentage: 15 }
    ],
    seniorAnalysis: 'Memory capacity exceeded during HashJoin building. Warehouse Small (2 nodes) has insufficient RAM for the join build table, triggering 12.4GB spill to local NVMe SSD.',
    prescribedFix: 'Scale UP the warehouse from SMALL to MEDIUM. Double RAM per node eliminates the 12.4GB local spill and reduces latency from 43s to ~8s.'
  },
  {
    id: 'remote-spill',
    name: 'Scenario 3: Severe Remote Disk Spilling (Cartesian / Huge Join)',
    status: 'critical',
    duration: '18m 42s (SLA Breach)',
    warehouse: 'MEDIUM (4 nodes)',
    partitionsScanned: 2400,
    partitionsTotal: 2400,
    localSpillGB: 86.2,
    remoteSpillGB: 142.5,
    bytesScannedGB: 95.0,
    cacheHitPct: 0,
    querySummary: 'SELECT o.*, p.* FROM orders o JOIN products p ON o.category = p.category;',
    operatorTree: [
      { step: 'Step 1', operator: 'TableScan [Full Scan - 0 Pruning]', percentage: 12, issue: 'Unfiltered table scan on 2.4k partitions' },
      { step: 'Step 2', operator: 'Join [Explosive HashJoin]', percentage: 78, issue: 'Local SSD full! Spilled 142.5 GB to AWS S3/Azure Blob' },
      { step: 'Step 3', operator: 'Aggregate', percentage: 10 }
    ],
    seniorAnalysis: 'Catastrophic Remote Disk Spilling. Non-unique join key on category caused Cartesian row explosion. Local NVMe SSD filled up, forcing writes across network to S3/Blob storage (100x latency penalty).',
    prescribedFix: '1. Fix SQL logic: join on unique surrogate key (product_id), not non-unique category string. 2. Filter orders by date range to enable pruning. 3. If volume is legitimate, scale UP to X-LARGE.'
  }
];

export const QueryProfileSimulator: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<ProfileScenario>(SCENARIOS[0]);

  return (
    <div className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 text-[#1A1A1A] shadow-sm my-4 sm:my-6 space-y-5 sm:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D9D1C1] pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#BF360C] shrink-0" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">Interactive Snowflake Query Profile Diagnostic Lab</h3>
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-[#5A5245] mt-1">
            Simulate real production execution trees. Inspect partition pruning ratios and diagnose Local vs Remote Spilling.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-[10px] text-[#8C7B65] uppercase tracking-widest font-mono font-bold shrink-0">Select Scenario:</span>
          <div className="grid grid-cols-3 sm:flex gap-1 bg-[#F9F7F2] p-1 rounded-sm border border-[#D9D1C1]">
            {SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc)}
                className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-sm text-[11px] sm:text-xs font-medium transition-all text-center cursor-pointer min-h-[38px] sm:min-h-0 flex items-center justify-center ${
                  activeScenario.id === sc.id
                    ? sc.status === 'optimal'
                      ? 'bg-[#2E5A36] text-white shadow-xs font-bold'
                      : sc.status === 'warning'
                      ? 'bg-[#BF360C] text-white shadow-xs font-bold'
                      : 'bg-[#1A1A1A] text-white shadow-xs font-bold'
                    : 'text-[#5A5245] hover:text-[#1A1A1A] hover:bg-[#E9E4D9]'
                }`}
              >
                {sc.status === 'optimal' ? 'Optimal' : sc.status === 'warning' ? 'Local Spill' : 'Remote Spill'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-[#F9F7F2] p-3 sm:p-4 rounded-sm border border-[#D9D1C1]">
          <span className="text-[9px] sm:text-[10px] text-[#8C7B65] uppercase font-mono font-bold tracking-widest block">Execution Time</span>
          <div className="text-lg sm:text-2xl font-serif font-bold text-[#1A1A1A] mt-1 flex items-center gap-1.5">
            <span className="truncate">{activeScenario.duration}</span>
            {activeScenario.status === 'optimal' && <CheckCircle2 className="w-4 h-4 text-[#2E5A36] shrink-0" />}
            {activeScenario.status === 'warning' && <AlertTriangle className="w-4 h-4 text-[#BF360C] shrink-0" />}
            {activeScenario.status === 'critical' && <XCircle className="w-4 h-4 text-[#BF360C] shrink-0" />}
          </div>
          <span className="text-[11px] sm:text-xs text-[#5A5245] mt-1 block truncate">Warehouse: <strong>{activeScenario.warehouse}</strong></span>
        </div>

        <div className="bg-[#F9F7F2] p-3 sm:p-4 rounded-sm border border-[#D9D1C1]">
          <span className="text-[9px] sm:text-[10px] text-[#8C7B65] uppercase font-mono font-bold tracking-widest block">Partition Pruning</span>
          <div className="text-lg sm:text-2xl font-serif font-bold text-[#1A1A1A] mt-1">
            {activeScenario.partitionsScanned} <span className="text-xs sm:text-sm font-sans font-normal text-[#5A5245]">/ {activeScenario.partitionsTotal}</span>
          </div>
          <span className={`text-[11px] sm:text-xs font-bold mt-1 block ${activeScenario.partitionsScanned / activeScenario.partitionsTotal < 0.1 ? 'text-[#2E5A36]' : 'text-[#BF360C]'}`}>
            {((activeScenario.partitionsScanned / activeScenario.partitionsTotal) * 100).toFixed(1)}% scanned
          </span>
        </div>

        <div className="bg-[#F9F7F2] p-3 sm:p-4 rounded-sm border border-[#D9D1C1]">
          <span className="text-[9px] sm:text-[10px] text-[#8C7B65] uppercase font-mono font-bold tracking-widest block">Local Spill (NVMe)</span>
          <div className="text-lg sm:text-2xl font-serif font-bold mt-1 text-[#BF360C]">
            {activeScenario.localSpillGB > 0 ? `${activeScenario.localSpillGB} GB` : '0 GB (None)'}
          </div>
          <span className="text-[11px] sm:text-xs text-[#5A5245] mt-1 block truncate">Memory overflow to SSD</span>
        </div>

        <div className="bg-[#F9F7F2] p-3 sm:p-4 rounded-sm border border-[#D9D1C1]">
          <span className="text-[9px] sm:text-[10px] text-[#8C7B65] uppercase font-mono font-bold tracking-widest block">Remote Spill (Blob/S3)</span>
          <div className={`text-lg sm:text-2xl font-serif font-bold mt-1 ${activeScenario.remoteSpillGB > 0 ? 'text-[#BF360C]' : 'text-[#2E5A36]'}`}>
            {activeScenario.remoteSpillGB > 0 ? `${activeScenario.remoteSpillGB} GB` : '0 GB (Clean)'}
          </div>
          <span className="text-[11px] sm:text-xs text-[#5A5245] mt-1 block truncate">High latency Object Store</span>
        </div>
      </div>

      {/* SQL Query Box */}
      <div className="bg-[#1A1A1A] p-3 sm:p-4 rounded-sm border border-[#D9D1C1] font-mono text-xs text-stone-200 overflow-x-auto shadow-inner">
        <span className="text-[#8C7B65] select-none mr-2 font-bold uppercase tracking-wider text-[10px] block sm:inline mb-1 sm:mb-0">SQL QUERY:</span>
        <code>{activeScenario.querySummary}</code>
      </div>

      {/* Execution Operator Tree */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-mono font-bold text-[#8C7B65] uppercase tracking-widest">Operator Execution Tree &amp; Step Distribution</h4>
          <span className="text-xs font-serif italic text-[#5A5245]">Total Query Breakdown</span>
        </div>
        <div className="space-y-2.5 sm:space-y-3">
          {activeScenario.operatorTree.map((op, idx) => (
            <div key={idx} className="bg-[#F9F7F2] rounded-sm p-3 sm:p-4 border border-[#D9D1C1]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2 gap-1">
                <span className="font-bold text-[#1A1A1A] font-mono">{op.step}: {op.operator}</span>
                <span className="font-bold font-mono text-[#1A1A1A] shrink-0">{op.percentage}% of query time</span>
              </div>
              <div className="w-full bg-[#E9E4D9] h-2 rounded-sm overflow-hidden">
                <div 
                  className={`h-2 transition-all ${
                    op.issue ? 'bg-[#BF360C]' : 'bg-[#1A1A1A]'
                  }`}
                  style={{ width: `${op.percentage}%` }}
                />
              </div>
              {op.issue && (
                <div className="mt-2.5 sm:mt-3 text-xs text-[#7A2110] flex items-start sm:items-center gap-2 font-medium bg-[#FAECE8] border border-[#E8B4A6] p-2 sm:p-2.5 rounded-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#BF360C] mt-0.5 sm:mt-0" />
                  <span>{op.issue}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Senior Forensic Analysis & Remedy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1 sm:pt-2">
        <div className="bg-[#F9F7F2] p-4 sm:p-5 rounded-sm border border-[#D9D1C1] border-l-4 border-l-[#BF360C] space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase text-[#BF360C] tracking-widest flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 shrink-0" /> Senior Engineer Diagnosis
          </span>
          <p className="font-serif text-[#1A1A1A] leading-relaxed text-xs sm:text-sm">
            {activeScenario.seniorAnalysis}
          </p>
        </div>
        <div className="bg-[#F9F7F2] p-4 sm:p-5 rounded-sm border border-[#D9D1C1] border-l-4 border-l-[#2E5A36] space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase text-[#2E5A36] tracking-widest flex items-center gap-1.5">
            <Zap className="w-4 h-4 shrink-0" /> Prescribed Production Remedy
          </span>
          <p className="font-serif text-[#1A1A1A] leading-relaxed text-xs sm:text-sm">
            {activeScenario.prescribedFix}
          </p>
        </div>
      </div>
    </div>
  );
};
