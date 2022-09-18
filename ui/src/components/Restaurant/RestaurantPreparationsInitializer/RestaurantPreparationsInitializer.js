import React from "react";
import { useState } from "react";

function downloadBlob(blob, name = 'img.png') {
    if (window.navigator && window.navigator.msSaveOrOpenBlob){
        return window.navigator.msSaveOrOpenBlob(blob);
    }
    
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = data;
    link.download = name;

    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );

    setTimeout(() => {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
}

const restaurantPreparationsInitializerRequest = (setIsHidden, setMessage, preparateList) => async (e) => {
    e.preventDefault();
    console.log(preparateList)

    

    await fetch("http://localhost:4000/user/restaurantPreparationsInitializer", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem("jwtToken")
        },
        body: JSON.stringify(preparateList, null, preparateList.length)
    }).then(async data => {
        const message = await data.text()
        if (data.status === 200){
            setIsHidden(true)

            await fetch("http://localhost:4000/user/getNumberOfTables", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then(response => response.json())
            .then(async data => {
                const restaurantId = parseInt(data.restaurantId)
                const numberOfTables = parseInt(data.numberOfTables)

                for (var i = 1; i <= numberOfTables; i++){
                    let res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=localhost:3000/clientSignIn?data=${restaurantId}-${i}`).then(async data => {
                        return new Blob([await data.arrayBuffer()], {
                            type: 'image/png'
                        });
                    })
                    downloadBlob(res, "masa"+ i + ".png")
                    console.log(res)
                }
            })
            window.location = "/TableScreen"
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

const RestaurantPreparationsInitializer = () => {
    const [isHidden, setIsHidden] = useState(true)
    const [message, setMessage] = useState("")

    const [preparateList, setPreparateList] = useState([
        {
            type_name: "",
            name: "",
            description: "",
            price: ""
        }
    ])

    const handlePreparateAdd = () => {
        setPreparateList([...preparateList, {
            type_name: "",
            name: "",
            description: "",
            price: 0
        }])
    }

    const handlePreparateRemove = (index) => {
        const list = [...preparateList]
        list.splice(index, 1)
        setPreparateList(list)
    }

    const onKeyUpType = (e) => {
        let preparateListCopy = Array.from(preparateList)
        preparateListCopy[preparateList.length -1]["type_name"] = e.target.value
        setPreparateList(preparateListCopy)
    }
    const onKeyUpName = (e) => {
        let preparateListCopy = Array.from(preparateList)
        preparateListCopy[preparateList.length -1]["name"] = e.target.value
        setPreparateList(preparateListCopy)
    }
    const onKeyUpDescription = (e) => {
        let preparateListCopy = Array.from(preparateList)
        preparateListCopy[preparateList.length -1]["description"] = e.target.value
        setPreparateList(preparateListCopy)
    }
    const onKeyUpPrice = (e) => {
        let preparateListCopy = Array.from(preparateList)
        preparateListCopy[preparateList.length -1]["price"] = e.target.value
        setPreparateList(preparateListCopy)
    }

    return(
        <main className="pa4 black-80 App">
            <form className="measure center">
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Register all the products that your restaurant serves</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="restaurant-name">Products</label>
                        <div className="mt3 pa2 ba b--black br3 bg-transparent w-100">
                        {preparateList.map((index) => (
                            <div className="tc ba b--black br3 pa1 ma1 grow shadow-5">
                                <input className="pa2 input-reset ba b--transparent bg-transparent hover-black w-70 tc" type="type" name="preparate-type" id="preparate-type" placeholder="Product Type" onKeyUp={onKeyUpType}/>
                                <input className="pa2 input-reset ba b--transparent bg-transparent hover-black w-70 tc" type="name" name="preparate-name" id="preparate-name" placeholder="Product Name" onKeyUp={onKeyUpName}/>
                                <input className="pa2 input-reset ba b--transparent bg-transparent hover-black w-70 tc" type="description" name="preparate-description" id="preparate-description" placeholder="Product Description" onKeyUp={onKeyUpDescription}/>
                                <input className="pa2 input-reset ba b--transparent bg-transparent hover-black w-70 tc" type="price" name="preparate-price" id="preparate-price" placeholder="Product Price" onKeyUp={onKeyUpPrice}/>
                                {preparateList.length - 1 === index}
                            </div>
                        ))}
                        </div>
                        <p className="dark-red" hidden = {isHidden}>{message}</p>
                        <button className="b mt3 br3 ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="button" onClick={handlePreparateAdd}>Add new Product</button>
                        <br></br>
                        <button className="b mt3 br3 ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="button" onClick={() => handlePreparateRemove(preparateList.length -1)}>Remove last Product</button>
                    </div>
                </fieldset>
                <div>
                    <input className="b ph3 br3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Submit"  onClick={restaurantPreparationsInitializerRequest(setIsHidden, setMessage, preparateList)}/>
                </div>
            </form>
        </main>
    );
}

export default RestaurantPreparationsInitializer;