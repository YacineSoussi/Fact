
import React, {useState} from 'react';
import ReactDOM from "react-dom";
import '../css/app.css';
import Navbar from './components/Navbar';
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import authAPI from './services/authAPI';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

authAPI.setup();


const App = () => {
 // Il faudrait par defaut qu'on demande a notre AuthAPI si on est connecté ou pas
    const [isAuthenticated, setIsAuthenticated] = useState(
        authAPI.isAuthenticated);

    const NavbarWithRouter= withRouter(Navbar);

    return (
        <AuthContext.Provider 
        value={{
            isAuthenticated,
            setIsAuthenticated
          }}>
    <HashRouter>

        <NavbarWithRouter />

    <main className="container pt-5">
            <Switch>
            <Route path="/login" render={props => (
                <LoginPage onLogin={setIsAuthenticated} {...props} />
            )}
            /> 
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <Route path="/" component={HomePage} />
            </Switch>
    </main>
    </HashRouter>
    </AuthContext.Provider>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);