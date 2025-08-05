import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIStudyCompanion } from "@/components/AIStudyCompanion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Practice from "@/pages/practice";
import Learning from "@/pages/learning-new";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/practice" component={Practice} />
      <Route path="/learning" component={Learning} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <AIStudyCompanion />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
