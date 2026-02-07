import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Welcome from "@/pages/welcome";
import AuthPage from "@/pages/auth-page";
import Resources from "@/pages/resources";
import Impact from "@/pages/impact";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import DailyTips from "@/pages/daily-tips";
import EcoAlternatives from "@/pages/eco-alternatives";
import GreenNews from "@/pages/green-news";
import RecyclingGuide from "@/pages/recycling-guide";
import EcoChallenges from "@/pages/eco-challenges";
import EcoChatbot from "@/pages/eco-chatbot";
import CarbonFootprint from "@/pages/carbon-footprint";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/resources" component={Resources} />
      <Route path="/recycling-guide" component={RecyclingGuide} />

      <Route path="/home">{() => <ProtectedRoute component={Home} />}</Route>
      <Route path="/daily-tips">{() => <ProtectedRoute component={DailyTips} />}</Route>
      <Route path="/eco-alternatives">{() => <ProtectedRoute component={EcoAlternatives} />}</Route>
      <Route path="/green-news">{() => <ProtectedRoute component={GreenNews} />}</Route>
      <Route path="/eco-challenges">{() => <ProtectedRoute component={EcoChallenges} />}</Route>
      <Route path="/eco-chatbot">{() => <ProtectedRoute component={EcoChatbot} />}</Route>
      <Route path="/carbon-footprint">{() => <ProtectedRoute component={CarbonFootprint} />}</Route>
      <Route path="/impact">{() => <ProtectedRoute component={Impact} />}</Route>

      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
