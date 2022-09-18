import React from "react";
import { useState } from "react";

const signUpRequest = (setIsHidden, setMessage) => (e) => {
    e.preventDefault()
    let email = e.nativeEvent.srcElement[1].value
    let password = e.nativeEvent.srcElement[2].value
    let confirmPassword = e.nativeEvent.srcElement[3].value
    if (password !== confirmPassword){
        const message = "Password must be identical with Confirm Password"
        alert(message)
    }
    else{
        fetch("http://localhost:4000/user/signup", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email:email,
                    password: password,
                    userType: "client"
                }
            )
        }).then(async data => {
            const message = await data.text() 
            if (data.status === 200){
                setIsHidden(false)
                setMessage("You signed up succesfully")
                localStorage.setItem("jwtToken", message)
            }
            else{
                alert(message)
            }
        })
        .catch(err => {
            console.error(err)
            setIsHidden(false)
        })
    }
}

const ClientSignUp = () => {
    const [isHidden, setIsHidden] = useState(true);
    const [message, setMessage] = useState("")

    return(
        <main className="pa4 black-80 App">
            <form className="measure center" onSubmit={signUpRequest(setIsHidden, setMessage)}>
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Sign Up</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Username</label>
                        <input className="pa2 input-reset ba b--black bg-transparent hover-black w-100" type="text" name="email-address" id="email-address" />
                    </div>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba b--black bg-transparent hover-black w-100" type="password" name="password" id="password" />
                    </div>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="confirm-password">Confirm Password</label>
                        <input className="b pa2 input-reset ba b--black bg-transparent hover-black w-100" type="password" name="confirm-password"/>
                    </div>
                </fieldset>
                <div>
                    <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign Up" />
                </div>
                <div className="lh-copy mt3">
                    <p className="dark-green" hidden = {isHidden}>{message}</p>
                    <label className="db fw6 lh-copy f6">Do you already have an account?</label>
                    <p className="db fw6 lh-copy f6"> In order to sign in you need to scan a QR code</p>
                </div>
            </form>
        </main>
    );
}

export default ClientSignUp;