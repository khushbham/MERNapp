import React ,{Suspense} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Loader  from "./components/layouts/loader";
var App = React.lazy(() => import("./App"));

  ReactDOM.render(
    <Suspense fallback={<div className="loaderWrapp"> <Loader/> </div>}>
      <App />
    </Suspense>,
    document.getElementById("root")
  );

