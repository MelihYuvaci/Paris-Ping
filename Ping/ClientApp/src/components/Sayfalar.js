import { Table, Button,  Modal, Input } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { Pagination } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import EditingModal from './EditingModal';
import AddModal from './AddModal';





const Sayfalar = () => {

    const { Search } = Input;
    const history = useHistory()

    const companyNameRef = useRef();
    const companyAdressRef = useRef();
    const statusIdRef = useRef();
    const pageIndexRef = useRef();
    const pageSizeRef = useRef();



    const [companyName, setCompanyName] = useState('')
    const [companyAdress, setCompanyAdress] = useState('')
    const [statusId, setStatusId] = useState('')
    const [pageIndex, setPageIndex] = useState('')
    const [pageSize, setPageSize] = useState('')



    const [response, setResponse] = useState([])
    const [isAdding, setIsAdding] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedData, setSelectedData] = useState({});
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const loggedIn = JSON.parse(localStorage.getItem('logedIn'));
        if (loggedIn !== true) {
            history.push('/')
        }
        else {
            if (companyNameRef.current !== companyName || companyAdressRef.current !== companyAdress ||
                statusIdRef.current !== statusId || pageIndexRef.current !== pageIndex || response.length === 0 || pageSizeRef.current !== pageSize) {
                getProduct()
            }
        }
        companyNameRef.current = companyName;
        companyAdressRef.current = companyAdress;
        statusIdRef.current = statusId;
        pageIndexRef.current = pageIndex;
        pageSizeRef.current = pageSize;
    });

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
            },
            filters: [
                { text: 'Aktif', value: 2 },
                { text: 'Pasif', value: 3 },

            ],
        },
        {
            title: "Düzenle/Sil",
            key: "silDuzenle",
            dataIndex: "silDuzenle",
            render: (_, id) => {
                return <>
                    <div>
                        <EditOutlined onClick={() => editData(id)} style={{ marginLeft: 10 }} />
                        <DeleteOutlined onClick={() => deleteData(id)} style={{ marginLeft: 20 }} className="text-danger" />
                    </div>
                </>
            }
        }
    ]

    const onHandleDataChange = async (currentVal = {}, filteringData = null) => {
        setStatusId(filteringData !== null && filteringData.statusId !== null && filteringData.statusId.length === 1 ? filteringData.statusId[0] : '');
    }
    const paginationChange = (page,pageSize) => {
        setPageIndex(page)
        setPageSize(pageSize)
    }

    const getProduct = async () => {
        const firmaIsmi = companyName !== '' ? 'CompanyName=' + companyName : ''
        const firmaSiteAdresi = companyAdress !== '' ? 'CompanyAdress=' + companyAdress : ''
        const stdLogStatus = statusId !== '' ? 'StatusId=' + statusId : ''
        const paginationPage = pageIndex !== '' ? 'PageIndex=' + pageIndex : ''
        const paginationSize = pageSize !== '' ? 'PageSize=' + pageSize : ''
        setLoading(true);
        var queryText = [firmaIsmi, firmaSiteAdresi, stdLogStatus, paginationPage, paginationSize].filter(Boolean).join("&");
        var url = '/api/Products?' + queryText;
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

    const postingData = async () => {
        setIsAdding(true)
    }

    const postData = async (e) => {
        const postedData = {
            StatusId: e.siteAdding.statusId,
            FirmaName: e.siteAdding.firmaName,
            FirmaUrl: e.siteAdding.firmaUrl,
            KontrolZamanı: e.siteAdding.kontrolZamanı,
            DenemeSayısı: e.siteAdding.denemeSayısı
        };
        console.log("addedPost", postedData, e);
        setLoading(true);
        await axios({
            method: 'post',
            url: '/api/Products',
            data: postedData,
        });
        await getProduct()
        setIsAdding(false)
        setLoading(false);
    }

    const editData = async (e) => {
        setSelectedData(e)
        setIsEditing(true)
    }

    const editingData = (e) => {
        const updatedPost = {
            Id: e.siteEdit.id,
            StatusId: e.siteEdit.statusId,
            FirmaName: e.siteEdit.firmaName,
            FirmaUrl: e.siteEdit.firmaUrl,
            KontrolZamanı: e.siteEdit.kontrolZamanı,
            DenemeSayısı: e.siteEdit.denemeSayısı
        };
        console.log("updatedPost", updatedPost, e);
        setLoading(true);
        axios.put(`/api/Products/${selectedData.id}`, updatedPost)
            .then(res => {
                this.setState({
                    updatedPost: res
                });
            })
            .catch((err) => {
                console.log(err);
            })
            .then(() => getProduct())
        setIsEditing(false)
        setLoading(false);
        console.log(e)
    }

    const deleteData = async (e) => {
        const id = e.id
        Modal.confirm({
            title: "Silmek istediğinize emin misiniz?",
            onOk: () => {
                setLoading(true);
                axios.delete(`/api/Products/${id}`)
                    .then(response => console.log("Deleted!!!", response))
                    .then(error => console.log(error))
                    .then(() => getProduct())
                setLoading(false);

            }
        })
    }

    const onWebsiteChange = (value) => {
        if (!value) {
            setAutoCompleteResult([]);
        } else {
            setAutoCompleteResult(['.com/healthcheck', '.org/healthcheck', '.net/healthcheck'].map((domain) => `${value}${domain}`));
        }
    };

    const websiteOptions = autoCompleteResult.map((website) => ({
        label: website,
        value: website,
    }));

    const onClose = () => {
        setIsEditing(false);
    }
    const onCloseAdding = () => {
        setIsAdding(false);
    }
    return (
        <div className="pb-5">

            <Button onClick={postingData} type="primary" style={{ marginBottom: 16 }}>
                Sayfa Ekle
            </Button>
            <Table
                columns={columns}
                onChange={onHandleDataChange}
                dataSource={response.data !== undefined ? response.data : []}
                loading={loading}
                pagination={false}
            ></Table>
            <Pagination className="mt-4 float-right" onChange={paginationChange} defaultCurrent={1} defaultPageSize={10} total={response.total} />
            <EditingModal editingData={editingData} selectedData={selectedData} onClose={onClose}
                isEditing={isEditing} websiteOptions={websiteOptions} onWebsiteChange={onWebsiteChange}
            />
            <AddModal onCloseAdding={onCloseAdding} isAdding={isAdding} postData={postData} websiteOptions={websiteOptions}
                onWebsiteChange={onWebsiteChange}
            />
        </div>
    )
}
export default Sayfalar;
