import React from "react";
import { Link } from "react-router-dom";

class RestaurantSignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: "",
            signInPassword: ""
        }
    }

    onRouteChange = (path) => {
        this.setState({route: path});
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

    onSubmitSignIn = (event) => {
        event.preventDefault()
        fetch("http://localhost:4000/user/signin", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        }).then(async data => {
            const message = await data.text() 
            if (data.status === 200){
                localStorage.setItem("jwtToken", message)
                window.location = "/TableScreen"
            }
            else {
                alert("Username or password are wrong")
            }
        })
    }

    render() {
        return(
            <main className="pa4 black-80 App">
                <form className="measure center">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f4 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Username</label>
                            <input 
                                className="pa2 input-reset ba b--black bg-transparent hover-black w-100" 
                                type="text" 
                                name="email-address" 
                                id="email-address"
                                onChange={this.onEmailChange} 
                            />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                                className="b pa2 input-reset ba b--black bg-transparent hover-black w-100" 
                                type="password" 
                                name="password" 
                                id="password" 
                                onChange={this.onPasswordChange}
                            />
                        </div>
                    </fieldset>
                    <div>
                        {<Link to={"/TableScreen"}>
                            <input 
                                onClick={this.onSubmitSignIn} 
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="submit" 
                                value="Sign In" 
                            />
                        </Link>}
                    </div>
                    <div className="lh-copy mt3">
                        <label className="db fw6 lh-copy f6">Do not have an account?</label>
                        <Link to={"/RestaurantSignUp"}>
                            <p className="f6 link dim black db">Sign Up</p>
                        </Link>
                    </div>
                </form>
            </main>
        )
    }
}

export default RestaurantSignIn;