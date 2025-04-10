import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Car, 
  Plane, 
  Utensils, 
  ShoppingBag, 
  BarChart, 
  Save, 
  Share2, 
  Download, 
  RefreshCw,
  Info,
  AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

// Types for footprint calculations
interface CategoryFootprint {
  home: number;
  transportation: number;
  food: number;
  consumption: number;
}

// India-specific carbon emission factors (approximate values for demonstration)
const EMISSION_FACTORS = {
  electricity: 0.82, // kg CO2 per kWh (India's grid mix)
  lpg: 2.98, // kg CO2 per kg of LPG
  petrol: 2.3, // kg CO2 per liter
  diesel: 2.7, // kg CO2 per liter
  cng: 2.0, // kg CO2 per kg
  flight: 0.2, // kg CO2 per km per person
  train: 0.04, // kg CO2 per km per person
  bus: 0.06, // kg CO2 per km per person
  meat: 6.0, // kg CO2 per kg
  dairy: 3.0, // kg CO2 per kg
  vegetables: 0.5, // kg CO2 per kg
  processed: 2.0, // kg CO2 per kg
  clothing: 20, // kg CO2 per item
  electronics: 100, // kg CO2 per item
};

export default function CarbonFootprint() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [footprint, setFootprint] = useState<CategoryFootprint>({
    home: 0,
    transportation: 0,
    food: 0,
    consumption: 0
  });
  
  // Home inputs
  const [electricityUsage, setElectricityUsage] = useState(200); // kWh per month
  const [lpgUsage, setLpgUsage] = useState(1); // cylinders per month
  const [householdSize, setHouseholdSize] = useState(4); // people
  const [renewableEnergy, setRenewableEnergy] = useState(0); // percentage
  
  // Transportation inputs
  const [carType, setCarType] = useState('none');
  const [carDistance, setCarDistance] = useState(500); // km per month
  const [carEfficiency, setCarEfficiency] = useState(15); // km per liter
  const [flights, setFlights] = useState(0); // flights per year
  const [flightDistance, setFlightDistance] = useState(500); // average km per flight
  const [publicTransportDistance, setPublicTransportDistance] = useState(200); // km per month
  const [publicTransportType, setPublicTransportType] = useState('bus');
  
  // Food inputs
  const [dietType, setDietType] = useState('mixed');
  const [meatConsumption, setMeatConsumption] = useState(3); // meals per week
  const [dairyConsumption, setDairyConsumption] = useState(7); // servings per week
  const [localFoodPercentage, setLocalFoodPercentage] = useState(30); // percentage
  const [foodWaste, setFoodWaste] = useState(20); // percentage
  
  // Consumption inputs
  const [clothingItems, setClothingItems] = useState(10); // items per year
  const [electronicsItems, setElectronicsItems] = useState(2); // items per year
  const [recyclingRate, setRecyclingRate] = useState(30); // percentage
  const [secondHandPercentage, setSecondHandPercentage] = useState(10); // percentage
  
  // To keep track of different categories
  const [homeComplete, setHomeComplete] = useState(false);
  const [transportComplete, setTransportComplete] = useState(false);
  const [foodComplete, setFoodComplete] = useState(false);
  const [consumptionComplete, setConsumptionComplete] = useState(false);
  
  // Calculate footprint when inputs change
  useEffect(() => {
    calculateHomeFootprint();
  }, [electricityUsage, lpgUsage, householdSize, renewableEnergy]);
  
  useEffect(() => {
    calculateTransportationFootprint();
  }, [carType, carDistance, carEfficiency, flights, flightDistance, publicTransportDistance, publicTransportType]);
  
  useEffect(() => {
    calculateFoodFootprint();
  }, [dietType, meatConsumption, dairyConsumption, localFoodPercentage, foodWaste]);
  
  useEffect(() => {
    calculateConsumptionFootprint();
  }, [clothingItems, electronicsItems, recyclingRate, secondHandPercentage]);
  
  // Calculate each category's footprint
  const calculateHomeFootprint = () => {
    // Electricity (adjusted for renewable percentage)
    const electricityEmissions = (electricityUsage * EMISSION_FACTORS.electricity * (1 - renewableEnergy / 100));
    
    // LPG (average cylinder is ~14.2 kg)
    const lpgEmissions = (lpgUsage * 14.2 * EMISSION_FACTORS.lpg);
    
    // Calculate total and divide by household size for per person footprint
    const totalHomeEmissions = (electricityEmissions + lpgEmissions) / householdSize;
    
    setFootprint(prev => ({
      ...prev,
      home: Math.round(totalHomeEmissions)
    }));
  };
  
  const calculateTransportationFootprint = () => {
    let carEmissions = 0;
    if (carType !== 'none') {
      // Convert distance to liters of fuel
      const fuelConsumption = carDistance / carEfficiency;
      
      // Apply emissions factor based on car type
      if (carType === 'petrol') {
        carEmissions = fuelConsumption * EMISSION_FACTORS.petrol;
      } else if (carType === 'diesel') {
        carEmissions = fuelConsumption * EMISSION_FACTORS.diesel;
      } else if (carType === 'cng') {
        carEmissions = fuelConsumption * EMISSION_FACTORS.cng;
      } else if (carType === 'electric') {
        // Electric cars have indirect emissions from electricity
        carEmissions = fuelConsumption * 0.2 * EMISSION_FACTORS.electricity;
      }
    }
    
    // Flight emissions (divide annual flights by 12 for monthly equivalent)
    const flightEmissions = (flights / 12) * flightDistance * EMISSION_FACTORS.flight;
    
    // Public transport emissions
    let publicTransportEmissions = 0;
    if (publicTransportType === 'bus') {
      publicTransportEmissions = publicTransportDistance * EMISSION_FACTORS.bus;
    } else if (publicTransportType === 'train') {
      publicTransportEmissions = publicTransportDistance * EMISSION_FACTORS.train;
    }
    
    const totalTransportEmissions = carEmissions + flightEmissions + publicTransportEmissions;
    
    setFootprint(prev => ({
      ...prev,
      transportation: Math.round(totalTransportEmissions)
    }));
  };
  
  const calculateFoodFootprint = () => {
    let foodEmissions = 0;
    
    // Base emissions depending on diet type
    if (dietType === 'vegan') {
      foodEmissions = 100; // base monthly food footprint for vegans
    } else if (dietType === 'vegetarian') {
      foodEmissions = 200; // base for vegetarians (includes dairy)
    } else if (dietType === 'mixed') {
      foodEmissions = 300; // base for mixed diet
    } else if (dietType === 'high-meat') {
      foodEmissions = 450; // base for high-meat diet
    }
    
    // Adjust for meat consumption (for mixed and high-meat diets)
    if (dietType === 'mixed' || dietType === 'high-meat') {
      foodEmissions += meatConsumption * EMISSION_FACTORS.meat * 4; // 4 is an approximate portion size in kg per month
    }
    
    // Adjust for dairy consumption (except for vegans)
    if (dietType !== 'vegan') {
      foodEmissions += dairyConsumption * EMISSION_FACTORS.dairy * 2; // 2 is an approximate dairy consumption in kg per month
    }
    
    // Adjust for local food (reduces transportation emissions)
    foodEmissions *= (1 - (localFoodPercentage / 200)); // Divide by 200 to reduce impact (full local doesn't mean zero emissions)
    
    // Adjust for food waste
    foodEmissions *= (1 + (foodWaste / 100));
    
    setFootprint(prev => ({
      ...prev,
      food: Math.round(foodEmissions)
    }));
  };
  
  const calculateConsumptionFootprint = () => {
    // Clothing emissions (reduced by second-hand percentage)
    const clothingEmissions = clothingItems * EMISSION_FACTORS.clothing * (1 - (secondHandPercentage / 100));
    
    // Electronics emissions (monthly equivalent)
    const electronicsEmissions = (electronicsItems / 12) * EMISSION_FACTORS.electronics;
    
    // Adjustment for recycling (impacts overall waste emissions)
    const wasteEmissions = 50 * (1 - (recyclingRate / 100)); // 50 kg is a base waste emission value
    
    const totalConsumptionEmissions = clothingEmissions + electronicsEmissions + wasteEmissions;
    
    setFootprint(prev => ({
      ...prev,
      consumption: Math.round(totalConsumptionEmissions)
    }));
  };
  
  // Total footprint calculation
  const totalFootprint = footprint.home + footprint.transportation + footprint.food + footprint.consumption;
  
  // Get footprint category with highest value
  const highestCategory = Object.entries(footprint).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  
  // Navigate to the next tab
  const nextTab = () => {
    if (activeTab === 'home') {
      setActiveTab('transportation');
      setHomeComplete(true);
    } else if (activeTab === 'transportation') {
      setActiveTab('food');
      setTransportComplete(true);
    } else if (activeTab === 'food') {
      setActiveTab('consumption');
      setFoodComplete(true);
    } else if (activeTab === 'consumption') {
      setActiveTab('results');
      setConsumptionComplete(true);
      calculateResults();
    }
  };
  
  // Previous tab navigation
  const prevTab = () => {
    if (activeTab === 'transportation') {
      setActiveTab('home');
    } else if (activeTab === 'food') {
      setActiveTab('transportation');
    } else if (activeTab === 'consumption') {
      setActiveTab('food');
    } else if (activeTab === 'results') {
      setActiveTab('consumption');
    }
  };
  
  // Calculate final results
  const calculateResults = () => {
    setIsLoading(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      setShowResults(true);
      setIsLoading(false);
      
      toast({
        title: "Carbon Footprint Calculated",
        description: "Your estimated carbon footprint is " + totalFootprint + " kg CO2e per month.",
      });
    }, 1500);
  };
  
  // Reset all inputs
  const resetCalculator = () => {
    // Reset all input values to defaults
    setElectricityUsage(200);
    setLpgUsage(1);
    setHouseholdSize(4);
    setRenewableEnergy(0);
    setCarType('none');
    setCarDistance(500);
    setCarEfficiency(15);
    setFlights(0);
    setFlightDistance(500);
    setPublicTransportDistance(200);
    setPublicTransportType('bus');
    setDietType('mixed');
    setMeatConsumption(3);
    setDairyConsumption(7);
    setLocalFoodPercentage(30);
    setFoodWaste(20);
    setClothingItems(10);
    setElectronicsItems(2);
    setRecyclingRate(30);
    setSecondHandPercentage(10);
    
    // Reset completion states
    setHomeComplete(false);
    setTransportComplete(false);
    setFoodComplete(false);
    setConsumptionComplete(false);
    
    // Go back to first tab
    setActiveTab('home');
    setShowResults(false);
    
    toast({
      title: "Calculator Reset",
      description: "All values have been reset to defaults.",
    });
  };
  
  // Determine footprint rating
  const getFootprintRating = () => {
    if (totalFootprint < 400) return { label: "Low", color: "bg-green-500" };
    if (totalFootprint < 800) return { label: "Below Average", color: "bg-green-300" };
    if (totalFootprint < 1200) return { label: "Average", color: "bg-yellow-300" };
    if (totalFootprint < 1600) return { label: "Above Average", color: "bg-orange-400" };
    return { label: "High", color: "bg-red-500" };
  };
  
  // Get category-specific recommendations
  const getRecommendations = () => {
    const recommendations = {
      home: [
        "Install LED bulbs throughout your home",
        "Unplug chargers and electronics when not in use",
        "Consider installing solar panels if possible",
        "Use natural ventilation instead of AC when weather permits"
      ],
      transportation: [
        "Use public transportation more frequently",
        "Consider carpooling for regular commutes",
        "Maintain your vehicle properly for optimal fuel efficiency",
        "Combine errands to reduce total driving distance"
      ],
      food: [
        "Reduce meat consumption, especially red meat",
        "Buy locally grown, seasonal produce",
        "Plan meals to reduce food waste",
        "Compost food scraps when possible"
      ],
      consumption: [
        "Buy quality items that last longer",
        "Repair items instead of replacing them",
        "Choose products with minimal packaging",
        "Consider second-hand or refurbished options"
      ]
    };
    
    // Return recommendations for the highest category
    return recommendations[highestCategory as keyof typeof recommendations];
  };
  
  // Share results
  const shareResults = () => {
    const text = `My monthly carbon footprint is ${totalFootprint} kg CO2e. Calculate yours at NatureCert!`;
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Share your results with friends and family!",
      });
    });
  };
  
  // Calculate percentage complete for the progress bar
  const getProgressPercentage = () => {
    let completed = 0;
    if (homeComplete) completed++;
    if (transportComplete) completed++;
    if (foodComplete) completed++;
    if (consumptionComplete) completed++;
    
    return (completed / 4) * 100;
  };
  
  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">Carbon Footprint Calculator</h1>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Estimate your personal carbon footprint and discover ways to reduce your environmental impact.
            This calculator is tailored for Indian households and lifestyles.
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-neutral-600 mb-2">
            <span>Start</span>
            <span>Complete</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
          <div className="flex justify-between mt-2">
            <div className={`flex items-center ${homeComplete ? 'text-primary' : 'text-neutral-400'}`}>
              <Home className="h-4 w-4 mr-1" />
              <span className="text-xs">Home</span>
            </div>
            <div className={`flex items-center ${transportComplete ? 'text-primary' : 'text-neutral-400'}`}>
              <Car className="h-4 w-4 mr-1" />
              <span className="text-xs">Transport</span>
            </div>
            <div className={`flex items-center ${foodComplete ? 'text-primary' : 'text-neutral-400'}`}>
              <Utensils className="h-4 w-4 mr-1" />
              <span className="text-xs">Food</span>
            </div>
            <div className={`flex items-center ${consumptionComplete ? 'text-primary' : 'text-neutral-400'}`}>
              <ShoppingBag className="h-4 w-4 mr-1" />
              <span className="text-xs">Consumption</span>
            </div>
            <div className={`flex items-center ${showResults ? 'text-primary' : 'text-neutral-400'}`}>
              <BarChart className="h-4 w-4 mr-1" />
              <span className="text-xs">Results</span>
            </div>
          </div>
        </div>
        
        {/* Calculator tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="mb-8 grid grid-cols-5 w-full">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          {/* Home energy tab */}
          <TabsContent value="home">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  Home Energy Use
                </CardTitle>
                <CardDescription>
                  Enter information about your household energy consumption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Monthly Electricity Usage (kWh)</Label>
                    <span className="text-sm text-neutral-500">{electricityUsage} kWh</span>
                  </div>
                  <Slider 
                    value={[electricityUsage]} 
                    min={50} 
                    max={1000} 
                    step={10}
                    onValueChange={(value) => setElectricityUsage(value[0])}
                  />
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Low (50 kWh)</span>
                    <span>Typical (250 kWh)</span>
                    <span>High (1000 kWh)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>LPG Cylinders per Month</Label>
                    <span className="text-sm text-neutral-500">{lpgUsage} cylinder(s)</span>
                  </div>
                  <Slider 
                    value={[lpgUsage]} 
                    min={0} 
                    max={4} 
                    step={0.5}
                    onValueChange={(value) => setLpgUsage(value[0])}
                  />
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>None</span>
                    <span>1 cylinder</span>
                    <span>4 cylinders</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Household Size</Label>
                    <span className="text-sm text-neutral-500">{householdSize} people</span>
                  </div>
                  <Slider 
                    value={[householdSize]} 
                    min={1} 
                    max={10} 
                    step={1}
                    onValueChange={(value) => setHouseholdSize(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Renewable Energy Percentage</Label>
                    <span className="text-sm text-neutral-500">{renewableEnergy}%</span>
                  </div>
                  <Slider 
                    value={[renewableEnergy]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => setRenewableEnergy(value[0])}
                  />
                  <div className="text-xs text-neutral-500">
                    <span>Percentage of your electricity from renewable sources (solar panels, green energy provider)</span>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={nextTab}>
                    Next: Transportation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transportation tab */}
          <TabsContent value="transportation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="mr-2 h-5 w-5" />
                  Transportation
                </CardTitle>
                <CardDescription>
                  Enter information about your travel and commuting habits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Main Vehicle Type</Label>
                  <Select value={carType} onValueChange={setCarType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No car</SelectItem>
                      <SelectItem value="petrol">Petrol/Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="cng">CNG</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {carType !== 'none' && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Monthly Driving Distance (km)</Label>
                        <span className="text-sm text-neutral-500">{carDistance} km</span>
                      </div>
                      <Slider 
                        value={[carDistance]} 
                        min={0} 
                        max={3000} 
                        step={50}
                        onValueChange={(value) => setCarDistance(value[0])}
                      />
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>0 km</span>
                        <span>1500 km</span>
                        <span>3000 km</span>
                      </div>
                    </div>
                    
                    {carType !== 'electric' && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Fuel Efficiency (km per liter)</Label>
                          <span className="text-sm text-neutral-500">{carEfficiency} km/L</span>
                        </div>
                        <Slider 
                          value={[carEfficiency]} 
                          min={5} 
                          max={30} 
                          step={1}
                          onValueChange={(value) => setCarEfficiency(value[0])}
                        />
                        <div className="flex justify-between text-xs text-neutral-500">
                          <span>Low (5 km/L)</span>
                          <span>Average (15 km/L)</span>
                          <span>Efficient (30 km/L)</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Flights per Year</Label>
                    <span className="text-sm text-neutral-500">{flights} flights</span>
                  </div>
                  <Slider 
                    value={[flights]} 
                    min={0} 
                    max={20} 
                    step={1}
                    onValueChange={(value) => setFlights(value[0])}
                  />
                </div>
                
                {flights > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Average Flight Distance (km one-way)</Label>
                      <span className="text-sm text-neutral-500">{flightDistance} km</span>
                    </div>
                    <Slider 
                      value={[flightDistance]} 
                      min={100} 
                      max={5000} 
                      step={100}
                      onValueChange={(value) => setFlightDistance(value[0])}
                    />
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Short (100 km)</span>
                      <span>Medium (1000 km)</span>
                      <span>Long (5000 km)</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Public Transportation (km per month)</Label>
                    <span className="text-sm text-neutral-500">{publicTransportDistance} km</span>
                  </div>
                  <Slider 
                    value={[publicTransportDistance]} 
                    min={0} 
                    max={1000} 
                    step={50}
                    onValueChange={(value) => setPublicTransportDistance(value[0])}
                  />
                </div>
                
                {publicTransportDistance > 0 && (
                  <div className="space-y-2">
                    <Label>Main Public Transport Type</Label>
                    <Select value={publicTransportType} onValueChange={setPublicTransportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="train">Train/Metro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={prevTab}>
                    Previous
                  </Button>
                  <Button onClick={nextTab}>
                    Next: Food
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Food tab */}
          <TabsContent value="food">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="mr-2 h-5 w-5" />
                  Food & Diet
                </CardTitle>
                <CardDescription>
                  Enter information about your dietary habits and food choices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Primary Diet Type</Label>
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegan">Vegan (No animal products)</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian (No meat, includes dairy)</SelectItem>
                      <SelectItem value="mixed">Mixed (Some meat & dairy)</SelectItem>
                      <SelectItem value="high-meat">High-meat (Meat daily)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(dietType === 'mixed' || dietType === 'high-meat') && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Meat Meals per Week</Label>
                      <span className="text-sm text-neutral-500">{meatConsumption} meals</span>
                    </div>
                    <Slider 
                      value={[meatConsumption]} 
                      min={0} 
                      max={21} 
                      step={1}
                      onValueChange={(value) => setMeatConsumption(value[0])}
                    />
                  </div>
                )}
                
                {dietType !== 'vegan' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Dairy Servings per Week</Label>
                      <span className="text-sm text-neutral-500">{dairyConsumption} servings</span>
                    </div>
                    <Slider 
                      value={[dairyConsumption]} 
                      min={0} 
                      max={21} 
                      step={1}
                      onValueChange={(value) => setDairyConsumption(value[0])}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Local Food Percentage</Label>
                    <span className="text-sm text-neutral-500">{localFoodPercentage}%</span>
                  </div>
                  <Slider 
                    value={[localFoodPercentage]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => setLocalFoodPercentage(value[0])}
                  />
                  <div className="text-xs text-neutral-500">
                    <span>Percentage of food that is locally sourced (within 100 km)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Food Waste Percentage</Label>
                    <span className="text-sm text-neutral-500">{foodWaste}%</span>
                  </div>
                  <Slider 
                    value={[foodWaste]} 
                    min={0} 
                    max={50} 
                    step={5}
                    onValueChange={(value) => setFoodWaste(value[0])}
                  />
                  <div className="text-xs text-neutral-500">
                    <span>Percentage of purchased food that goes to waste</span>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={prevTab}>
                    Previous
                  </Button>
                  <Button onClick={nextTab}>
                    Next: Consumption
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Consumption tab */}
          <TabsContent value="consumption">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Consumption & Waste
                </CardTitle>
                <CardDescription>
                  Enter information about your shopping habits and waste management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>New Clothing Items per Year</Label>
                    <span className="text-sm text-neutral-500">{clothingItems} items</span>
                  </div>
                  <Slider 
                    value={[clothingItems]} 
                    min={0} 
                    max={50} 
                    step={1}
                    onValueChange={(value) => setClothingItems(value[0])}
                  />
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>0 items</span>
                    <span>25 items</span>
                    <span>50 items</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>New Electronics Items per Year</Label>
                    <span className="text-sm text-neutral-500">{electronicsItems} items</span>
                  </div>
                  <Slider 
                    value={[electronicsItems]} 
                    min={0} 
                    max={10} 
                    step={1}
                    onValueChange={(value) => setElectronicsItems(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Recycling Rate</Label>
                    <span className="text-sm text-neutral-500">{recyclingRate}%</span>
                  </div>
                  <Slider 
                    value={[recyclingRate]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => setRecyclingRate(value[0])}
                  />
                  <div className="text-xs text-neutral-500">
                    <span>Percentage of recyclable waste that you actually recycle</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Second-hand Purchases</Label>
                    <span className="text-sm text-neutral-500">{secondHandPercentage}%</span>
                  </div>
                  <Slider 
                    value={[secondHandPercentage]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => setSecondHandPercentage(value[0])}
                  />
                  <div className="text-xs text-neutral-500">
                    <span>Percentage of items you buy second-hand rather than new</span>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={prevTab}>
                    Previous
                  </Button>
                  <Button onClick={nextTab}>
                    Calculate Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Results tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" />
                  Your Carbon Footprint Results
                </CardTitle>
                <CardDescription>
                  {isLoading ? "Calculating your results..." : "Here's a breakdown of your estimated carbon footprint"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center p-12">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Analyzing your carbon footprint...</p>
                  </div>
                )}
                
                {showResults && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-1">
                        {totalFootprint} kg CO₂e
                      </h3>
                      <p className="text-neutral-600 mb-3">Estimated monthly carbon emissions</p>
                      <div className="inline-block">
                        <Badge className={`${getFootprintRating().color} text-white px-4 py-1`}>
                          {getFootprintRating().label} Footprint
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-500 mt-4">
                        The average Indian carbon footprint is approximately 1000 kg CO₂e per month per person.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Breakdown by Category</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Home Energy</span>
                            <span>{footprint.home} kg CO₂e ({Math.round((footprint.home / totalFootprint) * 100)}%)</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-400" 
                              style={{ width: `${(footprint.home / totalFootprint) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Transportation</span>
                            <span>{footprint.transportation} kg CO₂e ({Math.round((footprint.transportation / totalFootprint) * 100)}%)</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400" 
                              style={{ width: `${(footprint.transportation / totalFootprint) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Food & Diet</span>
                            <span>{footprint.food} kg CO₂e ({Math.round((footprint.food / totalFootprint) * 100)}%)</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-400" 
                              style={{ width: `${(footprint.food / totalFootprint) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Consumption & Waste</span>
                            <span>{footprint.consumption} kg CO₂e ({Math.round((footprint.consumption / totalFootprint) * 100)}%)</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-400" 
                              style={{ width: `${(footprint.consumption / totalFootprint) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-3">
                        <h4 className="font-medium">Recommended Actions</h4>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 ml-2 text-neutral-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">These recommendations focus on your highest impact category: {highestCategory}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <Card className="bg-neutral-50 border-neutral-200">
                        <CardContent className="pt-6">
                          <ul className="space-y-2">
                            {getRecommendations().map((recommendation, index) => (
                              <li key={index} className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                <span>{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center pt-4 gap-4">
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={resetCalculator} className="flex items-center">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset Calculator
                        </Button>
                        <Button variant="outline" onClick={shareResults} className="flex items-center">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Results
                        </Button>
                      </div>
                      
                      <Button onClick={() => {
                        toast({
                          title: "Results Saved",
                          description: "Your carbon footprint results have been saved.",
                        });
                      }} className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        Save Results
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}