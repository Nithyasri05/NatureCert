import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'wouter';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ImpactChart from '@/components/impact/impact-chart';
import ProgressRing from '@/components/impact/progress-ring';

// Yearly impact data
const yearlyData = [
  { year: 2015, value: 28 },
  { year: 2016, value: 35 },
  { year: 2017, value: 42 },
  { year: 2018, value: 50 },
  { year: 2019, value: 65 },
  { year: 2020, value: 78 },
  { year: 2021, value: 85 },
  { year: 2022, value: 95 },
  { year: 2023, value: 115 }
];

// Industry breakdown data
const industryData = [
  { name: 'Agriculture', value: 30 },
  { name: 'Manufacturing', value: 25 },
  { name: 'Energy', value: 20 },
  { name: 'Construction', value: 15 },
  { name: 'Food & Beverage', value: 10 }
];

// Colors for the pie chart
const COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9'];

export default function Impact() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <Header />
      <main>
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Environmental Impact Data</h1>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Explore how environmental certifications are making a difference in creating a more sustainable world.
            </p>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="industry">By Industry</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-4 text-center">Certification Impact Overview</h2>
                  <p className="text-neutral-600 max-w-3xl mx-auto text-center mb-8">
                    See how different certifications contribute to environmental sustainability across key metrics.
                  </p>
                  
                  <ImpactChart />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                      <ProgressRing progress={75} label="Carbon Footprint" value="75%" color="#2E7D32" />
                      <p className="text-neutral-600 text-sm">Average reduction in carbon emissions for certified products</p>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                      <ProgressRing progress={60} label="Water Usage" value="60%" color="#8D6E63" />
                      <p className="text-neutral-600 text-sm">Average water conservation rate with certified practices</p>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                      <ProgressRing progress={68} label="Waste Reduction" value="68%" color="#81C784" />
                      <p className="text-neutral-600 text-sm">Average decrease in waste produced by certified companies</p>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                      <ProgressRing progress={85} label="Biodiversity" value="85%" color="#4CAF50" />
                      <p className="text-neutral-600 text-sm">Improvement in biodiversity metrics in certified areas</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-4 text-center">Impact Trends Over Time</h2>
                  <p className="text-neutral-600 max-w-3xl mx-auto text-center mb-8">
                    Observe how the positive environmental impact of certifications has grown over the years.
                  </p>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={yearlyData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} million tons CO2e`, 'Carbon Reduction']} />
                          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center text-sm text-neutral-500">Annual Carbon Emissions Reduction (Million Tons CO2e)</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="mb-2 font-bold text-lg text-center">Growth Rate</div>
                      <div className="text-5xl font-bold text-primary text-center mb-2">+22%</div>
                      <div className="text-center text-neutral-600 text-sm">Average annual growth in certified products</div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="mb-2 font-bold text-lg text-center">Consumer Adoption</div>
                      <div className="text-5xl font-bold text-primary text-center mb-2">63%</div>
                      <div className="text-center text-neutral-600 text-sm">Consumers who prioritize eco-certifications</div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="mb-2 font-bold text-lg text-center">Business ROI</div>
                      <div className="text-5xl font-bold text-primary text-center mb-2">3.5x</div>
                      <div className="text-center text-neutral-600 text-sm">Average return on sustainability investments</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="industry">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-4 text-center">Impact By Industry</h2>
                  <p className="text-neutral-600 max-w-3xl mx-auto text-center mb-8">
                    How different industries are contributing to environmental sustainability through certifications.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-bold text-neutral-800 mb-4 text-center">Industry Distribution</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={industryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {industryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-center text-sm text-neutral-500">Percentage of certified businesses by industry</div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-bold text-neutral-800 mb-4 text-center">Industry Impact Scores</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Agriculture', score: 85 },
                              { name: 'Energy', score: 70 },
                              { name: 'Manufacturing', score: 65 },
                              { name: 'Food & Beverage', score: 60 },
                              { name: 'Construction', score: 55 },
                            ]}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="score" fill="hsl(var(--primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-center text-sm text-neutral-500">Environmental impact score (0-100)</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        <section className="py-12 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Impact Reports & Research</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">
                Access our detailed reports and research on the environmental impact of various certifications.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-neutral-800 mb-2">Annual Impact Report</h3>
                  <p className="text-neutral-600 mb-4">
                    Comprehensive analysis of certification performance across all sectors and regions.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">Updated yearly</span>
                    <Link href="/resources" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
                      View Report <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-neutral-800 mb-2">Industry Comparison Study</h3>
                  <p className="text-neutral-600 mb-4">
                    Side-by-side comparison of certification effectiveness across different industries.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">Updated quarterly</span>
                    <Link href="/resources" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
                      View Study <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-neutral-800 mb-2">ROI Calculator</h3>
                  <p className="text-neutral-600 mb-4">
                    Interactive tool to calculate the return on investment for implementing certified practices.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">Interactive tool</span>
                    <Link href="/resources" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
                      Access Tool <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button asChild variant="outline" className="border-primary text-primary bg-white hover:bg-primary hover:text-white">
                <Link href="/resources">
                  View All Research Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
