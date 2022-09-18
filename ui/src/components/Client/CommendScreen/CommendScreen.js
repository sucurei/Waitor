import React, { useEffect } from "react";
import { useState } from "react";

function renderMenu(menu, setMenu){
    let list = []
    let indexCategory = 0
    if (menu !== null){
        for (let category of menu){
            let indexPreparate = 0
            let preparateList = []
            for (let preparate of category["preparates"]){
                preparateList.push(
                    <div style={{backgroundColor: '#FDC37E'}} className="fl flex w-100 bg-near-white tc br3 ba b--black">
                        <div className="w-75">
                            <p>{preparate["name"]}</p>
                            <p>{preparate["description"]}</p>
                        </div>
                        <div>
                            <p>{preparate["price"]} Lei</p>
                            <input className="b pa1 br3 input-reset b--black bg-transparent hover-black w-80" type="number" onChange={modifyQuantity(indexCategory, indexPreparate, menu, setMenu)} name="quantity" defaultValue={preparate["quantity"]}/>
                        </div>
                    </div>
                )
                indexPreparate++
            }
            indexCategory++
            list.push(
                <div style={{backgroundColor: '#CF9F67'}}>
                    <h1>{category["type"]}</h1>
                    <div className="ba bw1">{preparateList}</div>
                </div>
            )
        }
    }
    return list
}

const commendRequest = (menu) => async (e) => {
    e.preventDefault()
    const queryParams = new URLSearchParams(window.location.search)
    const restaurantId = queryParams.get('data').split('-')[0]
    const tableNumber = queryParams.get('data').split('-')[1]

    let order = []

    let areProducts = false;

    for (let category of menu){
        for (let preparate of category["preparates"]){
            if (preparate["quantity"] > 0){
                areProducts = true
                order.push({
                    name: preparate["name"],
                    quantity: preparate["quantity"]
                })
            }
        }
    }
    if (areProducts === false){
        alert("If you want to order something you must have at least one product with quantity equal or bigger than 1")
    }
    else{
        fetch("http://localhost:4000/user/clientCreatePurchaseOrderLine?restaurant_id=" + restaurantId + "&table_number=" + tableNumber, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem("jwtToken")
            },
            body: JSON.stringify(order)
        })
        window.location.reload()
    }
}

const commentRequest = () => async (e) => {
    e.preventDefault()
    const comment = document.getElementById("commentary").value

    if (comment === undefined || comment === ""){
        alert("Your commentary box can't be empty")
    }
    else{
        fetch("http://localhost:4000/user/clientCreateComment",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem("jwtToken")
            },
            body:JSON.stringify({
                commentary: comment
            })
        }).then(async data => {
            if (data.status === 201){
                alert("You need to order something first.")
            }
        })
        window.location.reload()
    }
}

const askForNoteRequest = () => async (e) => {
    e.preventDefault()
    fetch("http://localhost:4000/user/clientFinish",{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem("jwtToken")
        }
    }).then(async data => {
        if (data.status === 201){
            alert("You need to order something first.")
        }
        else
        {
            window.location ="http://localhost:3000/" 
        }
    })
}

const modifyQuantity = (indexCategory, indexPreparate, menu, setMenu) => (e) =>{
    e.preventDefault()
    console.log(e.target);
    console.log(menu);
    menu[indexCategory]["preparates"][indexPreparate]["quantity"] = e.target.value
    setMenu(menu)
}

const CommendScreen = () => {
    const [menu, setMenu] = useState(null)

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search)
        const ids = queryParams.get('data')
        fetch("http://localhost:4000/user/getMenu?data=" + ids, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem("jwtToken")
            },
        }).then(response => response.json())
        .then(data => setMenu(data))
    },[])

    return(
        <div>
            <div>
                <div>
                   { renderMenu(menu, setMenu) }
                </div>
                <div className="ba bw1 b--black flex flex-column justify-center">
                    <div>
                        <div className="tc ba b--black br3 pa1 ma1 grow ma2 shadow-5">
                            <input className="w-100 pa2 input-reset ba b--transparent bg-transparent hover-black tc" type="commentary" name="commentary" id="commentary" placeholder="Commentary"/>
                        </div>
                    </div>
                    <div className="flex">
                        <button className="b w-33 br3 pv2 ba b--black bg-light-green grow pointer" type="button" onClick={commendRequest(menu)}>Order</button>
                        <button className="b w-34 br3 pv2 ba b--black bg-gray grow pointer" type="button" onClick={commentRequest()}>Comment</button>
                        <button className="b w-33 br3 pv2 ba b--black bg-red grow pointer" type="button" onClick={askForNoteRequest()}>Ask for receipt</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommendScreen;