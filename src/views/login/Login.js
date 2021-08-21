import React from 'react'
import { Form, Button, Input, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Particles from 'react-particles-js';
import './Login.css';
import axios from 'axios';

export default function Login (props) {

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18, offset: 3 },
    };

    const onFinish = (values) => {
        console.log(values);
        axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
            .then((res) => {
                console.log(res.data);
                if (res.data.length === 0) {
                    message.error("用户名或密码不正确")
                }
                else {
                    localStorage.setItem('token', JSON.stringify(res.data[0]));
                    props.history.push('/')
                }
            })
    }

    return (
        <div style={{ height: '100%', background: '#39c5bb', overflow: 'hidden' }}>
            <Particles height={document.documentElement.clientHeight} />
            <div className="formContainer">
                <h2>请输入登录信息</h2>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        {...formItemLayout}
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    {/* <Form.Item
                        {...formItemLayout}
                    >
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item> */}

                    <Form.Item
                        {...formItemLayout}
                    >
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
