import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Asset {
  name: string;
  weight: number;
  return: number;
  stdDev: number;
}

interface PortfolioCalculatorProps {
  onComplete?: () => void;
}

interface Results {
  expectedReturn: string;
  variance: string;
  stdDev: string;
}

export function PortfolioCalculator({ onComplete }: PortfolioCalculatorProps) {
  const [assets, setAssets] = useState<Asset[]>([
    { name: 'Asset A', weight: 60, return: 8, stdDev: 15 },
    { name: 'Asset B', weight: 40, return: 12, stdDev: 20 }
  ]);
  const [correlation, setCorrelation] = useState(0.2);
  const [results, setResults] = useState<Results | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');

  const calculatePortfolio = () => {
    // Expected Return
    const expectedReturn = assets.reduce((sum, asset) => 
      sum + (asset.weight / 100) * asset.return, 0
    );

    // Portfolio Variance (for 2-asset portfolio)
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

  const updateAsset = (index: number, field: keyof Asset, value: string) => {
    const newAssets = [...assets];
    if (field === 'name') {
      newAssets[index][field] = value;
    } else {
      newAssets[index][field] = parseFloat(value) || 0;
    }
    setAssets(newAssets);
  };

  const addAsset = () => {
    if (assets.length < 4) {
      setAssets([...assets, { 
        name: `Asset ${String.fromCharCode(65 + assets.length)}`, 
        weight: 0, 
        return: 0, 
        stdDev: 0 
      }]);
    }
  };

  const removeAsset = (index: number) => {
    if (assets.length > 2) {
      setAssets(assets.filter((_, i) => i !== index));
    }
  };

  const practiceProblems = [
    {
      question: "Portfolio with 70% in Stock A (10% return, 18% std dev) and 30% in Stock B (14% return, 25% std dev). Correlation = 0.3. Find expected return and portfolio standard deviation.",
      solution: {
        expectedReturn: "11.20%",
        stdDev: "17.85%",
        calculation: "E(R) = 0.7×10% + 0.3×14% = 11.20%\nσp = √[(0.7²×0.18²) + (0.3²×0.25²) + (2×0.7×0.3×0.18×0.25×0.3)] = 17.85%"
      }
    },
    {
      question: "Equal-weighted portfolio: Asset X (12% return, 20% std dev) and Asset Y (8% return, 15% std dev). Correlation = -0.2. Calculate portfolio metrics.",
      solution: {
        expectedReturn: "10.00%",
        stdDev: "12.36%",
        calculation: "E(R) = 0.5×12% + 0.5×8% = 10%\nσp = √[(0.5²×0.2²) + (0.5²×0.15²) + (2×0.5×0.5×0.2×0.15×(-0.2))] = 12.36%"
      }
    }
  ];

  const presetPortfolios = [
    {
      name: "Conservative",
      assets: [
        { name: "Bonds", weight: 70, return: 4, stdDev: 8 },
        { name: "Stocks", weight: 30, return: 10, stdDev: 18 }
      ],
      correlation: 0.1
    },
    {
      name: "Balanced",
      assets: [
        { name: "Stocks", weight: 60, return: 10, stdDev: 18 },
        { name: "Bonds", weight: 40, return: 4, stdDev: 8 }
      ],
      correlation: 0.1
    },
    {
      name: "Aggressive",
      assets: [
        { name: "Growth Stocks", weight: 80, return: 12, stdDev: 22 },
        { name: "Value Stocks", weight: 20, return: 8, stdDev: 16 }
      ],
      correlation: 0.6
    }
  ];

  const loadPreset = (preset: typeof presetPortfolios[0]) => {
    setAssets(preset.assets);
    setCorrelation(preset.correlation);
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Portfolio Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-4">
              <div className="space-y-4">
                {assets.map((asset, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded">
                    <div>
                      <Label>Asset Name</Label>
                      <Input
                        value={asset.name}
                        onChange={(e) => updateAsset(index, 'name', e.target.value)}
                      />
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
                    <div className="flex items-end">
                      {assets.length > 2 && (
                        <Button
                          variant="outline"
                          onClick={() => removeAsset(index)}
                          className="w-full"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex space-x-4">
                  {assets.length < 4 && (
                    <Button onClick={addAsset} variant="outline">
                      Add Asset
                    </Button>
                  )}
                </div>

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
                    <Button onClick={calculatePortfolio} className="w-full" data-testid="calculate-portfolio">
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
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid gap-4">
                {presetPortfolios.map((preset, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{preset.name} Portfolio</h3>
                          <div className="text-sm text-muted-foreground">
                            {preset.assets.map((asset, i) => (
                              <div key={i}>
                                {asset.weight}% {asset.name} ({asset.return}% return, {asset.stdDev}% risk)
                              </div>
                            ))}
                            <div>Correlation: {preset.correlation}</div>
                          </div>
                        </div>
                        <Button onClick={() => loadPreset(preset)} size="sm">
                          Load
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="practice" className="space-y-4">
              <div className="space-y-6">
                {practiceProblems.map((problem, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <p className="text-sm">{problem.question}</p>
                        <Button 
                          onClick={() => setShowSolution(showSolution === index ? -1 : index)}
                          variant="outline"
                          size="sm"
                        >
                          {showSolution === index ? 'Hide Solution' : 'Show Solution'}
                        </Button>
                        {showSolution === index && (
                          <Alert>
                            <AlertDescription>
                              <div className="space-y-2">
                                <div><strong>Expected Return:</strong> {problem.solution.expectedReturn}</div>
                                <div><strong>Portfolio Std Dev:</strong> {problem.solution.stdDev}</div>
                                <div className="mt-2 text-xs whitespace-pre-line">
                                  <strong>Calculation:</strong><br/>
                                  {problem.solution.calculation}
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onComplete} className="px-8" data-testid="complete-portfolio">
          Complete Portfolio Module
        </Button>
      </div>
    </div>
  );
}