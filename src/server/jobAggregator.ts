import type { Opportunity } from '../types';
import { analyzeAndScoreOpportunity } from '../utils/aiOpportunityAnalyzer';

type SourceJob = {
  id: string | number;
  title: string;
  company: string;
  category?: string;
  description?: string;
  url?: string;
  location?: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  publicationDate?: string;
  jobType?: string;
  source: string;
};

const REQUEST_TIMEOUT_MS = 12_000;

function stripHtml(value = ''): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSalary(text = ''): number {
  const matches = text.replace(/,/g, '').match(/\$\s?(\d+(?:\.\d+)?)(?:\s*[kK])?/g) || [];
  const values = matches.map((raw) => {
    const m = raw.match(/(\d+(?:\.\d+)?)/);
    if (!m) return 0;
    const n = Number(m[1]);
    return /k/i.test(raw) ? n * 1000 : n;
  }).filter(Boolean);
  return values.length ? Math.max(...values) : 0;
}

function salaryFromJob(job: SourceJob): number {
  if (typeof job.salaryMax === 'number' && job.salaryMax > 0) return job.salaryMax;
  if (typeof job.salaryMin === 'number' && job.salaryMin > 0) return job.salaryMin;
  return parseSalary(job.salary || '');
}

async function getJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'User-Agent': 'Marium-AI-Workspace/2.0' },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json() as T;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRemotive(search = ''): Promise<SourceJob[]> {
  const query = search ? `&search=${encodeURIComponent(search)}` : '';
  const data = await getJson<any>(`https://remotive.com/api/remote-jobs?limit=100${query}`);
  return (data.jobs || []).map((job: any) => ({
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name,
    category: job.category,
    description: stripHtml(job.description),
    url: job.url,
    location: job.candidate_required_location || 'Worldwide',
    salary: job.salary || '',
    publicationDate: job.publication_date,
    jobType: job.job_type,
    source: 'Remotive',
  }));
}

async function fetchJobicy(search = ''): Promise<SourceJob[]> {
  const query = search ? `&tag=${encodeURIComponent(search)}` : '';
  const data = await getJson<any>(`https://jobicy.com/api/v2/remote-jobs?count=100${query}`);
  return (data.jobs || []).map((job: any) => ({
    id: `jobicy-${job.id}`,
    title: job.jobTitle,
    company: job.companyName,
    category: job.jobIndustry,
    description: stripHtml(job.jobDescription || job.jobExcerpt),
    url: job.url,
    location: job.jobGeo || 'Worldwide',
    salaryMin: Number(job.salaryMin) || 0,
    salaryMax: Number(job.salaryMax) || 0,
    salaryCurrency: job.salaryCurrency,
    publicationDate: job.pubDate,
    jobType: job.jobType,
    source: 'Jobicy',
  }));
}

async function fetchRemoteOk(search = ''): Promise<SourceJob[]> {
  const data = await getJson<any[]>('https://remoteok.com/api');
  const rows = Array.isArray(data) ? data : [];
  return rows
    .filter((job: any) => job && job.id && job.position)
    .filter((job: any) => !search || `${job.position} ${job.description || ''} ${(job.tags || []).join(' ')}`.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 100)
    .map((job: any) => ({
      id: `remoteok-${job.id}`,
      title: job.position,
      company: job.company || 'Unknown company',
      category: (job.tags || [])[0] || 'Remote Work',
      description: stripHtml(job.description),
      url: job.url || (job.slug ? `https://remoteok.com/remote-jobs/${job.slug}` : 'https://remoteok.com'),
      location: job.location || 'Worldwide',
      salaryMin: Number(job.salary_min) || 0,
      salaryMax: Number(job.salary_max) || 0,
      publicationDate: job.date,
      jobType: 'remote',
      source: 'Remote OK',
    }));
}

function toOpportunity(job: SourceJob): Opportunity {
  const reward = salaryFromJob(job);
  const description = (job.description || `${job.title} — ${job.company}`).slice(0, 12_000);
  const sourceReliability = job.source === 'Remotive' ? 82 : job.source === 'Jobicy' ? 80 : 76;
  const durationDays = /contract|freelance/i.test(job.jobType || '') ? 14 : 30;
  const salaryText = job.salary || (reward ? `$${reward.toLocaleString()} ${job.salaryCurrency || 'USD'}` : 'غير محدد');

  const base: Opportunity = {
    id: String(job.id),
    title: job.title || 'Remote opportunity',
    company: job.company || 'Unknown company',
    source: job.source,
    category: job.category || 'Remote Work',
    payoutValue: Math.min(100, reward ? 65 + Math.min(35, reward / 10_000 * 35) : 55),
    rawPayoutUSD: reward,
    reward,
    score: 0,
    riskScore: 0,
    status: 'new',
    createdAt: job.publicationDate ? Date.parse(job.publicationDate) : Date.now(),
    sourceReliability,
    executionDurationDays: durationDays,
    executionDurationScore: durationDays <= 14 ? 92 : 78,
    descriptionClarity: Math.min(100, description.length > 500 ? 92 : description.length > 180 ? 82 : 65),
    antiFraudScore: 85,
    totalScore: 0,
    riskLevel: 'Medium Risk',
    description,
    verified: false,
    date: job.publicationDate ? job.publicationDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    location: job.location || 'Worldwide',
    requiredSkills: Array.from(new Set([
      ...(job.category ? [job.category] : []),
      ...((description.match(/\b(react|typescript|javascript|python|java|kotlin|node\.js|aws|azure|firebase|sql|figma|seo|sales|writing|translation|customer support)\b/gi) || [])),
    ])).slice(0, 8),
    sourceUrl: job.url || '',
    applyUrl: job.url || '',
    jobType: job.jobType || 'remote',
    salaryText,
  };

  return analyzeAndScoreOpportunity(base);
}

function dedupe(opportunities: Opportunity[]): Opportunity[] {
  const seen = new Set<string>();
  return opportunities.filter((job) => {
    const key = `${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function aggregateRemoteJobs(search = ''): Promise<{ jobs: Opportunity[]; sources: string[]; warnings: string[] }> {
  const results = await Promise.allSettled([
    fetchRemotive(search),
    fetchJobicy(search),
    fetchRemoteOk(search),
  ]);
  const jobs: Opportunity[] = [];
  const sources: string[] = [];
  const warnings: string[] = [];
  results.forEach((result, index) => {
    const name = ['Remotive', 'Jobicy', 'Remote OK'][index];
    if (result.status === 'fulfilled') {
      jobs.push(...result.value.map(toOpportunity));
      sources.push(name);
    } else {
      warnings.push(`${name}: ${result.reason instanceof Error ? result.reason.message : 'تعذر الاتصال بالمصدر'}`);
    }
  });
  return { jobs: dedupe(jobs).sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0)), sources, warnings };
}
