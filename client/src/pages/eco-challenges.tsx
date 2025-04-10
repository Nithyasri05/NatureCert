import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Calendar, Check, Clock, 
  Users, Leaf, AlertTriangle, Award, 
  ChevronDown, ChevronUp
} from 'lucide-react';

interface EcoChallenge {
  id: number;
  title: string;
  description: string;
  duration: number; // days
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'Low' | 'Medium' | 'High';
  participants: number;
  steps: string[];
  rewards: string[];
  completed: boolean;
  progress: number;
  category: string;
}

export default function EcoChallenges() {
  const [activeChallenges, setActiveChallenges] = useState<number[]>([]);
  const [expandedChallenges, setExpandedChallenges] = useState<number[]>([]);
  
  const challenges: EcoChallenge[] = [
    {
      id: 1,
      title: "Zero Waste Week",
      description: "Challenge yourself to produce zero landfill waste for an entire week by refusing, reducing, reusing, recycling, and composting.",
      duration: 7,
      difficulty: "Medium",
      impact: "High",
      participants: 1245,
      steps: [
        "Conduct a waste audit before starting",
        "Create a zero waste kit (reusable bags, containers, utensils)",
        "Plan meals to minimize packaging waste",
        "Set up a compost system for food scraps",
        "Find bulk shopping options in your area",
        "Record daily progress and challenges"
      ],
      rewards: [
        "Eco-hero badge",
        "50 green points",
        "Tree planted in your name"
      ],
      completed: false,
      progress: 0,
      category: "Waste Reduction"
    },
    {
      id: 2,
      title: "Plant-Based Month",
      description: "Adopt a plant-based diet for 30 days to reduce your carbon footprint and explore delicious plant-based cuisine.",
      duration: 30,
      difficulty: "Medium",
      impact: "High",
      participants: 842,
      steps: [
        "Research plant-based nutrition basics",
        "Stock your pantry with plant-based staples",
        "Plan a week of meals at a time",
        "Try a new vegetable or plant protein each week",
        "Join the challenge community for recipe sharing",
        "Track environmental impact of food choices"
      ],
      rewards: [
        "Plant power badge",
        "100 green points",
        "Digital cookbook of top plant-based recipes"
      ],
      completed: false,
      progress: 0,
      category: "Food & Diet"
    },
    {
      id: 3,
      title: "Plastic-Free Challenge",
      description: "Eliminate single-use plastics from your daily life for 21 days to reduce plastic pollution.",
      duration: 21,
      difficulty: "Hard",
      impact: "High",
      participants: 961,
      steps: [
        "Identify all single-use plastics you currently use",
        "Find alternatives for your top 5 plastic items",
        "Carry reusable shopping bags, water bottle, and coffee cup",
        "Learn to make DIY toiletries and cleaning products",
        "Share tips and alternatives with friends and family",
        "Track how much plastic waste you've avoided"
      ],
      rewards: [
        "Plastic fighter badge",
        "75 green points",
        "Donation to ocean cleanup organization"
      ],
      completed: false,
      progress: 0,
      category: "Waste Reduction"
    },
    {
      id: 4,
      title: "Energy Saver",
      description: "Reduce your home energy consumption by 20% over 14 days through simple habit changes and efficiency measures.",
      duration: 14,
      difficulty: "Easy",
      impact: "Medium",
      participants: 723,
      steps: [
        "Record your current energy usage as baseline",
        "Unplug electronics when not in use",
        "Switch to LED bulbs",
        "Wash clothes in cold water",
        "Adjust thermostat by 2 degrees",
        "Air-dry clothes instead of using dryer",
        "Compare before/after energy usage"
      ],
      rewards: [
        "Energy genius badge",
        "40 green points",
        "Home energy efficiency guide"
      ],
      completed: false,
      progress: 0,
      category: "Energy Conservation"
    },
    {
      id: 5,
      title: "Water Wise",
      description: "Conserve water by adopting water-saving practices for 10 days.",
      duration: 10,
      difficulty: "Easy",
      impact: "Medium",
      participants: 589,
      steps: [
        "Track current water usage",
        "Take shorter showers (5 minutes or less)",
        "Install low-flow faucet aerators",
        "Fix any leaky faucets",
        "Collect and reuse water when possible",
        "Only run full loads of laundry and dishes"
      ],
      rewards: [
        "Water protector badge",
        "30 green points",
        "Water conservation handbook"
      ],
      completed: false,
      progress: 0,
      category: "Water Conservation"
    },
    {
      id: 6,
      title: "No-Buy Month",
      description: "Avoid buying any new non-essential items for 30 days to reduce consumption and focus on sustainable living.",
      duration: 30,
      difficulty: "Medium",
      impact: "Medium",
      participants: 412,
      steps: [
        "Define your 'essential' categories",
        "Make an inventory of what you already own",
        "Create a wishlist for future intentional purchases",
        "Find creative ways to reuse and repurpose items",
        "Borrow or share instead of buying new",
        "Reflect on consumption habits weekly"
      ],
      rewards: [
        "Mindful consumer badge",
        "60 green points",
        "Minimalist living guide"
      ],
      completed: false,
      progress: 0,
      category: "Sustainable Living"
    }
  ];
  
  const toggleActive = (challengeId: number) => {
    setActiveChallenges(prev => {
      if (prev.includes(challengeId)) {
        return prev.filter(id => id !== challengeId);
      } else {
        return [...prev, challengeId];
      }
    });
  };
  
  const toggleExpanded = (challengeId: number) => {
    setExpandedChallenges(prev => {
      if (prev.includes(challengeId)) {
        return prev.filter(id => id !== challengeId);
      } else {
        return [...prev, challengeId];
      }
    });
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-purple-100 text-purple-700';
      case 'High': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Eco Challenges</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Take on environmental challenges, track your progress, and earn rewards for your positive impact on the planet.
          </p>
        </div>
        
        <div className="bg-green-50 rounded-xl overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
                <Trophy className="h-16 w-16 text-yellow-500" />
              </div>
              <div className="md:flex-1">
                <h2 className="text-2xl font-bold mb-3">Challenge Yourself to Change</h2>
                <p className="text-neutral-700 mb-4">
                  Our eco-challenges help you develop sustainable habits while having fun and earning rewards. 
                  Start with something small or dive into a major lifestyle change - every action counts!
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    <span>4,800+ active participants</span>
                  </div>
                  <div className="flex items-center">
                    <Leaf className="h-5 w-5 text-green-600 mr-2" />
                    <span>30+ challenges to choose from</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-green-600 mr-2" />
                    <span>Earn badges and rewards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-100 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-neutral-800 font-medium">Active Challenges: {activeChallenges.length}</span>
            </div>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
              My Progress Dashboard
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {challenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className={`overflow-hidden transition-all duration-300 ${
                activeChallenges.includes(challenge.id) ? 'border-green-300 bg-green-50/50' : ''
              }`}
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge className={getImpactColor(challenge.impact)}>
                          {challenge.impact} Impact
                        </Badge>
                        <Badge variant="outline">
                          {challenge.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                      <p className="text-neutral-600 mb-4">{challenge.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{challenge.duration} days</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{challenge.participants.toLocaleString()} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end space-y-4">
                      {activeChallenges.includes(challenge.id) ? (
                        <>
                          <div className="w-full max-w-[200px]">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="font-medium">{challenge.progress}%</span>
                            </div>
                            <Progress value={challenge.progress} className="h-2" />
                          </div>
                          <Button 
                            variant="destructive" 
                            onClick={() => toggleActive(challenge.id)}
                            size="sm"
                          >
                            Quit Challenge
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="default" 
                          className="w-full md:w-auto"
                          onClick={() => toggleActive(challenge.id)}
                        >
                          Start Challenge
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className="flex items-center text-neutral-500 hover:text-neutral-700 mt-4 text-sm font-medium transition-colors"
                    onClick={() => toggleExpanded(challenge.id)}
                  >
                    {expandedChallenges.includes(challenge.id) ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show Details
                      </>
                    )}
                  </button>
                  
                  {expandedChallenges.includes(challenge.id) && (
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold mb-3 flex items-center">
                            <Check className="h-5 w-5 text-green-600 mr-2" />
                            Challenge Steps
                          </h4>
                          <ol className="space-y-2 pl-8 list-decimal">
                            {challenge.steps.map((step, idx) => (
                              <li key={idx} className="text-neutral-700">{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h4 className="font-bold mb-3 flex items-center">
                            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                            Rewards
                          </h4>
                          <ul className="space-y-2 pl-8 list-disc">
                            {challenge.rewards.map((reward, idx) => (
                              <li key={idx} className="text-neutral-700">{reward}</li>
                            ))}
                          </ul>
                          
                          <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
                            <h4 className="font-bold mb-2 flex items-center">
                              <Clock className="h-5 w-5 text-neutral-700 mr-2" />
                              Commitment Required
                            </h4>
                            <p className="text-neutral-600 text-sm">
                              {challenge.difficulty === 'Easy' 
                                ? 'About 5-10 minutes per day' 
                                : challenge.difficulty === 'Medium'
                                ? 'About 15-30 minutes per day'
                                : 'About 30-60 minutes per day'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button variant="outline">Load More Challenges</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}