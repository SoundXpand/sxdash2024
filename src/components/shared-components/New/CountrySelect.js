import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CountrySelect = ({ value, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data = await response.json();
      setCountries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setLoading(false);
    }
  };

  function onSelect(value) {
    onChange(value); // Notify parent component of the selected value
  }

  return (
    <Select
      showSearch
      placeholder="Select a country"
      optionFilterProp="children"
      onChange={onSelect}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      loading={loading}
      value={value} // Controlled value
      disabled={value !== ''} // Disable if value is not empty
    >
      {countries.map(country => (
        <Option key={country.name.common} value={country.name.common}>
          {country.name.common}
        </Option>
      ))}
    </Select>
  );
};

export default CountrySelect;
