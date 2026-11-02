import type { SpriteName } from './sprites';

export const site = {
  name: 'Javier Saguar',
  handle: 'javiersaguar',
  domain: 'javiersaguar.dev',
  github: 'https://github.com/javiersaguar',
  linkedin: 'https://www.linkedin.com/in/javier-saguar-46a3a7396/',
  linkedinHandle: 'in/javier-saguar',
  email: 'saguarjavier@gmail.com',
  school: 'ETSIT UPM',
  degree: 'Data Engineering & Systems',
};

// Lines typed one after another in the hero.
export const typedLines = ['Big Data projects', 'Cybersecurity audits', 'Apps, tools and games, built end to end'];

// Bars under the portrait. They fill, glow for a moment and start again.
export const skillBars = ['Data Engineering', 'Cybersecurity'];

export type Category = 'data' | 'security' | 'games';

export const categories: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'data', label: 'Data' },
  { id: 'security', label: 'Security' },
  { id: 'games', label: 'Games & apps' },
];

export type Project = {
  name: string;
  repo: string;
  sprite: SpriteName;
  tags: Category[];
  tagline: string;
  body: string;
  stat: { value: string; label: string };
  stack: string[];
  url?: string;
  context: string;
};

export const featured: Project[] = [
  {
    name: 'Albertitos',
    repo: 'AlbertitosAI-DecisionEngine',
    sprite: 'invoice',
    tags: ['data'],
    tagline: 'Accounts payable on autopilot, with receipts.',
    body:
      "HackSpain 2026, Maisa track. Each invoice gets PAY, DON'T PAY or ESCALATE. The LLM only extracts facts; versioned rules in code make the call and log the evidence, so every decision can be replayed.",
    stat: { value: '540/540', label: 'invoices decided, 0 pending' },
    stack: ['Python', 'Pydantic', 'PyMuPDF', 'SQLite', 'Next.js'],
    url: 'https://albertitos.vercel.app',
    context: 'Hackathon · team of 5',
  },
  {
    name: 'HappyTaxi',
    repo: 'HappyTaxy-BigData',
    sprite: 'taxi',
    tags: ['data', 'security'],
    tagline: 'A privacy-first data platform for NYC taxis.',
    body:
      'Ingestion, processing, storage and dashboards over the 2020 yellow-cab trips. Individual trips never leave a restricted zone: everything you can query is an aggregate. Two chatbots sit on top, and you can drive them with hand gestures.',
    stat: { value: '24.6M', label: 'taxi trips processed' },
    stack: ['Spark', 'Scala', 'Redpanda', 'MongoDB', 'Airflow', 'FastAPI'],
    url: 'https://happytaxi-javiers-projects-239a8bb6.vercel.app',
    context: 'University project · team of 5',
  },
  {
    name: 'Flight Delays',
    repo: 'BigData-Pipeline-Flight-Simulation',
    sprite: 'plane',
    tags: ['data'],
    tagline: 'Big Data pipeline from lakehouse to live predictions.',
    body:
      'Trains and serves flight delay predictions with Spark ML. Kafka streams the requests, Cassandra and an Iceberg lakehouse hold the data, Airflow and MLflow retrain. Runs on Docker Compose or GKE.',
    stat: { value: 'GKE', label: 'Spark in cluster mode' },
    stack: ['Spark', 'Kafka', 'Cassandra', 'Iceberg', 'MLflow', 'Kubernetes'],
    context: 'Big Data in the Cloud · team of 2',
  },
  {
    name: 'Atalaya',
    repo: 'Ciber-Tool',
    sprite: 'tower',
    tags: ['security'],
    tagline: 'A modular defensive security toolkit.',
    body:
      'HTTP header audits, TLS checks, leaked secret scanning and an SSH honeypot behind one CLI. Every module follows the same contract, so adding a new scan is adding one file.',
    stat: { value: '4', label: 'modules, one contract' },
    stack: ['Python', 'Pydantic', 'Typer', 'asyncssh', 'GitHub Actions'],
    context: 'Personal project',
  },
  {
    name: 'European Bad Drivers',
    repo: 'EUROPEAN-BAD-DRIVERS',
    sprite: 'chart',
    tags: ['data'],
    tagline: 'Where do people drive worse? It depends on the measure.',
    body:
      'A reproducible road-safety study on official DGT, INE and Eurostat data. It shows how province rankings move when you change the outcome or the denominator, with a public observatory on top.',
    stat: { value: '301,218', label: 'injury crashes analysed' },
    stack: ['Python', 'DuckDB', 'scikit-learn', 'React', 'Recharts'],
    url: 'https://javiersaguar.github.io/EUROPEAN-BAD-DRIVERS/',
    context: 'Personal research project',
  },
  {
    name: 'Pokémon Spain',
    repo: 'Pokemon-FanGame',
    sprite: 'gamepad',
    tags: ['games'],
    tagline: 'A non-profit fangame built from the ground up.',
    body:
      'A Pokémon fangame in the spirit of Indigo, written in Godot 4 with GDScript: overworld, battles, double battles, breeding and a RandomLocke mode.',
    stat: { value: '452', label: 'automated tests' },
    stack: ['Godot 4', 'GDScript', 'GUT'],
    context: 'Side project · in progress',
  },
];

export const sideQuests: { name: string; url: string; note: string; sprite: SpriteName }[] = [
  { name: 'Poker Chips', url: 'https://poker-texas.vercel.app', note: "A Texas Hold'em chip counter for when nobody brought chips.", sprite: 'chip' },
  { name: 'Wavelength', url: 'https://wavelength-ten-blue.vercel.app', note: 'The party guessing game, on one phone.', sprite: 'dial' },
  { name: 'Tabú', url: 'https://tabu-cartas.vercel.app', note: 'Cards for game nights.', sprite: 'cards' },
  { name: 'Bet366', url: 'https://bet366-nine.vercel.app', note: 'A betting house for friends. Points only, never real money.', sprite: 'dice' },
];

export const coursework: { name: string; note: string; sprite: SpriteName }[] = [
  { name: 'KITTI', note: 'Object detection (YOLO) and LiDAR-to-camera projection.', sprite: 'lidar' },
  { name: 'BraTS', note: 'Self-supervised brain tumour detection with contrastive learning.', sprite: 'brain' },
  { name: 'Hand gestures', note: 'Gesture recognition with MediaPipe and a CNN.', sprite: 'hand' },
];

// Shown as medals with the issuer's logo, like the README.
export const certifications: { name: string; detail?: string; issuer: string; icon: string }[] = [
  { name: 'Cybersecurity', detail: 'Professional Certificate', issuer: 'Google', icon: 'google' },
  { name: 'Jr Penetration Tester', issuer: 'TryHackMe', icon: 'tryhackme' },
];

// About me, as it is typed in the dialogue box. **bold** marks the highlights.
export const about = [
  "I'm Javier, a final-year **Data Engineering & Systems** student at **ETSIT UPM** in Madrid. Most of what I build sits where data meets infrastructure: pipelines that stream, store and serve data, and the platforms around them.",
  'I also care about security. I co-founded **FORTIA Security**, a cybersecurity consultancy for small businesses (web security audits, phishing simulations and staff training), and I write my own defensive tools.',
  'And sometimes I build just for fun: party games for my friends, a poker chip counter for nights without chips, and a whole Pokémon fangame.',
];

export const rightNow =
  "My bachelor's thesis: a cyber situational awareness platform that turns raw security telemetry into correlated, explainable incidents. Redpanda, Sigma rules, multi-stage detection, Neo4j attack graphs and MITRE ATT&CK.";

