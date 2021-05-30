import React, { useState, useEffect } from 'react';
import '../styles/beerList.css';
import Navbar from '../components/navbar';
import { Col, Row, Tabs } from "antd";
import { faHeart as faHeartFull} from '@fortawesome/free-solid-svg-icons';
import { faHeart} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { motion } from 'framer-motion';

function BeerList(props) {
    const [beerList, setBeerList] = useState([]);
    const [checkBeerList, setCheckBeerList] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const allBeerApi = async () => {
            const beerList = await fetch(`/beer-list`)
            const response = await beerList.json()
            setBeerList(response);
            setCheckBeerList(true)
        }

        const orderedBeer = async () => {
            const allBeerOrdered = await fetch(`/cart-list`)
            const resCartList = await allBeerOrdered.json()
            if (resCartList !== []) {
                props.saveCartList(resCartList)
            }
        }

        orderedBeer()
        allBeerApi()
    }, [])

    const { TabPane } = Tabs;

    const pageVariants = {
        initial: {
            opacity: 0,
            y: "200vh"
        },
        in: {
            opacity: 1,
            y: 0
        },
        out: {
            opacity: 0,
            x: "-200vw"
        }
    }

    const pageTransition = {
        type: 'spring',
        stiffness: 40
    }

    
    if (checkBeerList === true) {
        console.log(props.cartList);
        var allCard = beerList.map((card, i) => {
            var width;

            if (card.image_url === "https://images.punkapi.com/v2/keg.png") {
                width = "150px"
            } else {
                width = "100px"
            }

            if (card.description.length > 70) {
                var length = 70;
                var trimmedOverview = card.description.substring(0, length).trimEnd() + "..."
            }

            let coeur;
            let colorHeart;
            if (props.cartList.some(e => e.tag === card.id)) {
                coeur = faHeartFull;
                colorHeart = "#ee5253"
            } else {
                coeur = faHeart;
                colorHeart = "white"
            };

            const handleClickSaveCart = async (data) => {
                if(coeur === faHeart){
                    try {
                        const newOrder = await fetch('/save-beer-cart', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: `tag=${data.id}&name=${data.name}&image_url=${data.image_url}`
                        })
                        const orderSaved = await newOrder.json()
                        props.saveOrders(orderSaved)
                    } catch (err) {
                        setError(err.message)
                    }
                }else{
                    try {
                        await fetch('/delete-beer-cart', {
                            method: 'DELETE',
                            headers: {'Content-Type':'application/x-www-form-urlencoded'},
                            body: `tag=${card.id}`
                        })
                        props.deleteBeerFromCart(card.id)
                    }catch(err){
                        setError(err.message)
                    }
                }
            }

            return (
                <Col xs={24} lg={12} xl={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={card.id}>
                    <div className="beerCard">
                        <div className="topCard">
                            <img src={card.image_url} alt="picto fiche" width={width} height="300px" />
                        </div>
                        <div className="bottomCard">
                            <div className="mainBottomCardDiv">
                                <Tabs style={{ height: "79%", display: 'flex', justifyContent: 'center', alignItems: 'center' }} defaultActiveKey="1">
                                    <TabPane tab="Infos" key="1" >
                                        <div className="contenairInfoContent">
                                            <h5 className="titleBeer">{card.name}</h5>
                                            <p className="contentInfos">{card.tagline}</p>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Description" key="2">
                                        <div className="contenairDescriptionContent">
                                            <p className="descriptionText">{trimmedOverview}</p>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Volume" key="3">
                                        <div className="contenairVolumeContent">
                                            <div className="volumeBeerIcon"></div>
                                            <div className="volumeNumberBlock">
                                                <p className="numberVolume">{card.volume.value}</p>
                                                <span>L</span>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                                <div type="button" className="detailsAndCart">
                                    <Link to={`/beer-details/${card.id}`}><button className="detailsButton">View Details</button></Link>
                                    <button className="addCart">
                                        <FontAwesomeIcon icon={coeur} style={{ fontSize: 22, color: colorHeart, cursor: 'pointer' }} onClick={() => handleClickSaveCart(card)} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            )
        })
    }

    return (
        <div className="contenair" style={{overflowX: "hidden", overflowY: 'hidden'}}>
            <Navbar />
            <motion.div exit="out" animate="in" initial="initial" variants={pageVariants} transition={pageTransition} className="mainBlock">
                <Row className="beerBlock">

                    {allCard}

                </Row>
            </motion.div>
        </div>
    )

}

function mapStateToProps(state) {
    return { cartList: state.cartListReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        saveOrders: function (data) {
            dispatch({
                type: 'savedOrder',
                data: data
            })
        },
        saveCartList: function (data) {
            dispatch({
                type: 'savedCartList',
                data: data
            })
        },
        deleteBeerFromCart: function (tag) {
            dispatch({
                type: 'deleteOneBeer',
                tag: tag
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BeerList);