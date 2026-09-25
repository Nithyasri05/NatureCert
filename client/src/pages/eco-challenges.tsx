import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageFrame, PageIntro } from '@/components/layout/page-frame';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Calendar, Check, Clock, 
  Users, Leaf, AlertTriangle, 
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface EcoChallenge {
  id: number;
  title: string;
  description: string;
  duration: number; // days
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'Low' | 'Medium' | 'High';
  steps: string[];
  completed?: boolean;
  progress?: number;
  category: string;
}

interface ChallengeParticipation {
  id: number;
  challengeId: number;
  progress: number;
  completed: boolean;
  startDate: string;
  completionDate?: string | null;
}

export default function EcoChallenges() {
  const [expandedChallenges, setExpandedChallenges] = useState<number[]>([]);
  const [joiningChallengeId, setJoiningChallengeId] = useState<number | null>(null);
  const [participationByChallenge, setParticipationByChallenge] = useState<Record<number, ChallengeParticipation>>({});
  const { toast } = useToast();
  
  const { data: challenges = [], isLoading, isError, refetch } = useQuery<EcoChallenge[]>({
    queryKey: ['/api/challenges'],
    queryFn: async () => {
      const res = await fetch('/api/challenges');
      if (!res.ok) throw new Error('Failed to fetch eco challenges');
      return res.json();
    }
  });

  const { data: participation = [] } = useQuery<ChallengeParticipation[]>({
    queryKey: ['/api/me/challenges'],
    queryFn: async () => {
      const res = await fetch('/api/me/challenges', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch your challenge progress');
      return res.json();
    },
    refetchInterval: 15 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setParticipationByChallenge(
      Object.fromEntries(participation.map((item) => [item.challengeId, item])),
    );
  }, [participation]);

  const activeChallenges = Object.keys(participationByChallenge).map(Number);
  const completedChallenges = Object.values(participationByChallenge).filter((item) => item.completed).length;
  
  const toggleActive = async (challengeId: number) => {
    if (participationByChallenge[challengeId]) {
      setExpandedChallenges(prev => prev.includes(challengeId) ? prev : [...prev, challengeId]);
      return;
    }

    setJoiningChallengeId(challengeId);
    try {
      const response = await fetch('/api/challenges/join', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });
      if (!response.ok) throw new Error('Could not start this challenge');
      const joined: ChallengeParticipation = await response.json();
      setParticipationByChallenge(prev => ({ ...prev, [challengeId]: joined }));
      setExpandedChallenges(prev => prev.includes(challengeId) ? prev : [...prev, challengeId]);
      toast({ title: 'Challenge started', description: 'Your progress is now saved to your profile.' });
    } catch (error) {
      toast({ title: 'Could not start challenge', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setJoiningChallengeId(null);
    }
  };

  const completeStep = async (challenge: EcoChallenge, stepIndex: number) => {
    const current = participationByChallenge[challenge.id];
    if (!current) {
      toast({ title: 'Start this challenge first', description: 'Your progress will be saved after you join.', variant: 'destructive' });
      return;
    }

    const completedSteps = Math.round((current.progress / 100) * challenge.steps.length);
    if (stepIndex > completedSteps) {
      toast({ title: 'Complete steps in order', description: 'Finish the previous step before moving ahead.' });
      return;
    }
    if (stepIndex < completedSteps) return;

    const nextProgress = Math.round(((stepIndex + 1) / challenge.steps.length) * 100);
    setParticipationByChallenge(prev => ({
      ...prev,
      [challenge.id]: { ...current, progress: nextProgress, completed: nextProgress === 100 },
    }));

    try {
      const response = await fetch(`/api/challenges/${challenge.id}/progress`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: nextProgress }),
      });
      if (!response.ok) throw new Error('Could not save progress');
      const saved: ChallengeParticipation = await response.json();
      setParticipationByChallenge(prev => ({ ...prev, [challenge.id]: saved }));
      if (saved.completed) toast({ title: 'Challenge complete!', description: 'You completed every step of this challenge.' });
    } catch (error) {
      setParticipationByChallenge(prev => ({ ...prev, [challenge.id]: current }));
      toast({ title: 'Progress was not saved', description: 'Please try the step again.', variant: 'destructive' });
    }
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
    <PageFrame>
      <PageIntro eyebrow="Build a habit together" title="Eco Challenges" description="Choose a focused action, track the steps, and make progress you can actually repeat." />
        
        <div className="bg-green-50 rounded-xl overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
                <Trophy className="h-16 w-16 text-yellow-500" />
              </div>
              <div className="md:flex-1">
                <h2 className="text-2xl font-bold mb-3">Challenge Yourself to Change</h2>
                <p className="text-neutral-700 mb-4">
                  Our eco-challenges help you develop sustainable habits through small, repeatable actions. 
                  Start with one change or work through several challenges at your own pace.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    <span>{challenges.length} available challenges</span>
                  </div>
                  <div className="flex items-center">
                    <Leaf className="h-5 w-5 text-green-600 mr-2" />
                    <span>{activeChallenges.length} challenges in progress</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span>{completedChallenges} challenges completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-100 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-neutral-800 font-medium">Active Challenges: {activeChallenges.length}</span>
              <span className="text-neutral-600 text-sm ml-4">Completed: {completedChallenges}</span>
            </div>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => document.getElementById('my-progress')?.scrollIntoView({ behavior: 'smooth' })}>
              My Progress Dashboard
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full bg-green-500 animate-bounce"></div></div>
          ) : isError ? (
            <div className="text-center p-12">
              <p className="text-neutral-600 mb-4">We couldn&apos;t load eco challenges.</p>
              <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : challenges.length === 0 ? (
            <p className="text-center text-neutral-600 p-12">No eco challenges are available yet.</p>
        ) : (
          <div id="my-progress" className="grid grid-cols-1 gap-6">
          {challenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className={`overflow-hidden transition-all duration-300 ${
                participationByChallenge[challenge.id] ? 'border-green-300 bg-green-50/50' : ''
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
                          <Check className="h-4 w-4 mr-1" />
                          <span>{challenge.steps.length} steps</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end space-y-4">
                      {participationByChallenge[challenge.id] ? (
                        <>
                          <div className="w-full max-w-[200px]">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="font-medium">{participationByChallenge[challenge.id].progress}%</span>
                            </div>
                            <Progress value={participationByChallenge[challenge.id].progress} className="h-2" />
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => toggleActive(challenge.id)}
                            size="sm"
                          >
                            View Progress
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="default" 
                          className="w-full md:w-auto"
                          onClick={() => toggleActive(challenge.id)}
                          disabled={joiningChallengeId === challenge.id}
                        >
                          {joiningChallengeId === challenge.id ? 'Starting...' : 'Start Challenge'}
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
                          <ol className="space-y-3">
                            {challenge.steps.map((step, idx) => (
                              <li key={idx}>
                                <label className={`flex items-start gap-3 rounded-lg p-2 transition-colors ${
                                  participationByChallenge[challenge.id] && idx < Math.round((participationByChallenge[challenge.id].progress / 100) * challenge.steps.length)
                                    ? 'bg-green-50 text-green-800'
                                    : 'text-neutral-700'
                                }`}>
                                  <Checkbox
                                    checked={Boolean(participationByChallenge[challenge.id] && idx < Math.round((participationByChallenge[challenge.id].progress / 100) * challenge.steps.length))}
                                    disabled={!participationByChallenge[challenge.id] || idx !== Math.round((participationByChallenge[challenge.id].progress / 100) * challenge.steps.length)}
                                    onCheckedChange={() => completeStep(challenge, idx)}
                                  />
                                  <span>{step}</span>
                                </label>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
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
        )}
        
    </PageFrame>
  );
}