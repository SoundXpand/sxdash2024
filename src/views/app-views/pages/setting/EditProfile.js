import React, { Component } from 'react';
import { Form, Avatar, Button, Input, DatePicker, Row, Col, message, Upload } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import Flex from 'components/shared-components/Flex';
import { db } from 'configs/firebase';
import { auth } from 'configs/firebaseAuth';
import { connect } from 'react-redux';
import moment from 'moment';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import CountrySelect from 'components/shared-components/New/CountrySelect';

class EditProfile extends Component {

  avatarEndpoint = 'https://www.mocky.io/v2/5cc8019d300000980a055e76';

  state = {
    avatarUrl: '',
    name: '',
    email: '',
    userName: '',
    dateOfBirth: null,
    phoneNumber: '',
    website: '',
    address: '',
    city: '',
    postcode: '',
    country: '',
    ip: '',
    userUID: '',
    datetimeUpdated: ''
  };

  formRef = React.createRef();

  componentDidMount() {
    const { userUID } = this.props;
    if (userUID) {
      const userDocRef = doc(db, 'users', userUID);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.setState({
            avatarUrl: userData.avatarUrl || '',
            name: userData.name || '',
            userName: userData.userName || '',
            dateOfBirth: userData.dateOfBirth ? moment(userData.dateOfBirth.toDate()) : null,
            phoneNumber: userData.phoneNumber || '',
            website: userData.website || '',
            address: userData.address || '',
            city: userData.city || '',
            postcode: userData.postcode || '',
            country: userData.country || '',
            UserUID: userData.UserUID || ''
          }, () => {
            // Update form values after fetching data
            this.formRef.current.setFieldsValue({
              name: this.state.name,
              username: this.state.userName,
              dateOfBirth: this.state.dateOfBirth,
              phoneNumber: this.state.phoneNumber,
              website: this.state.website,
              address: this.state.address,
              city: this.state.city,
              postcode: this.state.postcode,
              country: this.state.country
            });
          });
        }
      }).catch(error => {
        console.error('Error fetching user data:', error);
      });

      //fetch from firebase auth
      this.fetchUserEmail();

      // Fetch IP address
      fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          this.setState({ ip: data.ip });
        })
        .catch(error => {
          console.error('Error fetching IP address:', error);
        });
    }
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  sanitizeData = (data) => {
    const sanitizedData = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        sanitizedData[key] = data[key];
      }
    });
    return sanitizedData;
  };

  fetchUserEmail = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userEmail = currentUser.email;
      this.setState({ email: userEmail }, () => {
        // Update form values after fetching data
        this.formRef.current.setFieldsValue({
          email: this.state.email,
        });
      });
    }
  };
  

  render() {
    const { userUID } = this.props;
    const { name, email, userName, dateOfBirth, phoneNumber, website, address, city, postcode, country, avatarUrl, ip } = this.state;

    const onFinish = values => {
      const key = 'updatable';
      message.loading({ content: 'Updating...', key });
      const datetimeUpdated = new Date();
      const sanitizedValues = this.sanitizeData({
        name: values.name,
        email: values.email,
        userName: values.username,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toDate() : null,
        phoneNumber: values.phoneNumber,
        website: values.website,
        address: values.address,
        city: values.city,
        postcode: values.postcode,
        country: values.country,
        avatarUrl: this.state.avatarUrl,
        userUID: userUID,
        ip: ip,
        datetimeUpdated: datetimeUpdated,
      });

      setTimeout(() => {
        this.setState(sanitizedValues);

        if (userUID) {
          const userDocRef = doc(db, 'users', userUID);
          setDoc(userDocRef, sanitizedValues, { merge: true })
            .then(() => {
              message.success({ content: 'Done!', key, duration: 2 });
            })
            .catch(error => {
              console.error('Error updating user data:', error);
              message.error({ content: 'Failed to update!', key, duration: 2 });
            });
        }
      }, 1000);
    };

    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };

    const onUploadAvatar = info => {
      const key = 'updatable';
      if (info.file.status === 'uploading') {
        message.loading({ content: 'Uploading...', key, duration: 1000 });
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            avatarUrl: imageUrl,
          }),
        );
        message.success({ content: 'Uploaded!', key, duration: 1.5 });
      }
    };

    const onRemoveAvatar = () => {
      this.setState({
        avatarUrl: ''
      });
    };

    return (
      <>
        <Flex alignItems="center" mobileFlex={false} className="text-center text-md-left">
          <Avatar size={90} icon={<UserOutlined />} />
          <div className="ml-3 mt-md-0 mt-3">
            <Upload onChange={onUploadAvatar} showUploadList={false} action={this.avatarEndpoint}>
              <Button type="primary">Change Avatar</Button>
            </Upload>
            <Button className="ml-2" onClick={onRemoveAvatar}>Remove</Button>
          </div>
        </Flex>
        <div className="mt-4">
          <Form
            ref={this.formRef}
            name="basicInformation"
            layout="vertical"
            initialValues={{
              name: name,
              email: email,
              username: userName,
              dateOfBirth: dateOfBirth,
              phoneNumber: phoneNumber,
              website: website,
              address: address,
              city: city,
              postcode: postcode,
              country: country,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={16}>
              <Row gutter={ROW_GUTTER}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input disabled={name} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input disabled={userName} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
          >
            <Input disabled={email} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[
              {
                required: true,
                type: 'object',
                message: 'Please select a date of birth!',
              },
            ]}
          >
            <DatePicker disabled={dateOfBirth} className="w-100" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Website"
            name="website"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Street Address"
            name="address"
            rules={[
              {
                required: true,
                message: 'Please enter a valid address!',
              },
            ]}
          >
            <Input disabled={address} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="City"
            name="city"
            rules={[
              {
                required: true,
                message: 'Please enter a valid city!',
              },
            ]}
          >
            <Input disabled={city} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Post code"
            name="postcode"
            rules={[
              {
                required: true,
                message: 'Please enter a valid post code!',
              },
            ]}
          >
            <Input disabled={postcode} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Country"
            name="country"
            rules={[
              {
                required: true,
                message: 'Please select your country!',
              },
            ]}
          >
            <CountrySelect disabled={!country} />
          </Form.Item>
        </Col>
      </Row>
                <Button type="primary" htmlType="submit">
                  Save Change
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    userUID: state.auth.userUID,
  };
};

export default connect(mapStateToProps)(EditProfile);
