import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SubmitPaper from "./pages/SubmitPaper"
import CreateConference from "./pages/CreateConference"
import ViewConferences from "./pages/ViewConferences"
import ConferenceDetails from "./pages/ConferenceDetails"
import AssignReviewer from "./pages/AssignReviewer"
import AssignReviewerForConference from "./pages/AssignReviewerForConference"
import MyAssigned from "./pages/MyAssigned"
import ReviewPaper from "./pages/ReviewPaper"
import Register from "./pages/Register"
import RegisterAttendee from "./pages/RegisterAttendee"
import MyConferences from "./pages/MyConferences"
import PendingReviews from "./pages/PendingReviews";
import PendingDecisions from "./pages/PendingDecisions";
import MySubmissions from "./pages/MySubmissions";


import Layout from "./Layout"

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit" element={<SubmitPaper />} />
        <Route path="/submit/:id" element={<SubmitPaper />} />
        <Route path="/create-conference" element={<CreateConference />} />
        <Route path="/conferences" element={<ViewConferences />} />
        <Route path="/conference/:id" element={<ConferenceDetails />} />
        <Route path="/assign" element={<AssignReviewer />} />
        <Route path="/conference/:id/assign" element={<AssignReviewerForConference />} />
        <Route path="/assigned" element={<MyAssigned />} />
        <Route path="/review/:id" element={<ReviewPaper />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-attendee" element={<RegisterAttendee />} />
        <Route path="/my-conferences" element={<MyConferences />} />
        <Route path="/pending-reviews" element={<PendingReviews />} />
        <Route path="/pending-decisions" element={<PendingDecisions />} />
        <Route path="/my-submissions" element={<MySubmissions />} />


      </Routes>
    </Layout>
  )
}
