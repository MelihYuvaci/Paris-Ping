import React, { useEffect } from "react";
import { Button, Form, Modal, Input, InputNumber, AutoComplete, Divider, Select } from 'antd';
const { Option } = Select;

const AddModal = (props) => {

    const [form] = Form.useForm();

    useEffect(() =>
        form.resetFields(),
        [props.isAdding]);


    return (
        <Modal
            title="Sayfa Ekle"
            visible={props.isAdding}
            onCancel={props.onCloseAdding}
            footer={null}
        >
            <Form
                form={form}
                onFinish={props.postData}>
                <Form.Item
                    name={['siteAdding', 'firmaName']}
                    label="Firma Adı"
                    rules={[
                        {
                            required: true,
                            message: 'Lütfen Firma Adını Giriniz!'
                        },
                    ]}
                >
                    <Input placeholder="Firma Adını giriniz" />
                </Form.Item>
                <Form.Item
                    name={['siteAdding', 'firmaUrl']}
                    label="Sayfa Url"
                    rules={[
                        {
                            required: true,
                            message: "Lütfen Firmanın Url'sini Giriniz!"
                        },
                    ]}
                >
                    <AutoComplete options={props.websiteOptions} onChange={props.onWebsiteChange} placeholder="Firma Url'sini giriniz">
                        <Input />
                    </AutoComplete>
                </Form.Item>
                <Form.Item
                    name={['siteAdding', 'kontrolZamanı']}
                    label="Kontrol Zamanı (dk)"
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 99,
                            required: true,
                            message: 'Kontrol Zamanı 0 ve 99 arasında olmalıdır'
                        },
                    ]}
                >
                    <InputNumber placeholder="Kontrol zamanını giriniz" />
                </Form.Item>
                <Form.Item
                    name={['siteAdding', 'denemeSayısı']}
                    label="Deneme Sayısı"
                    rules={[
                        {
                            type: 'number',
                            min: 0,
                            max: 99,
                            required: true,
                            message: 'Deneme Sayısı 0 ve 99 arasında olmalıdır'
                        },
                    ]}
                >
                    <InputNumber placeholder="Deneme sayısını giriniz" />
                </Form.Item>
                <Form.Item
                    name={['siteAdding', 'statusId']}
                    label="Durum"
                    rules={[
                        {
                            required: true,
                            message: "Lütfen Firmanın Aktif veya Pasifliğini Seçiniz!"
                        },
                    ]}
                >
                    <Select placeholder="Aktif veya Pasifliğini Seçiniz">
                        <Option value={2}>Aktif</Option>
                        <Option value={3}>Pasif</Option>
                    </Select>
                </Form.Item>
                <Divider />
                <Form.Item>
                    <Button type="primary" block htmlType="submit">
                        Kaydet
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddModal;