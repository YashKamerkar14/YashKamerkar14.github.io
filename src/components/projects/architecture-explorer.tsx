"use client";

import { useState } from "react";

const paths = [
  { id: "prediction", title: "Prediction", description: "BTS flight data is stored in S3. XGBoost models are trained in SageMaker, and the prediction endpoint serves the Streamlit dashboard on EC2.", nodes: ["Flight data", "Amazon S3", "SageMaker", "Dashboard"] },
  { id: "weather", title: "Weather ingestion", description: "The repository describes weather ingestion through AWS Lambda into Amazon RDS. That data supports the platform's weather-aware experience.", nodes: ["Weather API", "AWS Lambda", "Amazon RDS", "Dashboard"] },
  { id: "assistant", title: "AI assistant", description: "The Streamlit interface uses Amazon Bedrock Nova Micro and data-query tools to answer natural-language questions with project data.", nodes: ["Question", "Bedrock", "Data tools", "Answer"] },
] as const;

export function ArchitectureExplorer() {
  const [selected, setSelected] = useState(0);
  const path = paths[selected];
  return <div className="architecture-explorer">
    <div className="architecture-buttons" role="group" aria-label="Explore a documented system path">{paths.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.title}<span aria-hidden="true">↗</span></button>)}</div>
    <ol className="architecture-flow" aria-label={`${path.title} path`}>{path.nodes.map((node, index) => <li className="flow-node" key={`${path.id}-${node}`}><span className="mono">0{index + 1}</span><strong>{node}</strong>{index < 3 && <span className="flow-arrow" aria-hidden="true">→</span>}</li>)}</ol>
    <p className="architecture-description" aria-live="polite">{path.description}</p>
    <details className="architecture-transcript"><summary>Read all three paths</summary>{paths.map(item => <p key={item.id}><strong>{item.title}.</strong> {item.description}</p>)}</details>
  </div>;
}
