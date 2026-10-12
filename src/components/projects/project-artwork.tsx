/** Original illustrative diagrams; these are not screenshots or live project outputs. */
export function ProjectArtwork({ kind }: { kind: "flightsense" }) {
  return <figure className="project-artwork flight-artwork" aria-label="Illustrative FlightSense data, prediction model, and dashboard workflow">
    <svg viewBox="0 0 640 260" fill="none" aria-hidden="true"><rect width="640" height="260" rx="5" fill="#e9e4d3"/><g stroke="#647a62" strokeWidth="2"><path d="M194 130h69m-9-7 9 7-9 7m123-7h67m-9-7 9 7-9 7" strokeDasharray="5 5"/><path d="M89 81v99c0 12 88 12 88 0V81" fill="#fffdf0"/><ellipse cx="133" cy="81" rx="44" ry="13" fill="#d2dcc5"/><path d="M89 111c0 12 88 12 88 0m-88 35c0 12 88 12 88 0"/><rect x="277" y="69" width="99" height="122" rx="10" fill="#d3dfcb"/><path d="M300 158v-36h18v36h18v-54h18v54m-57 12h62"/><rect x="457" y="82" width="103" height="89" rx="6" fill="#fffdf0"/><path d="M474 105h68m-68 20h28m-28 16h20m20-19 17 7 14-16M509 171v21m-23 0h48"/></g></svg>
    <figcaption>Historical data → prediction model → dashboard</figcaption>
  </figure>;
}
