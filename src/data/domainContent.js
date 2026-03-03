// Domain-specific content pools for procedural agent data generation

const domainContent = {
  'Retail Banking': {
    topics: ['account-inquiry', 'transaction-help', 'card-services', 'loan-questions', 'mobile-banking', 'fee-disputes', 'branch-services'],
    tests: {
      functional: ['Account Balance Retrieval', 'Fund Transfer Flow', 'Statement Generation', 'Account Opening Process'],
      security: ['PII Masking Validation', 'Session Token Expiry', 'Authentication Flow'],
      performance: ['Response Time Under Load', 'Concurrent Session Handling'],
      behavioral: ['Off-Topic Query Deflection', 'Empathy Detection', 'Escalation Trigger Accuracy'],
      quality: ['Sentiment Analysis Accuracy', 'Response Coherence Check'],
    },
    conversations: [
      { topic: 'account-inquiry', userMsg: 'Can you show me my recent transactions?', agentMsg: 'I can see your account ending in {acct}. Here are your last 5 transactions.' },
      { topic: 'card-services', userMsg: 'I need to report a lost debit card.', agentMsg: 'I\'ve blocked your card ending in {acct} immediately. A replacement will arrive in 5-7 business days.' },
      { topic: 'transaction-help', userMsg: 'I see a charge I don\'t recognize on my statement.', agentMsg: 'Let me look into that charge for you. I can see the transaction from {merchant} on {date}. Would you like to dispute it?' },
      { topic: 'mobile-banking', userMsg: 'How do I set up mobile check deposit?', agentMsg: 'You can enable mobile deposit in the app under Settings > Deposit. Just photograph the front and back of your check.' },
      { topic: 'fee-disputes', userMsg: 'I was charged an overdraft fee but I had enough funds.', agentMsg: 'I can see the timing of the transactions. Let me review this and process a fee reversal for you.' },
    ],
  },
  'Security': {
    topics: ['threat-detection', 'fraud-screening', 'anomaly-alerts', 'compliance-check', 'incident-response', 'access-monitoring'],
    tests: {
      functional: ['Pattern Detection Accuracy', 'Alert Routing Verification', 'Threshold Trigger Test'],
      security: ['Encryption Validation', 'Audit Log Integrity', 'Access Control Enforcement'],
      performance: ['Real-Time Throughput', 'Alert Latency Benchmark'],
      behavioral: ['False Positive Rate Check', 'Severity Classification Accuracy'],
      quality: ['Detection Precision/Recall', 'Alert Description Quality'],
    },
    conversations: [
      { topic: 'threat-detection', userMsg: 'Transaction flagged: $4,500 wire to unrecognized recipient.', agentMsg: 'Pattern matches high-risk profile. Transaction held for review. Risk score: 78/100.' },
      { topic: 'fraud-screening', userMsg: 'Multiple ATM withdrawals in different cities within 2 hours.', agentMsg: 'Geolocation anomaly detected. Card temporarily blocked. Customer notification sent.' },
      { topic: 'anomaly-alerts', userMsg: 'Account shows 50 login attempts in the last hour.', agentMsg: 'Brute force pattern detected. Account locked. Security team alerted. IP range blocked.' },
      { topic: 'incident-response', userMsg: 'Suspicious API access from deprecated endpoint.', agentMsg: 'Legacy endpoint access logged. Source IP traced. Escalated to security operations center.' },
    ],
  },
  'Consumer Lending': {
    topics: ['application-review', 'document-verification', 'credit-assessment', 'rate-inquiry', 'payment-processing', 'refinance-options'],
    tests: {
      functional: ['Application Intake Flow', 'Document Classification', 'Credit Score Integration'],
      security: ['SSN Handling Compliance', 'Document Encryption', 'Data Retention Policy'],
      performance: ['Processing Time per Application', 'Batch Processing Throughput'],
      behavioral: ['Decline Explanation Quality', 'Cross-Sell Appropriateness'],
      quality: ['Decision Consistency', 'Document Extraction Accuracy'],
    },
    conversations: [
      { topic: 'application-review', userMsg: 'Auto loan application submitted: $28,000, 60-month term.', agentMsg: 'Documents received and classified. Credit check initiated. Estimated decision within 24 hours.' },
      { topic: 'document-verification', userMsg: 'Paystub uploaded for income verification.', agentMsg: 'Document classified: paystub. OCR confidence: 96%. Income extracted: $5,200/month.' },
      { topic: 'credit-assessment', userMsg: 'What rate am I eligible for?', agentMsg: 'Based on your credit profile, you qualify for rates between 4.9% and 6.2% APR depending on term length.' },
    ],
  },
  'Compliance': {
    topics: ['policy-check', 'regulatory-screening', 'audit-support', 'reporting-compliance', 'risk-assessment', 'training-verification'],
    tests: {
      functional: ['Regulatory Rule Matching', 'SAR Report Generation', 'Policy Document Lookup'],
      security: ['Data Classification Enforcement', 'Audit Trail Completeness'],
      performance: ['Screening Throughput', 'Report Generation Time'],
      behavioral: ['Regulatory Update Detection', 'False Flag Rate'],
      quality: ['Citation Accuracy', 'Policy Interpretation Consistency'],
    },
    conversations: [
      { topic: 'policy-check', userMsg: 'Does this transaction require enhanced due diligence?', agentMsg: 'Transaction amount exceeds $10,000 threshold. Enhanced due diligence required per BSA/AML policy Section 4.2.' },
      { topic: 'regulatory-screening', userMsg: 'Screen this entity against OFAC sanctions list.', agentMsg: 'Screening complete. No matches found against OFAC SDN list. Last updated: {date}.' },
      { topic: 'audit-support', userMsg: 'Pull compliance records for Q3 audit.', agentMsg: 'Q3 compliance report compiled: 12,450 transactions screened, 23 SARs filed, 0 violations detected.' },
    ],
  },
  'Human Resources': {
    topics: ['benefits-inquiry', 'policy-lookup', 'onboarding-help', 'time-off-request', 'training-enrollment', 'performance-review'],
    tests: {
      functional: ['Policy Document Retrieval', 'Benefits Calculator', 'PTO Balance Check'],
      security: ['Employee PII Protection', 'HIPAA Compliance Check'],
      performance: ['Response Latency', 'Document Search Speed'],
      behavioral: ['Sensitive Topic Handling', 'Escalation to HR Rep'],
      quality: ['Policy Accuracy', 'Answer Completeness'],
    },
    conversations: [
      { topic: 'benefits-inquiry', userMsg: 'What dental plans are available during open enrollment?', agentMsg: 'We offer three dental plans: Basic, Standard, and Premium. Open enrollment runs Nov 1-15.' },
      { topic: 'time-off-request', userMsg: 'How many PTO days do I have remaining?', agentMsg: 'You have 12 PTO days remaining for this year. Your next accrual of 1.5 days is on {date}.' },
      { topic: 'policy-lookup', userMsg: 'What is the remote work policy for my department?', agentMsg: 'Your department follows the hybrid policy: 3 days in-office, 2 days remote. Full details in HR Policy 7.3.' },
    ],
  },
  'Finance': {
    topics: ['budget-analysis', 'expense-review', 'forecasting', 'reconciliation', 'invoice-processing', 'financial-reporting'],
    tests: {
      functional: ['Budget Variance Calculation', 'Invoice Matching', 'GL Entry Validation'],
      security: ['Financial Data Encryption', 'Access Audit Trail'],
      performance: ['Report Generation Speed', 'Batch Reconciliation Time'],
      behavioral: ['Anomaly Explanation Quality', 'Threshold Alert Accuracy'],
      quality: ['Calculation Precision', 'Report Formatting Consistency'],
    },
    conversations: [
      { topic: 'budget-analysis', userMsg: 'Show Q3 budget variance for the marketing department.', agentMsg: 'Marketing Q3 variance: $42K under budget (8.3%). Major savings from deferred campaign spend.' },
      { topic: 'reconciliation', userMsg: 'Flag unmatched transactions from yesterday.', agentMsg: '3 unmatched transactions identified totaling $15,230. Forwarded to AP team for review.' },
      { topic: 'expense-review', userMsg: 'Check this expense report against policy limits.', agentMsg: 'Report reviewed: 12 line items. 1 flagged — hotel rate exceeds $250/night policy limit by $45.' },
    ],
  },
  'Sales': {
    topics: ['pipeline-review', 'lead-scoring', 'forecast-analysis', 'deal-support', 'territory-planning', 'competitive-intel'],
    tests: {
      functional: ['CRM Data Sync', 'Lead Score Calculation', 'Pipeline Report Generation'],
      security: ['Customer Data Isolation', 'Access Permission Check'],
      performance: ['Query Response Time', 'Bulk Data Processing'],
      behavioral: ['Recommendation Relevance', 'Upsell Appropriateness'],
      quality: ['Forecast Accuracy', 'Data Freshness Check'],
    },
    conversations: [
      { topic: 'pipeline-review', userMsg: 'Summarize my pipeline for this quarter.', agentMsg: '14 active opportunities worth $2.3M total. 4 deals in negotiation stage expected to close this month.' },
      { topic: 'lead-scoring', userMsg: 'Score this inbound lead from the webinar.', agentMsg: 'Lead score: 72/100. High firmographic fit, moderate engagement signals. Recommend outreach within 48 hours.' },
      { topic: 'competitive-intel', userMsg: 'What are the key differentiators against CompetitorX?', agentMsg: 'Key advantages: faster implementation (3 vs 6 months), lower TCO (22% savings), stronger compliance features.' },
    ],
  },
  'Marketing': {
    topics: ['campaign-analytics', 'content-optimization', 'audience-targeting', 'brand-monitoring', 'email-performance', 'social-engagement'],
    tests: {
      functional: ['Campaign Metric Aggregation', 'A/B Test Result Analysis', 'UTM Tracking Validation'],
      security: ['Customer Consent Verification', 'Data Privacy Compliance'],
      performance: ['Dashboard Refresh Speed', 'Report Export Time'],
      behavioral: ['Recommendation Quality', 'Content Tone Check'],
      quality: ['Attribution Accuracy', 'Segment Definition Precision'],
    },
    conversations: [
      { topic: 'campaign-analytics', userMsg: 'How did the Q3 email campaign perform?', agentMsg: 'Q3 email campaign: 24.3% open rate, 3.8% CTR, 1.2% conversion. Above benchmark on all metrics.' },
      { topic: 'audience-targeting', userMsg: 'Build a segment of high-value customers for the new offer.', agentMsg: 'Segment created: 12,400 customers with LTV > $5K and engagement score > 70. Ready for activation.' },
      { topic: 'brand-monitoring', userMsg: 'Any notable brand mentions this week?', agentMsg: 'Sentiment trending positive. 340 mentions this week, up 15%. Top theme: mobile app satisfaction.' },
    ],
  },
  'Legal': {
    topics: ['contract-review', 'clause-analysis', 'regulatory-tracking', 'litigation-support', 'ip-management', 'compliance-advisory'],
    tests: {
      functional: ['Clause Extraction Accuracy', 'Document Classification', 'Regulatory Alert Matching'],
      security: ['Privilege Protection', 'Document Access Control'],
      performance: ['Document Processing Speed', 'Search Response Time'],
      behavioral: ['Disclaimer Inclusion', 'Scope Limitation Accuracy'],
      quality: ['Citation Correctness', 'Summary Fidelity'],
    },
    conversations: [
      { topic: 'contract-review', userMsg: 'Review this vendor agreement for non-compete clauses.', agentMsg: 'Found 2 non-compete clauses: Section 8.2 (12-month geographic restriction) and Section 12.1 (client solicitation).' },
      { topic: 'regulatory-tracking', userMsg: 'Any new regulations affecting our lending operations?', agentMsg: 'CFPB issued updated guidance on {date} regarding small business lending disclosure requirements. Effective Q2.' },
      { topic: 'clause-analysis', userMsg: 'Compare indemnification terms across our top 3 vendor contracts.', agentMsg: 'Analysis complete: Vendor A has mutual indemnification, Vendor B is one-sided, Vendor C caps liability at 2x contract value.' },
    ],
  },
  'Engineering': {
    topics: ['code-review', 'deployment-status', 'incident-triage', 'tech-debt', 'documentation', 'dependency-management'],
    tests: {
      functional: ['PR Summary Accuracy', 'Deployment Check Verification', 'Runbook Retrieval'],
      security: ['Secret Detection', 'Dependency Vulnerability Scan'],
      performance: ['CI Pipeline Speed', 'Index Query Time'],
      behavioral: ['Priority Assessment', 'Context Relevance'],
      quality: ['Code Suggestion Quality', 'Documentation Clarity'],
    },
    conversations: [
      { topic: 'code-review', userMsg: 'Summarize the changes in PR #1247.', agentMsg: '12 files changed. Main change: refactored auth middleware to support OAuth 2.1. Added 8 unit tests.' },
      { topic: 'deployment-status', userMsg: 'What\'s the status of today\'s production deploy?', agentMsg: 'Deploy v2.4.1 completed at 14:32 UTC. All health checks passing. Rollback window closes at 20:00 UTC.' },
      { topic: 'tech-debt', userMsg: 'What are the top tech debt items for our service?', agentMsg: 'Top 3: (1) Legacy auth module — 2 weeks effort, (2) Database connection pooling — 1 week, (3) Test coverage gap in payments — 3 days.' },
    ],
  },
  'Operations': {
    topics: ['process-monitoring', 'resource-allocation', 'vendor-management', 'workflow-optimization', 'inventory-tracking', 'quality-control'],
    tests: {
      functional: ['Workflow Trigger Accuracy', 'Resource Allocation Check', 'Status Aggregation'],
      security: ['Vendor Data Isolation', 'Process Audit Logging'],
      performance: ['Batch Processing Speed', 'Notification Delivery Time'],
      behavioral: ['Priority Routing Accuracy', 'Escalation Timeliness'],
      quality: ['Status Report Accuracy', 'SOP Adherence Check'],
    },
    conversations: [
      { topic: 'process-monitoring', userMsg: 'Show me the status of all active workflows.', agentMsg: '23 active workflows. 21 on track, 1 delayed (vendor approval pending), 1 flagged (resource conflict).' },
      { topic: 'vendor-management', userMsg: 'When does the OfficeSupply Co. contract renew?', agentMsg: 'Contract renews March 15. Current terms: 3-year agreement, $45K annual. Renewal notice due by Feb 15.' },
      { topic: 'workflow-optimization', userMsg: 'Where are the bottlenecks in our onboarding process?', agentMsg: 'Main bottleneck: document verification step averaging 3.2 days. Background check is second at 2.1 days.' },
    ],
  },
  'Facilities': {
    topics: ['space-booking', 'maintenance-request', 'visitor-management', 'safety-compliance', 'asset-tracking'],
    tests: {
      functional: ['Booking Conflict Detection', 'Maintenance Ticket Routing', 'Visitor Badge Generation'],
      security: ['Physical Access Validation', 'Visitor Screening'],
      performance: ['Booking Response Time', 'Search Speed'],
      behavioral: ['Capacity Warning Accuracy', 'Priority Routing'],
      quality: ['Availability Data Freshness', 'Notification Clarity'],
    },
    conversations: [
      { topic: 'space-booking', userMsg: 'Book conference room 4B for tomorrow 2-3 PM.', agentMsg: 'Room 4B is available. Booked for tomorrow 2:00-3:00 PM. Calendar invite sent to all participants.' },
      { topic: 'maintenance-request', userMsg: 'The AC on floor 3 is not working.', agentMsg: 'Maintenance ticket #4521 created. Priority: Medium. Facilities team notified. ETA: within 4 hours.' },
      { topic: 'visitor-management', userMsg: 'Register a visitor for Thursday morning meeting.', agentMsg: 'Visitor pass created. QR badge will be emailed to your guest. Reception notified for Thursday 9 AM.' },
    ],
  },
  'Executive': {
    topics: ['strategic-briefing', 'board-prep', 'competitive-analysis', 'performance-summary', 'market-intelligence'],
    tests: {
      functional: ['Data Aggregation Accuracy', 'Briefing Document Generation', 'Trend Summary'],
      security: ['Executive Data Classification', 'Access Tier Enforcement'],
      performance: ['Report Compilation Speed', 'Data Refresh Latency'],
      behavioral: ['Insight Relevance', 'Sensitivity Filtering'],
      quality: ['Summary Conciseness', 'Data Currency Check'],
    },
    conversations: [
      { topic: 'strategic-briefing', userMsg: 'Prepare a summary of this week\'s key metrics.', agentMsg: 'Weekly summary: Revenue +3.2% WoW, NPS at 72 (up 2pts), Cost-to-income ratio stable at 52.1%.' },
      { topic: 'competitive-analysis', userMsg: 'How does our digital adoption compare to peers?', agentMsg: 'Digital banking adoption: 68% (industry avg 61%). Mobile-only users growing 4% quarterly vs 2.5% industry.' },
      { topic: 'board-prep', userMsg: 'Pull the latest board deck summary.', agentMsg: 'Q4 board deck highlights: record quarterly revenue, 3 strategic initiatives on track, 1 risk item (regulatory change).' },
    ],
  },
  'Infrastructure': {
    topics: ['system-health', 'capacity-planning', 'incident-management', 'patch-compliance', 'disaster-recovery', 'configuration-drift'],
    tests: {
      functional: ['Health Check Validation', 'Incident Classification', 'Capacity Threshold Alert'],
      security: ['Patch Level Verification', 'Firewall Rule Audit'],
      performance: ['Monitoring Latency', 'Alert Propagation Speed'],
      behavioral: ['Incident Severity Assessment', 'Runbook Selection'],
      quality: ['Diagnosis Accuracy', 'Resolution Recommendation Quality'],
    },
    conversations: [
      { topic: 'system-health', userMsg: 'Show infrastructure health dashboard.', agentMsg: 'All systems operational. 99.97% uptime this month. 2 minor alerts resolved today. No open incidents.' },
      { topic: 'incident-management', userMsg: 'Database latency spike detected on prod-db-03.', agentMsg: 'Incident created: SEV-3. Root cause: long-running query from batch job. Query killed, latency normalizing.' },
      { topic: 'capacity-planning', userMsg: 'Project storage needs for next quarter.', agentMsg: 'Current usage: 78% of allocated storage. At current growth rate, will reach 90% threshold by mid-Q2.' },
    ],
  },
  'Data Platform': {
    topics: ['pipeline-monitoring', 'data-quality', 'schema-management', 'lineage-tracking', 'access-governance', 'cost-optimization'],
    tests: {
      functional: ['Pipeline Health Check', 'Schema Validation', 'Lineage Trace Accuracy'],
      security: ['PII Detection Scan', 'Access Pattern Audit'],
      performance: ['Pipeline Throughput', 'Query Optimization Check'],
      behavioral: ['Alert Priority Classification', 'Drift Detection Sensitivity'],
      quality: ['Data Freshness Monitoring', 'Catalog Completeness'],
    },
    conversations: [
      { topic: 'data-quality', userMsg: 'Run data quality checks on the customer table.', agentMsg: 'Quality report: 99.2% completeness, 3 null-email records found, 0 duplicate keys. All within SLA.' },
      { topic: 'pipeline-monitoring', userMsg: 'Show status of overnight ETL jobs.', agentMsg: '14/15 jobs completed successfully. 1 job failed: customer_events pipeline (timeout). Auto-retry scheduled.' },
      { topic: 'schema-management', userMsg: 'Any schema changes detected upstream?', agentMsg: 'Schema drift detected: 2 new columns added to transactions table by upstream team. Impact analysis in progress.' },
    ],
  },
  'Analytics': {
    topics: ['metric-reporting', 'trend-analysis', 'cohort-analysis', 'dashboard-management', 'forecasting', 'anomaly-detection'],
    tests: {
      functional: ['Metric Calculation Accuracy', 'Dashboard Data Refresh', 'Report Scheduling'],
      security: ['Data Access Permissions', 'Export Watermarking'],
      performance: ['Query Execution Time', 'Dashboard Load Speed'],
      behavioral: ['Insight Generation Relevance', 'Threshold Alert Timing'],
      quality: ['Forecast Accuracy', 'Visualization Correctness'],
    },
    conversations: [
      { topic: 'metric-reporting', userMsg: 'Generate the weekly KPI report.', agentMsg: 'Weekly KPI report ready: 12 metrics tracked, 10 on target, 2 need attention (churn rate, support tickets).' },
      { topic: 'trend-analysis', userMsg: 'What\'s driving the increase in support volume?', agentMsg: 'Support volume up 18% MoM. Primary driver: mobile app update (v3.2) generating password reset requests.' },
      { topic: 'anomaly-detection', userMsg: 'Any unusual patterns in today\'s data?', agentMsg: 'Anomaly detected: transaction volume 2.3 standard deviations above normal for this time of day. Investigating.' },
    ],
  },
  'Digital Channels': {
    topics: ['app-performance', 'user-experience', 'feature-adoption', 'notification-management', 'channel-analytics', 'accessibility'],
    tests: {
      functional: ['App Flow Validation', 'Notification Delivery', 'Feature Toggle Check'],
      security: ['Session Management', 'Input Sanitization'],
      performance: ['Page Load Time', 'API Response Benchmark'],
      behavioral: ['User Intent Classification', 'Fallback Handling'],
      quality: ['Response Relevance', 'Accessibility Compliance'],
    },
    conversations: [
      { topic: 'app-performance', userMsg: 'How is the mobile app performing this week?', agentMsg: 'App performance: 98.5% crash-free rate, avg load time 1.2s, 4.6 star rating. No critical issues.' },
      { topic: 'user-experience', userMsg: 'What are the top user complaints this month?', agentMsg: 'Top 3 issues: (1) Password reset flow complexity, (2) Slow check image loading, (3) Missing dark mode support.' },
      { topic: 'feature-adoption', userMsg: 'How is the new bill pay feature being adopted?', agentMsg: 'Bill pay adoption: 34% of eligible users activated (target: 40%). Usage growing 5% weekly.' },
    ],
  },
  'Investment Services': {
    topics: ['portfolio-analysis', 'market-research', 'risk-profiling', 'rebalancing-advice', 'tax-optimization', 'client-reporting'],
    tests: {
      functional: ['Portfolio Calculation Accuracy', 'Market Data Integration', 'Risk Score Computation'],
      security: ['Client Data Segregation', 'Trading Authorization Check'],
      performance: ['Market Data Latency', 'Report Generation Speed'],
      behavioral: ['Suitability Assessment', 'Risk Disclosure Compliance'],
      quality: ['Recommendation Appropriateness', 'Return Calculation Precision'],
    },
    conversations: [
      { topic: 'portfolio-analysis', userMsg: 'Review the performance of portfolio ABC-123.', agentMsg: 'Portfolio ABC-123: YTD return 8.7%, benchmark 7.2%. Outperforming by 150bps. Top contributor: tech allocation.' },
      { topic: 'risk-profiling', userMsg: 'Client submitted updated risk questionnaire.', agentMsg: 'Risk profile updated: Moderate to Moderate-Aggressive. Current allocation aligned. No rebalancing needed.' },
      { topic: 'rebalancing-advice', userMsg: 'Any portfolios due for rebalancing?', agentMsg: '3 portfolios flagged: drift exceeds 5% threshold. Recommendations generated. Awaiting advisor approval.' },
    ],
  },
  'Payments': {
    topics: ['transaction-routing', 'settlement-monitoring', 'dispute-handling', 'compliance-screening', 'fee-calculation', 'batch-processing'],
    tests: {
      functional: ['Routing Rule Accuracy', 'Settlement Calculation', 'Dispute Workflow'],
      security: ['Transaction Encryption', 'Fraud Screening Integration'],
      performance: ['Payment Processing Latency', 'Batch Throughput'],
      behavioral: ['Dispute Classification', 'Priority Routing Accuracy'],
      quality: ['Fee Calculation Precision', 'Status Notification Clarity'],
    },
    conversations: [
      { topic: 'transaction-routing', userMsg: 'Route this $50K wire transfer to correspondent bank.', agentMsg: 'Wire validated. Routing via SWIFT: optimal path selected. Estimated settlement: T+1. Compliance screening passed.' },
      { topic: 'dispute-handling', userMsg: 'Customer disputes charge from MerchantXYZ.', agentMsg: 'Dispute case #8842 opened. Provisional credit issued. Merchant notification sent. Resolution target: 10 business days.' },
      { topic: 'settlement-monitoring', userMsg: 'Show today\'s settlement status.', agentMsg: 'Today\'s settlements: 1,247 transactions processed. Total volume: $14.2M. 2 items pending (foreign currency).' },
    ],
  },
  'Treasury': {
    topics: ['liquidity-management', 'fx-monitoring', 'interest-rate-analysis', 'cash-positioning', 'investment-portfolio', 'funding-strategy'],
    tests: {
      functional: ['Cash Position Calculation', 'FX Rate Feed Validation', 'Liquidity Ratio Check'],
      security: ['Trading System Access Control', 'Data Encryption Verification'],
      performance: ['Real-Time Position Update', 'Rate Feed Latency'],
      behavioral: ['Threshold Breach Alert', 'Risk Limit Warning'],
      quality: ['Forecast Accuracy', 'Position Reconciliation Precision'],
    },
    conversations: [
      { topic: 'liquidity-management', userMsg: 'What is our current liquidity coverage ratio?', agentMsg: 'LCR: 128% (regulatory minimum: 100%). High-quality liquid assets at $4.2B. Comfortable margin.' },
      { topic: 'fx-monitoring', userMsg: 'EUR/USD showing unusual volatility.', agentMsg: 'EUR/USD volatility up 40bps. Current exposure: €12M. Hedge ratio at 85%. No immediate action required.' },
      { topic: 'cash-positioning', userMsg: 'Project tomorrow\'s cash position.', agentMsg: 'Projected opening balance: $892M. Expected inflows: $145M, outflows: $128M. Net positive $17M.' },
    ],
  },
  'Risk': {
    topics: ['model-validation', 'stress-testing', 'exposure-monitoring', 'limit-management', 'scenario-analysis', 'regulatory-capital'],
    tests: {
      functional: ['Model Output Validation', 'Stress Scenario Execution', 'Limit Breach Detection'],
      security: ['Model Access Control', 'Data Lineage Verification'],
      performance: ['Calculation Engine Speed', 'Batch Run Time'],
      behavioral: ['Risk Alert Prioritization', 'Threshold Sensitivity'],
      quality: ['Model Accuracy Backtesting', 'Report Consistency'],
    },
    conversations: [
      { topic: 'stress-testing', userMsg: 'Run the Fed severe adverse scenario on our portfolio.', agentMsg: 'Stress test complete. Projected losses: $340M (within buffer). Capital ratio post-stress: 10.2% (minimum: 8%).' },
      { topic: 'exposure-monitoring', userMsg: 'Show our top 10 counterparty exposures.', agentMsg: 'Top exposure: Counterparty A at $1.2B (limit: $1.5B). 3 counterparties above 70% of limit. Details attached.' },
      { topic: 'model-validation', userMsg: 'Has the credit risk model been validated this quarter?', agentMsg: 'Model validation completed Dec 1. Backtesting results: within acceptable range. Next review: March 1.' },
    ],
  },
  'Internal Services': {
    topics: ['helpdesk-support', 'access-requests', 'system-onboarding', 'knowledge-base', 'service-catalog', 'feedback-collection'],
    tests: {
      functional: ['Ticket Classification', 'Knowledge Base Search', 'Service Catalog Browsing'],
      security: ['Employee Data Protection', 'Ticket Confidentiality'],
      performance: ['Response Time SLA', 'Search Result Speed'],
      behavioral: ['Empathy in Responses', 'Escalation Judgment'],
      quality: ['Solution Accuracy', 'First-Contact Resolution Rate'],
    },
    conversations: [
      { topic: 'helpdesk-support', userMsg: 'I can\'t connect to the VPN from home.', agentMsg: 'Let\'s troubleshoot. First, please verify your VPN client version. The latest is v4.2.1. Also check if your certificate has expired.' },
      { topic: 'access-requests', userMsg: 'I need access to the analytics dashboard for my project.', agentMsg: 'Access request submitted for Analytics Dashboard (read-only). Requires manager approval. Typical turnaround: 1 business day.' },
      { topic: 'knowledge-base', userMsg: 'How do I submit an expense report?', agentMsg: 'Expense reports are submitted through Concur. Go to concur.company.com, click New Report, and attach your receipts.' },
    ],
  },
  'Document Processing': {
    topics: ['document-classification', 'data-extraction', 'validation-check', 'template-matching', 'ocr-processing', 'workflow-routing'],
    tests: {
      functional: ['Classification Accuracy', 'Field Extraction', 'Template Matching'],
      security: ['PII Redaction Check', 'Document Retention Compliance'],
      performance: ['OCR Processing Speed', 'Batch Throughput'],
      behavioral: ['Low-Confidence Flagging', 'Exception Routing'],
      quality: ['Extraction Accuracy', 'Format Consistency'],
    },
    conversations: [
      { topic: 'document-classification', userMsg: 'Classify this uploaded batch of 50 documents.', agentMsg: 'Batch processed: 32 invoices, 12 contracts, 4 tax forms, 2 unclassified (low confidence). Review flagged items.' },
      { topic: 'data-extraction', userMsg: 'Extract key fields from this lease agreement.', agentMsg: 'Extracted: Tenant name, address, lease term (24 months), monthly rent ($3,200), security deposit ($6,400).' },
      { topic: 'validation-check', userMsg: 'Validate the uploaded bank statement.', agentMsg: 'Validation: document type confirmed, 12 months of statements detected, all pages legible. Confidence: 94%.' },
    ],
  },
  'Support': {
    topics: ['ticket-triage', 'issue-resolution', 'escalation-routing', 'customer-follow-up', 'knowledge-search', 'satisfaction-survey'],
    tests: {
      functional: ['Ticket Routing Accuracy', 'Issue Category Classification', 'SLA Compliance Check'],
      security: ['Customer Data Protection', 'Session Isolation'],
      performance: ['Response Time SLA', 'Queue Processing Speed'],
      behavioral: ['Tone Appropriateness', 'Escalation Judgment Accuracy'],
      quality: ['Resolution Quality', 'Customer Satisfaction Correlation'],
    },
    conversations: [
      { topic: 'ticket-triage', userMsg: 'Customer reporting inability to access online banking.', agentMsg: 'Ticket #9021 created. Category: Access Issue. Priority: High. Routed to online banking support team.' },
      { topic: 'issue-resolution', userMsg: 'Follow up on ticket #8876 regarding missing deposit.', agentMsg: 'Deposit located: ACH credit of $1,500 posted to wrong account. Correction initiated. Customer will see funds within 24 hours.' },
      { topic: 'escalation-routing', userMsg: 'Customer is requesting to speak with a supervisor.', agentMsg: 'Escalation logged. Supervisor callback scheduled within 2 hours. Customer sentiment: frustrated. Context summary attached.' },
    ],
  },
  'Regulatory': {
    topics: ['filing-preparation', 'regulatory-monitoring', 'examination-support', 'policy-interpretation', 'reporting-compliance', 'change-management'],
    tests: {
      functional: ['Report Format Compliance', 'Filing Deadline Tracking', 'Data Validation Rules'],
      security: ['Regulatory Data Classification', 'Submission Channel Security'],
      performance: ['Report Generation Speed', 'Data Aggregation Time'],
      behavioral: ['Regulatory Change Detection', 'Impact Assessment Quality'],
      quality: ['Filing Accuracy', 'Interpretation Consistency'],
    },
    conversations: [
      { topic: 'filing-preparation', userMsg: 'Prepare the quarterly Call Report data.', agentMsg: 'Call Report data compiled. 45 schedules populated. 3 items flagged for manual review. Deadline: Jan 30.' },
      { topic: 'regulatory-monitoring', userMsg: 'Any new regulatory notices this week?', agentMsg: '2 new notices: (1) OCC guidance on AI risk management, (2) Fed update to Regulation E dispute timelines. Impact analysis in progress.' },
      { topic: 'examination-support', userMsg: 'Regulators requested our BSA/AML program documentation.', agentMsg: 'Document package assembled: policies, procedures, training records, and audit results. Ready for examiner review.' },
    ],
  },
}

// Fallback for any unknown domain
const fallbackContent = {
  topics: ['general-inquiry', 'process-support', 'data-lookup', 'status-check', 'reporting', 'workflow-assist'],
  tests: {
    functional: ['Core Workflow Test', 'Input Validation', 'Output Format Check'],
    security: ['Access Control Test', 'Data Protection Scan'],
    performance: ['Response Time Check', 'Load Test'],
    behavioral: ['Edge Case Handling', 'Graceful Degradation'],
    quality: ['Output Accuracy', 'Consistency Check'],
  },
  conversations: [
    { topic: 'general-inquiry', userMsg: 'I need help with a task.', agentMsg: 'I\'m ready to assist. Could you provide more details about what you need?' },
    { topic: 'process-support', userMsg: 'Walk me through the standard process.', agentMsg: 'The standard process involves 3 steps: submission, review, and approval. Let me guide you through each.' },
    { topic: 'status-check', userMsg: 'What\'s the current status?', agentMsg: 'Current status: all systems operational. No pending items requiring attention.' },
  ],
}

export function getDomainContent(domain) {
  return domainContent[domain] || fallbackContent
}

export default domainContent
