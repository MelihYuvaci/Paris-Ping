import React, { useEffect, useState, useRef } from "react";
import { Tabs, Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import { Pagination } from 'antd';
import axios from 'axios';
import { useHistory } from "react-router-dom";



const SiderDemo = () => {

    const { Search } = Input;
    const { TabPane } = Tabs;

    const changeTab = activeKey => {
        if (activeKey === "1") {
            getProduct();
        } else {
            getProduct(activeKey)
        }

    };
    const history = useHistory();
    const [response, setResponse] = useState([])

    const companyNameRef = useRef();
    const companyAdressRef = useRef();
    const pageIndexRef = useRef();
    const pageSizeRef = useRef();


    const [loading, setLoading] = useState(false)
    const [companyName, setCompanyName] = useState('')
    const [companyAdress, setCompanyAdress] = useState('')
    const [pageIndex, setPageIndex] = useState('')
    const [pageSize, setPageSize] = useState('')



    useEffect(() => {
        const loggedIn = JSON.parse(localStorage.getItem('logedIn'));

        if (loggedIn !== true) {
            history.push('/')
        }
        if (response.length === 0) {
            getProduct()
        }
        if (companyNameRef.current !== companyName || companyAdressRef.current !== companyAdress || pageIndexRef.current !== pageIndex || pageSizeRef.current !== pageSize) {
            getProduct();
        }

        companyNameRef.current = companyName;
        companyAdressRef.current = companyAdress;
        pageIndexRef.current = pageIndex;
        pageSizeRef.current = pageSize;


    }, [companyName, companyAdress, pageIndex, pageSize]);


    const columns = [

        {
            title: "Firma Adı",
            key: 'firmaName',
            dataIndex: 'firmaName',
            filterDropdown: () => {
                return (
                    <>
                        <Search placeholder="Aramanızı giriniz" allowClear onSearch={(e) => setCompanyName(e)} />
                    </>
                );

            },
            filterIcon: () => {
                return <SearchOutlined />
            },
            onFilter: (value, record) => {
                return record.firmaName.toLowerCase().includes(value.toLowerCase())
            },

        },
        {
            title: "Sayfa URL",
            key: 'firmaUrl',
            dataIndex: 'firmaUrl',
            filterDropdown: () => {
                return (
                    <>
                        <Search placeholder="Aramanızı giriniz" allowClear onSearch={(e) => setCompanyAdress(e)} />
                    </>
                );

            },
            filterIcon: () => {
                return <SearchOutlined />
            },
            onFilter: (value, record) => {
                return record.firmaUrl.toLowerCase().includes(value.toLowerCase())
            },

        },
        {
            title: "Kontrol Zamanı (dk)",
            key: 'kontrolZamanı',
            dataIndex: 'kontrolZamanı',

        },
        {
            title: "Deneme Sayısı",
            key: 'denemeSayısı',
            dataIndex: 'denemeSayısı',

        },
        {
            title: "Durum",
            key: 'statusId',
            dataIndex: 'statusId',
            render: (_, id) => {
                return <>
                    <div>
                        <p className={id.statusId === 3 ? 'btn btn-danger btn-sm m-0 ' : id.statusId === 2 ? 'btn btn-primary btn-sm m-0' : 'btn btn-light btn-sm m-0'}>{id.statusId === 3 ? 'Pasif' : id.statusId === 2 ? 'Aktif' : 'Girilmemiş'} </p>
                        {/*style={{ color: id.statusId === 3 ? 'red' : id.statusId === 2 ? 'green' : 'black' }}*/}
                    </div>
                </>
            }
        },
    ]

    const paginationChange = (page, pageSize) => {
        setPageIndex(page)
        setPageSize(pageSize)
    }

    const getProduct = async (StatusId) => {
        const firmaIsmi = companyName !== '' ? 'CompanyName=' + companyName : ''
        const firmaSiteAdresi = companyAdress !== '' ? 'CompanyAdress=' + companyAdress : ''
        const paginationPage = pageIndex !== '' ? 'PageIndex=' + pageIndex : ''
        const paginationSize = pageSize !== '' ? 'PageSize=' + pageSize : ''
        setLoading(true);
        var queryText = [firmaIsmi, firmaSiteAdresi, paginationPage, paginationSize].filter(Boolean).join("&");
        var url = '/api/Products?' + queryText;
        if (StatusId) {
            setLoading(true);
            url += 'StatusId=' + StatusId + queryText;
        }
        await axios.get(url)
            .then(function (response) {
                // handle success
                setResponse(response.data)
                console.log('response', response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                setLoading(false);
            });
    }


    return (
        <Tabs defaultActiveKey="1" centered onChange={changeTab}>
            <TabPane tab="Tüm Sayfalar" key="1">
                <Table
                    columns={columns}
                    dataSource={response.data !== undefined ? response.data : []}
                    loading={loading}
                    pagination={false}
                >
                </Table>
                <Pagination className="mt-4 float-right" onChange={paginationChange} defaultCurrent={1} defaultPageSize={10} total={response.total} />
            </TabPane>
            <TabPane tab="Kontrol Edilenler" key="2">

                <Table
                    columns={columns}
                    dataSource={response.data !== undefined ? response.data : []}
                    loading={loading}
                    pagination={false}
                >
                </Table>
                <Pagination className="mt-4 float-right" onChange={paginationChange} defaultCurrent={1} defaultPageSize={10} total={response.total} />
            </TabPane>
            <TabPane tab="Hata Verenler" key="3">
                <Table
                    columns={columns}
                    dataSource={response.data !== undefined ? response.data : []}
                    loading={loading}
                    pagination={false}
                >
                </Table>
                <Pagination className="mt-4 float-right" onChange={paginationChange} defaultCurrent={1} defaultPageSize={10} total={response.total} />
            </TabPane>
        </Tabs>

    );


}
export default SiderDemo;