import React, { Component, memo } from "react";
import "./ChangeProfile.css";
import Input from "../../common/formField/Input";
import Select from "../../common/formField/Select";

class ChangeProfile extends Component {
  constructor(props) {
    super(props);
    var { userProfile } = this.props.userProfileReducer;
    this.state = {
      name: "",
      birthday: "",
      male: "",
      image: "",
      data: "",
      updateImage: false,
      oldImage: userProfile.image,
      firstSubmit: false,
      errors: {
        name: "",
        birthday: "",
      },
      showAlert: false,
    };
  }

  componentDidMount() {
    const { userProfile } = this.props.userProfileReducer;
    this.setState({
      name: userProfile.name,
      birthday: userProfile.birthday,
      male: userProfile.male ? userProfile.male : true,
      image: userProfile.image,
    });
  }

  onChange = (e) => {
    var target = e.target;
    var { name, value } = target;
    if (name === "data") {
      value = target.files[0];
      this.setState({
        updateImage: true,
        image: URL.createObjectURL(value),
      });
    }
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { name, birthday, male } = this.state;
    if (name !== "" && name.length < 255 && birthday !== "" && male !== "") {
      var data = { name, birthday, male };
      this.props.onUpdateProfile(data);
    }
    this.setState({
      firstSubmit: true,
    });
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  onUploadAvatar = () => {
    var { data } = this.state;
    if (data) {
      this.props.onUpdateAvatar(data);
      this.setState({
        updateImage: false,
        showAlert: true,
      });
    }
  };

  onEdit = (e) => {
    e.preventDefault();
    this.setState({
      isEditing: true,
    });
    var { userProfile } = this.props.userProfileReducer;
    this.setState({
      name: userProfile.name,
      birthday: userProfile.birthday,
      male:
        userProfile.male === true || userProfile.male === false
          ? userProfile.male
          : true,
    });
  };

  onCancel = (e) => {
    e.preventDefault();
    this.setState({
      isEditing: false,
    });
    var { errors } = this.state;
    errors.name = "";
    this.setState({
      errors,
    });
  };

  render() {
    // const { message } = this.props.userProfileReducer;
    const { changeAvatarMessage, loading } = this.props.userActionReducer;
    const maleOptions = [
      { value: true, label: "Nam" },
      { value: false, label: "N???" },
    ];

    return (
      <div className="change-profile-page">
        <div className="header">
          <div className="title">H??? s?? c???a t??i</div>
          <div className="description">Qu???n l?? th??ng tin c?? nh??n c???a b???n</div>
        </div>
        <div className="body">
          <div className="info">
            <Input
              label="H??? v?? t??n"
              name="name"
              value={this.state.name}
              firstSubmit={this.state.firstSubmit}
              rules={[
                { require: true, message: "Ch??a nh???p h??? t??n" },
                { max: 255, message: "Nh???p d?????i 255 k?? t???" },
              ]}
              labelWidth="100px"
              onChange={this.onChange}
            />
            <Input
              label="Ng??y sinh"
              name="birthday"
              value={this.state.birthday}
              firstSubmit={this.state.firstSubmit}
              rules={[{ require: true, message: "Ch??a nh???p ng??y sinh" }]}
              labelWidth="100px"
              onChange={this.onChange}
              type="date"
            />
            <Select
              name="male"
              value={this.state.male}
              firstSubmit={this.state.firstSubmit}
              label="Gi???i t??nh"
              placeHolder="Ch???n gi???i t??nh"
              labelWidth="100px"
              setValidate={this.setValidate}
              onChange={this.onChange}
              rules={[{ require: true, message: "Ch??a ch???n gi???i t??nh" }]}
              options={maleOptions}
            />
            <div>
              {loading ? (
                <button type="submit" className="btn-submit">
                  ??ang t???i...
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-submit"
                  onClick={this.onSubmit}
                >
                  L??u thay ?????i
                </button>
              )}
            </div>
          </div>
          <div className="avatar">
            <div>
              <input
                type="file"
                className="uploadfile"
                name="data"
                id="data"
                onChange={this.onChange}
              />
              <label className="btn-choose" htmlFor="data">
                <img
                  className="avatar-img"
                  alt={"Avatar"}
                  src={this.state.image}
                ></img>
                <div></div>
              </label>
            </div>
            <div>
              <span className="text-danger">
                {changeAvatarMessage ? changeAvatarMessage : ""}
              </span>
              {this.state.updateImage ? (
                <button onClick={this.onUploadAvatar} className="btn-upload">
                  ?????i ???nh ?????i di???n
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default memo(ChangeProfile);
