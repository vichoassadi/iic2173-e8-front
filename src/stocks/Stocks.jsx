import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const count = 25;

  // Fetch stocks from existing API
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        console.log("Fetching stocks...");
        const response = await axios.get(`${API_URL}/stocks`, {
          params: { page, count }
        });
        console.log("API Response:", response);
        setStocks(response.data);
      } catch (error) {
        console.error('Full error:', error);
        console.log('Error response:', error.response);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, [page]);

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
              <td>${stock.price.toFixed(2)}</td>
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