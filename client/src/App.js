import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScaleSettings from "./components/nps-setting/ScaleSettings";
import Response from "./components/nps-setting/Response";
import InputType from "./components/input-type/InputType";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<InputType />} />
            <Route path="admin" element={<ScaleSettings />} />
            <Route path="response" element={<Response />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
