const {createAgentHandler} = require('./portfolio-agent.cjs');
const {createBudgetGuard} = require('./openrouter-budget.cjs');

function createVercelHandler({fetcher = fetch, key = () => process.env.OPENROUTER_API_KEY, dailyBudget, allowedOrigins = (process.env.SCOUT_ALLOWED_ORIGINS || 'https://yashkamerkar14.github.io').split(',').map(origin=>origin.trim()).filter(Boolean)} = {}) {
 const agent = createAgentHandler({
  fetcher,key,provider:()=> 'openrouter',allowedOrigins,requireOrigin:true,timeoutMs:45000,
  clientAddress:req=>process.env.VERCEL === '1' ? String(req.headers['x-vercel-forwarded-for'] || 'unknown').split(',')[0].trim() : req.socket?.remoteAddress || 'local',
  beforeQuestion:createBudgetGuard({fetcher,key,...(dailyBudget === undefined ? {} : {dailyBudget})}),
 });
 return async function handler(req,res) {
  const url = new URL(req.url,'http://localhost');
  // The status rewrite may preserve the original path or expose the destination.
  req.url = url.pathname === '/api/agents/status' || url.searchParams.get('route') === 'status' || req.query?.route === 'status' ? '/api/agents/status' : '/api/agents';
  await agent(req,res);
 };
}
module.exports = {createVercelHandler};
