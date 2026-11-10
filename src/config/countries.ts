export interface Country {
  iso: string
  name: string
  dialCode: string
  flag: string
  /** Example national number, shown as the input placeholder */
  example: string
}

export const countries: Country[] = [
  { iso: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', example: '(201) 555-0123' },
  { iso: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', example: '(204) 555-0123' },
  { iso: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', example: '7400 123456' },
  { iso: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', example: '85 012 3456' },
  { iso: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', example: '412 345 678' },
  { iso: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', example: '21 123 4567' },
  { iso: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', example: '11 98765 4321' },
  { iso: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', example: '912 345 678' },
  { iso: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', example: '612 34 56 78' },
  { iso: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', example: '6 12 34 56 78' },
  { iso: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', example: '151 23456789' },
  { iso: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', example: '312 345 6789' },
  { iso: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', example: '6 12345678' },
  { iso: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', example: '470 12 34 56' },
  { iso: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', example: '78 123 45 67' },
  { iso: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', example: '70 123 45 67' },
  { iso: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', example: '406 12 345' },
  { iso: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', example: '32 12 34 56' },
  { iso: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', example: '512 345 678' },
  { iso: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', example: '55 1234 5678' },
  { iso: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', example: '9 11 2345 6789' },
  { iso: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', example: '9 1234 5678' },
  { iso: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', example: '321 1234567' },
  { iso: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', example: '81234 56789' },
  { iso: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', example: '131 2345 6789' },
  { iso: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', example: '90 1234 5678' },
  { iso: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', example: '10 1234 5678' },
  { iso: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', example: '8123 4567' },
  { iso: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', example: '50 123 4567' },
  { iso: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', example: '71 123 4567' },
]
