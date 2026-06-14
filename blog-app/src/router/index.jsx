import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import HomePageOld from "../HomePageOld";
import HomePage from "../pages/HomePage";
import PostPage from "../pages/PostPage";
import HomePageSearch from "../pages/HomePageSearch";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "post/:id",
        element: <PostPage />
      },
      {
        path: "search",
        element: <HomePageSearch />
      },{
        path: "old",
        element: <HomePageOld />
      }
    ]
  }
]);

export default router;