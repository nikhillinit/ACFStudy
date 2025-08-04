import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

const PortfolioCalculator = ({ onComplete }) => {
  const [assets, setAssets] = useState([
    { name: 'Asset A', weight: 60, return: 8, stdDev: 15 },
    { name: 'Asset B', weight: 40, return: 12, stdDev: 20 }
  ]);
  const [correlation, setCorrelation] = useState(0.2);
  const [results, setResults] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const calculatePortfolio = () => {
    // Expected Return
    const expectedReturn = assets.reduce((sum, asset) => 
      sum + (asset.weight / 100) * asset.return, 0
    );

    // Portfolio Variance
    const w1 = assets[0].weight / 100;
    const w2 = assets[1].weight / 100;
    const sigma1 = assets[0].stdDev / 100;
    const sigma2 = assets[1].stdDev / 100;
    
    const portfolioVariance = 
      Math.pow(w1, 2) * Math.pow(sigma1, 2) +
      Math.pow(w2, 2) * Math.pow(sigma2, 2) +
      2 * w1 * w2 * sigma1 * sigma2 * correlation;

    const portfolioStdDev = Math.sqrt(portfolioVariance) * 100;

    setResults({
      expectedReturn: expectedReturn.toFixed(2),
      variance: (portfolioVariance * 10000).toFixed(2),
      stdDev: portfolioStdDev.toFixed(2)
    });
  };

  const updateAsset = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = parseFloat(value) || 0;
    setAssets(newAssets);
  };

  const practiceProblems = [
    {
      question: "Portfolio with 70% in Stock A (10% return, 18% std dev) and 30% in Stock B (14% return, 25% std dev). Correlation = 0.3. Find expected return and portfolio standard deviation.",
      solution: {
        expectedReturn: "11.20%",
        stdDev: "17.85%",
        calculation: "E(R) = 0.7×10% + 0.3×14% = 11.20%\nσp = √[(0.7²×0.18²) + (0.3²×0.25²) + (2×0.7×0.3×0.18×0.25×0.3)] = 17.85%"
      }
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Portfolio Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assets.map((asset, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded">
              <div>
                <Label>{asset.name}</Label>
              </div>
              <div>
                <Label>Weight (%)</Label>
                <Input
                  type="number"
                  value={asset.weight}
                  onChange={(e) => updateAsset(index, 'weight', e.target.value)}
                />
              </div>
              <div>
                <Label>Return (%)</Label>
                <Input
                  type="number"
                  value={asset.return}
                  onChange={(e) => updateAsset(index, 'return', e.target.value)}
                />
              </div>
              <div>
                <Label>Std Dev (%)</Label>
                <Input
                  type="number"
                  value={asset.stdDev}
                  onChange={(e) => updateAsset(index, 'stdDev', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Correlation Coefficient</Label>
              <Input
                type="number"
                step="0.1"
                min="-1"
                max="1"
                value={correlation}
                onChange={(e) => setCorrelation(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={calculatePortfolio} className="w-full">
                Calculate Portfolio Metrics
              </Button>
            </div>
          </div>

          {results && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <div><strong>Expected Return:</strong> {results.expectedReturn}%</div>
                  <div><strong>Portfolio Variance:</strong> {results.variance} (basis points)</div>
                  <div><strong>Portfolio Std Deviation:</strong> {results.stdDev}%</div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practice Problem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">{practiceProblems[0].question}</p>
            <Button 
              onClick={() => setShowSolution(!showSolution)}
              variant="outline"
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
            {showSolution && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <div><strong>Expected Return:</strong> {practiceProblems[0].solution.expectedReturn}</div>
                    <div><strong>Portfolio Std Dev:</strong> {practiceProblems[0].solution.stdDev}</div>
                    <div className="mt-2 text-xs whitespace-pre-line">
                      <strong>Calculation:</strong><br/>
                      {practiceProblems[0].solution.calculation}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onComplete} className="px-8">
          Complete Portfolio Module
        </Button>
      </div>
    </div>
  );
};

export default PortfolioCalculator;

