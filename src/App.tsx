// I-TEKRON 2K26 — "Tension in the Skyline": dark cinematic shell for the Phase 1 hero.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Schedule from "./pages/Schedule";
import Sponsors from "./pages/Sponsors";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import RegistrationStatus from "./pages/RegistrationStatus";
import DigitalPass from "./pages/DigitalPass";
import OrganizerCheckin from "./pages/OrganizerCheckin";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import MyPasses from "./pages/MyPasses";
import { Login, SignUp, SupabaseConfirmationCallback } from "./pages/ParticipantAuth";
import { AuthProvider } from "./contexts/AuthContext";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/events/:eventId" component={EventDetail} />
      <Route path="/events" component={Events} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/sponsors" component={Sponsors} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/register" component={Register} />
      <Route path="/registration-status" component={RegistrationStatus} />
      <Route path="/digital-pass" component={DigitalPass} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/auth/callback" component={SupabaseConfirmationCallback} />
      <Route path="/my-passes" component={MyPasses} />
      <Route path="/organizer-checkin" component={OrganizerCheckin} />
      <Route path="/organizer-dashboard" component={OrganizerDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider><TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider></AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
