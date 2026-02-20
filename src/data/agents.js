// ─── Display override constants for 4,000+ scale narrative ──────────────────
// ABC Bank has 4,127 agents total — most from self-service Copilot usage
// We keep the actual agent records small; these constants drive summary displays
export const DISPLAY_TOTAL_AGENTS = 4127
export const DISPLAY_ACTIVE_AGENTS = 3982
export const DISPLAY_DEGRADED_AGENTS = 48
export const DISPLAY_MAINTENANCE_AGENTS = 12
export const DISPLAY_IMPACT_COUNTS = { green: 3400, yellow: 580, red: 147 }

// Team-level display counts — scaled to reflect the full 4,127 agent portfolio.
// Self-service teams (Copilot-sourced) dominate. Alphabetical order matches nav.
export const displayTeamCounts = {
  'Branch Operations': 28,
  'Business Intelligence': 30,
  'Collections': 17,
  'Compliance': 40,
  'Customer Experience': 52,
  'Data Analytics': 44,
  'Data Engineering': 28,
  'Data Governance': 31,
  'Digital Banking': 39,
  'Financial Reporting': 35,
  'Human Resources': 26,
  'IT Operations': 43,
  'Lending Operations': 47,
  'Marketing': 24,
  'Operations': 20,
  'Payments': 45,
  'Risk Analytics': 38,
  'Risk Management': 65,
  'Self-Service — Engineering': 545,
  'Self-Service — Executive': 145,
  'Self-Service — Facilities': 170,
  'Self-Service — Finance': 490,
  'Self-Service — HR': 460,
  'Self-Service — Legal': 285,
  'Self-Service — Marketing': 410,
  'Self-Service — Operations': 375,
  'Self-Service — Sales': 520,
  'Treasury': 35,
  'Wealth Management': 40,
}

