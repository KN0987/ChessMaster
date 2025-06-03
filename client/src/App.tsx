import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/layout/Layout";
import Loading from "./components/ui/Loading";

// Lazy load pages for better performance
const Play = lazy(() => import("./pages/Play"));
const Profile = lazy(() => import("./pages/Profile"));
const SinglePlayer = lazy(() => import("./pages/SinglePlayer"));
const MultiPlayer = lazy(() => import("./pages/MultiPlayer"));
const LocalMultiPlayer = lazy(() => import("./pages/LocalMultiPlayer"));
const GameRoom = lazy(() => import("./pages/GameRoom"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Play />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/play/single" element={<SinglePlayer />} />
            <Route path="/play/multi" element={<MultiPlayer />} />
            <Route path="/play/local" element={<LocalMultiPlayer />} />
            <Route path="/game/:roomId" element={<GameRoom />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App