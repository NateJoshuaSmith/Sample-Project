import React, { useState, useEffect } from 'react';

const App = () => {
  const [content, setContent] = useState('');
  const [data, setData] = useState([]);

  // Fetch existing data from the Flask backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Post data to Flask backend using fetch
    fetch('http://127.0.0.1:5000/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
      .then(response => response.json())
      .then(newData => {
        setData([...data, newData]); // Add the new data to the state
        setContent(''); // Clear the input field
      })
      .catch(error => console.error('Error adding data:', error));
  };

  return (
    <div>
      <h1>React Flask SQLite Example</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter some text"
          required
        />
        <button type="submit">Add Data</button>
      </form>

      <h2>Stored Data:</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
