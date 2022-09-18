import React, { useState, useEffect } from "react";
import Navigation from "../../Usable/Navigation/Navigation";
import TablePicture from './/Table.jpg'
import NoNewsPoint from './/GrayDot.png';
import NewsPoint from './/RedDot.png';


function renderOrder(data, type){
    let list = []
    if (data !== null){
        console.log(data);
        if (type === "preparate"){
            for (let detail of data){
                if (detail.type === "preparate"){
                    list.push(
                        <div style={{backgroundColor: '#FDC37E'}} className="fl w-100 bg-near-white tc ">
                            <p>Product Name: {detail.name}</p>
                            <p>Quantity: {detail.quantity}</p>
                        </div>
                    )
                }
            }
        }
        else{
            for (let detail of data){
                if (detail.type === "comment"){
                    list.push(
                        <div style={{backgroundColor: '#FDC37E'}} className="fl w-100 bg-light-gray tc">
                            <p>Commentary: {detail.comment}</p>
                        </div>
                    )
                }
            }
        }
        return list
    }
    return list
}

function renderTables(numberOfTables, setTableNumber, setNow, tableStatus) {
    const list = []
    console.log(tableStatus);
    for (let i = 1; i <= numberOfTables; i++){
        list.push(
            <button className='tc bg-transparent dib pa3 ma2 grow bw1 shadow-5 ba b--gold' type="button" 
                onClick={() => {
                    setTableNumber(i)
                    setNow(new Date())
                }}>
            <img src={TablePicture} alt='' height='60px'></img>
            <img src={tableStatus[i-1] ? NewsPoint : NoNewsPoint} alt='' height='10px'></img>
            <p>{i}</p>
        </button>)
    }
    return list
}

const TablesScreen = () => {
    const [numberOfTables, setNumberOfTables] = useState(null)
    const [tableNumber, setTableNumber] = useState(null) 
    const [data, setData] = useState(null) 
    const [now, setNow] = useState(null)
    const [tableStatus, setTableStatus] = useState([])
    const [tableDetail, setTableDetail] = useState([])

    useEffect(() => {
        fetch("http://localhost:4000/user/getNumberOfTables", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then(response => response.json())
        .then(data => {
            setNumberOfTables(data.numberOfTables)
            setTableStatus(Array(parseInt(data.numberOfTables)).fill(false))
            setTableDetail(Array(parseInt(data.numberOfTables)).fill([]))
        })
    }, [])
    
    useEffect(() => {
        let interval = setInterval(() => {
            for (let i = 0; i < parseInt(numberOfTables); i++){
                if (tableStatus[i] === false){
                    fetch("http://localhost:4000/user/getOrder?table_number=" + (i + 1), {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': localStorage.getItem("jwtToken")
                        },
                    }).then(response => {
                        if (response !== null){
                            return response.json()
                        }
                        return null
                    }).then(data => {
                        if (JSON.stringify(data) !== JSON.stringify(tableDetail[i])){
                            setTableStatus((tableStatus) => {
                                let newTableStatus = [...tableStatus]
                                newTableStatus[i] = true
                                return newTableStatus
                            })
                        }
                    })
                }
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [numberOfTables, tableDetail, tableStatus])
    

    useEffect(() => {
        if (tableNumber !== null){
            fetch("http://localhost:4000/user/getOrder?table_number=" + tableNumber, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem("jwtToken")
                },
            }).then(response => {
                if (response !== null){
                    return response.json()
                }
                return null
            })
            .then(data => {
                setTableDetail((tableDetail) => {
                    let newTableDetail = [...tableDetail]
                    newTableDetail[tableNumber - 1] = data
                    return newTableDetail
                })
                setTableStatus((tableStatus) => {
                    let newTableStatus = [...tableStatus]
                    newTableStatus[tableNumber - 1] = false
                    return newTableStatus
                })
                setData(data)
            })
        }
    },[tableNumber, now])

    return(
        <div>
            <Navigation />
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', width:'100%'}}>
                <div>
                    {renderTables(numberOfTables, setTableNumber, setNow, tableStatus)}
                </div>
                <div className="ba bw1 b--black ma2 flex justify-center">
                    <div className="flex flex-column w-50">
                        {renderOrder(data,"preparate")}
                    </div>
                    <div className="flex flex-column w-50">
                        {renderOrder(data,"comment")}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TablesScreen;