// The character sheet's loot: one line per featured project.
export const loot = [
  { item: 'Albertitos', value: '540 invoices' },
  { item: 'HappyTaxi', value: '24.6M trips' },
  { item: 'Flight Delays', value: 'on GKE' },
  { item: 'Atalaya', value: '4 modules' },
  { item: 'Bad Drivers', value: '301K crashes' },
  { item: 'Pokémon Spain', value: '452 tests' },
];

export type StackItem = { icon: string; name: string; used: string };

// Tech stack as an inventory, with the same items and order as the README.
// "icon" is a Simple Icons slug, or "text:XX" when there is no logo (drawn as letters).
// "used" says where each one shows up; tools that are not in a public repo yet say what they are for.
export const stack: { group: string; items: StackItem[] }[] = [
  {
    group: 'Data',
    items: [
      { icon: 'apachespark', name: 'Spark', used: 'HappyTaxi and Flight Delays, written in Scala, in cluster mode.' },
      { icon: 'apacheflink', name: 'Flink', used: 'Streaming and multi-stage detection (CEP) in my thesis.' },
      { icon: 'apachekafka', name: 'Kafka', used: 'Flight Delays streams its prediction requests through Kafka.' },
      { icon: 'text:RP', name: 'Redpanda', used: 'The event bus of HappyTaxi and of my thesis.' },
      { icon: 'clickhouse', name: 'ClickHouse', used: 'The analytical store of my thesis: events, alerts and campaigns.' },
      { icon: 'apacheairflow', name: 'Airflow', used: 'Orchestrates loads and retraining in HappyTaxi and Flight Delays.' },
      { icon: 'databricks', name: 'Databricks', used: 'Managed Spark: notebooks, jobs and Delta tables.' },
      { icon: 'text:ICE', name: 'Iceberg', used: 'The lakehouse tables of Flight Delays.' },
      { icon: 'neo4j', name: 'Neo4j', used: 'The attack graph of my thesis: feasible paths to the critical assets.' },
      { icon: 'mongodb', name: 'MongoDB', used: 'Aggregates in HappyTaxi, predictions in Flight Delays.' },
      { icon: 'apachecassandra', name: 'Cassandra', used: 'Distances and predictions in Flight Delays.' },
    ],
  },
  {
    group: 'Security',
    items: [
      { icon: 'wireshark', name: 'Wireshark', used: 'Traffic analysis in labs and audits.' },
      { icon: 'text:WZ', name: 'Wazuh', used: 'Open SIEM, planned as the outside baseline for the rules of my thesis.' },
      { icon: 'text:SURI', name: 'Suricata', used: 'Network IDS alerts are one of the telemetry sources of my thesis.' },
      { icon: 'owasp', name: 'OWASP', used: 'The checklist behind web audits and the Atalaya header checks.' },
      { icon: 'burpsuite', name: 'Burp Suite', used: 'Web application audits.' },
      { icon: 'text:NMAP', name: 'Nmap', used: 'Network discovery and port scanning in labs and audits.' },
      { icon: 'vault', name: 'Vault', used: 'Secrets management: keys and credentials out of the code.' },
      { icon: 'text:ATT&CK', name: 'MITRE ATT&CK', used: 'Every detection and incident in my thesis maps to ATT&CK techniques.' },
    ],
  },
  {
    group: 'Cloud',
    items: [
      { icon: 'googlecloud', name: 'Google Cloud', used: 'GKE, Compute Engine and Artifact Registry for Flight Delays.' },
      { icon: 'text:AWS', name: 'AWS', used: 'Compute, storage and IAM on Amazon Web Services.' },
      { icon: 'text:AZ', name: 'Azure', used: 'Microsoft cloud services and Entra ID.' },
      { icon: 'terraform', name: 'Terraform', used: 'Infrastructure as code.' },
      { icon: 'googlebigquery', name: 'BigQuery', used: 'Serverless SQL warehouse on Google Cloud.' },
      { icon: 'text:S3', name: 'S3', used: 'The S3 API: SeaweedFS in HappyTaxi, MinIO in Flight Delays.' },
      { icon: 'cloudflare', name: 'Cloudflare', used: 'Workers AI is one of the vision models benchmarked in TrazIA-3D.' },
      { icon: 'minio', name: 'MinIO', used: 'Object storage for Flight Delays and my thesis.' },
    ],
  },
  {
    group: 'AI',
    items: [
      { icon: 'pytorch', name: 'PyTorch', used: 'The hand-gesture CNN of HappyTaxi and RoboMaster detection for class.' },
      { icon: 'scikitlearn', name: 'Scikit-learn', used: 'The models of European Bad Drivers.' },
      { icon: 'text:XGB', name: 'XGBoost', used: 'The crash severity model of European Bad Drivers.' },
      { icon: 'huggingface', name: 'Hugging Face', used: 'Pretrained vision models, fine-tuned in TrazIA-3D.' },
      { icon: 'mlflow', name: 'MLflow', used: 'Tracks every retraining of Flight Delays.' },
      { icon: 'langchain', name: 'LangChain', used: 'The RAG chatbot of HappyTaxi.' },
      { icon: 'langgraph', name: 'LangGraph', used: 'Stateful agent workflows on top of LangChain.' },
      { icon: 'ollama', name: 'Ollama', used: 'Local models for the HappyTaxi chatbots and TrazIA-3D.' },
      { icon: 'text:RAG', name: 'RAG', used: 'The HappyTaxi chatbot answers from retrieved documents.' },
      { icon: 'qdrant', name: 'Qdrant', used: 'The vector store behind the HappyTaxi RAG chatbot.' },
    ],
  },
  {
    group: 'Ops',
    items: [
      { icon: 'docker', name: 'Docker', used: 'HappyTaxi, Flight Delays, Albertitos and my thesis all run on Docker.' },
      { icon: 'kubernetes', name: 'Kubernetes', used: 'Flight Delays on Google Kubernetes Engine.' },
      { icon: 'github', name: 'GitHub', used: 'Every project, with Actions for CI in Atalaya and European Bad Drivers.' },
      { icon: 'prometheus', name: 'Prometheus', used: 'Metrics for HappyTaxi, Flight Delays and my thesis.' },
      { icon: 'grafana', name: 'Grafana', used: 'Dashboards for HappyTaxi, Flight Delays and my thesis.' },
      { icon: 'helm', name: 'Helm', used: 'Packaging Kubernetes deployments as charts.' },
      { icon: 'opentelemetry', name: 'OpenTelemetry', used: 'Traces, metrics and logs with one open standard.' },
      { icon: 'linux', name: 'Linux', used: 'Where everything runs, WSL included.' },
    ],
  },
  {
    group: 'Code',
    items: [
      { icon: 'python', name: 'Python', used: 'Albertitos, Atalaya, European Bad Drivers, TrazIA-3D and the HappyTaxi APIs.' },
      { icon: 'text:SQL', name: 'SQL', used: 'ClickHouse in my thesis, DuckDB in European Bad Drivers, SQLite in Albertitos.' },
      { icon: 'typescript', name: 'TypeScript', used: 'The portal of my thesis, Bet366, the Albertitos console and this site.' },
      { icon: 'fastapi', name: 'FastAPI', used: 'The capture and access APIs of HappyTaxi.' },
      { icon: 'react', name: 'React', used: 'The European Bad Drivers observatory and the Albertitos console.' },
      { icon: 'gnubash', name: 'Bash', used: 'Glue for every pipeline and deploy.' },
      { icon: 'godotengine', name: 'Godot', used: 'Pokémon Spain, in GDScript.' },
      { icon: 'scala', name: 'Scala', used: 'The Spark jobs of HappyTaxi and Flight Delays.' },
      { icon: 'pydantic', name: 'Pydantic', used: 'The typed contracts of Albertitos, Atalaya and TrazIA-3D.' },
    ],
  },
];
