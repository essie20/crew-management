import { Route, Routes, Link } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import CrewPage from "./routes/CrewPage";
import ManagerPage from "./routes/ManagerPage";
import { Cloudy, Handshake, Plane, Users } from "lucide-react";

function App() {
  return (
    <>
      <div>
        <Router>
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-300">
            <Plane className="h-200 w-200 absolute z-0 m-10 opacity-50  [stroke-width: 1] stroke-white" />
            <Cloudy className="h-50 w-50 absolute right-20 top-70 z-0 m-10 opacity-50  [stroke-width: 1] stroke-white" />
            <Handshake className="h-50 w-50 absolute bottom-10 left-260 z-0 m-10 opacity-50  [stroke-width: 1] stroke-white" />
            <nav className="relative shadow-sm bg-white z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex justify-between h-16 ">
                  <div className="flex ">
                    <div className="flex-shrink-0 flex items-center">
                      <Plane className="h-8 w-8 text-blue-600" />
                      <span className="ml-2 text-xl font-bold text-gray-900">
                        Airline Crew Management
                      </span>
                    </div>
                    <div className="ml-6 flex space-x-8">
                      <Link
                        to="/"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                      >
                        <Users className="h-5 w-5 mr-1" />
                        Crew View
                      </Link>
                      <Link
                        to="/management"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                      >
                        <Plane className="h-5 w-5 mr-1" />
                        Management
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 z-20 relative ">
              <Routes>
                <Route path="/" element={<CrewPage />} />
                <Route path="/management" element={<ManagerPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;
