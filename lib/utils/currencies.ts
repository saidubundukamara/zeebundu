// Comprehensive currency list with codes, names, and flag emojis
export interface CurrencyInfo {
  code: string;
  name: string;
  flag: string;
  symbol?: string;
}

// Complete list of all world currencies (ISO 4217 standard)
const CURRENCIES_RAW: CurrencyInfo[] = [
  // Major currencies
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$' },
  
  // European currencies
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
  { code: 'RON', name: 'Romanian Leu', flag: '🇷🇴', symbol: 'lei' },
  { code: 'BGN', name: 'Bulgarian Lev', flag: '🇧🇬', symbol: 'лв' },
  { code: 'HRK', name: 'Croatian Kuna', flag: '🇭🇷', symbol: 'kn' },
  { code: 'RSD', name: 'Serbian Dinar', flag: '🇷🇸', symbol: 'дин' },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', flag: '🇧🇦', symbol: 'KM' },
  { code: 'ALL', name: 'Albanian Lek', flag: '🇦🇱', symbol: 'L' },
  { code: 'MKD', name: 'Macedonian Denar', flag: '🇲🇰', symbol: 'ден' },
  { code: 'ISK', name: 'Icelandic Krona', flag: '🇮🇸', symbol: 'kr' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', flag: '🇺🇦', symbol: '₴' },
  { code: 'BYN', name: 'Belarusian Ruble', flag: '🇧🇾', symbol: 'Br' },
  { code: 'MDL', name: 'Moldovan Leu', flag: '🇲🇩', symbol: 'L' },
  { code: 'GIP', name: 'Gibraltar Pound', flag: '🇬🇮', symbol: '£' },
  { code: 'GGP', name: 'Guernsey Pound', flag: '🇬🇬', symbol: '£' },
  { code: 'JEP', name: 'Jersey Pound', flag: '🇯🇪', symbol: '£' },
  { code: 'IMP', name: 'Isle of Man Pound', flag: '🇮🇲', symbol: '£' },
  { code: 'FOK', name: 'Faroese Krona', flag: '🇫🇴', symbol: 'kr' },
  
  // Middle Eastern currencies
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', symbol: 'ر.س' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦', symbol: 'ر.ق' },
  { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼', symbol: 'د.ك' },
  { code: 'BHD', name: 'Bahraini Dinar', flag: '🇧🇭', symbol: '.د.ب' },
  { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲', symbol: 'ر.ع.' },
  { code: 'JOD', name: 'Jordanian Dinar', flag: '🇯🇴', symbol: 'د.ا' },
  { code: 'ILS', name: 'Israeli Shekel', flag: '🇮🇱', symbol: '₪' },
  { code: 'LBP', name: 'Lebanese Pound', flag: '🇱🇧', symbol: 'ل.ل' },
  { code: 'SYP', name: 'Syrian Pound', flag: '🇸🇾', symbol: '£' },
  { code: 'YER', name: 'Yemeni Rial', flag: '🇾🇪', symbol: '﷼' },
  { code: 'IRR', name: 'Iranian Rial', flag: '🇮🇷', symbol: '﷼' },
  { code: 'IQD', name: 'Iraqi Dinar', flag: '🇮🇶', symbol: 'ع.د' },
  { code: 'AFN', name: 'Afghan Afghani', flag: '🇦🇫', symbol: '؋' },
  
  // Asian currencies
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
  { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰', symbol: '₨' },
  { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩', symbol: '৳' },
  { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰', symbol: 'Rs' },
  { code: 'NPR', name: 'Nepalese Rupee', flag: '🇳🇵', symbol: '₨' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', flag: '🇧🇹', symbol: 'Nu.' },
  { code: 'MMK', name: 'Myanmar Kyat', flag: '🇲🇲', symbol: 'K' },
  { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳', symbol: '₫' },
  { code: 'LAK', name: 'Lao Kip', flag: '🇱🇦', symbol: '₭' },
  { code: 'KHR', name: 'Cambodian Riel', flag: '🇰🇭', symbol: '៛' },
  { code: 'KZT', name: 'Kazakhstani Tenge', flag: '🇰🇿', symbol: '₸' },
  { code: 'UZS', name: 'Uzbekistani Som', flag: '🇺🇿', symbol: 'soʻm' },
  { code: 'KGS', name: 'Kyrgystani Som', flag: '🇰🇬', symbol: 'с' },
  { code: 'TJS', name: 'Tajikistani Somoni', flag: '🇹🇯', symbol: 'SM' },
  { code: 'TMT', name: 'Turkmenistani Manat', flag: '🇹🇲', symbol: 'm' },
  { code: 'AZN', name: 'Azerbaijani Manat', flag: '🇦🇿', symbol: '₼' },
  { code: 'AMD', name: 'Armenian Dram', flag: '🇦🇲', symbol: '֏' },
  { code: 'GEL', name: 'Georgian Lari', flag: '🇬🇪', symbol: '₾' },
  { code: 'MNT', name: 'Mongolian Tugrik', flag: '🇲🇳', symbol: '₮' },
  { code: 'TWD', name: 'Taiwan Dollar', flag: '🇹🇼', symbol: 'NT$' },
  { code: 'MOP', name: 'Macanese Pataca', flag: '🇲🇴', symbol: 'P' },
  { code: 'BND', name: 'Brunei Dollar', flag: '🇧🇳', symbol: 'B$' },
  
  // African currencies
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', symbol: '₦' },
  { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭', symbol: '₵' },
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
  { code: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬', symbol: 'USh' },
  { code: 'TZS', name: 'Tanzanian Shilling', flag: '🇹🇿', symbol: 'TSh' },
  { code: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹', symbol: 'Br' },
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬', symbol: '£' },
  { code: 'MAD', name: 'Moroccan Dirham', flag: '🇲🇦', symbol: 'DH' },
  { code: 'TND', name: 'Tunisian Dinar', flag: '🇹🇳', symbol: 'د.ت' },
  { code: 'DZD', name: 'Algerian Dinar', flag: '🇩🇿', symbol: 'د.ج' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
  { code: 'BWP', name: 'Botswana Pula', flag: '🇧🇼', symbol: 'P' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', flag: '🇿🇼', symbol: '$' },
  { code: 'ZMW', name: 'Zambian Kwacha', flag: '🇿🇲', symbol: 'ZK' },
  { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼', symbol: 'MK' },
  { code: 'MZN', name: 'Mozambican Metical', flag: '🇲🇿', symbol: 'MT' },
  { code: 'AOA', name: 'Angolan Kwanza', flag: '🇦🇴', symbol: 'Kz' },
  { code: 'MGA', name: 'Malagasy Ariary', flag: '🇲🇬', symbol: 'Ar' },
  { code: 'MUR', name: 'Mauritian Rupee', flag: '🇲🇺', symbol: '₨' },
  { code: 'SCR', name: 'Seychellois Rupee', flag: '🇸🇨', symbol: '₨' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', flag: '🇲🇻', symbol: 'Rf' },
  { code: 'XOF', name: 'CFA Franc (West)', flag: '🌍', symbol: 'Fr' },
  { code: 'XAF', name: 'CFA Franc (Central)', flag: '🌍', symbol: 'Fr' },
  { code: 'RWF', name: 'Rwandan Franc', flag: '🇷🇼', symbol: 'Fr' },
  { code: 'BIF', name: 'Burundian Franc', flag: '🇧🇮', symbol: 'Fr' },
  { code: 'DJF', name: 'Djiboutian Franc', flag: '🇩🇯', symbol: 'Fr' },
  { code: 'ERN', name: 'Eritrean Nakfa', flag: '🇪🇷', symbol: 'Nkf' },
  { code: 'SOS', name: 'Somali Shilling', flag: '🇸🇴', symbol: 'Sh' },
  { code: 'SDG', name: 'Sudanese Pound', flag: '🇸🇩', symbol: '£' },
  { code: 'SSP', name: 'South Sudanese Pound', flag: '🇸🇸', symbol: '£' },
  { code: 'LYD', name: 'Libyan Dinar', flag: '🇱🇾', symbol: 'ل.د' },
  { code: 'SLE', name: 'Sierra Leonean Leone', flag: '🇸🇱', symbol: 'Le' },
  { code: 'GMD', name: 'Gambian Dalasi', flag: '🇬🇲', symbol: 'D' },
  { code: 'GNF', name: 'Guinean Franc', flag: '🇬🇳', symbol: 'Fr' },
  { code: 'LRD', name: 'Liberian Dollar', flag: '🇱🇷', symbol: '$' },
  { code: 'CDF', name: 'Congolese Franc', flag: '🇨🇩', symbol: 'Fr' },
  { code: 'STN', name: 'São Tomé & Príncipe Dobra', flag: '🇸🇹', symbol: 'Db' },
  { code: 'SZL', name: 'Swazi Lilangeni', flag: '🇸🇿', symbol: 'L' },
  { code: 'LSL', name: 'Lesotho Loti', flag: '🇱🇸', symbol: 'L' },
  { code: 'NAD', name: 'Namibian Dollar', flag: '🇳🇦', symbol: '$' },
  
  // Latin American currencies
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
  { code: 'ARS', name: 'Argentine Peso', flag: '🇦🇷', symbol: '$' },
  { code: 'CLP', name: 'Chilean Peso', flag: '🇨🇱', symbol: '$' },
  { code: 'COP', name: 'Colombian Peso', flag: '🇨🇴', symbol: '$' },
  { code: 'PEN', name: 'Peruvian Sol', flag: '🇵🇪', symbol: 'S/.' },
  { code: 'BOB', name: 'Bolivian Boliviano', flag: '🇧🇴', symbol: 'Bs.' },
  { code: 'PYG', name: 'Paraguayan Guarani', flag: '🇵🇾', symbol: '₲' },
  { code: 'UYU', name: 'Uruguayan Peso', flag: '🇺🇾', symbol: '$' },
  { code: 'VES', name: 'Venezuelan Bolivar', flag: '🇻🇪', symbol: 'Bs.S.' },
  { code: 'GYD', name: 'Guyanese Dollar', flag: '🇬🇾', symbol: '$' },
  { code: 'SRD', name: 'Surinamese Dollar', flag: '🇸🇷', symbol: '$' },
  { code: 'CRC', name: 'Costa Rican Colón', flag: '🇨🇷', symbol: '₡' },
  { code: 'PAB', name: 'Panamanian Balboa', flag: '🇵🇦', symbol: 'B/.' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', flag: '🇳🇮', symbol: 'C$' },
  { code: 'HNL', name: 'Honduran Lempira', flag: '🇭🇳', symbol: 'L' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', flag: '🇬🇹', symbol: 'Q' },
  { code: 'BZD', name: 'Belize Dollar', flag: '🇧🇿', symbol: '$' },
  { code: 'SVC', name: 'Salvadoran Colón', flag: '🇸🇻', symbol: '₡' },
  { code: 'DOP', name: 'Dominican Peso', flag: '🇩🇴', symbol: '$' },
  { code: 'HTG', name: 'Haitian Gourde', flag: '🇭🇹', symbol: 'G' },
  { code: 'CUP', name: 'Cuban Peso', flag: '🇨🇺', symbol: '$' },
  { code: 'JMD', name: 'Jamaican Dollar', flag: '🇯🇲', symbol: 'J$' },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar', flag: '🇹🇹', symbol: 'TT$' },
  { code: 'BSD', name: 'Bahamian Dollar', flag: '🇧🇸', symbol: '$' },
  { code: 'BBD', name: 'Barbadian Dollar', flag: '🇧🇧', symbol: 'Bds$' },
  { code: 'XCD', name: 'East Caribbean Dollar', flag: '🇦🇬', symbol: '$' },
  { code: 'AWG', name: 'Aruban Florin', flag: '🇦🇼', symbol: 'ƒ' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', flag: '🇨🇼', symbol: 'ƒ' },
  
  // Oceania currencies
  { code: 'FJD', name: 'Fijian Dollar', flag: '🇫🇯', symbol: 'FJ$' },
  { code: 'PGK', name: 'Papua New Guinean Kina', flag: '🇵🇬', symbol: 'K' },
  { code: 'SBD', name: 'Solomon Islands Dollar', flag: '🇸🇧', symbol: 'SI$' },
  { code: 'VUV', name: 'Vanuatu Vatu', flag: '🇻🇺', symbol: 'Vt' },
  { code: 'NCF', name: 'New Caledonian Franc', flag: '🇳🇨', symbol: 'Fr' },
  { code: 'XPF', name: 'CFP Franc', flag: '🌍', symbol: 'Fr' },
  { code: 'TOP', name: 'Tongan Paʻanga', flag: '🇹🇴', symbol: 'T$' },
  { code: 'WST', name: 'Samoan Tala', flag: '🇼🇸', symbol: 'T' },
  { code: 'KID', name: 'Kiribati Dollar', flag: '🇰🇮', symbol: '$' },
  
  // Other currencies
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽' },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
  { code: 'FKP', name: 'Falkland Islands Pound', flag: '🇫🇰', symbol: '£' },
  { code: 'SHP', name: 'Saint Helena Pound', flag: '🇸🇭', symbol: '£' },
  { code: 'KYD', name: 'Cayman Islands Dollar', flag: '🇰🇾', symbol: '$' },
  
  // Precious metals and special codes
  { code: 'XAU', name: 'Gold (ounce)', flag: '🥇', symbol: 'oz' },
  { code: 'XAG', name: 'Silver (ounce)', flag: '🥈', symbol: 'oz' },
  { code: 'XPD', name: 'Palladium (ounce)', flag: '💎', symbol: 'oz' },
  { code: 'XPT', name: 'Platinum (ounce)', flag: '💎', symbol: 'oz' },
  
  // Special drawing rights
  { code: 'XDR', name: 'Special Drawing Rights', flag: '🌐', symbol: 'SDR' },
];

// Sort currencies alphabetically by name
export const CURRENCIES: CurrencyInfo[] = [...CURRENCIES_RAW].sort((a, b) => 
  a.name.localeCompare(b.name)
);

// Helper function to get currency by code
export function getCurrencyByCode(code: string): CurrencyInfo | undefined {
  return CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
}

// Helper function to search currencies
export function searchCurrencies(query: string): CurrencyInfo[] {
  const lowerQuery = query.toLowerCase();
  return CURRENCIES.filter(c => 
    c.code.toLowerCase().includes(lowerQuery) ||
    c.name.toLowerCase().includes(lowerQuery)
  );
}

