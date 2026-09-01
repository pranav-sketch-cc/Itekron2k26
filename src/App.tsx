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

const AppLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppLayout>
      <Switch>

        {/* Public pages */}
        <Route
          path="/"
          component={Home}
        />

        <Route
          path="/about"
          component={About}
        />

        <Route
          path="/events"
          component={Events}
        />

        <Route
          path="/events/:id"
          component={EventDetail}
        />

        <Route
          path="/events/:id/register"
          component={RegisterEvent as React.ComponentType}
        />

        <Route
          path="/schedule"
          component={Schedule}
        />

        <Route
          path="/sponsors"
          component={Sponsors}
        />

        {/* Authentication */}
        <Route
          path="/login"
          component={Login}
        />

        <Route
          path="/signup"
          component={SignUp}
        />

        {/* User registrations */}
        <Route
          path="/my-registrations"
          component={MyRegistrations}
        />

        {/* Digital entry pass */}
        <Route
          path="/pass/:id"
          component={DigitalPass}
        />

        {/* Fallback */}
        <Route
          component={Home}
        />

      </Switch>
    </AppLayout>
  );
}

export default App;