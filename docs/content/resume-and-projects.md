# Resume and project sources

The user confirmed the [existing PDF](../../public/Yash_Mahesh_Kamerkar_Resume.pdf) as the source of truth, including the August 2026 Uber start and San Jose location. The portfolio prioritizes AI engineering and backend software engineering equally.

The supplied resume, its embedded links and the earlier website were checked locally on 9 October 2026. Subsequent reviews retained all three roles, 15 contributions, 54 skills and Stevens education. This establishes consistency with the supplied resume; employer outcomes remain resume-reported claims.

## Identity and links

| Detail | Confirmed value |
| --- | --- |
| Full resume name | Yash Mahesh Kamerkar |
| Website display name | Yash Kamerkar |
| Email | yashkamerkar1407@gmail.com |
| LinkedIn | https://www.linkedin.com/in/yash-kamerkar-3ab6181a4 |
| Portfolio | https://yashkamerkar14.github.io/ |
| Twitter / X | https://x.com/Yashrooney14, supplied directly by the user |
| Location | San Jose, California |

The phone number remains available in the PDF. The website does not introduce a calculated years-of-experience statement, availability badge, GPA or additional degree.

## Roles and education

| Organization | Exact role or degree | Dates | Location | Finding |
| --- | --- | --- | --- | --- |
| Uber | Software Engineer \| AI Engineer | Aug 2026 - Present | USA | All fields match. August 2026 is in the past relative to this audit date; do not flag it as a future-date error. |
| Universal Courier | Software Engineer \| AI Engineer | Jul 2023 - Aug 2024 | India | All fields match. |
| Dell Technologies | Software Engineer | Sep 2021 - Jul 2023 | India | All fields match. |
| Stevens Institute of Technology | Master of Science in Computer Science | Sep 2024 - May 2026 | Hoboken, NJ | All fields match. No additional degree or GPA is supplied. |

## Employer achievement ledger

All rows below are present in both the PDF and current HTML, including expandable experience details. Use the PDF as the source; preserve units and context in redesigned summaries.

| ID | Employer | Source-backed scope and outcome |
| --- | --- | --- |
| U1 | Uber | Java/Spring Boot gRPC trip-event service; 4 upstream feeds; duplicate event incidents 9 to 2 per week. |
| U2 | Uber | LangChain/OpenAI/Pinecone driver-policy RAG pipeline; 12,000 compliance documents; lookup 15 minutes to under 50 seconds. |
| C1 | Universal Courier | 3 carrier REST APIs: UPS, FedEx, USPS; Python/FastAPI; 8,000 daily parcels; unified tracking dashboard. |
| C2 | Universal Courier | scikit-learn ETA model; 2 years of shipment records; average error 3.4h to 1.1h; 5 delivery zones. |
| C3 | Universal Courier | LangChain/OpenAI support assistant; 420 repetitive queries resolved automatically per month; average first response 6h to 12min. |
| C4 | Universal Courier | FastAPI real-time status endpoints; 3 internal dashboards; 150 concurrent dispatcher users during peak scheduling. |
| C5 | Universal Courier | Python/Pandas/SQLAlchemy ETL; 180GB daily shipment records; 6 warehouse management systems. |
| C6 | Universal Courier | Jenkins/Docker/Azure nightly route jobs; scheduling overhead 4h to 35min per dispatch cycle; 3 distribution hubs. |
| D1 | Dell | Java 11/Spring Boot 2.x order services; 45,000 daily purchase requests; 6 connected service modules. |
| D2 | Dell | 3 Oracle PL/SQL batch jobs migrated to Python/Pandas/SQLAlchemy ETL; nightly processing 6h to 2.5h. |
| D3 | Dell | JUnit 5/Mockito tests for 12 service modules; 14 critical regression defects eliminated before each release; 1,500 net tested lines added. |
| D4 | Dell | Docker/Kubernetes Spring Boot deployments; zero-downtime rolling updates; 4 staging/production environments. |
| D5 | Dell | Spring MVC/Hibernate contracts for 3 product catalog endpoints; integration onboarding 5 days to 2 days. |
| D6 | Dell | 5 PostgreSQL reporting endpoints; composite indexes and 3 N+1 rewrites; average database response 2.1s to 340ms. |
| D7 | Dell | Inventory monolith split into 2 services; build 14min to 5min; 3 cross-team deployment dependencies removed. |

