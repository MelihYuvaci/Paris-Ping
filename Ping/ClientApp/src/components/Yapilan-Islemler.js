import React, { useEffect, useState, useRef } from 'react';
import { Pagination, Table, Input, DatePicker, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { createBrowserHistory } from 'history';
import axios from 'axios';
import { formatDate } from '../constans';
import moment from 'moment';



const YapilanIslemler = () => {

    const { RangePicker } = DatePicker;
    const { Search } = Input;
    const history = createBrowserHistory();

    const companyNameRef = useRef();
    const dateTimeREf = useRef();
    const statusIdRef = useRef();
    const companyAdressRef = useRef();
    const pageIndexRef = useRef();
    const pageSizeRef = useRef();


    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [companyName, setCompanyName] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [statusId, setStatusId] = useState('')
    const [companyAdress, setCompanyAdress] = useState('')
    const [pageIndex, setPageIndex] = useState('')
    const [pageSize, setPageSize] = useState('')


    useEffect(() => {
        const loggedIn = JSON.parse(localStorage.getItem('logedIn'));
        if (loggedIn !== true) {
            history.push('/')
        }
        if (response.length === 0) {
            getProduct();
        }
        if (companyAdressRef.current !== companyAdress || companyNameRef.current !== companyName ||
            statusIdRef.current !== statusId || dateTimeREf.current !== dateTime || pageIndexRef.current !== pageIndex || pageSizeRef.current !== pageSize) {
            getProduct();
        }
        companyAdressRef.current = companyAdress;
        companyNameRef.current = companyName;
        statusIdRef.current = statusId;
        dateTimeREf.current = dateTime;
        pageIndexRef.current = pageIndex;
        pageSizeRef.current = pageSize;

    }, [companyAdress, companyName, dateTime, pageIndex, statusId, pageSize]);


    

    const columns = [

        {
            title:
                <Space direction="vertical" size={12}>

                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                        }}
                        showTime
                        format="YYYY/MM/DD HH:mm:ss"
                        onChange={dateTimeOnChange}
                    />
                </Space>,
            key: 'dateTime',
            dataIndex: 'dateTime',
        },
        {
            title: "Firma İsmi ",
            key: 'firmaIsmi',
            dataIndex: 'firmaIsmi',
            width: '10%',
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
                return record.firmaIsmi.toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            title: "Firma Url Adresi",
            key: 'firmaSiteAdresi',
            dataIndex: 'firmaSiteAdresi',
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
                return record.firmaSiteAdresi.toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            title: "Açıklama",
            key: 'aciklama',
            dataIndex: 'aciklama',
        },
        {
            title: "Durum",
            key: "statusIdLog",
            dataIndex: "statusIdLog",
            render: (_, id) => {
                return <>
                    <div>
                        <p className={id.statusIdLog === 3 ? 'btn btn-danger btn-sm m-0 ' : id.statusIdLog === 2 ?
                            'btn btn-primary btn-sm m-0' : 'btn btn-light btn-sm m-0'}>{id.statusIdLog === 3 ? 'Wrong' : id.statusIdLog === 2 ? 'Ok' : 'Girilmemiş'} </p>
                    </div>
                </>
            },
            filters: [
                { text: 'Ok', value: 2 },
                { text: 'Wrong', value: 3 }
            ]
        }


    ]

    const onHandleDataChange = async (currentVal = {}, filteringData = null) => {
        setStatusId(filteringData !== null && filteringData.statusIdLog !== null && filteringData.statusIdLog.length === 1 ? filteringData.statusIdLog[0] : '');
    }

    const paginationChange = (page, pageSize) => {
        setPageIndex(page)
        setPageSize(pageSize)
    }

    async function dateTimeOnChange(a, dateStrings) {
        setDateTime(dateStrings);
    }

    const getProduct = async () => {
        const dateTimeStart = dateTime !== '' ? 'DateTimeStart=' + dateTime[0] : ''
        const dateTimeEnd = dateTime !== '' ? 'DateTimeEnd=' + dateTime[1] : ''
        const firmaIsmi = companyName !== '' ? 'CompanyName=' + companyName : ''
        const firmaSiteAdresi = companyAdress !== '' ? 'CompanyAdress=' + companyAdress : ''
        const stdLogStatus = statusId !== '' ? 'StatusId=' + statusId : ''
        const paginationPage = pageIndex !== '' ? 'PageIndex=' + pageIndex : ''
        const paginationSize = pageSize !== '' ? 'PageSize=' + pageSize:''
        setLoading(true);
        var queryText = [firmaIsmi, firmaSiteAdresi, stdLogStatus, dateTimeStart, dateTimeEnd, paginationPage, paginationSize].filter(Boolean).join("&");
        var url = '/api/Logs?' + queryText;

        await axios.get(url)
            .then(function (response) {
                // handle success
                let tempData = { ...response.data };
                console.log(tempData)
                tempData.data.forEach((e, i) => {
                    const obj = { ...e }
                    obj.dateTime = formatDate(e.dateTime);
                    tempData.data[i].dateTime = obj.dateTime
                })
                setResponse(tempData);
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
        <div className="pb-5">
            <Table
                style={{ display: 'flex', flex: 1, margin: 10 }}
                columns={columns}
                dataSource={response.data !== undefined ? response.data : []}
                pagination={false}
                loading={loading}
                onChange={onHandleDataChange}
            ></Table>
            <Pagination className="mt-4 float-right" onChange={paginationChange} defaultCurrent={1} defaultPageSize={10} total={response.total} />
        </div>
    )
}
export default YapilanIslemler;