import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Layout from "./components/Layout";
import Playground from "./pages/Playground";
import Profile from "./pages/Profile";
import Communities from "./pages/Communities";
import CommunityPage from "./pages/CommunityPage";
import NotFound from "./pages/NotFound";

import "./index.css";
import ForgetPassword from "./pages/ForgetPassword";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/forgot" element={<ForgetPassword />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route element={<Layout />}>
        <Route path="/playground/:userId" element={<Playground />} />
        <Route path="/profile/:profileId" element={<Profile />} />
        <Route path="/communities/:userId" element={<Communities />} />
        <Route path="/communities/community" element={<CommunityPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;