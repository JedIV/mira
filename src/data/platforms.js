import { agents, platformSources } from './agents'

export const connectedPlatforms = platformSources.map(p => ({
  ...p,
  status: p.id === 'n8n' ? 'syncing' : 'connected',
  lastScan: p.id === 'n8n' ? '2 min ago' : p.id === 'snowflake' ? '12 min ago' : `${Math.floor(Math.random() * 45) + 15} min ago`,
  proactiveScan: p.id !== 'n8n',
  endpoint: {
    bedrock: 'us-east-1.bedrock.amazonaws.com',
    copilot: 'graph.microsoft.com/copilot',
    servicenow: 'abcbank.service-now.com',
    langchain: 'api.langchain.com',
    n8n: 'n8n.internal.abcbank.com',
    dataiku: 'dss.abcbank.com',
    snowflake: 'abcbank.snowflakecomputing.com/cortex',
  }[p.id],
}))

export const availablePlatforms = [
  { id: 'bedrock', name: 'AWS Bedrock', description: 'Amazon foundation models and agent orchestration', color: '#FF9900', comingSoon: false },
  { id: 'copilot', name: 'Microsoft Copilot', description: 'Microsoft AI assistants and Copilot Studio agents', color: '#00A4EF', comingSoon: false },
  { id: 'servicenow', name: 'ServiceNow', description: 'IT workflow automation and virtual agents', color: '#81B5A1', comingSoon: false },
  { id: 'langchain', name: 'LangChain', description: 'Open-source LLM framework agents', color: '#1C3C3C', comingSoon: false },
  { id: 'n8n', name: 'n8n', description: 'Workflow automation with AI agent nodes', color: '#EA4B71', comingSoon: false },
  { id: 'dataiku', name: 'Dataiku', description: 'Data science and MLOps platform agents', color: '#2AB1AC', comingSoon: false },
  { id: 'snowflake', name: 'Snowflake Cortex', description: 'Snowflake AI services and Cortex agents', color: '#29B5E8', comingSoon: false },
  { id: 'databricks', name: 'Databricks', description: 'Lakehouse AI and Mosaic ML agent serving', color: '#FF3621', comingSoon: false },
  { id: 'crewai', name: 'CrewAI', description: 'Multi-agent orchestration framework', color: '#8B5CF6', comingSoon: true },
  { id: 'autogen', name: 'AutoGen', description: 'Microsoft multi-agent conversation framework', color: '#0EA5E9', comingSoon: true },
  { id: 'llamaindex', name: 'LlamaIndex', description: 'Data-aware LLM application framework', color: '#A855F7', comingSoon: true },
]

export const connectionFormFields = {
  bedrock: { endpoint: 'AWS Region', endpointDefault: 'us-east-1', authLabel: 'AWS Access Key ID', authDefault: 'AKIA••••••••EXAMPLE' },
  copilot: { endpoint: 'Tenant Endpoint', endpointDefault: 'graph.microsoft.com', authLabel: 'Client Secret', authDefault: '••••••••-••••-••••-••••-••••••••••••' },
  servicenow: { endpoint: 'Instance URL', endpointDefault: 'abcbank.service-now.com', authLabel: 'API Token', authDefault: 'snc-••••••••••••••••' },
  langchain: { endpoint: 'API Endpoint', endpointDefault: 'api.langchain.com', authLabel: 'API Key', authDefault: 'ls-••••••••••••••••' },
  n8n: { endpoint: 'Instance URL', endpointDefault: 'n8n.internal.abcbank.com', authLabel: 'API Key', authDefault: 'n8n_api_••••••••••••' },
  dataiku: { endpoint: 'DSS URL', endpointDefault: 'dss.abcbank.com', authLabel: 'API Key', authDefault: 'dkuapi-••••••••••••' },
  snowflake: { endpoint: 'Account URL', endpointDefault: 'abcbank.snowflakecomputing.com', authLabel: 'OAuth Token', authDefault: 'sf-oauth-••••••••••••' },
  databricks: { endpoint: 'Workspace URL', endpointDefault: 'abcbank.cloud.databricks.com', authLabel: 'Personal Access Token', authDefault: 'dapi••••••••••••••••' },
}

