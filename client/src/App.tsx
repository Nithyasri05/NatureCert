import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Welcome from "@/pages/welcome";
import AuthPage from "@/pages/auth-page";
import Resources from "@/pages/resources";
import Impact from "@/pages/impact";
import Contact from "@/pages/contact";
import DailyTips from "@/pages/daily-tips";
import EcoAlternatives from "@/pages/eco-alternatives";
import GreenNews from "@/pages/green-news";
import RecyclingGuide from "@/pages/recycling-guide";
import EcoChallenges from "@/pages/eco-challenges";
import CarbonFootprint from "@/pages/carbon-footprint";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EcoAssistantWidget from '@/components/chat/eco-assistant-widget';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/home">{() => <ProtectedRoute component={Home} />}</Route>
      <Route path="/daily-tips">{() => <ProtectedRoute component={DailyTips} />}</Route>
      <Route path="/eco-alternatives">{() => <ProtectedRoute component={EcoAlternatives} />}</Route>
      <Route path="/green-news">{() => <ProtectedRoute component={GreenNews} />}</Route>
      <Route path="/eco-challenges">{() => <ProtectedRoute component={EcoChallenges} />}</Route>
      <Route path="/carbon-footprint">{() => <ProtectedRoute component={CarbonFootprint} />}</Route>
      <Route path="/impact">{() => <ProtectedRoute component={Impact} />}</Route>
      <Route path="/resources">{() => <ProtectedRoute component={Resources} />}</Route>
      <Route path="/recycling-guide">{() => <ProtectedRoute component={RecyclingGuide} />}</Route>
      <Route path="/contact">{() => <ProtectedRoute component={Contact} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const showAssistant = location !== "/" && location !== "/auth";

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      {showAssistant && <EcoAssistantWidget />}
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
