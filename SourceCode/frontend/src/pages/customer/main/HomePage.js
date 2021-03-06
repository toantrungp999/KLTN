import React, { Component, memo } from "react";
import { connect } from "react-redux";
import {
  fectchProductHomepagesRequest,
  fectchRecommendedProductsRequest,
} from "../../../actions/productActions";
import NotFound from "../notFound/NotFound";
import Poster from "../../../components/customer/poster/Poster";
import ProductSection from "../../../components/customer/productSection/ProductSection";
import RecommendedSection from "../../../components/customer/recommendedProduct/RecommendedSection";
import Panel from "../../../components/customer/panel/Panel";
import MiddlePanel from "../../../components/customer/middlePanel/MiddlePanel.js";
import Loading from "../../../components/common/loading/Loading";
import "./HomePage.css";

class HomePage extends Component {
  componentDidMount() {
    this.props.fectchProducts();
    this.props.fectchRecommendedProducts(
      this.props.userInfoReducer.userInfo
        ? this.props.userInfoReducer.userInfo._id
        : undefined,
      undefined
    );
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.userInfoReducer.userInfo &&
      prevProps.userInfoReducer.userInfo
    ) {
      this.props.fectchRecommendedProducts(undefined, undefined);
    }
  }

  render() {
    const { loading, message, productHomepages } =
      this.props.productHomepagesReducer;
    const { recommendedProducts } = this.props.recommendedProductsReducer;
    const recommendedColorOptions =
      this.props.recommendedProductsReducer.colorOptions;
    const recommendedSizeOptions =
      this.props.recommendedProductsReducer.sizeOptions;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else if (message) {
      console.log(message);
      return <NotFound link={"/"}></NotFound>;
    } else {
      var { hots, news, bestSellers, colorOptions, sizeOptions } =
        productHomepages;
      // var productsClone = [];
      // if(products){
      //   for(var i=0; i<10; i++){
      //     products.map((product, index) => {productsClone.push(product)});
      //   }
      // }
      // let elementProduct = productsClone ? productsClone.map((product, index) => {
      //   return <ProductItem key={product._id} index={index} product={product} />
      // }) : '';
      return (
        <div className="home-page">
          <Poster />
          <div className="home-page-section">
            {/* <SearchByBrands brandsReducer={this.props.brandsReducer} /> */}
            <Panel />
            {recommendedProducts && (
              <RecommendedSection
                products={recommendedProducts}
                sizeOptions={recommendedSizeOptions}
                colorOptions={recommendedColorOptions}
                title="G???i ??"
                description="C?? th??? b???n quan t??m"
              />
            )}
            <ProductSection
              products={news}
              sizeOptions={sizeOptions}
              colorOptions={colorOptions}
              title="M???i nh???t"
              description="Xu h?????ng th???i trang d??nh cho b???n"
              path="new-product"
            />
            <MiddlePanel index={1} />
            <ProductSection
              products={hots}
              sizeOptions={sizeOptions}
              colorOptions={colorOptions}
              title="N???i b???t"
              description="S???n ph???m y??u th??ch c???a gi???i tr???"
              path="hot-produtc"
            />
            <MiddlePanel index={0} />
            <MiddlePanel index={2} />
            <ProductSection
              products={bestSellers}
              sizeOptions={sizeOptions}
              colorOptions={colorOptions}
              title="B??n ch???y"
              description="S???n ph???m ???????c mua nhi???u nh???t"
              path="best-seller"
            />

            <section className="text-center pt-5">
              <div className="row mb-4 wow fadeIn"></div>
              {/* <Paging onFetchData={this.onFetchData} pagingInfo={pagingInfo} loading={loading} location={this.props.location} /> */}
            </section>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
    productsReducer: state.productsReducer,
    // brandsReducer: state.brandsReducer,
    categoriesReducer: state.categoriesReducer,
    productHomepagesReducer: state.productHomepagesReducer,
    recommendedProductsReducer: state.recommendedProductsReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fectchProducts: () => {
      dispatch(fectchProductHomepagesRequest());
    },
    fectchRecommendedProducts: (userId, productId) => {
      dispatch(fectchRecommendedProductsRequest(userId, productId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(HomePage));