// Mock scan results per platform - a subset of agents to "discover"
export const mockScanResults = {
  bedrock: [
    { name: 'Fraud Detection Agent v2', description: 'Next-gen fraud detection with improved accuracy', type: 'Detection' },
    { name: 'Credit Risk Assessor', description: 'Real-time credit risk assessment engine', type: 'Analysis' },
    { name: 'Document Classifier', description: 'Classifies incoming documents by type and urgency', type: 'Classification' },
    { name: 'Regulatory Filing Bot', description: 'Automates regulatory filing preparation', type: 'Compliance' },
    { name: 'Sentiment Analyzer', description: 'Analyzes customer sentiment from interactions', type: 'Analysis' },
  ],
  copilot: [
    { name: 'Meeting Summary Agent', description: 'Generates meeting summaries and action items', type: 'Productivity' },
    { name: 'Email Draft Assistant', description: 'Drafts email responses using context', type: 'Communication' },
    { name: 'Report Builder', description: 'Builds reports from natural language queries', type: 'Reporting' },
  ],
  servicenow: [
    { name: 'Incident Auto-Router', description: 'Routes incidents to appropriate teams', type: 'IT Service' },
    { name: 'Change Risk Evaluator', description: 'Evaluates risk score for change requests', type: 'IT Service' },
    { name: 'Knowledge Article Finder', description: 'Finds relevant knowledge articles for tickets', type: 'Support' },
    { name: 'SLA Breach Predictor', description: 'Predicts SLA breaches before they happen', type: 'Monitoring' },
  ],
  langchain: [
    { name: 'RAG Research Agent', description: 'Retrieval-augmented research assistant', type: 'Research' },
    { name: 'Data Pipeline Monitor', description: 'Monitors data pipeline health and quality', type: 'Monitoring' },
    { name: 'Code Review Assistant', description: 'Reviews code changes for best practices', type: 'Development' },
  ],
  n8n: [
    { name: 'Webhook Processor', description: 'Processes incoming webhooks and routes actions', type: 'Automation' },
    { name: 'Data Sync Agent', description: 'Syncs data between CRM and data warehouse', type: 'Integration' },
  ],
  dataiku: [
    { name: 'Churn Prediction v3', description: 'Updated churn prediction model with new features', type: 'ML Model' },
    { name: 'Product Recommender', description: 'Product recommendation engine for banking products', type: 'ML Model' },
    { name: 'Anomaly Detector', description: 'Detects anomalies in transaction patterns', type: 'Detection' },
    { name: 'Customer Segmenter', description: 'Dynamic customer segmentation agent', type: 'Analysis' },
    { name: 'Forecast Engine', description: 'Revenue and volume forecasting agent', type: 'Forecasting' },
    { name: 'NLP Classifier', description: 'Classifies customer inquiries by intent', type: 'NLP' },
  ],
  snowflake: [
    { name: 'Query Optimizer Agent', description: 'Suggests query optimizations for slow queries', type: 'Performance' },
    { name: 'Data Quality Scanner', description: 'Scans tables for data quality issues', type: 'Quality' },
    { name: 'Usage Analytics Agent', description: 'Analyzes Snowflake usage and cost patterns', type: 'Analytics' },
    { name: 'Schema Change Detector', description: 'Monitors for unexpected schema changes', type: 'Monitoring' },
  ],
  databricks: [
    { name: 'Feature Store Agent', description: 'Manages and serves ML features from the lakehouse', type: 'ML Ops' },
    { name: 'Model Monitoring Agent', description: 'Monitors model drift and performance degradation', type: 'Monitoring' },
    { name: 'Data Lakehouse QA Agent', description: 'Validates data quality across Delta tables', type: 'Quality' },
    { name: 'Notebook Scheduler Agent', description: 'Orchestrates and schedules notebook workflows', type: 'Automation' },
    { name: 'Unity Catalog Scanner', description: 'Scans Unity Catalog for governance compliance', type: 'Governance' },
  ],
}
