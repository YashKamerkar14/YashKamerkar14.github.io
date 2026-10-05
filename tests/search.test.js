/*
 * Minimal, dependency-free tests for assets/js/search.js.
 * Open tests/index.html through a local server (python -m http.server) and check the summary line;
 * window.__testResults is also exposed for automated runs.
 */
(function () {
  'use strict';
  var S = window.PortfolioSearch;
  var results = [];

  function test(name, fn) {
    try { fn(); results.push({ name: name, ok: true }); }
    catch (e) { results.push({ name: name, ok: false, error: e.message }); }
  }
  function eq(actual, expected, msg) {
    var a = JSON.stringify(actual), b = JSON.stringify(expected);
    if (a !== b) throw new Error((msg || 'expected equal') + ': ' + a + ' !== ' + b);
  }
  function ok(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }

  var DOCS = [
    { id: 'uber-rag', title: 'Uber', text: 'Engineered a retrieval-augmented generation (RAG) pipeline using LangChain, OpenAI API, and Pinecone.' },
    { id: 'dell-k8s', title: 'Dell Technologies', text: 'Deployed containerized Spring Boot services via Docker on Kubernetes clusters.' },
    { id: 'dell-pg', title: 'Dell Technologies', text: 'Optimized PostgreSQL query performance, reducing average database response time from 2.1 seconds to 340 ms.' },
    { id: 'skills', title: 'Skills', text: 'React.js JUnit 5 Mockito FastAPI' },
    { id: 'football', title: 'Interests', text: 'Die-hard Manchester United supporter.' }
  ];
  var index = S.createIndex(DOCS);
  var top = function (q) { var r = index.search(q, 3); return r.length ? r[0].doc.id : null; };

  test('tokenize lowercases, strips punctuation and stopwords', function () {
    eq(S.tokenize('What is Yash\'s RAG experience?'), ['rag', 'experience']);
  });
  test('tokenize keeps tech tokens like react.js and n+1 intact', function () {
    eq(S.tokenize('React.js and N+1 queries.'), ['react.js', 'n+1', 'query']);
  });
  test('stem handles plurals without mangling -ss / -us words', function () {
    eq(S.stem('queries'), 'query');
    eq(S.stem('clusters'), 'cluster');
    eq(S.stem('class'), 'class');
    eq(S.stem('status'), 'status');
    eq(S.stem('react.js'), 'react.js');
  });
  test('expandQuery adds weighted synonyms', function () {
    var exp = S.expandQuery('k8s');
    eq(exp[0], { term: 'k8s', weight: 1 });
    ok(exp.some(function (t) { return t.term === 'kubernete' && t.weight < 1; }), 'k8s should expand to kubernetes');
  });
  test('literal match ranks first', function () { eq(top('pinecone'), 'uber-rag'); });
  test('synonym match: k8s finds Kubernetes', function () { eq(top('k8s'), 'dell-k8s'); });
  test('synonym match: genai finds the RAG work', function () { eq(top('genai'), 'uber-rag'); });
  test('synonym match: latency finds the PostgreSQL win', function () { eq(top('latency'), 'dell-pg'); });
  test('prefix match: "kube" finds Kubernetes', function () { eq(top('kube'), 'dell-k8s'); });
  test('prefix match: "react" finds react.js', function () { eq(top('react'), 'skills'); });
  test('title field is searchable', function () { eq(top('uber'), 'uber-rag'); });
  test('soccer finds football interest via synonyms', function () { eq(top('soccer'), 'football'); });
  test('stopword-only and empty queries return nothing', function () {
    eq(index.search('what is the', 5), []);
    eq(index.search('', 5), []);
  });
  test('unknown terms return nothing', function () { eq(index.search('cobol mainframe', 5), []); });
  test('boost lowers a document score', function () {
    var boosted = S.createIndex([
      { id: 'list', title: 'Skills', text: 'PostgreSQL MySQL', boost: 0.5 },
      { id: 'story', title: 'Dell', text: 'Optimized PostgreSQL query performance for reporting endpoints.' }
    ]);
    eq(boosted.search('postgresql', 2)[0].doc.id, 'story');
  });
  test('results are sorted by descending score', function () {
    var r = index.search('dell spring postgresql', 5);
    for (var i = 1; i < r.length; i++) ok(r[i - 1].score >= r[i].score, 'not sorted at ' + i);
  });

  var passed = results.filter(function (r) { return r.ok; }).length;
  var list = document.getElementById('results');
  results.forEach(function (r) {
    var li = document.createElement('li');
    li.className = r.ok ? 'pass' : 'fail';
    li.textContent = (r.ok ? 'PASS ' : 'FAIL ') + r.name + (r.error ? ' - ' + r.error : '');
    list.appendChild(li);
  });
  var summary = document.getElementById('summary');
  summary.textContent = passed + ' / ' + results.length + ' passed';
  summary.className = passed === results.length ? 'pass' : 'fail';
  window.__testResults = { passed: passed, total: results.length, results: results };
})();
