import { Form, Input, Button, message } from 'antd';
import parisping from './Img/parisping.png';
import React, { useEffect, } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Login.css';





const Login = () => {
    const history = useHistory();

    useEffect(() => {
        const logedIn = JSON.parse(localStorage.getItem('logedIn'));
        if (logedIn === true) {
            history.push('/home')
        }
    })


    const onFinish = async (e) => {
        await axios.post('/api/Users/login', e, { withCredentials: 'include' })

            .then(function (response) {
                console.log(response);
                message.success('Giriş Başarılı!');
                localStorage.setItem('logedIn', true);
                history.push('/home');
            })
            .catch(function (error) {
                console.log(error);
                message.error('Hatalı Giriş!');
            });

    };

    const onFinishFailed = (e) => {
        history.push('/')
        console.log('Failed:', e);
    };

    return (
        <div className="container text-center mt-5 p-3 min-max-w">
            <div className="shadow-lg bg-body rounded-3 p-4 a">
                <Form
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className="mt-4"
                >
                    <img className="mx-auto" width={200} src={parisping}></img>
                    
                    <p class="h5 mb-3 mt-3 "> Giriş Yap</p>
                <Form.Item
                    label="Email"
                    name="Email"
                        rules={[{ required: true, message: 'Lütfen E-Mail Adresinizi Giriniz!' }]}
                        className="mt-4"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="Password"
                    rules={[{ required: true, message: 'Lütfen Parolanızı Giriniz!' }]}
                >
                    <Input.Password />
                </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                        <Button className="px-5" type="primary" htmlType="submit">
                        Giriş
                    </Button>
                </Form.Item>
                </Form>
        </div>
        </div >
    );
}
export default Login;