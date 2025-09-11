import { createBrowserRouter } from "react-router-dom";
import EditButterfly from "../pages/EditButterfly";
import CreateButterfly from "../pages/CreateButterfly";
import ButterflyDetail from "../pages/ButterflyDetail";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import ButterflyGalery from "../pages/ButterflyGalery";
import AboutUs from "../pages/AboutUs";
import Init from "../pages/Init";

const routerButterfly = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/init",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Init />,
      },
      {
        path: "newbutterfly",
        element: <CreateButterfly />,
      },
      {
        path: "editbutterfly/:id",
        element: <EditButterfly />,
      },
      {
        path: "butterflydetail/:id",
        element: <ButterflyDetail />,
      },
      {
        path: "butterfly-detail",
        element: <ButterflyDetail />, // Nueva ruta sin parámetro ID
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "galery",
        element: <ButterflyGalery />,
      },
    ],
  },
]);

export default routerButterfly;