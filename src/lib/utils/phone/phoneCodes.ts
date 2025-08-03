import countryData from 'country-telephone-data';

export const countryPhoneCodes = countryData.allCountries.map((country: { name: any; iso2: any; dialCode: any; }) => ({
  name: country.name,
  iso2: country.iso2,
  dialCode: `+${country.dialCode}`,
}));