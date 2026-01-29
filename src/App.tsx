import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import FocusingPage from "./pages/FocusingPage/FocusingPage";
import BrainstormingPage from "./pages/BrainStormingPage/BrainstormingPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import GroupDetailPage from "./pages/GroupDetailPage/GroupDetailPage";
import StudyPage from "./pages/StudyPage/StudyPage";
import GroupStudyPage from "./pages/GroupStudyPage/GroupStudyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/focusing" element={<FocusingPage />} />
          <Route path="/focusing/study/:documentId" element={<StudyPage />} />
          <Route path="/brainstorming" element={<BrainstormingPage />} />
          <Route path="/brainstorming/group/:groupId" element={<GroupDetailPage />} />
          <Route path="/brainstorming/group/:groupId/work/:workId" element={<GroupStudyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
