import "./scss/App.scss";
import "antd/dist/antd.css";
import Main from "./components/Main/Main";
import { positions, Provider as AlertProvider, transitions } from "react-alert";
import AlertTemplate from "./components/AlertTemplate/AlertTemplate";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

export interface DataType {
  key: string;
  surname: string;
  name: string;
  patronymic: string;
  position: string;
  birthDay: any;
  gender: string;
  employmentDate: any;
  dismissalDate: string;
  rights: Array<any>;
  collegues?: Array<any> | string;
  [key: string]: any;
}

const options: any = {
  position: positions.BOTTOM_RIGHT,
  timeout: 3000,
  offset: "30px",
  transition: transitions.SCALE,
  type: "error",
};

function App() {
  return (
    <div className="App">
      <AlertProvider template={AlertTemplate} {...options}>
        <Router>
          <Route exact path="/technical-test-greendatasoft/">
            <Main />
          </Route>
          <Route>
            <Redirect to="/technical-test-greendatasoft/" />
          </Route>
        </Router>
      </AlertProvider>
    </div>
  );
}

export default App;
