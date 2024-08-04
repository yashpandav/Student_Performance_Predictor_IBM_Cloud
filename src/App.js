import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [showInfo, setShowInfo] = useState(false);
  const [formData, setFormData] = useState({
    hoursStudied: '',
    previousScores: '',
    extracurricularActivities: false,
    sleepHours: '',
    sampleQuestionsPracticed: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  async function main(payload) {
    try {
      const response = await axios.post('http://localhost:2000/api/predict', payload);
      return response.data.predictions[0].values[0];
    } catch (error) {
      console.error("An error occurred:", error.message);
      throw error;
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const payload = {
        input_data: [{
          fields: ["Hours Studied", "Previous Scores", "Extracurricular Activities", "Sleep Hours", "Sample Question Papers Practiced"],
          values: [
            [
              parseFloat(formData.hoursStudied),
              parseFloat(formData.previousScores),
              formData.extracurricularActivities ? 'Yes' : 'No',
              parseFloat(formData.sleepHours),
              parseFloat(formData.sampleQuestionsPracticed)
            ]
          ]
        }]
      };
      const scoringResponse = await main(payload);

      if (Array.isArray(scoringResponse) && scoringResponse.length > 0) {
        setPrediction(parseFloat(scoringResponse[0].toFixed(2)));
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error('Error predicting performance:', error);
      alert('An error occurred while predicting performance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <h1 className="title">Student Performance Predictor</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="hoursStudied">Average Hours Studied</label>
              <input
                type="number"
                id="hoursStudied"
                name="hoursStudied"
                value={formData.hoursStudied}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="previousScores">Previous Scores</label>
              <input
                type="number"
                id="previousScores"
                name="previousScores"
                value={formData.previousScores}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="sleepHours">Average Sleep Hours</label>
              <input
                type="number"
                id="sleepHours"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="sampleQuestionsPracticed">Sample Questions Practiced</label>
              <input
                type="number"
                id="sampleQuestionsPracticed"
                name="sampleQuestionsPracticed"
                value={formData.sampleQuestionsPracticed}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="switch-container">
            <input
              type="checkbox"
              id="extracurricularActivities"
              name="extracurricularActivities"
              checked={formData.extracurricularActivities}
              onChange={handleInputChange}
            />
            <label htmlFor="extracurricularActivities" className="switch-label">
              Extracurricular Activities
            </label>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Predicting...
              </>
            ) : (
              'Predict Performance'
            )}
          </button>
        </form>

        {prediction !== null && (
          <div className="result-container">
            <h2 className="result-title">Predicted Performance</h2>
            <p className="result-value">{prediction ? prediction.toFixed(2) : 'No prediction available'}</p>
          </div>
        )}
      </div>
      <button className="info-button" onClick={toggleInfo}>?</button>

      {showInfo && (
        <div className="info-modal">
          <h2>Project Information</h2>
          <h3>API Reference</h3>
          <p>Watson Model Public Url : <a>https://us-south.ml.cloud.ibm.com/ml/v4/deployments/8b8ed81c-7ffd-4180-a44b-02ba9f7e0cce/predictions?version=2021-05-01</a></p>
          <h3>How to Fill Details</h3>
          <ul>
            <li>Average Hours Studied: Enter the average number of hours studied per day.</li>
            <li>Previous Scores: Enter the average score from previous exams (0-100).</li>
            <li>Sleep Hours: Enter the average number of sleep hours per day.</li>
            <li>Sample Questions Practiced: Enter the number of sample questions practiced.</li>
            <li>Extracurricular Activities: Check if participating in extracurricular activities.</li>
          </ul>

          <h3>Accuracy Warning</h3>
          <p>Please note that this is a predictive model and results may vary. The accuracy of predictions depends on the quality and quantity of training data used.</p>

          <h3>Credits</h3>
          <p>This project utilizes:</p>
          <ul>
            <li>IBM Cloud</li>
            <li>Watson Studio</li>
            <li>Dataset from Kaggle</li>
          </ul>

          <p>Created by: Yash Pandav</p>
          <div className="social-icons">
            <a href="https://github.com/yashpandav" target="_blank" rel="noopener noreferrer" title="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/yash-pandav/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
          
          <button className="close-info-button" onClick={toggleInfo}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;