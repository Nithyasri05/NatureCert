import ImpactChart from '@/components/impact/impact-chart';
import ProgressRing from '@/components/impact/progress-ring';

export default function ImpactSection() {
  const metrics = [
    { label: 'Carbon Footprint', value: '75%', progress: 75, color: '#2E7D32', description: 'Average reduction in carbon emissions for certified products' },
    { label: 'Water Usage', value: '60%', progress: 60, color: '#8D6E63', description: 'Average water conservation rate with certified practices' },
    { label: 'Waste Reduction', value: '68%', progress: 68, color: '#81C784', description: 'Average decrease in waste produced by certified companies' },
    { label: 'Biodiversity', value: '85%', progress: 85, color: '#4CAF50', description: 'Improvement in biodiversity metrics in certified areas' },
  ];

  return (
    <section className="py-12 md:py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Environmental Impact Visualization</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">See how different certifications contribute to reducing environmental impact across various industries and regions.</p>
        </div>
        
        <ImpactChart />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <ProgressRing
                  progress={metric.progress}
                  label={metric.label}
                  value={metric.value}
                  color={metric.color}
                />
              </div>
              <p className="text-neutral-600 text-sm">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
