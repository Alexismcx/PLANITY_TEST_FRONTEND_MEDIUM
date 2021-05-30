import React, { useState, useEffect } from 'react';
import '../styles/beerDetails.css';
import Navbar from '../components/navbar'
import { Col, Row, Tabs } from "antd";
import { faHeart as faHeartFull, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { motion } from 'framer-motion';

function BearDetails(props) {

    const { TabPane } = Tabs;

    const [beerDetail, setBeerDetails] = useState([])
    const [checkBeerDetail, setCheckBeerDetail] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const allBeer = async () => {
            const beerDetail = await fetch(`/beer-details/${props.match.params.ids}`)
            const response = await beerDetail.json()
            setBeerDetails(response);
            setCheckBeerDetail(true)

            console.log(response);
        }
        allBeer()
    }, [])

    const pageVariants = {
        initial: {
            opacity: 0,
            y: "100vh"
        },
        in: {
            opacity: 1,
            y: 0
        },
        out: {
            opacity: 0,
            y: "-100vh"
        }
    }

    const pageTransition = {
        type: 'spring',
        stiffness: 45,
    }

    const BottleTransition = {
        type: 'spring',
        stiffness: "35",
        duration: 1
    }

    if (checkBeerDetail === true) {
        var cardDetail = beerDetail.map((card, i) => {
            var width;

            if (card.image_url === "https://images.punkapi.com/v2/keg.png") {
                width = "180px"
            } else {
                width = "100px"
            }

            var maltIngredients = card.ingredients.malt.map((malt, i) => {
                return (
                    <p className="ingredientsElements">{malt.name}: {malt.amount.value} {malt.amount.unit}</p>
                )
            })

            var hopsIngredients = card.ingredients.hops.map((hops, i) => {
                return (
                    <p className="ingredientsElements">{hops.name}: {hops.amount.value} {hops.amount.unit}</p>
                )
            })

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
                if (coeur === faHeart) {
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
                } else {
                    try {
                        await fetch('/delete-beer-cart', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: `tag=${card.id}`
                        })
                        props.deleteBeerFromCart(card.id)
                    } catch (err) {
                        setError(err.message)
                    }
                }
            }

            return (
                <Row className="beerBlockDetails" key={card.name}>
                    <Col xs={24} lg={12} xl={12} className="beerCardImageDetails">
                        <motion.img exit="out" animate="in" initial="initial" variants={pageVariants} transition={BottleTransition} src={card.image_url} alt="picto fiche" width={width} height="350px"></motion.img>
                    </Col>
                    <Col xs={24} lg={12} xl={12} className="beerCardDatasDetails">
                        <Tabs className="tabDetailsStyle" defaultActiveKey="1">
                            <TabPane tab="Infos" key="1" style={{ width: "100%", height: "100%" }} >
                                <div className="infoDetailsBlock">
                                    <div className="nameAndTagDetails">
                                        <p className="nameBeerDetails">{card.name}</p>
                                        <p className="tagBeerDetails">{card.tagline}</p>
                                    </div>
                                    <div className="volumeBlockDetails">
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <p className="volumeDateDetails">{card.volume.value}L</p>
                                        </div>
                                    </div>

                                    <div className="descriptionBlockDetails">
                                        <p className="ingredientsCategory">Description:</p>
                                        <p className="ingredientsElements">{card.description}</p>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="Ingredients" key="2">
                                <div className="ingredientsDetailsBlock">
                                    <p className="ingredientsCategory">Malt:</p>
                                    {maltIngredients}
                                    <p className="ingredientsCategory">Hops:</p>
                                    {hopsIngredients}
                                    <p className="ingredientsCategory">Yeast:</p>
                                    {card.ingredients.yeast}

                                </div>
                            </TabPane>
                            <TabPane tab="Brewers Tips" key="3">
                                <div className="infoBewersTipsBlock">
                                    <p className="brewerTips">{card.brewers_tips}</p>
                                </div>

                            </TabPane>
                        </Tabs>
                        <div className="bottomDetails">

                            <button className="bottomButtonsBack">
                                <Link to="/beer-list" style={{display: "flex"}}>
                                    <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 22, color: "white", display: 'flex' }} />
                                    <span className="textButtonBack">GO BACK</span>
                                </Link>
                            </button>
                            <button className="bottomButtonsHeart">
                                <FontAwesomeIcon icon={coeur} style={{ fontSize: 22, color: colorHeart }} onClick={() => handleClickSaveCart(card)} />
                            </button>
                        </div>
                    </Col>
                </Row>
            )
        })
    }

    return (
        <div className="contenairDetails" style={{overflowX: "hidden", overflowY: 'hidden'}}>
            <Navbar />
            <motion.div exit="out" animate="in" initial="initial" variants={pageVariants} transition={pageTransition} className="mainBlockDetails">
                {cardDetail}

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
)(BearDetails);