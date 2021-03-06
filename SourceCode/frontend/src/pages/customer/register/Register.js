import React, { Component, memo } from "react";
import { registerRequest } from "./../../../actions/userActions";
import {
  fetchCitiesRequest,
  fetchDistrictsRequest,
} from "../../../actions/locationActions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  isPhoneNumber,
  isEmail,
  isValidDate,
} from "../../../extentions/ArrayEx";
import Input from "../../../components/common/formField/Input";
import Select from "../../../components/common/formField/Select";
import "./Register.css";
class Register extends Component {
  constructor(props) {
    super(props);
    const { userInfo } = this.props.userInfoReducer;
    this.useEffect(userInfo);
    this.state = {
      username: "",
      password: "",
      re_password: "",
      name: "",
      phoneNumber: "",
      email: "",
      birthday: "",
      male: true,
      cityId: "1",
      districtId: "",
      wardId: "",
      streetOrBuilding: "",
      firstSubmit: false,
      submit: false,
    };
  }

  componentDidMount() {
    this.props.fetchCities();
    this.props.fetchDistricts(this.state.cityId);
  }

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    let value = target.value;
    if (name === "male") value = target.value === "true" ? true : false;
    else if (name === "cityId") {
      this.props.fetchDistricts(value);
      this.setState({
        districtId: "",
        wardId: "",
      });
    } else if (name === "districtId" && value === "-1") {
      this.setState({
        wardId: "",
      });
    }

