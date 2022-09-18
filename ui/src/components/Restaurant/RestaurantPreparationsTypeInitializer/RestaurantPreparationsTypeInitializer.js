import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const restaurantPreparationsTypeInitializerRequest = (setIsHidden, setMessage, typeList) => (e) => { 
    e.preventDefault();
    console.log(typeList);
    
    fetch("http://localhost:4000/user/restaurantPreparationTypeInitializer", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem("jwtToken")
        },
        body: JSON.stringify(typeList, null, typeList.length)
    }).then(async data => {
        const message = await data.text()
        if (data.status === 200){
            setIsHidden(true)
            window.location = "/RestaurantPreparationsInitializer"
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

const RestaurantPreparationsTypeInitializer = () => {
    const [isHidden, setIsHidden] = useState(true)
    const [message, setMessage] = useState("")

    const [typeList, setTypeList] = useState([
        { name: "" },
    ])

    const handleTypeAdd = () => {
        setTypeList([...typeList, { name: "" }])
    }

    const handleTypeRemove = (index) => {
        const list = [...typeList]
        list.splice(index, 1)
        setTypeList(list)
    }

    const onKeyUp = (e) => {
        let typeListCopy = Array.from(typeList);
        typeListCopy[typeList.length - 1] = {
            name: e.target.value
        }
        setTypeList(typeListCopy)
    }

    return(
        <main className="pa4 black-80 App">
            <form className="measure center">
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Register all the types of products that your restaurant serves</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="restaurant-name">Types</label>
                        <div className="mt3 pa2 ba b--black br3 bg-transparent w-100">
                        {typeList.map((index) => (
                            <div className="tc ba b--black br3 pa1 ma1 grow shadow-5">
                                <input className="pa2 input-reset ba b--transparent bg-transparent hover-black w-70 tc" type="type" name="preparate-type" id="preparate-type" placeholder="Type" onKeyUp={onKeyUp}/>
                                {typeList.length - 1 === index}
                            </div>
                        ))}
                        </div>
                        <p className="dark-red" hidden = {isHidden}>{message}</p>
                        <button className="b mt3 br3 ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="button" onClick={handleTypeAdd}>Add new Type</button>
                        <br></br>
                        <button className="b mt3 br3 ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="button" onClick={() => handleTypeRemove(typeList.length -1)}>Remove last Type</button>
                    </div>
                </fieldset>
                <div>
                    <Link to={"/RestaurantPreparationsInitializer"}>
                        <input className="b ph3 br3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Submit"  onClick={restaurantPreparationsTypeInitializerRequest(setIsHidden, setMessage, typeList)}/>
                    </Link>
                </div>
            </form>
        </main>
    );
}

export default RestaurantPreparationsTypeInitializer;