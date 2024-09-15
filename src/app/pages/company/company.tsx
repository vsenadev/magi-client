import React, { useState } from 'react';
import './App.scss';

interface Company {
  name: string;
  company: string;
  status: string;
}

const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [status, setStatus] = useState<string>('Active');
  const [companies, setCompanies] = useState<Company[]>([]);

  const handleAddCompany = () => {
    if (name && company) {
      const newCompany: Company = { name, company, status };
      setCompanies([...companies, newCompany]);
      // Clear inputs
      setName('');
      setCompany('');
      setStatus('Active');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Sidebar</h2>
        <p>Links</p>
      </div>
      <div className="main-content">
        <div className="input-row">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button onClick={handleAddCompany}>Add Company</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index}>
                <td>{company.name}</td>
                <td>{company.company}</td>
                <td>{company.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;