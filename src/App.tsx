import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { RegisterEvent } from './pages/RegisterEvent';
import { Login } from './pages/Login';
import { Signup } from './pages/SignUp'; // Corrected named import
import { AuthCallback } from './pages/AuthCallback';
import { MyRegistrations } from './pages/MyRegistrations';
import { DigitalPass } from './pages/DigitalPass';
import { Schedule } from './pages/Schedule';
import { Sponsors } from './pages/Sponsors';
import { OrganizerLogin } from './pages/OrganizerLogin';
import { OrganizerDashboard } from './pages/OrganizerDashboard';

export function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col justify-between selection:bg-red-600 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/events" component={Events} />
            <Route path="/events/:id" component={EventDetail} />
            <Route path="/register/:id" component={RegisterEvent} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/auth/callback" component={AuthCallback} />
            <Route path="/my-registrations" component={MyRegistrations} />
            <Route path="/pass/:id" component={DigitalPass} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/sponsors" component={Sponsors} />
            <Route path="/organizer/login" component={OrganizerLogin} />
            <Route path="/organizer" component={OrganizerDashboard} />
            <Route>
              <div className="min-h-screen pt-32 text-center text-slate-400">
                <h1 className="text-4xl font-bold text-white mb-2">404</h1>
                <p className="text-xs">Page Not Found</p>
              </div>
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;