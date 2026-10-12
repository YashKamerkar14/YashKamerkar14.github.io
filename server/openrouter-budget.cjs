// This uses provider-reported usage, not an in-memory serverless daily counter.
// OpenRouter's own key credit limit is the hard cap; this is an earlier stop.
function createBudgetGuard({fetcher = fetch, key = () => process.env.OPENROUTER_API_KEY, dailyBudget = Number(process.env.SCOUT_DAILY_BUDGET_USD || '0.25')} = {}) {
 return async function checkBudget() {
  if (!Number.isFinite(dailyBudget) || dailyBudget <= 0) return {status:503,error:'Scout is taking a break. Please explore the project links.'};
  try {
   const response = await fetcher('https://openrouter.ai/api/v1/key',{
    headers:{Authorization:'Bearer '+key()},signal:AbortSignal.timeout(5000),
   });
   if (!response.ok) return {status:503,error:'The AI connection needs attention. Please explore the project links for now.'};
   const {data} = await response.json();
   if (!Number.isFinite(data?.usage_daily) || data.usage_daily < 0 || !Number.isFinite(data?.limit) || !Number.isFinite(data?.limit_remaining)) {
    return {status:503,error:'The AI budget is not configured yet. Please explore the project links.'};
   }
   if (data.limit_remaining <= 0 || data.usage_daily >= dailyBudget) return {status:429,error:'Scout has reached today’s AI budget. Please explore the project demos and sources.'};
   return null;
  } catch {
   return {status:503,error:'The AI budget check is unavailable. Please explore the project links for now.'};
  }
 };
}
module.exports = {createBudgetGuard};