    this.setState({
      [name]: value,
    });
  };

  useEffect = (userInfo) => {
    if (userInfo) this.props.history.push("/");
  };

  onSubmit = (event) => {
    event.preventDefault();
    let {
      email,
      password,
      re_password,
      username,
      phoneNumber,
      birthday,
      male,
      cityId,
      districtId,
      wardId,
      streetOrBuilding,
    } = this.state;
    password = password.trim();
    streetOrBuilding = streetOrBuilding.trim();
    if (
      email &&
      email.trim().length <= 255 &&
      isEmail(email.trim()) &&
      password &&
      password.trim().length <= 255 &&
      password.trim() === re_password.trim() &&
      username &&
      username.trim().length <= 255 &&
      isPhoneNumber(phoneNumber) &&
      birthday &&
      isValidDate(birthday)
    ) {
      var city, district, ward;
      var { cities } = this.props.citiesReducer;
      var index;
      if (cities) {
        index = this.findIndexById(cities, cityId);
        if (index >= 0) city = cities[index].name;
      }
      var { districts } = this.props.districtsReducer;
      if (districts) {
        index = this.findIndexById(districts, districtId);
        if (index >= 0) district = districts[index].name;
        var wards = districts
          .filter(
            (district) => Number(district.id) === Number(this.state.districtId)
          )
          .map((district) => district.wards);
        if (wards && wards.length > 0) {
          wards = wards[0];
          index = this.findIndexById(wards, wardId);
          if (index >= 0) ward = wards[index].name;
        }
      }
      if (city && district && ward && streetOrBuilding) {
        let name = username;
        email = email.trim();
        phoneNumber = phoneNumber.trim();
        name = name.trim();
        const data = {
          email,
          password,
          name,
          phoneNumber,
          birthday,
          male,
          address: {
            city,
            district,
            ward,
            streetOrBuilding,
          },
        };
        this.props.register(data);
        this.setState({ submit: true });
      }
    }
    this.setState({ firstSubmit: true });
  };

  findIndexById = (array, id) => {
    for (var i = array.length - 1; i >= 0; i--)
      if (Number(array[i].id) === Number(id)) return i;
    return -1;
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.userRegisterReducer.loading === false &&
      nextProps.userRegisterReducer.message === undefined &&
      prevState.submit
    ) {
      return { submit: "success" };
    } else return null;
  }

  render() {
    var { firstSubmit, submit } = this.state;
    var { cities } = this.props.citiesReducer;
    var optionCity = cities
      ? cities.map((city, index) => {
          return { value: city.id, label: city.name };
        })
      : [];
    var { districts } = this.props.districtsReducer;
    var optionDistricts = [];
    var optionWards = [];
    if (districts) {
      optionDistricts = districts.map((district, index) => {
        return { value: district.id, label: district.name };
      });
      var wards = districts
        .filter(
          (district) => Number(district.id) === Number(this.state.districtId)
        )
        .map((district) => district.wards);
      if (wards.length > 0)
        optionWards = wards[0].map((ward, index) => {
          return { value: ward.id, label: ward.name };
        });
    }
    var { loading } = this.props.userRegisterReducer;
    var button_submit = loading ? (
      <input type="button" className="btn btn-submit" value="LOADING..." />
    ) : (
      <input type="submit" className="btn btn-submit" value="????ng k??" />
    );
    if (submit === "success") this.props.history.push(`/login`);
    return (
      <div>
        <div className="register-page">
          <h3 className="title">????ng k?? t??i kho???n</h3>
          <form onSubmit={this.onSubmit}>
            <div className="info-section">
              <Input
                name="email"
                value={this.state.email}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                label="Email"
                placeHolder="Nh???p ?????a ch??? email"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Ch??a nh???p email" },
                  { email: true, message: "Email kh??ng h???p l???" },
                  { min: 6, message: "Nh???p t??? 6 k?? t???" },
                  { max: 255, message: "Kh??ng nh???p qu?? 255 k?? t???" },
                ]}
              />
              <Input
                name="password"
                value={this.state.password}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                type="password"
                label="M???t kh???u"
                placeHolder="Nh???p m???t kh???u"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Ch??a nh???p m???t kh???u" },
                  { min: 6, message: "Nh???p t??? 6 k?? t???" },
                  { max: 255, message: "Kh??ng nh???p qu?? 255 k?? t???" },
                ]}
              />
              <Input
                name="re_password"
                value={this.state.re_password}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                type="password"
                label="X??c nh???n"
                placeHolder="Nh???p l???i m???t kh???u"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Ch??a nh???p" },
                  { max: 255, message: "Kh??ng nh???p qu?? 255 k?? t???" },
                  {
                    equal: this.state.password,
                    message: "M???t kh???u kh??ng kh???p",
                  },
                ]}
              />
              <Input
                name="username"
                value={this.state.username}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                label="H??? t??n"
                placeHolder="Nh???p h??? v?? t??n"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Ch??a nh???p h??? t??n" },
                  { max: 255, message: "Kh??ng nh???p qu?? 255 k?? t???" },
                ]}
              />
              <Input
                name="phoneNumber"
                value={this.state.phoneNumber}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                label="S??? ??i???n tho???i"
                placeHolder="Nh???p s??? ??i???n tho???i"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Ch??a nh???p s??? ??i???n tho???i" },
                  { phoneNumber: true, message: "Kh??ng ph???i s??? ??i???n tho???i" },
                ]}
              />
              <Input
                name="birthday"
                value={this.state.birthday}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                type="date"
                label="Ng??y sinh"
                placeHolder="Nh???p ng??y sinh"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Ch??a nh???p ng??y sinh" },
                  { date: true, message: "Ng??y sinh kh??ng h???p l???" },
                ]}
              />
              <Select
                name="male"
                value={this.state.male.toString()}
                firstSubmit={firstSubmit}
                options={[
                  { value: "true", label: "Nam" },
                  { value: "false", label: "N???" },
                ]}
                onChange={this.onChange}
                label="Gi???i t??nh"
                placeHolder="Ch???n gi???i t??nh"
                labelWidth="150px"
                rules={[{ require: true, message: "Ch??a ch???n gi???i t??nh" }]}
              />
            </div>
            <div className="address-section">
              <label>?????a ch???</label>
              <Select
                name="cityId"
                value={this.state.cityId}
                firstSubmit={firstSubmit}
                options={optionCity}
                onChange={this.onChange}
                label=""
                placeHolder="Ch???n t???nh, th??nh ph???"
                labelWidth="0px"
                rules={[{ require: true, message: "Ch??a ch???n t???nh" }]}
              />
              <Select
                name="districtId"
                value={this.state.districtId}
                firstSubmit={firstSubmit}
                options={optionDistricts}
                onChange={this.onChange}
                label=""
                placeHolder="Ch???n qu???n, huy???n"
                labelWidth="0px"
                rules={[{ require: true, message: "Ch??a ch???n qu???n, huy???n" }]}
              />
              <Select
                name="wardId"
                value={this.state.wardId}
                firstSubmit={firstSubmit}
                options={optionWards}
                onChange={this.onChange}
                label=""
                placeHolder="Ch???n ph?????ng, x??"
                labelWidth="0px"
                rules={[{ require: true, message: "Ch??a ch???n ph?????ng, x??" }]}
              />
              <Input
                name="streetOrBuilding"
                value={this.state.streetOrBuilding}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                label=""
                placeHolder="Nh???p ?????a ch??? c???a b???n"
                labelWidth="0px"
                rules={[
                  { require: true, message: "Ch??a nh???p ?????a ch???" },
                  { max: 255, message: "Kh??ng nh???p qu?? 255 k?? t???" },
                ]}
              />

              <div className="form-group btn-container">{button_submit}</div>
              <div className="form-group text-center mrb-100">
                <span>
                  B???n ???? c?? t??i kho???n? <Link to="/Login">????ng nh???p ngay</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    districtsReducer: state.districtsReducer,
    citiesReducer: state.citiesReducer,
    userRegisterReducer: state.userRegisterReducer,
    userInfoReducer: state.userInfoReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    register: (register) => {
      dispatch(registerRequest(register));
    },
    fetchCities: () => {
      dispatch(fetchCitiesRequest());
    },
    fetchDistricts: (id) => {
      dispatch(fetchDistrictsRequest(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Register));
