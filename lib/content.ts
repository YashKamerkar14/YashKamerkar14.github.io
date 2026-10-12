export const profile = {
  name: "Yash Mahesh Kamerkar",
  displayName: "Yash Kamerkar",
  email: "yashkamerkar1407@gmail.com",
  location: "San Jose, California",
  github: "https://github.com/YashKamerkar14",
  twitter: "https://x.com/Yashrooney14",
  linkedin: "https://www.linkedin.com/in/yash-kamerkar-3ab6181a4",
  resume: "/Yash_Mahesh_Kamerkar_Resume.pdf",
  paper: "https://arxiv.org/abs/2605.07364",
  flightRepo: "https://github.com/YashKamerkar14/Flight-Delay-Prediction-using-Amazon-Sagemaker",
} as const;

export const experience = [
  {
    company: "Uber", mark: "U", role: "Software Engineer | AI Engineer", location: "USA", date: "Aug 2026 — Present", start: "2026-08", end: null,
    focus: "Backend engineering · Applied AI",
    bullets: [
      "Engineered a RAG pipeline with LangChain, OpenAI API, and Pinecone for an internal driver policy assistant, cutting policy lookup time from 15 minutes to under 50 seconds across 12,000 compliance documents.",
      "Architected a gRPC trip-event aggregation microservice in Java and Spring Boot, consolidating 4 upstream location feeds and cutting duplicate event processing incidents from 9 to 2 per week.",
    ],
  },
  {
    company: "Universal Courier", mark: "UC", role: "Software Engineer | AI Engineer", location: "India", date: "Jul 2023 — Aug 2024", start: "2023-07", end: "2024-08",
    focus: "Conversational AI · Logistics systems",
    bullets: [
      "Built an LLM-powered support assistant with LangChain and OpenAI API, automating 420 repetitive delivery query resolutions per month and cutting average first-response time from 6 hours to 12 minutes.",
      "Designed a scikit-learn delivery ETA model trained on 2 years of shipment records, reducing average estimation error from 3.4 hours to 1.1 hours across 5 regional delivery zones.",
      "Integrated 3 carrier REST APIs (UPS, FedEx, USPS) using Python and FastAPI to consolidate real-time tracking for 8,000 daily parcels into a unified customer-facing dashboard.",
      "Constructed FastAPI endpoints for 3 internal logistics dashboards, supporting 150 concurrent dispatcher users during peak morning scheduling windows.",
      "Developed a Python, Pandas, and SQLAlchemy ETL pipeline ingesting and normalizing 180 GB of daily shipment records from 6 warehouse management systems.",
      "Automated nightly route-optimization jobs with Jenkins and Docker on Microsoft Azure, reducing manual scheduling overhead from 4 hours to 35 minutes per dispatch cycle across 3 distribution hubs.",
    ],
  },
  {
    company: "Dell Technologies", mark: "D", role: "Software Engineer", location: "India", date: "Sep 2021 — Jul 2023", start: "2021-09", end: "2023-07",
    focus: "Microservices · Data infrastructure",
    bullets: [
      "Implemented Java 11 and Spring Boot 2.x order-management microservices for Dell's supply chain platform, processing 45,000 daily purchase requests across 6 service modules.",
      "Optimized 5 PostgreSQL reporting endpoints with composite indexes and 3 N+1 query rewrites, reducing average database response time from 2.1 seconds to 340 ms.",
      "Migrated 3 legacy Oracle PL/SQL batch jobs to Python ETL pipelines with Pandas and SQLAlchemy, reducing nightly processing time from 6 hours to 2.5 hours.",
      "Authored JUnit 5 and Mockito test suites for 12 service modules, eliminating 14 critical regression defects before each production release and adding 1,500 net tested lines.",
      "Deployed containerized Spring Boot services with Docker on Kubernetes, enabling zero-downtime rolling updates across 4 staging and production environments.",
      "Streamlined 3 product catalog API contracts using Spring MVC and Hibernate ORM, cutting internal portal integration onboarding from 5 days to 2 days.",
      "Refactored an inventory reporting monolith into 2 independently deployable Spring Boot services, cutting build time from 14 minutes to 5 minutes and removing 3 cross-team deployment dependencies.",
    ],
  },
] as const;

export const skillGroups = [
  { title: "Languages", items: ["Python", "Java", "JavaScript (ES6+)", "TypeScript", "SQL", "Bash"] },
  { title: "AI/ML & Generative AI", items: ["LangChain", "LangGraph", "OpenAI API", "Anthropic Claude API", "Retrieval-Augmented Generation (RAG)", "Large Language Models (LLMs)", "Prompt Engineering", "Hugging Face Transformers", "BERT", "scikit-learn", "PyTorch", "Vector databases"] },
  { title: "Frameworks & Libraries", items: ["FastAPI", "Flask", "Spring Boot", "Spring MVC", "Hibernate ORM", "Pandas", "NumPy", "React.js", "JUnit 5", "Mockito"] },
  { title: "Databases", items: ["PostgreSQL", "MySQL", "Oracle", "MongoDB", "Pinecone", "ChromaDB", "Redis"] },
  { title: "Cloud & DevOps", items: ["Amazon Web Services (AWS)", "Microsoft Azure", "Azure OpenAI Service", "Docker", "Kubernetes (K8s)", "Jenkins", "GitHub Actions", "Terraform", "CI/CD Pipelines"] },
  { title: "Tools & Methodologies", items: ["Git", "GitHub", "JIRA", "Postman", "Maven", "Gradle", "Linux", "REST APIs", "Microservices Architecture", "Agile/Scrum"] },
] as const;
