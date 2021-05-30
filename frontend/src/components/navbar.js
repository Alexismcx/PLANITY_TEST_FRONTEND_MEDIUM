import React, {useState} from 'react';

import { Link, NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import { Menu, Popover} from 'antd';
import 'antd/dist/antd.css';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

function Navbar(props) {
    const [error, setError] = useState(null)


    const handleClickRemoveBeerCart = async (tag) => {
        try {
            await fetch('/delete-beer-cart', {
                method: 'DELETE',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `tag=${tag}`
            })
            props.deleteBeerFromCart(tag)
        }catch(err){
            setError(err.message)
        }
    }

    var displayCart = props.cartList.map((beer, i) => {

        var width;

        if (beer.image_url === "https://images.punkapi.com/v2/keg.png") {
            width = "40px"
        } else {
            width = "25px"
        }
        
        return (
            <div className="cartBlockItem" key={beer.tag}>
                <div className="imageCartBeer">
                    <img src={beer.image_url} alt="picto fiche" width={width} height="70px" />
                </div>
                <span>{beer.name}</span>
                <FontAwesomeIcon icon={faTrash} className="trashIcon" onClick={() => handleClickRemoveBeerCart(beer.tag)} />
            </div>
        )
    })

    const contentPopover = (
        <div>
            {displayCart}
        </div>
    )



    return (
        <div className="mainContenair">
            <div className="navBlock">
                <Menu className="mainMenu" mode="horizontal" >
                    <Menu.Item modified="true" className="navOptions" key="BeerList">
                        <NavLink to={`/beer-list`} activeStyle={{ fontWeight: "bold", color: 'black' }}>
                            Beer List
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item modified="true" className="navOptions" key="BeerCart">
                        <Popover content={contentPopover} title="Order">
                            <Link to="/beer-card"><FontAwesomeIcon style={{ fontSize: 20 }} icon={faShoppingCart} /></Link>
                        </Popover>
                    </Menu.Item>
                </Menu>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { cartList: state.cartListReducer }
}

function mapDispatchToProps(dispatch) {
    return {
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
)(Navbar);