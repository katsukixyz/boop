import { Suspense, StrictMode } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { ChakraProvider } from "@chakra-ui/react";

import routes from "~react-pages";

function App() {
  return <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <CookiesProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </CookiesProvider>
    </Router>
  </StrictMode>
);