// Hand-crafted primary agents (these appear in demos)
const coreAgents = [
  {
    id: 'cs-agent-001',
    name: 'Customer Service Agent',
    description: 'Handles customer inquiries across chat, email, and voice channels',
    status: 'active',
    source: 'dataiku',
    team: 'Customer Experience',
    domain: 'Retail Banking',
    owner: 'Sarah Chen',
    channels: ['chat', 'email', 'voice'],
    createdAt: '2024-03-15',
    lastActive: '2024-12-06T14:32:00Z',
    version: '2.4.1',
    criticality: 'high',
    tags: ['customer-facing', 'tier-1', 'pii-handling'],
    businessImpact: 'yellow',
    businessImpactLabel: 'Resolution rate declined 7.8% in Q4',
    aiInsight: 'Customer Service Agent is operational with 78.5% resolution rate, down from 85.2% last quarter. A new recurring topic ("no snow") is affecting response quality. Recommend reviewing behavior analysis and updating knowledge base.',
    operationalHealth: { responseTime: 1200, responseTimeTrend: 'stable', errorRate: 0.3, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 1, dataExposure: 0 },
  },
  {
    id: 'fraud-agent-002',
    name: 'Fraud Detection Agent',
    description: 'Real-time transaction monitoring and fraud alerting',
    status: 'active',
    source: 'bedrock',
    team: 'Risk Management',
    domain: 'Security',
    owner: 'Michael Torres',
    channels: ['api'],
    createdAt: '2024-01-10',
    lastActive: '2024-12-06T14:35:00Z',
    version: '3.1.0',
    criticality: 'high',
    tags: ['internal', 'real-time', 'compliance-critical'],
    businessImpact: 'green',
    businessImpactLabel: 'Detection rate at 99.2%, exceeding targets',
    aiInsight: 'Fraud Detection Agent is performing exceptionally with 99.2% detection rate and 0.01% error rate. Blocked 1,247 fraudulent transactions this month, saving an estimated $2.45M.',
    operationalHealth: { responseTime: 150, responseTimeTrend: 'up', errorRate: 0.01, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'loan-agent-003',
    name: 'Loan Processing Agent',
    description: 'Automates loan application review and document processing',
    status: 'active',
    source: 'copilot',
    team: 'Lending Operations',
    domain: 'Consumer Lending',
    owner: 'Jennifer Park',
    channels: ['api', 'email'],
    createdAt: '2024-02-20',
    lastActive: '2024-12-06T13:45:00Z',
    version: '1.8.2',
    criticality: 'high',
    tags: ['document-processing', 'decision-support'],
    businessImpact: 'green',
    businessImpactLabel: 'Processing accuracy at 97.8%',
    aiInsight: 'Loan Processing Agent is steady with 97.8% accuracy. Processing time averages 24 minutes per application. Consider monitoring the higher error rate (0.8%) during peak hours.',
    operationalHealth: { responseTime: 4500, responseTimeTrend: 'stable', errorRate: 0.8, errorRateTrend: 'up' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'it-support-004',
    name: 'IT Support Agent',
    description: 'Internal helpdesk automation for employee tech issues',
    status: 'active',
    source: 'servicenow',
    team: 'IT Operations',
    domain: 'Internal Services',
    owner: 'David Kim',
    channels: ['chat', 'ticket'],
    createdAt: '2024-04-05',
    lastActive: '2024-12-06T14:28:00Z',
    version: '2.0.0',
    criticality: 'medium',
    tags: ['internal', 'employee-facing'],
    businessImpact: 'green',
    businessImpactLabel: 'Resolution rate at 82.3%',
    aiInsight: 'IT Support Agent is operating well with 82.3% resolution rate and high employee satisfaction (4.4/5). No significant issues detected.',
    operationalHealth: { responseTime: 1800, responseTimeTrend: 'down', errorRate: 0.2, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'onboarding-005',
    name: 'Customer Onboarding Agent',
    description: 'Guides new customers through account setup and KYC',
    status: 'active',
    source: 'langchain',
    team: 'Customer Experience',
    domain: 'Retail Banking',
    owner: 'Lisa Wang',
    channels: ['chat', 'mobile'],
    createdAt: '2024-05-12',
    lastActive: '2024-12-06T14:30:00Z',
    version: '1.5.0',
    criticality: 'high',
    tags: ['customer-facing', 'kyc', 'compliance'],
    businessImpact: 'green',
    businessImpactLabel: 'Onboarding completion at 89.2%',
    aiInsight: 'Customer Onboarding Agent is performing well with 89.2% completion rate. Drop-off rate of 10.8% is within acceptable range. KYC verification steps are functioning normally.',
    operationalHealth: { responseTime: 2100, responseTimeTrend: 'stable', errorRate: 0.5, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 2, dataExposure: 1 },
  },
  {
    id: 'investment-006',
    name: 'Investment Advisor Agent',
    description: 'Provides portfolio insights and investment recommendations',
    status: 'active',
    source: 'dataiku',
    team: 'Wealth Management',
    domain: 'Investment Services',
    owner: 'Robert Martinez',
    channels: ['chat', 'email'],
    createdAt: '2024-03-28',
    lastActive: '2024-12-06T12:15:00Z',
    version: '2.2.0',
    criticality: 'high',
    tags: ['advisory', 'financial-planning'],
    businessImpact: 'yellow',
    businessImpactLabel: 'Portfolio accuracy needs monitoring',
    aiInsight: 'Investment Advisor Agent shows slightly elevated response times (3.2s avg). Portfolio recommendation accuracy is strong at 94.1% but below the 96% target. Recommend review.',
    operationalHealth: { responseTime: 3200, responseTimeTrend: 'up', errorRate: 0.6, errorRateTrend: 'up' },
    operationalRisks: { securityWarnings: 1, dataExposure: 0 },
  },
  {
    id: 'compliance-007',
    name: 'Compliance Monitor Agent',
    description: 'Monitors transactions for regulatory compliance violations',
    status: 'active',
    source: 'bedrock',
    team: 'Compliance',
    domain: 'Regulatory',
    owner: 'Amanda Foster',
    channels: ['api'],
    createdAt: '2024-01-25',
    lastActive: '2024-12-06T14:35:00Z',
    version: '4.0.1',
    criticality: 'high',
    tags: ['compliance', 'monitoring', 'aml'],
    businessImpact: 'green',
    businessImpactLabel: 'All compliance checks passing',
    aiInsight: 'Compliance Monitor Agent is operating at peak performance with 99.95% uptime. All regulatory checks are passing. Zero missed alerts in the past 30 days.',
    operationalHealth: { responseTime: 800, responseTimeTrend: 'stable', errorRate: 0.05, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'marketing-008',
    name: 'Marketing Personalization Agent',
    description: 'Delivers personalized product recommendations and offers',
    status: 'active',
    source: 'langchain',
    team: 'Marketing',
    domain: 'Marketing',
    owner: 'Chris Johnson',
    channels: ['email', 'push', 'web'],
    createdAt: '2024-06-10',
    lastActive: '2024-12-06T11:00:00Z',
    version: '1.3.0',
    criticality: 'medium',
    tags: ['personalization', 'campaigns'],
    businessImpact: 'green',
    businessImpactLabel: 'Campaign conversion up 12%',
    aiInsight: 'Marketing Personalization Agent is delivering strong results with campaign conversion rates up 12% month-over-month. Error rate of 1.2% is slightly elevated but within tolerance.',
    operationalHealth: { responseTime: 2800, responseTimeTrend: 'stable', errorRate: 1.2, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'collections-009',
    name: 'Collections Agent',
    description: 'Automates payment reminder communications',
    status: 'degraded',
    source: 'n8n',
    team: 'Collections',
    domain: 'Consumer Lending',
    owner: 'Patricia Brown',
    channels: ['sms', 'email', 'voice'],
    createdAt: '2024-04-20',
    lastActive: '2024-12-06T14:10:00Z',
    version: '1.1.0',
    criticality: 'medium',
    tags: ['outbound', 'payment-processing'],
    businessImpact: 'red',
    businessImpactLabel: 'High error rate affecting collections',
    aiInsight: 'Collections Agent is degraded with 2.8% error rate and 97.5% uptime. Payment reminders are failing for a subset of customers. Immediate investigation recommended.',
    operationalHealth: { responseTime: 3500, responseTimeTrend: 'up', errorRate: 2.8, errorRateTrend: 'up' },
    operationalRisks: { securityWarnings: 3, dataExposure: 1 },
  },
  {
    id: 'hr-agent-010',
    name: 'HR Assistant Agent',
    description: 'Answers employee HR questions and processes requests',
    status: 'active',
    source: 'copilot',
    team: 'Human Resources',
    domain: 'Internal Services',
    owner: 'Nancy White',
    channels: ['chat', 'email'],
    createdAt: '2024-05-01',
    lastActive: '2024-12-06T13:30:00Z',
    version: '1.2.0',
    criticality: 'low',
    tags: ['internal', 'employee-facing'],
    businessImpact: 'green',
    businessImpactLabel: 'Employee satisfaction at 4.3/5',
    aiInsight: 'HR Assistant Agent is performing steadily. Employee satisfaction remains high at 4.3/5. Low criticality with no significant issues.',
    operationalHealth: { responseTime: 1500, responseTimeTrend: 'stable', errorRate: 0.15, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'document-011',
    name: 'Document Analysis Agent',
    description: 'Extracts and validates information from uploaded documents',
    status: 'active',
    source: 'bedrock',
    team: 'Operations',
    domain: 'Document Processing',
    owner: 'James Wilson',
    channels: ['api'],
    createdAt: '2024-02-15',
    lastActive: '2024-12-06T14:20:00Z',
    version: '2.5.0',
    criticality: 'medium',
    tags: ['ocr', 'extraction', 'validation'],
    businessImpact: 'green',
    businessImpactLabel: 'Extraction accuracy at 98.5%',
    aiInsight: 'Document Analysis Agent is performing well with 98.5% extraction accuracy. Processing volume is steady at ~200 documents per day.',
    operationalHealth: { responseTime: 2200, responseTimeTrend: 'stable', errorRate: 0.3, errorRateTrend: 'down' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'scheduling-012',
    name: 'Appointment Scheduler Agent',
    description: 'Manages branch appointment bookings for customers',
    status: 'active',
    source: 'langchain',
    team: 'Branch Operations',
    domain: 'Retail Banking',
    owner: 'Emily Davis',
    channels: ['chat', 'phone'],
    createdAt: '2024-06-25',
    lastActive: '2024-12-06T14:05:00Z',
    version: '1.0.2',
    criticality: 'low',
    tags: ['scheduling', 'customer-facing'],
    businessImpact: 'green',
    businessImpactLabel: 'Booking success rate at 95%',
    aiInsight: 'Appointment Scheduler Agent is running smoothly with 95% booking success rate. No significant issues detected.',
    operationalHealth: { responseTime: 900, responseTimeTrend: 'stable', errorRate: 0.1, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'reporting-013',
    name: 'Report Generation Agent',
    description: 'Automates creation of business and compliance reports',
    status: 'active',
    source: 'dataiku',
    team: 'Business Intelligence',
    domain: 'Analytics',
    owner: 'Kevin Lee',
    channels: ['api', 'email'],
    createdAt: '2024-03-10',
    lastActive: '2024-12-06T08:00:00Z',
    version: '3.0.0',
    criticality: 'medium',
    tags: ['reporting', 'analytics', 'scheduled'],
    businessImpact: 'green',
    businessImpactLabel: 'Reports generated on schedule',
    aiInsight: 'Report Generation Agent is delivering all scheduled reports on time. Coverage includes business and compliance domains with 100% delivery rate.',
    operationalHealth: { responseTime: 5500, responseTimeTrend: 'stable', errorRate: 0.2, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'feedback-014',
    name: 'Customer Feedback Agent',
    description: 'Collects and analyzes customer satisfaction feedback',
    status: 'maintenance',
    source: 'langchain',
    team: 'Customer Experience',
    domain: 'Analytics',
    owner: 'Rachel Green',
    channels: ['sms', 'email'],
    createdAt: '2024-07-01',
    lastActive: '2024-12-05T23:59:00Z',
    version: '0.9.1',
    criticality: 'low',
    tags: ['surveys', 'nps', 'analytics'],
    businessImpact: 'yellow',
    businessImpactLabel: 'Under maintenance — feedback collection paused',
    aiInsight: 'Customer Feedback Agent is currently in maintenance mode. Feedback collection is paused while v1.0 release is being prepared. Expected back online within 48 hours.',
    operationalHealth: { responseTime: 0, responseTimeTrend: 'stable', errorRate: 0, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'escalation-015',
    name: 'Escalation Handler Agent',
    description: 'Routes complex issues to appropriate human specialists',
    status: 'active',
    source: 'servicenow',
    team: 'Customer Experience',
    domain: 'Support',
    owner: 'Thomas Anderson',
    channels: ['internal'],
    createdAt: '2024-04-15',
    lastActive: '2024-12-06T14:33:00Z',
    version: '1.4.0',
    criticality: 'high',
    tags: ['routing', 'escalation', 'triage'],
    businessImpact: 'green',
    businessImpactLabel: 'Routing accuracy at 96%',
    aiInsight: 'Escalation Handler Agent is performing well with 96% routing accuracy. Average escalation handling time is 2.3 minutes. No missed escalations in the past 7 days.',
    operationalHealth: { responseTime: 500, responseTimeTrend: 'stable', errorRate: 0.1, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
  {
    id: 'kyc-agent-016',
    name: 'KYC Verification Agent',
    description: 'Automates identity verification and document classification for credit applications',
    status: 'active',
    source: 'bedrock',
    team: 'Risk Management',
    domain: 'Compliance',
    owner: 'Priya Sharma',
    channels: ['api'],
    createdAt: '2024-04-01',
    lastActive: '2024-12-06T14:35:00Z',
    version: '2.1.0',
    criticality: 'high',
    tags: ['kyc', 'compliance', 'identity-verification', 'credit'],
    businessImpact: 'red',
    businessImpactLabel: 'Escalation rate 23% vs <10% target — credit processing time doubled',
    aiInsight: 'KYC Verification Agent is operationally healthy but missing critical business targets. Escalation rate has climbed from 8% to 23% over 6 weeks, routing a disproportionate number of credit applications to manual review. Average processing time has doubled from 2.1 to 4.2 days. Customer satisfaction for credit applicants dropped from 4.1 to 3.2. Immediate behavior analysis and model recalibration recommended.',
    operationalHealth: { responseTime: 1100, responseTimeTrend: 'stable', errorRate: 0.2, errorRateTrend: 'stable' },
    operationalRisks: { securityWarnings: 0, dataExposure: 0 },
  },
]

// ─── Generated agents to simulate enterprise scale ───────────────────────────
// Distributed across platforms — Dataiku and Bedrock dominant, Copilot for some self-service

const generatedAgentTemplates = [
  // ── Self-Service / Departmental Agents (spread across platforms) ──────────
  { team: 'Self-Service — Sales', domain: 'Sales', source: 'dataiku', criticality: 'low', names: [
    ['Sales Pipeline Summarizer', 'Summarizes weekly pipeline status for sales reps'],
    ['Lead Scoring Copilot', 'Scores inbound leads based on firmographic data'],
    ['Meeting Prep Assistant', 'Prepares client meeting briefs from CRM data'],
    ['Quote Generator', 'Generates pricing quotes based on product config'],
    ['RFP Response Drafter', 'Drafts responses to incoming RFP questions'],
    ['Win/Loss Analyzer', 'Analyzes deal outcomes for coaching insights'],
    ['Territory Planner', 'Helps reps plan territory coverage and travel'],
    ['Competitive Intel Bot', 'Retrieves competitive positioning data'],
    ['Sales Forecast Helper', 'Generates rolling 90-day forecast summaries'],
    ['Commission Calculator', 'Calculates estimated commissions per deal'],
    ['Deal Room Organizer', 'Organizes documents and notes for active deals'],
    ['Renewal Reminder Bot', 'Tracks upcoming contract renewals'],
  ]},
  { team: 'Self-Service — Finance', domain: 'Finance', source: 'bedrock', criticality: 'low', names: [
    ['Expense Report Checker', 'Validates expense reports against policy'],
    ['Budget Variance Analyzer', 'Highlights budget vs actual variances'],
    ['Invoice Matcher', 'Matches invoices to purchase orders'],
    ['Cash Flow Forecaster', 'Projects weekly cash flow from AP/AR data'],
    ['GL Entry Validator', 'Checks general ledger entries for anomalies'],
    ['Month-End Checklist Bot', 'Tracks month-end close task completion'],
    ['Vendor Payment Status', 'Looks up vendor payment status and history'],
    ['Tax Document Organizer', 'Categorizes tax-related documents'],
    ['Intercompany Reconciler', 'Helps reconcile intercompany transactions'],
    ['Financial Report Formatter', 'Formats data exports into standard reports'],
  ]},
  { team: 'Self-Service — HR', domain: 'Human Resources', source: 'servicenow', criticality: 'low', names: [
    ['PTO Balance Checker', 'Looks up employee PTO balances and policies'],
    ['Benefits FAQ Bot', 'Answers common benefits enrollment questions'],
    ['New Hire Checklist Agent', 'Tracks onboarding tasks for new employees'],
    ['Org Chart Navigator', 'Helps employees find team structures and contacts'],
    ['Performance Review Prep', 'Prepares templates for performance reviews'],
    ['Job Posting Drafter', 'Drafts internal and external job postings'],
    ['Interview Scheduler', 'Coordinates interview schedules across panels'],
    ['Training Recommender', 'Suggests training courses based on role and goals'],
    ['Exit Survey Analyzer', 'Summarizes exit survey themes and trends'],
    ['Headcount Tracker', 'Tracks team headcount against budget'],
    ['Policy Lookup Agent', 'Retrieves HR policy documents on demand'],
    ['Diversity Metrics Reporter', 'Generates diversity metrics summaries'],
  ]},
  { team: 'Self-Service — Legal', domain: 'Legal', source: 'langchain', criticality: 'medium', names: [
    ['Contract Clause Finder', 'Searches contracts for specific clauses'],
    ['NDA Generator', 'Generates standard NDA documents from templates'],
    ['Regulatory Update Tracker', 'Monitors regulatory changes relevant to banking'],
    ['Legal Hold Manager', 'Tracks documents under legal hold status'],
    ['IP Portfolio Tracker', 'Manages intellectual property filing status'],
    ['Litigation Timeline Builder', 'Builds timelines for active cases'],
    ['Compliance FAQ Bot', 'Answers compliance-related policy questions'],
    ['Third-Party Risk Checker', 'Screens vendors against risk databases'],
  ]},
  { team: 'Self-Service — Marketing', domain: 'Marketing', source: 'dataiku', criticality: 'low', names: [
    ['Campaign Performance Summarizer', 'Summarizes campaign metrics across channels'],
    ['Content Calendar Manager', 'Manages editorial content calendar'],
    ['Social Media Monitor', 'Tracks brand mentions and sentiment on social media'],
    ['Email Template Builder', 'Creates email templates from brand guidelines'],
    ['A/B Test Analyzer', 'Analyzes A/B test results and recommends winners'],
    ['SEO Keyword Tracker', 'Monitors keyword rankings and suggests optimizations'],
    ['Brand Voice Checker', 'Reviews content for brand voice consistency'],
    ['Event Planning Assistant', 'Coordinates logistics for marketing events'],
    ['Customer Persona Builder', 'Generates customer personas from segment data'],
    ['UTM Tag Generator', 'Creates tracking UTM parameters for campaign links'],
  ]},
  { team: 'Self-Service — Operations', domain: 'Operations', source: 'n8n', criticality: 'low', names: [
    ['Facility Booking Agent', 'Manages conference room and facility bookings'],
    ['Vendor Contact Lookup', 'Retrieves vendor contact and contract info'],
    ['Shipping Status Tracker', 'Tracks package and supply shipment status'],
    ['Inventory Alert Bot', 'Monitors supply inventory levels and alerts'],
    ['Process Documentation Writer', 'Helps draft SOPs from workflow descriptions'],
    ['Meeting Notes Summarizer', 'Generates meeting summaries from transcripts'],
    ['Project Status Aggregator', 'Compiles project status from multiple sources'],
    ['Change Request Tracker', 'Tracks change requests through approval workflow'],
  ]},
  // ── Platform-managed agents (Bedrock, Dataiku, ServiceNow, etc.) ─────────
  { team: 'Risk Management', domain: 'Security', source: 'bedrock', criticality: 'high', names: [
    ['AML Transaction Screener', 'Screens transactions against AML watch lists'],
    ['Sanctions List Checker', 'Validates parties against global sanctions lists'],
    ['Credit Risk Scorer', 'Calculates credit risk scores for applications'],
    ['Market Risk Monitor', 'Monitors portfolio exposure to market movements'],
    ['Operational Risk Tracker', 'Tracks operational risk events and near-misses'],
    ['Cyber Threat Detector', 'Detects anomalous network patterns indicating threats'],
    ['Third-Party Risk Assessor', 'Assesses third-party vendor risk profiles'],
    ['Insider Threat Monitor', 'Monitors for potential insider threat indicators'],
  ]},
  { team: 'Customer Experience', domain: 'Retail Banking', source: 'dataiku', criticality: 'medium', names: [
    ['Churn Prediction Agent', 'Predicts customer churn probability'],
    ['Cross-Sell Recommender', 'Recommends products based on customer profile'],
    ['Sentiment Analysis Agent', 'Analyzes customer interaction sentiment in real-time'],
    ['Voice of Customer Analyzer', 'Aggregates and themes customer feedback'],
    ['Customer Journey Mapper', 'Maps customer touchpoints across channels'],
    ['Next-Best-Action Engine', 'Recommends next best action for customer interactions'],
  ]},
  { team: 'Lending Operations', domain: 'Consumer Lending', source: 'bedrock', criticality: 'high', names: [
    ['Mortgage Underwriting Agent', 'Automates mortgage underwriting decisions'],
    ['Auto Loan Processor', 'Processes auto loan applications end-to-end'],
    ['Small Business Loan Reviewer', 'Reviews SMB loan applications for eligibility'],
    ['Loan Document Verifier', 'Verifies required documents for loan processing'],
    ['Credit Line Adjuster', 'Recommends credit line adjustments based on behavior'],
    ['Refinance Eligibility Checker', 'Checks refinance eligibility for existing loans'],
  ]},
  { team: 'IT Operations', domain: 'Infrastructure', source: 'servicenow', criticality: 'medium', names: [
    ['Incident Auto-Classifier', 'Classifies and routes IT incidents automatically'],
    ['Change Approval Workflow', 'Manages change management approval chains'],
    ['Asset Discovery Agent', 'Discovers and catalogs IT assets on the network'],
    ['Patch Compliance Checker', 'Verifies systems are patched to current standards'],
    ['Service Desk Triage Bot', 'Triages incoming service desk tickets by priority'],
    ['SLA Monitor Agent', 'Monitors service level agreement compliance'],
    ['Capacity Planning Agent', 'Forecasts infrastructure capacity needs'],
    ['DR Readiness Checker', 'Validates disaster recovery readiness status'],
  ]},
  { team: 'Compliance', domain: 'Regulatory', source: 'dataiku', criticality: 'high', names: [
    ['KYC Refresh Agent', 'Triggers and processes periodic KYC refreshes'],
    ['SAR Filing Assistant', 'Helps prepare suspicious activity reports'],
    ['Regulatory Report Generator', 'Generates required regulatory filings'],
    ['Policy Change Tracker', 'Tracks policy changes and notifies stakeholders'],
    ['Audit Trail Analyzer', 'Analyzes audit trails for compliance gaps'],
    ['GDPR Data Request Handler', 'Processes GDPR data subject access requests'],
  ]},
  { team: 'Treasury', domain: 'Treasury', source: 'bedrock', criticality: 'high', names: [
    ['Liquidity Forecaster', 'Forecasts daily liquidity positions'],
    ['FX Rate Monitor', 'Monitors foreign exchange rate movements'],
    ['Bond Portfolio Analyzer', 'Analyzes bond portfolio duration and risk'],
    ['Cash Position Calculator', 'Calculates real-time cash positions across accounts'],
    ['Interest Rate Risk Monitor', 'Monitors interest rate risk exposure'],
  ]},
  { team: 'Branch Operations', domain: 'Retail Banking', source: 'servicenow', criticality: 'low', names: [
    ['Branch Queue Manager', 'Manages customer queue and wait times at branches'],
    ['Teller Transaction Validator', 'Validates high-value teller transactions'],
    ['Branch Performance Dashboard', 'Generates daily branch performance summaries'],
    ['ATM Health Monitor', 'Monitors ATM network health and availability'],
    ['Cash Replenishment Predictor', 'Predicts ATM cash replenishment needs'],
  ]},
  { team: 'Wealth Management', domain: 'Investment Services', source: 'dataiku', criticality: 'medium', names: [
    ['Portfolio Rebalancer', 'Recommends portfolio rebalancing actions'],
    ['Tax Loss Harvester', 'Identifies tax loss harvesting opportunities'],
    ['Client Risk Profiler', 'Assesses client risk tolerance from questionnaires'],
    ['Estate Planning Assistant', 'Provides estate planning document assistance'],
    ['Market Research Summarizer', 'Summarizes daily market research for advisors'],
    ['Fee Schedule Calculator', 'Calculates advisory fee schedules'],
  ]},
  { team: 'Payments', domain: 'Payments', source: 'n8n', criticality: 'high', names: [
    ['Wire Transfer Validator', 'Validates wire transfer details before execution'],
    ['ACH Batch Processor', 'Processes ACH payment batches'],
    ['Payment Routing Optimizer', 'Optimizes payment routing for speed and cost'],
    ['Dispute Resolution Tracker', 'Tracks payment dispute cases through resolution'],
    ['Real-Time Payment Monitor', 'Monitors real-time payment rail activity'],
    ['Cross-Border Payment Agent', 'Manages cross-border payment compliance'],
  ]},
  { team: 'Data Engineering', domain: 'Data Platform', source: 'langchain', criticality: 'medium', names: [
    ['Data Quality Monitor', 'Monitors data pipeline quality metrics'],
    ['Schema Drift Detector', 'Detects schema changes in upstream data sources'],
    ['ETL Pipeline Monitor', 'Monitors ETL pipeline health and throughput'],
    ['Data Catalog Updater', 'Keeps data catalog entries current'],
    ['PII Scanner', 'Scans data stores for unprotected PII'],
    ['Data Lineage Tracer', 'Traces data lineage across transformation steps'],
  ]},
  { team: 'Business Intelligence', domain: 'Analytics', source: 'dataiku', criticality: 'low', names: [
    ['Dashboard Refresh Agent', 'Refreshes executive dashboards on schedule'],
    ['KPI Alert Agent', 'Alerts stakeholders when KPIs breach thresholds'],
    ['Ad Hoc Query Agent', 'Converts natural language questions to SQL queries'],
    ['Trend Detection Agent', 'Detects significant trends in business metrics'],
    ['Board Report Compiler', 'Compiles data for board-level reporting'],
  ]},
  { team: 'Digital Banking', domain: 'Digital Channels', source: 'langchain', criticality: 'medium', names: [
    ['Mobile App FAQ Bot', 'Answers mobile banking app questions'],
    ['Chatbot Fallback Handler', 'Handles chatbot conversations that need escalation'],
    ['Push Notification Manager', 'Manages push notification delivery and targeting'],
    ['Digital Wallet Assistant', 'Helps customers set up digital wallet features'],
    ['App Rating Monitor', 'Monitors and summarizes app store ratings'],
  ]},
  { team: 'Self-Service — Engineering', domain: 'Engineering', source: 'copilot', criticality: 'low', names: [
    ['Code Review Summarizer', 'Summarizes code review feedback across PRs'],
    ['Deployment Status Checker', 'Checks deployment pipeline status'],
    ['Tech Debt Tracker', 'Tracks and prioritizes technical debt items'],
    ['API Documentation Generator', 'Generates API docs from code annotations'],
    ['Release Notes Drafter', 'Drafts release notes from commit history'],
    ['On-Call Runbook Agent', 'Retrieves relevant runbooks during incidents'],
    ['Dependency Update Checker', 'Identifies outdated dependencies and CVEs'],
    ['Sprint Metrics Reporter', 'Reports sprint velocity and burndown metrics'],
    ['Architecture Decision Logger', 'Logs and retrieves architecture decision records'],
    ['Test Coverage Analyzer', 'Analyzes test coverage gaps'],
  ]},
  { team: 'Self-Service — Facilities', domain: 'Facilities', source: 'servicenow', criticality: 'low', names: [
    ['Desk Booking Agent', 'Manages hot desk and workspace reservations'],
    ['Visitor Check-In Bot', 'Manages visitor registration and badge printing'],
    ['Maintenance Request Bot', 'Submits and tracks facility maintenance requests'],
    ['Parking Spot Finder', 'Checks parking availability at office locations'],
    ['Cafeteria Menu Bot', 'Retrieves daily cafeteria menus and specials'],
  ]},
  { team: 'Self-Service — Executive', domain: 'Executive', source: 'bedrock', criticality: 'low', names: [
    ['Board Deck Summarizer', 'Summarizes board presentation materials'],
    ['Strategy Document Q&A', 'Answers questions about strategy documents'],
    ['Competitive Landscape Briefer', 'Prepares competitive landscape briefings'],
    ['M&A Due Diligence Helper', 'Assists with due diligence document review'],
    ['Investor Relations FAQ', 'Answers common investor relations questions'],
  ]},
  // ── Snowflake Cortex Agents ──────────────────────────────────────────────
  { team: 'Data Analytics', domain: 'Analytics', source: 'snowflake', criticality: 'medium', names: [
    ['Customer 360 Analyst', 'Builds unified customer profiles from multi-source data'],
    ['Revenue Attribution Agent', 'Attributes revenue across marketing touchpoints'],
    ['Product Usage Analyzer', 'Analyzes product feature usage patterns'],
    ['Cohort Analysis Agent', 'Performs customer cohort retention analysis'],
    ['Data Warehouse Optimizer', 'Recommends warehouse query optimizations'],
    ['Anomaly Detection Agent', 'Detects statistical anomalies in business metrics'],
    ['Predictive Churn Model', 'Runs churn prediction models on customer data'],
    ['Segment Builder Agent', 'Creates customer segments from behavioral data'],
  ]},
  { team: 'Risk Analytics', domain: 'Risk', source: 'snowflake', criticality: 'high', names: [
    ['Credit Scoring Pipeline', 'Runs credit scoring models on applicant data'],
    ['Portfolio Risk Aggregator', 'Aggregates portfolio risk metrics across asset classes'],
    ['Stress Test Runner', 'Executes regulatory stress test scenarios'],
    ['Loss Forecasting Agent', 'Forecasts expected credit losses'],
    ['Concentration Risk Monitor', 'Monitors portfolio concentration limits'],
    ['Counterparty Exposure Calculator', 'Calculates counterparty credit exposure'],
  ]},
  { team: 'Financial Reporting', domain: 'Finance', source: 'snowflake', criticality: 'high', names: [
    ['GL Reconciliation Agent', 'Reconciles general ledger across sub-systems'],
    ['Regulatory Capital Calculator', 'Computes regulatory capital ratios'],
    ['P&L Attribution Agent', 'Attributes P&L movements to risk factors'],
    ['Balance Sheet Analyzer', 'Analyzes balance sheet trends and projections'],
    ['Cost Allocation Engine', 'Allocates shared costs across business units'],
    ['Financial Close Accelerator', 'Automates month-end financial close tasks'],
  ]},
  { team: 'Data Governance', domain: 'Data Platform', source: 'snowflake', criticality: 'medium', names: [
    ['Data Classification Agent', 'Classifies data assets by sensitivity level'],
    ['Access Pattern Analyzer', 'Analyzes data access patterns for policy compliance'],
    ['Data Freshness Monitor', 'Monitors data freshness and staleness across tables'],
    ['Column-Level Lineage Tracer', 'Traces column-level data lineage in pipelines'],
    ['Usage Metering Agent', 'Tracks Snowflake credit usage by team and workload'],
    ['Query Cost Optimizer', 'Identifies expensive queries and suggests optimizations'],
    ['Data Sharing Monitor', 'Monitors data sharing agreements and access'],
  ]},
]

// Seeded pseudo-random number generator for deterministic agent generation
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)

const firstNames = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth','David','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Karen','Charles','Nancy','Christopher','Lisa','Daniel','Betty','Matthew','Sandra','Anthony','Ashley','Mark','Kimberly']
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson']
const channelOptions = [['chat'], ['email'], ['api'], ['chat', 'email'], ['api', 'email'], ['chat', 'mobile'], ['internal'], ['ticket'], ['chat', 'ticket']]

function generateAgent(template, nameEntry, index) {
  const [name, description] = nameEntry
  const id = `gen-${template.team.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${String(index).padStart(3, '0')}`
  const statuses = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'degraded', 'maintenance']
  const impacts = ['green', 'green', 'green', 'green', 'green', 'green', 'yellow', 'yellow', 'red']
  const trends = ['stable', 'stable', 'stable', 'up', 'down']

  const status = statuses[Math.floor(rand() * statuses.length)]
  const businessImpact = impacts[Math.floor(rand() * impacts.length)]
  const owner = `${firstNames[Math.floor(rand() * firstNames.length)]} ${lastNames[Math.floor(rand() * lastNames.length)]}`
  const channels = channelOptions[Math.floor(rand() * channelOptions.length)]
  const responseTime = Math.floor(rand() * 5000) + 200
  const errorRate = Math.round((rand() * 3) * 100) / 100
  const securityWarnings = rand() > 0.85 ? Math.floor(rand() * 4) + 1 : 0
  const dataExposure = rand() > 0.92 ? Math.floor(rand() * 2) + 1 : 0
  const version = `${Math.floor(rand() * 4) + 1}.${Math.floor(rand() * 10)}.${Math.floor(rand() * 10)}`
  const monthOffset = Math.floor(rand() * 18)
  const createdDate = new Date(2024, monthOffset % 12, Math.floor(rand() * 28) + 1)
  const lastActiveHours = Math.floor(rand() * 72)
  const lastActive = new Date(Date.now() - lastActiveHours * 3600000)

  const impactLabels = {
    green: ['Operating within targets', 'All metrics nominal', 'Performance exceeding expectations', 'Steady state operations'],
    yellow: ['Monitoring for improvement', 'Minor performance dip noted', 'Approaching threshold limits', 'Under review for optimization'],
    red: ['Requires immediate attention', 'Performance below threshold', 'Significant degradation detected', 'Critical — action needed'],
  }

  const businessImpactLabel = impactLabels[businessImpact][Math.floor(rand() * impactLabels[businessImpact].length)]
  const aiInsight = `${name} is ${status === 'active' ? 'operational' : status} with ${responseTime}ms average response time and ${errorRate}% error rate. ${businessImpact === 'green' ? 'No significant issues detected.' : businessImpact === 'yellow' ? 'Minor issues noted — recommend monitoring.' : 'Critical issues require immediate investigation.'}`

  return {
    id,
    name,
    description,
    status,
    source: template.source,
    team: template.team,
    domain: template.domain,
    owner,
    channels,
    createdAt: createdDate.toISOString().split('T')[0],
    lastActive: lastActive.toISOString(),
    version,
    criticality: template.criticality,
    tags: [template.source, template.domain.toLowerCase().replace(/\s/g, '-')],
    businessImpact,
    businessImpactLabel,
    aiInsight,
    operationalHealth: {
      responseTime,
      responseTimeTrend: trends[Math.floor(rand() * trends.length)],
      errorRate,
      errorRateTrend: trends[Math.floor(rand() * trends.length)],
    },
    operationalRisks: { securityWarnings, dataExposure },
  }
}

// Generate all agents from templates
let genIndex = 16
const generatedAgents = generatedAgentTemplates.flatMap(template =>
  template.names.map(nameEntry => generateAgent(template, nameEntry, genIndex++))
)

export const agents = [...coreAgents, ...generatedAgents]

export const platformSources = [
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    color: '#00A4EF',
    // Display count reflects full enterprise scale (self-service Copilot agents dominate)
    agentCount: 3400,
    description: 'Microsoft AI assistant'
  },
  {
    id: 'bedrock',
    name: 'AWS Bedrock',
    color: '#FF9900',
    agentCount: 180,
    description: 'Amazon foundation models'
  },
  {
    id: 'snowflake',
    name: 'Snowflake Cortex',
    color: '#29B5E8',
    agentCount: 230,
    description: 'Snowflake AI agents'
  },
  {
    id: 'langchain',
    name: 'LangChain',
    color: '#1C3C3C',
    agentCount: 120,
    description: 'LLM framework agents'
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    color: '#81B5A1',
    agentCount: 95,
    description: 'IT workflow automation'
  },
  {
    id: 'n8n',
    name: 'n8n',
    color: '#EA4B71',
    agentCount: 55,
    description: 'Workflow automation'
  },
  {
    id: 'dataiku',
    name: 'Dataiku',
    color: '#2AB1AC',
    agentCount: 47,
    description: 'Data science platform'
  },
]

export const getAgentById = (id) => agents.find(a => a.id === id)

export const getAgentsBySource = (source) => agents.filter(a => a.source === source)

export const getAgentsByTeam = (team) => agents.filter(a => a.team === team)

export const getAgentsByStatus = (status) => agents.filter(a => a.status === status)

export const getAgentsByTeamGrouped = () => {
  const grouped = {}
  agents.forEach(agent => {
    if (!grouped[agent.team]) {
      grouped[agent.team] = []
    }
    grouped[agent.team].push(agent)
  })
  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
}
