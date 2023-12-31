import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import moment from "moment";
import "moment/dist/locale/lt";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes, slugs } from "./utils/routes";

import zoomPlugin from "chartjs-plugin-zoom";
import { useEffect } from "react";
import { initGA, logPageView } from "./utils/analytic";

Chart.register(...registerables, annotationPlugin, zoomPlugin);
//CrosshairPlugin
//@ts-ignore
//Interaction.modes.interpolate = Interpolate;

moment.locale("lt");

const App = () => {
  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   window.ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill;
    // }

    initGA();
    logPageView();
  }, []);

  return (
    <>
      <Routes>
        {(routes || []).map((route, index) => (
          <Route
            key={`route-${index}`}
            path={route.slug}
            element={route.component}
          />
        ))}
        <Route path="*" element={<Navigate to={slugs.hydroPowerPlantsMap} />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
