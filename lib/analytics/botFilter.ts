const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /googlebot/i, /bingbot/i, /yandex/i, /baidu/i, /duckduck/i,
  /facebookexternalhit/i, /twitterbot/i, /whatsapp/i, /telegram/i,
  /lighthouse/i, /gtmetrix/i, /pingdom/i, /uptimerobot/i,
];

const INTERNAL_IPS = ['127.0.0.1', '::1', 'localhost'];

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

export function isInternalIP(ip: string): boolean {
  return INTERNAL_IPS.includes(ip) || ip.startsWith('192.168.') || ip.startsWith('10.');
}