## Technical skills

The six groups contain 54 entries, matching the current website's six groups. Project-specific technologies outside this list need their own project sources.

| Resume group | Count | Exact inventory |
| --- | --- | --- |
| Languages | 6 | Python; Java; JavaScript (ES6+); TypeScript; SQL; Bash. |
| AI/ML and Generative AI | 12 | LangChain; LangGraph; OpenAI API; Anthropic Claude API; Retrieval-Augmented Generation (RAG); Large Language Models (LLMs); Prompt Engineering; Hugging Face Transformers; BERT; scikit-learn; PyTorch; vector databases. |
| Frameworks and Libraries | 10 | FastAPI; Flask; Spring Boot; Spring MVC; Hibernate ORM; Pandas; NumPy; React.js; JUnit 5; Mockito. |
| Databases | 7 | PostgreSQL; MySQL; Oracle; MongoDB; Pinecone; ChromaDB; Redis. |
| Cloud and DevOps | 9 | Amazon Web Services (AWS); Microsoft Azure; Azure OpenAI Service; Docker; Kubernetes (K8s); Jenkins; GitHub Actions; Terraform; CI/CD Pipelines. |
| Tools and Methodologies | 10 | Git; GitHub; JIRA; Postman; Maven; Gradle; Linux; REST APIs; Microservices Architecture; Agile/Scrum. |

Skills are listed without an inferred proficiency or seniority score. Project technologies outside the resume inventory have their own sources.

## FlightSense evidence

| Claim | Evidence inspected | Qualification |
| --- | --- | --- |
| FlightSense title and co-authorship | [arXiv record](https://arxiv.org/abs/2605.07364) | Yash M. Kamerkar is a named co-author with Aditi J. Shelke, Renuka J. Shelke, and Nitin P. Hazarani. Use co-author credit; individual contributions need clarification before more specific ownership claims. |
| Publication status/date | Same arXiv record | Submitted 8 May 2026; revised 16 May 2026. Existing structured-data first-submission date agrees. Label arXiv preprint; no reviewed venue was established. |
| 7.07M records and ROC-AUC 0.879 | Same paper abstract | Paper reports BTS 2018 data and final version-3 test ROC-AUC. Attribute the result to the paper. AUC must not be called accuracy. |
| Version-1 0.732 and version-2 0.875 | Paper abstract and [repository README](https://github.com/YashKamerkar14/Flight-Delay-Prediction-using-Amazon-Sagemaker/blob/main/README.md) | README documents these earlier versions; it does not document the final 0.879 in its displayed performance section. Keep version labels and source context. Compare only after evaluation conditions are checked. |
| FlightSense repository/code | Public GitHub README and recursive file tree | Actual files include training/feature notebooks, `app.py`, `chatbot.py`, and `tools.py`. Supports inspectable project code; does not alone establish current uptime or every measured result. |
| Deployment/architecture | README versus paper abstract | README describes weather API/Lambda/RDS/SageMaker/EC2/Streamlit/Bedrock; paper describes NOAA features and AWS deployment. Choose a documented version for each diagram; inspect code and paper before asserting a combined architecture. |

## Current selected projects

The shared catalog at src/lib/projects.json contains Context Window, Medical Bill Auditor and FlightSense, in that order. All three are visible in one gallery. The detailed sources and evaluation qualifications are recorded in the [Context Window audit](context-window.md) and [Medical Bill Auditor audit](medical-bill-auditor.md). FlightSense retains its paper, repository and case-study links. Football analysis was removed from the application at the user's request.

The canonical PDF SHA-256 is E927FA3830B619796A441D03311FC5D4CD62D5B2D4E30A11DE1C4C0366FCD397. The hero's Production backend & AI systems line is backed by the listed employment; it does not claim an invented count or production scale for personal projects.

Scout and Scribe use resume facts and allowlisted project READMEs, distinguish full implementations from demonstration scope, and attribute project-reported results. Sources support inspection, but generated answers can still be mistaken. The production connection and its one initial live verification are documented in [Scout operations](../operations/scout-backend.md).
