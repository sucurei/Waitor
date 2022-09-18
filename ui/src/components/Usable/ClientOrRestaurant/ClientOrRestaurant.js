import React from "react";
import { Link } from "react-router-dom";

const ClientOrRestaurant = ({onRouteChangeToClient, onRouteChangeToResturant}) => {
    return(
        <main className="pa4 black-80 App">
            <form className="measure center">
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Tell us what you are so we can help you</legend>
                </fieldset>
                <div>
                    <Link to={"/ClientSignUp"}>
                        <input className="b ph3 pa3 input-reset ba b--black bg-transparent grow pointer f6 dib shadow-5 br3 ma2 grow bw1" type="submit" value="Client" />
                    </Link>
                </div>
                <div>
                    <Link to={"/RestaurantSignIn"}>
                        <input className="b ph3 pa3 input-reset ba b--black bg-transparent grow pointer f6 dib shadow-5 br3 ma2 grow bw1" type="submit" value="Restaurant" />
                    </Link>
                </div>
            </form>
        </main>
    );
}

export default ClientOrRestaurant;