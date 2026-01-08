import { RouteTree } from "./navigation/RouteTree";
import { register } from "./navigation/routeTracker";
import './App.css'

register((eventName, payload) => {
  // Example analytics tracker
   console.log(`Analytics Tracker - Event: ${eventName}`, payload);
});

export function App() {
  return (
    <RouteTree />
  )
}
