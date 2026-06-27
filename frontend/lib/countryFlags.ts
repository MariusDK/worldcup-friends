const COUNTRY_CODES: Record<string, string> = {
  algeria: 'DZ',
  argentina: 'AR',
  australia: 'AU',
  austria: 'AT',
  belgium: 'BE',
  brazil: 'BR',
  cameroon: 'CM',
  canada: 'CA',
  chile: 'CL',
  china: 'CN',
  colombia: 'CO',
  costa_rica: 'CR',
  croatia: 'HR',
  czech_republic: 'CZ',
  denmark: 'DK',
  ecuador: 'EC',
  egypt: 'EG',
  england: 'GB',
  france: 'FR',
  germany: 'DE',
  ghana: 'GH',
  greece: 'GR',
  honduras: 'HN',
  hungary: 'HU',
  iceland: 'IS',
  india: 'IN',
  iran: 'IR',
  iraq: 'IQ',
  ireland: 'IE',
  italy: 'IT',
  ivory_coast: 'CI',
  japan: 'JP',
  korea_republic: 'KR',
  mexico: 'MX',
  morocco: 'MA',
  netherlands: 'NL',
  new_zealand: 'NZ',
  nigeria: 'NG',
  norway: 'NO',
  panama: 'PA',
  paraguay: 'PY',
  peru: 'PE',
  poland: 'PL',
  portugal: 'PT',
  qatar: 'QA',
  romania: 'RO',
  russia: 'RU',
  saudi_arabia: 'SA',
  scotland: 'GB',
  senegal: 'SN',
  serbia: 'RS',
  slovakia: 'SK',
  slovenia: 'SI',
  south_africa: 'ZA',
  spain: 'ES',
  sweden: 'SE',
  switzerland: 'CH',
  tunisia: 'TN',
  turkey: 'TR',
  ukraine: 'UA',
  united_arab_emirates: 'AE',
  united_states: 'US',
  uruguay: 'UY',
  wales: 'GB',
};

const ALIASES: Record<string, string> = {
  czechia: 'czech_republic',
  cote_d_ivoire: 'ivory_coast',
  iran_islamic_republic_of: 'iran',
  korea: 'korea_republic',
  south_korea: 'korea_republic',
  usa: 'united_states',
  us: 'united_states',
  u_s_a: 'united_states',
  united_states_of_america: 'united_states',
};

export function countryFlag(country: string) {
  const key = normalizeCountry(country);
  const code = COUNTRY_CODES[ALIASES[key] || key];
  return code ? flagFromIsoCode(code) : '';
}

function normalizeCountry(country: string) {
  return country
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function flagFromIsoCode(code: string) {
  return code
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
}
