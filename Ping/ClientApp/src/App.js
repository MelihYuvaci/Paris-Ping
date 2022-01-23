import React from 'react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import './custom.css';
import SiderDemo from './components/Layout';
import 'antd/dist/antd.css'
import { createBrowserHistory } from 'history';
import Sayfalar from './components/Sayfalar';
import Login from './components/Login';
import YapilanIslemler from './components/Yapilan-Islemler';
import axios from 'axios';
import parisping from './components/Img/parisping.png';
import {
    LogoutOutlined,
    HomeOutlined,
    FileOutlined,
    FolderOpenOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

import { useEffect } from 'react';


function App() {
    const history = createBrowserHistory();
    const { Content, Footer, Sider } = Layout;

    useEffect(() => {
        const loggedIn = JSON.parse(localStorage.getItem('logedIn'));
        if (loggedIn !== true) {
            history.push('/')
        }
    });

    const logout = async () => {
        await axios.post('/api/Users/logout', { withCredentials: 'include' })

            .then(function (response) {
                console.log(response);
                localStorage.removeItem('logedIn');
                history.push('/')

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="App">
            <Router history={history}>
                <Switch>
                    <Route path='/' exact component={Login} />
                    <Layout style={{ minHeight: '100vh' }} >
                        <Sider
                            breakpoint="lg"
                            collapsedWidth="0"
                            onBreakpoint={broken => {
                                console.log(broken);
                            }}
                            onCollapse={(collapsed, type) => {
                                console.log(collapsed, type);
                            }}
                            style={{ background: '#fff' }}

                        >
                            <div className="logo">
                                <img className="ml-2" src={parisping} style={{ width: 150 }}></img>
                            </div>
                            <Menu className="mt-5" theme="light" defaultSelectedKeys={['1']} mode="inline">
                                <Menu.Item key="1" icon={<HomeOutlined />}>
                                    <Link to="/home">
                                        Anasayfa</Link>
                                </Menu.Item>

                                <Menu.Item key="2" icon={<FolderOpenOutlined />}>
                                    <Link to="/Sayfalar">
                                        Sayfalar</Link>
                                </Menu.Item>

                                <Menu.Item key="3" icon={<FileOutlined />}>
                                    <Link to="/Yapilan-Islemler">
                                        Yapilan Islemler</Link>
                                </Menu.Item>
                                <Menu.Item onClick={logout} key="4" icon={<LogoutOutlined />}>
                                    Cikis Yap
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout>
                            <Content style={{ margin: '24px 16px 0' }}>
                                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                    <Route path='/home' exact component={SiderDemo} />
                                    <Route path='/Sayfalar' exact component={Sayfalar} />
                                    <Route path='/Yapilan-Islemler' exact component={YapilanIslemler} />
                                </div>
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>DENEME YAZILIM</Footer>
                        </Layout>
                    </Layout>
                </Switch>
            </Router>

        </div>
    );
}

export default App;