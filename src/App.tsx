import React from 'react';
import { Switch, Route } from 'wouter';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import RegisterEvent from './pages/RegisterEvent';
import Schedule from './pages/Schedule';
import Sponsors from './pages/Sponsors';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { MyRegistrations } from './pages/MyRegistrations';
import DigitalPass from './pages/DigitalPass';
import OrganizerLogin from './pages/OrganizerLogin';
import OrganizerDashboard from './pages/OrganizerDashboard';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-transparent text-white">
      <div className="site-background" aria-hidden="true">
        <div className="site-background-orb site-background-orb-red" />
        <div className="site-background-orb site-background-orb-blue" />
        <div className="site-background-orb site-background-orb-center" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/events" component={Events} />
        <Route path="/events/:id" component={EventDetail} />
        <Route
          path="/events/:id/register"
          component={RegisterEvent as React.ComponentType}
        />
        <Route path="/schedule" component={Schedule} />
        <Route path="/sponsors" component={Sponsors} />

        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />

        <Route path="/my-registrations" component={MyRegistrations} />
        <Route path="/pass/:id" component={DigitalPass} />

        <Route path="/organizer/login" component={OrganizerLogin} />
        <Route path="/organizer" component={OrganizerDashboard} />

        <Route component={Home} />
      </Switch>
    </AppLayout>
  );
}

export default App;
