import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

type ImpactMetric = 'carbon' | 'water' | 'waste' | 'biodiversity';

const impactData = {
  carbon: [
    { name: 'FSC', value: 30 },
    { name: 'Organic', value: 60 },
    { name: 'Fair Trade', value: 90 },
    { name: 'Energy Star', value: 120 },
  ],
  water: [
    { name: 'FSC', value: 70 },
    { name: 'Organic', value: 110 },
    { name: 'Fair Trade', value: 50 },
    { name: 'Energy Star', value: 40 },
  ],
  waste: [
    { name: 'FSC', value: 80 },
    { name: 'Organic', value: 40 },
    { name: 'Fair Trade', value: 60 },
    { name: 'Energy Star', value: 100 },
  ],
  biodiversity: [
    { name: 'FSC', value: 120 },
    { name: 'Organic', value: 90 },
    { name: 'Fair Trade', value: 70 },
    { name: 'Energy Star', value: 30 },
  ],
};

interface ImpactChartProps {
  fullWidth?: boolean;
}

export default function ImpactChart({ fullWidth = true }: ImpactChartProps) {
  const [activeMetric, setActiveMetric] = useState<ImpactMetric>('carbon');
  
  const getButtonClass = (metric: ImpactMetric) => {
    return metric === activeMetric
      ? 'bg-primary text-white'
      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50';
  };
  
  const getMetricLabel = (metric: ImpactMetric): string => {
    switch (metric) {
      case 'carbon': return 'Carbon Reduction Impact (Million Tons CO2e)';
      case 'water': return 'Water Conservation Impact (Billion Gallons)';
      case 'waste': return 'Waste Reduction Impact (Million Tons)';
      case 'biodiversity': return 'Biodiversity Improvement (% Increase in Species)';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${fullWidth ? 'mb-8' : ''}`}>
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <Button 
          className={getButtonClass('carbon')}
          onClick={() => setActiveMetric('carbon')}
        >
          Carbon Reduction
        </Button>
        <Button 
          className={getButtonClass('water')}
          onClick={() => setActiveMetric('water')}
        >
          Water Conservation
        </Button>
        <Button 
          className={getButtonClass('waste')}
          onClick={() => setActiveMetric('waste')}
        >
          Waste Reduction
        </Button>
        <Button 
          className={getButtonClass('biodiversity')}
          onClick={() => setActiveMetric('biodiversity')}
        >
          Biodiversity
        </Button>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={impactData[activeMetric]}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value}`, '']}
              labelFormatter={(name) => `${name} Certification`}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-sm text-neutral-500">{getMetricLabel(activeMetric)}</div>
    </div>
  );
}
