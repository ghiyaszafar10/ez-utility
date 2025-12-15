import React, { useState } from 'react';
import { Link2, DollarSign, Gauge, Home } from 'lucide-react';

function App() {
  const [activeFeature, setActiveFeature] = useState('home');
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [currencyLoading, setCurrencyLoading] = useState(false);
  
  const [convValue, setConvValue] = useState('1');
  const [convCategory, setConvCategory] = useState('temperature');
  const [fromUnit, setFromUnit] = useState('celsius');
  const [toUnit, setToUnit] = useState('fahrenheit');
  const [convResult, setConvResult] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://ez-utility-backend.onrender.com';

  const handleUrlShorten = async () => {
    if (!longUrl) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl })
      });
      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      alert('Error: Make sure backend is running!');
    }
    setLoading(false);
  };

  const handleCurrencyConvert = async () => {
    if (!amount) return;
    setCurrencyLoading(true);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const rate = data.rates[toCurrency];
      const result = (parseFloat(amount) * rate).toFixed(2);
      setConvertedAmount(result);
    } catch (error) {
      alert('Error fetching rates');
    }
    setCurrencyLoading(false);
  };

  const handleGeneralConvert = () => {
    if (!convValue) return;
    const val = parseFloat(convValue);
    let result = 0;

    if (convCategory === 'temperature') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') result = (val * 9/5) + 32;
      else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') result = (val - 32) * 5/9;
      else if (fromUnit === 'celsius' && toUnit === 'kelvin') result = val + 273.15;
      else if (fromUnit === 'kelvin' && toUnit === 'celsius') result = val - 273.15;
      else result = val;
    } else if (convCategory === 'speed') {
      if (fromUnit === 'kmh' && toUnit === 'mph') result = val * 0.621371;
      else if (fromUnit === 'mph' && toUnit === 'kmh') result = val * 1.60934;
      else result = val;
    } else if (convCategory === 'length') {
      if (fromUnit === 'meter' && toUnit === 'feet') result = val * 3.28084;
      else if (fromUnit === 'feet' && toUnit === 'meter') result = val / 3.28084;
      else result = val;
    }

    setConvResult(result.toFixed(4));
  };

  const unitOptions = {
    temperature: ['celsius', 'fahrenheit', 'kelvin'],
    speed: ['kmh', 'mph', 'ms'],
    length: ['meter', 'feet', 'kilometer']
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'PKR'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <nav style={{
        background: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
          EZ-Utility
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'url', icon: Link2, label: 'URL' },
            { id: 'currency', icon: DollarSign, label: 'Currency' },
            { id: 'converter', icon: Gauge, label: 'Converter' }
          ].map(feature => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              style={{
                background: activeFeature === feature.id ? '#667eea' : 'white',
                color: activeFeature === feature.id ? 'white' : '#667eea',
                border: '2px solid #667eea',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {feature.label}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {activeFeature === 'home' && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>Welcome to EZ-Utility</h1>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Your all-in-one utility toolkit. Shorten URLs, convert currencies, and convert units!
            </p>
          </div>
        )}

        {activeFeature === 'url' && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '2rem' }}>
            <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>URL Shortener</h2>
            <input
              type="text"
              placeholder="Enter long URL"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
            />
            <button
              onClick={handleUrlShorten}
              disabled={loading}
              style={{
                width: '100%',
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
            {shortUrl && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
                <strong>Short URL:</strong> <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
              </div>
            )}
          </div>
        )}

        {activeFeature === 'currency' && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '2rem' }}>
            <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Currency Converter</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '2px solid #ddd' }}
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '2px solid #ddd' }}
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={handleCurrencyConvert}
              style={{
                width: '100%',
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Convert
            </button>
            {convertedAmount && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ color: '#667eea' }}>{convertedAmount} {toCurrency}</h3>
              </div>
            )}
          </div>
        )}

        {activeFeature === 'converter' && (
          <div style={{ background: 'white', borderRadius: '10px', padding: '2rem' }}>
            <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Unit Converter</h2>
            <select
              value={convCategory}
              onChange={(e) => {
                setConvCategory(e.target.value);
                setFromUnit(unitOptions[e.target.value][0]);
                setToUnit(unitOptions[e.target.value][1]);
              }}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '2px solid #ddd',
                marginBottom: '1rem'
              }}
            >
              <option value="temperature">Temperature</option>
              <option value="speed">Speed</option>
              <option value="length">Length</option>
            </select>
            <input
              type="number"
              value={convValue}
              onChange={(e) => setConvValue(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '2px solid #ddd',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '2px solid #ddd' }}
              >
                {unitOptions[convCategory].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '2px solid #ddd' }}
              >
                {unitOptions[convCategory].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <button
              onClick={handleGeneralConvert}
              style={{
                width: '100%',
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Convert
            </button>
            {convResult && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ color: '#667eea' }}>{convResult} {toUnit}</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
