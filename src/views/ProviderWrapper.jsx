import * as React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {StaticRouter} from 'react-router';
import About from "./About";
import Home from "./Home";
import Contact from "./Contact";
import Footer from "./Footer";
import Header from "./Header";

const ProviderWrapper = (props) => {
    const Router = props.isServerSide ? StaticRouter : BrowserRouter;

    return (
        <Provider store={props.store}>
            <Router
                context={props.context}
                location={props.location}
            >
                <div className="container">
                    <Header />
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={Home}
                        />
                        <Route
                            path="/about"
                            component={About}
                        />
                        <Route
                            path="/contact"
                            component={Contact}
                        />
                    </Switch>
                    <Footer />
                </div>
            </Router>
        </Provider>
    );
};

export default ProviderWrapper;
