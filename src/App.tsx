import React from 'react';
import { Route, Switch } from 'wouter';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { RegisterEvent } from './pages/RegisterEvent';
import { Schedule } from './pages/Schedule';
import { Sponsors } from './pages/Sponsors';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { AuthCallback } from './pages/AuthCallback';
import { MyRegistrations } from './pages/MyRegistrations';
import { DigitalPass } from './pages/DigitalPass';
import { OrganizerLogin } from './pages/OrganizerLogin';
import { OrganizerDashboard } from './pages/OrganizerDashboard';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/events" component={Events} />
          <Route path="/events/:id" component={EventDetail} />
          <Route path="/events/:id/register" component={RegisterEvent} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/sponsors" component={Sponsors} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/my-registrations" component={MyRegistrations} />
          <Route path="/pass/:registrationId" component={DigitalPass} />
          <Route path="/organizer/login" component={OrganizerLogin} />
          <Route path="/organizer" component={OrganizerDashboard} />
          <Route>
            <div className="min-h-screen pt-32 text-center text-slate-400 text-sm">
              404 — Page Not Found
            </div>
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}