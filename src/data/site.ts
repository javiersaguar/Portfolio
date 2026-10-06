export const site = {
  name: 'Javier Saguar',
  handle: 'javiersaguar',
  domain: 'javiersaguar.dev',
  github: 'https://github.com/javiersaguar',
  linkedin: 'https://www.linkedin.com/in/javier-saguar-46a3a7396/',
  linkedinHandle: 'in/javier-saguar',
  school: 'ETSIT UPM',
  degree: 'Data Engineering & Systems',
};

export type Project = {
  name: string;
  repo: string;
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
    repo: 'HS-Maisa',
    tagline: 'Accounts payable on autopilot, with receipts.',
    body:
      'HackSpain 2026, Maisa track. Each invoice gets PAY, DON\'T PAY or ESCALATE. The LLM only extracts facts; versioned rules in code make the call and log the evidence, so every decision can be replayed.',
    stat: { value: '540', label: 'invoices decided, 0 pending' },
    stack: ['Python', 'Pydantic', 'PyMuPDF', 'SQLite', 'Next.js', 'Claude API'],
    url: 'https://albertitos.vercel.app',
    context: 'Hackathon · team of 5',
  },
  {
    name: 'HappyTaxi',
    repo: 'PIDS-Proyecto1',
    tagline: 'A privacy-first data platform for NYC taxis.',
    body:
      'Ingestion, processing, storage and dashboards over the 2020 yellow-cab trips, plus two chatbots: a local LLM with Ollama and a RAG one over Qdrant. You can drive them with hand gestures.',
    stat: { value: '2', label: 'chatbots on top of the platform' },
    stack: ['Spark', 'Scala', 'Redpanda', 'MongoDB', 'Airflow', 'FastAPI'],
    url: 'https://happytaxi-javiers-projects-239a8bb6.vercel.app',
    context: 'University project',
  },
  {
    name: 'Flight Delay Predictor',
    repo: 'practica_creativa3',
    tagline: 'Big Data pipeline from lakehouse to live predictions.',
    body:
      'Trains and serves flight delay predictions with Spark ML. Kafka streams the requests, Cassandra and an Iceberg lakehouse hold the data, Airflow and MLflow retrain. Runs on Docker Compose or GKE.',
    stat: { value: 'GKE', label: 'deployed in cluster mode' },
    stack: ['Spark', 'Kafka', 'Cassandra', 'Iceberg', 'MLflow', 'Kubernetes'],
    context: 'Big Data in the Cloud',
  },
  {
    name: 'Atalaya',
    repo: 'Ciber-Tool',
    tagline: 'A modular defensive security toolkit.',
    body:
      'HTTP header audits, TLS checks, leaked secret scanning and an SSH honeypot behind one CLI. Every module follows the same contract, so adding a new scan is adding one file.',
    stat: { value: '242', label: 'tests, 85% coverage' },
    stack: ['Python', 'Pydantic', 'Typer', 'GitHub Actions'],
    context: 'Personal project',
  },
  {
    name: 'Pokémon Panchito',
    repo: 'Pokemon-FanGame',
    tagline: 'A non-profit fangame built from scratch.',
    body:
      'A Pokémon fangame in the spirit of Indigo, written in Godot 4 with GDScript: overworld, battles, double battles, breeding and a RandomLocke mode.',
    stat: { value: '369', label: 'automated tests passing' },
    stack: ['Godot 4', 'GDScript', 'GUT'],
    context: 'Side project · in progress',
  },
];

export const sideQuests = [
  { name: 'Poker Chips', url: 'https://poker-texas.vercel.app', note: 'Texas Hold\'em with no chips at the table' },
  { name: 'Wavelength', url: 'https://wavelength-ten-blue.vercel.app', note: 'Party guessing game' },
  { name: 'Impostor', url: 'https://impostor4.vercel.app', note: 'Find who doesn\'t know the word' },
  { name: 'Tabú', url: 'https://tabu-cartas.vercel.app', note: 'Card game for game nights' },
  { name: 'Bet366', url: 'https://bet366-nine.vercel.app', note: 'A betting house for friends, points only' },
  { name: 'European Bad Drivers', url: 'https://javiersaguar.github.io/EUROPEAN-BAD-DRIVERS/', note: 'Where in Europe do people drive worse?' },
];

export const inventory = [
  { item: 'Albertitos', value: '540 invoices' },
  { item: 'Atalaya', value: '242 tests' },
  { item: 'HappyTaxi', value: '2 chatbots' },
  { item: 'Flight Delay', value: 'on GKE' },
  { item: 'Panchito', value: '369 tests' },
  { item: 'Party games', value: '5 shipped' },
];
