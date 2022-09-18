import React from "react";
import { useState } from "react";

const restaurantDataInitializerRequest = (setIsHidden, setMessage) => (e) => {
    e.preventDefault();
    let restaurantName = e.nativeEvent.srcElement[1].value
    let numberOfTables = e.nativeEvent.srcElement[2].value
    if (numberOfTables <= 0){
        const message = "A restaurant can't have 0 or less tables."
        setMessage(message)
        setIsHidden(false)
    }
    fetch("http://localhost:4000/user/restaurantDataInitializer", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem("jwtToken")
        },
        body: JSON.stringify(
            {
                restaurantName: restaurantName,
                numberOfTables: numberOfTables
            }
        )
    }).then(async data => {
        const message = await data.text()
        if (data.status === 200){
            setIsHidden(true)
            window.location = "/RestaurantPreparationsTypeInitializer"
        }
        else{
            setIsHidden(false)
            setMessage(message)
        }
    })
    .catch(err => {
        console.error(err)
        setIsHidden(false)
    })
}

const RestaurantDataInitilizer = () => {
    const [isHidden, setIsHidden] = useState(true)
    const [message, setMessage] = useState("")
    
    return (
        <main className="pa4 black-80 App">
            <form className="measure center" onSubmit={restaurantDataInitializerRequest(setIsHidden, setMessage)}>
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Tell us more about your restaurant</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="restaurant-name">Restaurant Name</label>
                        <input className="pa2 input-reset ba b--black bg-transparent hover-black w-100" type="text" name="restaurant-name"/>
                    </div>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="number-of-tables">Number of Tables</label>
                        <input className="b pa2 input-reset ba b--black bg-transparent hover-black w-100" type="number" name="number-of-tables" defaultValue={0}/>
                        <p className="dark-red" hidden = {isHidden}>{message}</p>
                    </div>
                </fieldset>
                <div>
                    <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Submit" />
                </div>
            </form>
        </main>
    );
}

export default RestaurantDataInitilizer;