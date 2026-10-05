/*
 * Pure, DOM-free search core used by the "Ask" palette: tokenizer, synonym expansion and BM25 ranking.
 * Exposed as window.PortfolioSearch so the UI (palette.js) and the browser tests (tests/) can share it.
 *
 * Why not an embedding model? The page has ~40 passages; BM25 plus a hand-tuned synonym map covers
 * the realistic queries ("k8s", "genai", "latency") at zero download cost, which matters on mobile.
 */
(function (global) {
  'use strict';

  var STOPWORDS = toSet(
    'a an and are as at be by did do does for from has have he his how i in is it its me my of on or ' +
    'tell that the this to was what when where which who with yash about any ever has worked work used use'
  );

  /**
   * Query-side synonyms: each key expands to extra terms (weighted lower than the literal term).
   * Keys and values are already in tokenized form.
   */
  var SYNONYMS = {
    ai: ['llm', 'rag', 'langchain', 'machine', 'learning', 'model', 'agent'],
    genai: ['llm', 'rag', 'langchain', 'openai', 'generative'],
    gpt: ['openai', 'llm'],
    llm: ['langchain', 'openai', 'rag', 'assistant', 'language'],
    llms: ['llm', 'langchain', 'openai', 'rag'],
    rag: ['retrieval', 'augmented', 'pinecone', 'vector'],
    ml: ['machine', 'learning', 'model', 'scikit', 'xgboost', 'prediction'],
    k8s: ['kubernetes'],
    kubernetes: ['k8s', 'docker', 'containerized'],
    aws: ['amazon', 'sagemaker', 'lambda', 'bedrock'],
    cloud: ['aws', 'azure', 'kubernetes', 'docker'],
    azure: ['microsoft'],
    java: ['spring', 'junit', 'hibernate'],
    spring: ['java', 'boot'],
    python: ['fastapi', 'pandas', 'flask'],
    backend: ['microservice', 'api', 'spring', 'fastapi', 'grpc'],
    microservices: ['microservice', 'spring', 'grpc'],
    api: ['rest', 'fastapi', 'endpoint', 'grpc'],
    apis: ['api', 'rest', 'fastapi'],
    database: ['sql', 'postgresql', 'oracle', 'query'],
    db: ['database', 'sql', 'postgresql'],
    sql: ['postgresql', 'mysql', 'oracle', 'query'],
    postgres: ['postgresql'],
    latency: ['time', 'response', 'faster', 'reducing', 'cutting'],
    performance: ['optimized', 'latency', 'response', 'time'],
    speed: ['faster', 'time', 'latency'],
    test: ['junit', 'mockito', 'testing'],
    testing: ['junit', 'mockito', 'test'],
    etl: ['pipeline', 'pandas', 'sqlalchemy', 'ingested'],
    data: ['etl', 'pipeline', 'records', 'pandas'],
    devops: ['jenkins', 'docker', 'kubernetes', 'ci', 'cd'],
    ci: ['jenkins', 'actions', 'pipelines'],
    nlp: ['sentiment', 'finbert', 'bert', 'transcripts'],
    paper: ['arxiv', 'published', 'flightsense'],
    research: ['arxiv', 'published', 'flightsense', 'paper'],
    publication: ['arxiv', 'published', 'paper'],
    education: ['stevens', 'master', 'science', 'degree'],
    degree: ['master', 'stevens', 'science'],
    school: ['stevens', 'master'],
    university: ['stevens'],
    football: ['manchester', 'united', 'yolo'],
    soccer: ['football', 'manchester', 'united'],
    hire: ['open', 'roles', 'contact', 'email'],
    hiring: ['open', 'roles', 'contact'],
    email: ['contact', 'mailto'],
    flight: ['flightsense', 'delay', 'airport'],
    agent: ['agentic', 'langgraph', 'assistant'],
    agents: ['agent', 'agentic', 'langgraph']
  };

  var BM25_K1 = 1.2;
  var BM25_B = 0.75;
  var SYNONYM_WEIGHT = 0.4;
  var PREFIX_WEIGHT = 0.6;

  function toSet(str) {
    var set = Object.create(null);
    str.split(/\s+/).forEach(function (w) { if (w) set[w] = true; });
    return set;
  }

  /** Light stemmer: strips the plural/participle endings that matter for this corpus. */
  function stem(word) {
    if (/[0-9.+#]/.test(word)) return word; // technical tokens: react.js, k8s, n+1, c#
    if (word.length > 4 && /ies$/.test(word)) return word.slice(0, -3) + 'y';
    if (word.length > 4 && /(ss|us)$/.test(word)) return word;
    if (word.length > 3 && /s$/.test(word)) return word.slice(0, -1);
    return word;
  }

  /** Lowercases, strips accents/punctuation, removes stopwords and stems. */
  function tokenize(text) {
    if (!text) return [];
    var normalized = String(text)
      .toLowerCase()
      .normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9+#.\s-]/g, ' ')
      .replace(/(\w)[.-](?=\s|$)/g, '$1');
    return normalized.split(/[\s/-]+/)
      .map(function (w) { return w.replace(/^[.]+|[.]+$/g, ''); })
      .filter(function (w) { return w.length > 1 && !STOPWORDS[w]; })
      .map(stem);
  }

  /** Returns [{term, weight}] for a query: literal terms at 1.0, synonyms at SYNONYM_WEIGHT. */
  function expandQuery(query) {
    var terms = tokenize(query);
    var weights = Object.create(null);
    terms.forEach(function (t) { weights[t] = 1; });
    terms.forEach(function (t) {
      var raw = SYNONYMS[t] || SYNONYMS[t + 's'];
      if (!raw) return;
      raw.forEach(function (s) {
        var st = stem(s);
        if (!(st in weights)) weights[st] = SYNONYM_WEIGHT;
      });
    });
    return Object.keys(weights).map(function (t) { return { term: t, weight: weights[t] }; });
  }

  /**
   * Builds a BM25 index.
   * @param {Array<{id:string, text:string, title?:string, boost?:number}>} docs
   *   title is weighted (counted twice); boost multiplies the doc's final score (default 1).
   */
  function createIndex(docs) {
    var postings = Object.create(null); // term -> {docIdx: tf}
    var lengths = [];
    var vocabulary = [];

    docs.forEach(function (doc, i) {
      var tokens = tokenize(doc.text).concat(tokenize(doc.title || ''), tokenize(doc.title || ''));
      lengths.push(tokens.length);
      tokens.forEach(function (t) {
        if (!postings[t]) { postings[t] = Object.create(null); vocabulary.push(t); }
        postings[t][i] = (postings[t][i] || 0) + 1;
      });
    });

    var avgLength = lengths.reduce(function (a, b) { return a + b; }, 0) / Math.max(lengths.length, 1);

    function idf(term) {
      var df = postings[term] ? Object.keys(postings[term]).length : 0;
      return Math.log(1 + (docs.length - df + 0.5) / (df + 0.5));
    }

    /** Terms in the vocabulary that start with `term` (for search-as-you-type on partial words). */
    function prefixMatches(term) {
      if (term.length < 3) return [];
      return vocabulary.filter(function (v) { return v !== term && v.indexOf(term) === 0; });
    }

    /**
     * @returns {Array<{doc:object, score:number, terms:string[]}>} best first; terms = matched index terms.
     */
    function search(query, limit) {
      var expanded = expandQuery(query);
      if (!expanded.length) return [];

      // Add prefix matches for literal terms ("kube" → "kubernetes").
      var weighted = [];
      expanded.forEach(function (q) {
        weighted.push(q);
        if (q.weight === 1) {
          prefixMatches(q.term).forEach(function (p) { weighted.push({ term: p, weight: PREFIX_WEIGHT }); });
        }
      });

      var scores = Object.create(null);
      var matched = Object.create(null);
      weighted.forEach(function (q) {
        var plist = postings[q.term];
        if (!plist) return;
        var termIdf = idf(q.term);
        Object.keys(plist).forEach(function (key) {
          var tf = plist[key];
          var norm = tf + BM25_K1 * (1 - BM25_B + BM25_B * lengths[key] / avgLength);
          scores[key] = (scores[key] || 0) + q.weight * termIdf * (tf * (BM25_K1 + 1)) / norm;
          (matched[key] = matched[key] || []).push(q.term);
        });
      });

      return Object.keys(scores)
        .map(function (key) {
          var boost = docs[key].boost == null ? 1 : docs[key].boost;
          return { doc: docs[key], score: scores[key] * boost, terms: matched[key] };
        })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, limit || 8);
    }

    return { search: search, size: docs.length };
  }

  global.PortfolioSearch = {
    tokenize: tokenize,
    stem: stem,
    expandQuery: expandQuery,
    createIndex: createIndex
  };
})(typeof window !== 'undefined' ? window : globalThis);
