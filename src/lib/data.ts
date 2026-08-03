export interface Skill {
  name: string;
  /** Share of live postings, 0–100. */
  share: number;
  /** Change in percentage points over the window. */
  delta: number;
}

export interface Role {
  openings: number;
  change: string;
  median: string;
  competition: string;
  timeToFill: string;
  skills: Skill[];
}

const skills = (rows: [string, number, number][]): Skill[] =>
  rows.map(([name, share, delta]) => ({ name, share, delta }));

export const ROLES: Record<string, Role> = {
  "Analytics Engineer": {
    openings: 18420,
    change: "+14.2%",
    median: "$148,000",
    competition: "3.4 : 1",
    timeToFill: "31 days",
    skills: skills([
      ["SQL", 96, 2],
      ["dbt", 78, 9],
      ["Python", 61, 4],
      ["Snowflake", 54, 7],
      ["Git / CI", 44, 3],
      ["Airflow", 33, 2],
      ["BigQuery", 29, -1],
      ["Looker", 22, -4],
    ]),
  },
  "Data Engineer": {
    openings: 41730,
    change: "+8.4%",
    median: "$161,000",
    competition: "2.9 : 1",
    timeToFill: "27 days",
    skills: skills([
      ["SQL", 94, 1],
      ["Python", 88, 3],
      ["AWS", 63, 5],
      ["Spark", 57, -2],
      ["Airflow", 46, 4],
      ["Databricks", 38, 11],
      ["Kafka", 31, 2],
      ["Terraform", 21, 6],
    ]),
  },
  "Data Analyst": {
    openings: 62510,
    change: "-2.1%",
    median: "$102,000",
    competition: "7.1 : 1",
    timeToFill: "38 days",
    skills: skills([
      ["SQL", 91, 0],
      ["Excel", 74, -3],
      ["Power BI", 52, 6],
      ["Tableau", 48, -5],
      ["Python", 39, 4],
      ["Statistics", 28, 1],
      ["Looker", 17, -2],
      ["dbt", 12, 7],
    ]),
  },
  "ML Engineer": {
    openings: 22860,
    change: "+19.6%",
    median: "$187,000",
    competition: "4.6 : 1",
    timeToFill: "24 days",
    skills: skills([
      ["Python", 97, 1],
      ["PyTorch", 64, 8],
      ["AWS", 58, 3],
      ["RAG / LLM ops", 51, 22],
      ["Kubernetes", 42, 2],
      ["Spark", 34, -4],
      ["MLflow", 29, 5],
      ["Vector DB", 23, 14],
    ]),
  },
};

export const ROLE_NAMES = Object.keys(ROLES);

export interface Certificate {
  name: string;
  issuer: string;
  postings: string;
  pay: string;
  delta: number;
  prepHours: number;
}

export const CERTIFICATES: Certificate[] = [
  {
    name: "Databricks Data Engineer Associate",
    issuer: "Databricks",
    postings: "3,120",
    pay: "+11.4%",
    delta: 3.1,
    prepHours: 40,
  },
  {
    name: "Google Cloud Professional Data Engineer",
    issuer: "Google Cloud",
    postings: "4,010",
    pay: "+12.7%",
    delta: 2.4,
    prepHours: 60,
  },
  {
    name: "AWS Certified Data Engineer Associate",
    issuer: "Amazon",
    postings: "2,410",
    pay: "+9.6%",
    delta: 2.8,
    prepHours: 45,
  },
  {
    name: "SnowPro Core",
    issuer: "Snowflake",
    postings: "2,740",
    pay: "+8.9%",
    delta: 1.1,
    prepHours: 30,
  },
  {
    name: "Microsoft DP-600 Fabric Analytics Engineer",
    issuer: "Microsoft",
    postings: "1,860",
    pay: "+7.2%",
    delta: 4.2,
    prepHours: 35,
  },
  {
    name: "Tableau Desktop Specialist",
    issuer: "Salesforce",
    postings: "1,410",
    pay: "+2.1%",
    delta: -2.4,
    prepHours: 25,
  },
  {
    name: "Azure DP-900 Data Fundamentals",
    issuer: "Microsoft",
    postings: "1,120",
    pay: "+1.4%",
    delta: -0.4,
    prepHours: 15,
  },
  {
    name: "SAS Certified Specialist: Base Programming",
    issuer: "SAS",
    postings: "380",
    pay: "-6.8%",
    delta: -3.7,
    prepHours: 30,
  },
];

export interface RoleRow {
  role: string;
  learnNext: string;
  openings: string;
  median: string;
  delta: number;
}

export const ROLE_ROWS: RoleRow[] = [
  {
    role: "Analytics Engineer",
    learnNext: "dbt",
    openings: "18,420",
    median: "$148,000",
    delta: 14.2,
  },
  {
    role: "Data Engineer",
    learnNext: "Databricks",
    openings: "41,730",
    median: "$161,000",
    delta: 8.4,
  },
  {
    role: "Data Analyst",
    learnNext: "Power BI",
    openings: "62,510",
    median: "$102,000",
    delta: -2.1,
  },
  {
    role: "ML Engineer",
    learnNext: "RAG / LLM ops",
    openings: "22,860",
    median: "$187,000",
    delta: 19.6,
  },
  {
    role: "BI Developer",
    learnNext: "Microsoft Fabric",
    openings: "14,090",
    median: "$118,000",
    delta: 1.8,
  },
  {
    role: "Data Scientist",
    learnNext: "Causal inference",
    openings: "19,640",
    median: "$164,000",
    delta: 4.6,
  },
  {
    role: "Analytics Manager",
    learnNext: "Warehouse cost control",
    openings: "7,310",
    median: "$176,000",
    delta: 6.9,
  },
  {
    role: "Data Governance Lead",
    learnNext: "Unity Catalog",
    openings: "5,880",
    median: "$158,000",
    delta: 11.2,
  },
];
