import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { convertNumberToVND } from "./../../../extentions/ArrayEx";
import {
  updateCartRequest,
  deleteCartRequest,
  fectchCartsRequest,
} from "../../../actions/cartActions";
import { showAlertWithTimeout } from "../../../actions/alertActions";
import ItemBasketCart from "../../../components/customer/itemBasketCart/ItemBasketCart";
import "./BasketCart.css";
import Loading from "../../../components/common/loading/Loading";

class BasketCartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: [],
      cartId: undefined,
      showAlert: false,
      selectAll: true,
      errorMessage: "",
    };
  }

  GoToHome = () => {
    this.props.history.push("/");
  };

  componentDidMount() {
    let cartId =
      this.props.location.state !== undefined
        ? this.props.location.state.cartId
        : null;
    let selectedList = this.state.selectedList;
    if (cartId !== undefined && cartId != null) {
      selectedList.push(cartId);
      this.setState({
        cartId: cartId,
        showAlert: true,
        selectedList: selectedList,
        selectAll: false,
      });
    } else {
      this.setState({ cartId });
    }
    this.props.fectchCarts();
  }

  onUpdateSelectedList = (_id, status) => {
    const selected = this.state.selectedList;
    for (const index in selected) {
      if (selected[index] === _id) selected.splice(index, 1);
    }
    if (status === true) {
      selected.push(_id);
    }
    let selectAll =
      selected.length === this.props.cartsReducer.carts.length ? true : false;
    this.setState({
      selectedList: selected,
      selectAll: selectAll,
    });
  };

  onCheck = (event) => {
    let checked = event.target.checked;
    let selected = this.state.selectedList;
    if (!checked) {
      selected = [];
    } else {
      let carts = this.props.cartsReducer.carts;
      selected = [];
      selected = carts
        ? carts.map((cart, index) => {
            return cart._id;
          })
        : [];
    }
    this.setState({
      selectAll: checked,
      selectedList: selected,
    });
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  onBuy = () => {
    const selectedList = this.state.selectedList;
    if (selectedList.length === 0) {
      this.setState({
        errorMessage: "Ch??a ch???n s???n ph???m",
      });
      this.props.showAlertWithTimeout(
        "?????t h??ng th???t b???i",
        "Vui l??ng ch???n s???n ph???m",
        false
      );
    } else {
      let validQuantity = true;
      let carts = this.props.cartsReducer.carts;
      carts.forEach((cart) => {
        let { quantityInStore } = cart;
        if (selectedList.includes(cart._id))
          if (cart.quantity > quantityInStore) validQuantity = false;
      });
      if (validQuantity)
        this.props.history.push({
          pathname: "/orders/create",
          state: {
            selectedList: this.state.selectedList,
          },
        });
      else {
        this.setState({
          errorMessage: "Kh??ng ????? s??? l?????ng",
        });
        this.props.showAlertWithTimeout(
          "?????t h??ng th???t b???i",
          "Kh??ng ????? s??? l?????ng s???n ph???m, vui l??ng ki???m tra l???i",
          false
        );
      }
    }
  };

  deleteCart = (_id) => {
    let selected = this.state.selectedList;
    selected = selected.filter((item) => item !== _id);
    this.setState({ selectedList: selected });
    this.props.deleteCart(_id);
  };

  render() {
    let { loading, updateLoading, updateStatus, carts } =
      this.props.cartsReducer;
    if (loading || this.state.cartId === undefined)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      let total = 0;
      let totalQuantity = 0;
      let totalSelectQuantity = 0;

      let elementCarts = carts
        ? carts.map((cart, index) => {
            let { colorId, sizeId, quantity, quantityInStore } = cart;
            let { productId } = colorId;
            let { size } = sizeId;
            total += this.state.selectedList.includes(cart._id)
              ? productId.price * quantity - productId.saleOff * quantity
              : 0;
            totalSelectQuantity += this.state.selectedList.includes(cart._id)
              ? quantity
              : 0;
            totalQuantity += quantity;
            let type = colorId.color + " - " + size;
            let { cartId, selectedList } = this.state;
            let defaultCheck =
              cartId !== null ? (cartId === cart._id ? true : false) : true;
            let checked = selectedList.includes(cart._id);

            return (
              <ItemBasketCart
                _id={cart._id}
                key={cart._id}
                index={index}
                colorId={colorId._id}
                sizeId={sizeId._id}
                deleteCart={this.deleteCart}
                updateLoading={updateLoading}
                updateStatus={updateStatus}
                updateCart={this.props.updateCart}
                name={productId.name}
                productId={productId._id}
                image={colorId.image}
                type={type}
                quantity={quantity}
                quantityInStore={quantityInStore}
                price={productId.price}
                saleOff={productId.saleOff}
                onUpdateSelectedList={this.onUpdateSelectedList}
                checked={checked}
                defaultCheck={defaultCheck}
              />
            );
          })
        : "";

      return (
        <div className="cart-page">
          <div>
            <div className="row">
              <div className="col-12">
                <h2 className="title">Gi??? h??ng</h2>
                <div className="table-responsive pl-1 pr-1 pt-1">
                  {/* <table className="table table-customer">
                    <thead>
                      <tr>
                        <th scope="col">S???n ph???m</th>
                        <th scope="col">S??? l?????ng</th>
                        <th scope="col">T???ng gi??</th>
                        <th scope="col" className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {elementCarts}
                    </tbody>
                  </table> */}
                  {elementCarts}
                </div>
                <div className="bottom-bar">
                  <div className="fixed">
                    <div className="check-section">
                      <input
                        id="checkbox-on-header"
                        className="checkbox-cart-item"
                        type="checkbox"
                        name="isChoose"
                        checked={this.state.selectAll}
                        onChange={this.onCheck}
                      />
                      <label
                        className="label-checkbox-cart-item on-header"
                        htmlFor="checkbox-on-header"
                      >
                        <i className="fa fa-check item-checkbox-cart-item"></i>
                      </label>
                      <span className="pl-2">
                        <strong>Ch???n t???t c??? ({totalQuantity}) </strong>
                      </span>
                    </div>
                    <div className="buy-section">
                      <div className="price-section">
                        {this.state.selectedList.length === 0 ? (
                          <span className="message">Ch??a ch???n s???n ph???m</span>
                        ) : (
                          <>
                            <span className="total-product">
                              T???ng ({totalSelectQuantity} S???n ph???m):{" "}
                            </span>
                            <span className="price">
                              {convertNumberToVND(total)}???
                            </span>
                          </>
                        )}
                      </div>
                      <div className="btn-section">
                        <button className="btn-buyy" onClick={this.onBuy}>
                          Mua h??ng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    cartsReducer: state.cartsReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fectchCarts: () => {
    dispatch(fectchCartsRequest());
  },
  updateCart: (data) => {
    dispatch(updateCartRequest(data));
  },
  deleteCart: (_id) => {
    dispatch(deleteCartRequest(_id));
  },
  showAlertWithTimeout: (message, description, success) => {
    dispatch(showAlertWithTimeout(message, description, success));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(BasketCartPage));
