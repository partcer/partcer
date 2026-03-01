function useCountryStates() {
    // utils/countryService.js
    const fetchCountriesWithStates = async () => {
        try {
            // First, get all countries
            const countriesResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
            const countriesData = await countriesResponse.json();

            const countries = countriesData.map(country => ({
                name: country.name.common,
                code: country.cca2,
                states: []
            })).sort((a, b) => a.name.localeCompare(b.name));

            return countries;

        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    };
    
    return fetchCountriesWithStates;
}

export default useCountryStates;