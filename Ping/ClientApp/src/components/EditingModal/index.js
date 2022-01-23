import React, { useEffect } from "react";
import { Button, Form, Modal, Input, InputNumber, AutoComplete, Divider, Select } from 'antd';
const { Option } = Select;
const EditingModal = (props) => {
    const [form] = Form.useForm();

    useEffect(() =>
        form.resetFields(),
        [props.selectedData]);

    return (
        <Modal
            title="Düzenle"
            visible={props.isEditing}
            onCancel={props.onClose}
            footer={null}

        >
            <Form
                onFinish={props.editingData}
                onChange={(newFields) => {
                    console.log(newFields);
                }}
                form={form}
            >
                <Form.Item
                    name={['siteEdit', 'firmaName']}
                    label="Firma Adı"
                    rules={[
                        {
                            required: true,
                            message: 'Lütfen Firma Adını Giriniz!'
                        },
                    ]}
                    initialValue={props.selectedData?.firmaName}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['siteEdit', 'firmaUrl']}
                    label="Sayfa Url"
                    rules={[
                        {
                            required: true,
                            message: "Lütfen Firmanın Url'sini Giriniz!"
                        },
                    ]}
                    initialValue={props.selectedData?.firmaUrl}

                >
                    <AutoComplete options={props.websiteOptions} onChange={props.onWebsiteChange}>
                        <Input />
                    </AutoComplete>
                </Form.Item>
                <Form.Item
                    name={['siteEdit', 'kontrolZamanı']}
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
                    initialValue={props.selectedData?.kontrolZamanı}

                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name={['siteEdit', 'denemeSayısı']}
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
                    initialValue={props.selectedData?.denemeSayısı}

                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name={['siteEdit', 'statusId']}
                    label="Durum"
                    rules={[
                        {
                            required: true,
                            message: 'Lütfen Aktif veya Pasifliğini Seçiniz',
                        },
                    ]}
                    initialValue={props.selectedData?.statusId}

                >
                    <Select>
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

export default EditingModal;