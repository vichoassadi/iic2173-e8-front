import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const count = 25;

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        // First get the raw text response
        const response = await axios.get(`${API_URL}/stocks`, {
          params: { page, count },
          transformResponse: [data => data] // Get raw response text
        });

        // Transform the malformed JSON into proper JSON
        const fixedJson = response.data
          .replace(/"id/g, '{"id')       // Add missing { before each object
          .replace(/\),/g, '},')         // Replace ), with },
          .replace(/\)]/g, '}]')         // Replace )] with }]
          .replace(/"\s+/g, '"')         // Remove any whitespace after quotes
          .replace(/\s+"/g, '"');        // Remove any whitespace before quotes

        // Parse the fixed JSON
        const parsedData = JSON.parse(fixedJson);
        setStocks(Array.isArray(parsedData) ? parsedData : []);
        
      } catch (error) {
        console.error('Error processing stocks data:', error);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [page]);

  // Get unique symbols from the fetched stocks
  const uniqueSymbols = [...new Set(stocks.map(stock => stock.symbol))];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="stocks-container">
      <h2>Stocks</h2>
      
      <div className="symbols-list">
        <h3>Available Symbols</h3>
        <div>
          {uniqueSymbols.map(symbol => (
            <span key={symbol} className="symbol-tag">{symbol}</span>
          ))}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.id}>
              <td>{stock.symbol}</td>
              <td>${stock.price?.toFixed(2)}</td>
              <td>{stock.short_name}</td>
              <td>{stock.quantity}</td>
              <td>{new Date(stock.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={stocks.length < count}
        >
          Next
        </button>
      </div>
    </div>
  );
}