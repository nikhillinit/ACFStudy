import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const BondCalculator = ({ onComplete }) => {
  const [bondData, setBondData] = useState({
    faceValue: 1000,
    couponRate: 5,
    yearsToMaturity: 4,
    currentPrice: 950,
    ytm: 0
  });

  const [stockData, setStockData] = useState({
    buyPrice: 20,
    sellPrice: 22,
    dividend: 1
  });

  const [results, setResults] = useState({});
  const [activeTab, setActiveTab] = useState('bond-ytm');

  // YTM calculation using approximation formula
  const calculateYTM = () => {
    const { faceValue, couponRate, yearsToMaturity, currentPrice } = bondData;
    const annualCoupon = (couponRate / 100) * faceValue;
    
    // Approximation formula for YTM
    const numerator = annualCoupon + (faceValue - currentPrice) / yearsToMaturity;
    const denominator = (faceValue + currentPrice) / 2;
    const ytmApprox = (numerator / denominator) * 100;
    
    setResults({
      ...results,
      ytm: ytmApprox.toFixed(2),
      currentYield: ((annualCoupon / currentPrice) * 100).toFixed(2)
    });
  };

  // Bond price calculation given YTM
  const calculateBondPrice = () => {
    const { faceValue, couponRate, yearsToMaturity, ytm } = bondData;
    const annualCoupon = (couponRate / 100) * faceValue;
    const discountRate = ytm / 100;
    
    let presentValue = 0;
    
    // Present value of coupon payments
    for (let t = 1; t <= yearsToMaturity; t++) {
      presentValue += annualCoupon / Math.pow(1 + discountRate, t);
    }
    
    // Present value of face value
    presentValue += faceValue / Math.pow(1 + discountRate, yearsToMaturity);
    
    setResults({
      ...results,
      bondPrice: presentValue.toFixed(2)
    });
  };

  // Stock total return calculation
  const calculateStockReturn = () => {
    const { buyPrice, sellPrice, dividend } = stockData;
    const totalReturn = ((sellPrice - buyPrice + dividend) / buyPrice) * 100;
    const dividendYield = (dividend / buyPrice) * 100;
    const capitalGain = ((sellPrice - buyPrice) / buyPrice) * 100;
    
    setResults({
      ...results,
      totalReturn: totalReturn.toFixed(2),
      dividendYield: dividendYield.toFixed(2),
      capitalGain: capitalGain.toFixed(2)
    });
  };

  const practiceProblems = [
    {
      type: 'bond',
      question: "Bond purchased at $950, 5% annual coupon, $1,000 face value, 4 years to maturity. What is the YTM?",
      answer: "6.24%",
      solution: "Using approximation: YTM ≈ [50 + (1000-950)/4] / [(1000+950)/2] = 62.5/975 = 6.41%"
    },
    {
      type: 'stock',
      question: "Buy stock at $20, receive $1 dividend, sell at $22. What is your total return?",
      answer: "15.00%",
      solution: "Total Return = (22 - 20 + 1) / 20 = 3/20 = 15%"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bond & Equity Valuation Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bond-ytm">Bond YTM</TabsTrigger>
              <TabsTrigger value="bond-price">Bond Price</TabsTrigger>
              <TabsTrigger value="stock-return">Stock Return</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bond-ytm" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Face Value ($)</Label>
                  <Input
                    type="number"
                    value={bondData.faceValue}
                    onChange={(e) => setBondData({...bondData, faceValue: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Coupon Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={bondData.couponRate}
                    onChange={(e) => setBondData({...bondData, couponRate: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Years to Maturity</Label>
                  <Input
                    type="number"
                    value={bondData.yearsToMaturity}
                    onChange={(e) => setBondData({...bondData, yearsToMaturity: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Current Price ($)</Label>
                  <Input
                    type="number"
                    value={bondData.currentPrice}
                    onChange={(e) => setBondData({...bondData, currentPrice: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={calculateYTM} className="w-full">
                Calculate YTM
              </Button>
              {results.ytm && (
                <Alert>
                  <AlertDescription>
                    <div><strong>Yield to Maturity:</strong> {results.ytm}%</div>
                    <div><strong>Current Yield:</strong> {results.currentYield}%</div>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="bond-price" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Face Value ($)</Label>
                  <Input
                    type="number"
                    value={bondData.faceValue}
                    onChange={(e) => setBondData({...bondData, faceValue: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Coupon Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={bondData.couponRate}
                    onChange={(e) => setBondData({...bondData, couponRate: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Years to Maturity</Label>
                  <Input
                    type="number"
                    value={bondData.yearsToMaturity}
                    onChange={(e) => setBondData({...bondData, yearsToMaturity: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Required YTM (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={bondData.ytm}
                    onChange={(e) => setBondData({...bondData, ytm: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={calculateBondPrice} className="w-full">
                Calculate Bond Price
              </Button>
              {results.bondPrice && (
                <Alert>
                  <AlertDescription>
                    <strong>Bond Price:</strong> ${results.bondPrice}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="stock-return" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Buy Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={stockData.buyPrice}
                    onChange={(e) => setStockData({...stockData, buyPrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Sell Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={stockData.sellPrice}
                    onChange={(e) => setStockData({...stockData, sellPrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Dividend ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={stockData.dividend}
                    onChange={(e) => setStockData({...stockData, dividend: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={calculateStockReturn} className="w-full">
                Calculate Total Return
              </Button>
              {results.totalReturn && (
                <Alert>
                  <AlertDescription>
                    <div><strong>Total Return:</strong> {results.totalReturn}%</div>
                    <div><strong>Dividend Yield:</strong> {results.dividendYield}%</div>
                    <div><strong>Capital Gain:</strong> {results.capitalGain}%</div>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practice Problems</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {practiceProblems.map((problem, index) => (
            <div key={index} className="p-4 border rounded">
              <p className="text-sm mb-2">{problem.question}</p>
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600">Show Solution</summary>
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <div><strong>Answer:</strong> {problem.answer}</div>
                  <div><strong>Solution:</strong> {problem.solution}</div>
                </div>
              </details>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onComplete} className="px-8">
          Complete Bond Valuation Module
        </Button>
      </div>
    </div>
  );
};

export default BondCalculator;

