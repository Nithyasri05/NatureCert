import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Welcome from "@/pages/welcome";
import AuthPage from "@/pages/auth-page";
import Certifications from "@/pages/certifications";
import CertificationDetail from "@/pages/certification-detail";
import Resources from "@/pages/resources";
import Impact from "@/pages/impact";
import About from "@/pages/about";
import Contact from "@/pages/contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/home" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/certifications" component={Certifications} />
      <Route path="/certifications/:id" component={CertificationDetail} />
      <Route path="/resources" component={Resources} />
      <Route path="/impact" component={Impact} />
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
