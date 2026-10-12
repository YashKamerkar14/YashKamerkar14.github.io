export function ResearchCover() {
  return <div className="research-cover-content">
    <div className="research-cover-copy">
      <span className="mono">MACHINE LEARNING / RESEARCH</span>
      <strong>FlightSense<span>.</span></strong>
      <p>From raw data<br />to useful answers.</p>
      <span className="research-cover-credit">Co-authored research · arXiv preprint · 2026</span>
    </div>
    <div className="research-route-art">
      <svg className="research-connections" viewBox="0 0 600 480" fill="none" aria-hidden="true">
        <defs><linearGradient id="research-route-gradient" x1="130" y1="60" x2="460" y2="420" gradientUnits="userSpaceOnUse"><stop stopColor="#94b9f1" /><stop offset=".5" stopColor="#cbddf8" /><stop offset="1" stopColor="#749ae0" /></linearGradient></defs>
        <circle cx="306" cy="239" r="209" stroke="#adc8ef" strokeOpacity=".13" /><circle cx="306" cy="239" r="159" stroke="#adc8ef" strokeOpacity=".09" />
        <path d="M160 80C305 80 475 101 475 227S206 310 206 399" stroke="url(#research-route-gradient)" strokeWidth="2" />
        <path d="M160 80C305 80 475 101 475 227S206 310 206 399" stroke="#c4d8f8" strokeWidth="30" opacity=".025" />
        <circle cx="160" cy="80" r="5" fill="#cbdcf7" /><circle cx="475" cy="227" r="5" fill="#cbdcf7" /><circle cx="206" cy="399" r="5" fill="#cbdcf7" />
        <g fill="#aec8ed" opacity=".3">{Array.from({ length: 24 }, (_, index) => <circle key={index} cx={90 + index % 6 * 20} cy={252 + Math.floor(index / 6) * 20} r="1.2" />)}</g>
        <path d="M355 372h89m-44-44v89" stroke="#adc8ef" strokeOpacity=".13" />
      </svg>
      <ol className="research-route">
        <li><span className="research-stage-number">01 / DATA</span><strong>Amazon S3</strong><span>Historical records</span></li>
        <li><span className="research-stage-number">02 / MODEL</span><strong>SageMaker</strong><span>Training & inference</span></li>
        <li><span className="research-stage-number">03 / INTERFACE</span><strong>Streamlit</strong><span>Dashboard on EC2</span></li>
      </ol>
    </div>
    <span className="research-cover-caption">Documented prediction path · repository</span>
  </div>;
}
