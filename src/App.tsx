import { AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { BookingProvider } from "./components/Booking";
import { LivePathContext, MobileBar, Nav, Page } from "./components/Chrome";
import Home from "./pages/Home";
import Menu from "./pages/Menu";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <BookingProvider>
        <Nav />
        <LivePathContext.Provider value={location.pathname}>
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/menu"
              element={
                <Page>
                  <Menu />
                </Page>
              }
            />
            <Route
              path="*"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
          </Routes>
        </AnimatePresence>
        </LivePathContext.Provider>
        <MobileBar />
      </BookingProvider>
    </MotionConfig>
  );
}
