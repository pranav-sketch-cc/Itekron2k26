import { Switch, Route } from 'wouter';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import RegisterEvent from './pages/RegisterEvent';
import { MyRegistrations } from './pages/MyRegistrations';

export function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/events/:eventId/register" component={RegisterEvent} />
      <Route path="/my-registrations" component={MyRegistrations} />
      <Route component={Home} />
    </Switch>
  );
}

export default App;