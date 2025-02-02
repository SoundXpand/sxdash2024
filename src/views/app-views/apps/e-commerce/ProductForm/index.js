import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import VariationField from './VariationField'
import ShippingField from './ShippingField'
import ProductListData from "assets/data/product-list.data.json"
import { db } from 'configs/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ADD = 'ADD'
const EDIT = 'EDIT'

const ProductForm = props => {

  const { mode = ADD, param } = props

  const [form] = Form.useForm();
  const [uploadedImg, setImage] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if(mode === EDIT) {
      console.log('is edit')
      console.log('props', props)
      const { id } = param
      const produtId = parseInt(id)
      const productData = ProductListData.filter( product => product.id === produtId)
      const product = productData[0]
      form.setFieldsValue({
        comparePrice: 0.00,
        cost: 0.00,
        taxRate: 6,
        description: 'There are many variations of passages of Lorem Ipsum available.',
        category: product.category,
        name: product.name,
        price: product.price
      });
      setImage(product.image)
    }
  }, [form, mode, param, props]);

  const handleUploadChange = info => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl =>{
        setImage(imageUrl)
        setUploadLoading(true)
      });
    }
  };

  const onFinish = async () => {
    setSubmitLoading(true)
    form.validateFields().then(async values => {
      try {
        const productData = {
          ...values,
          image: uploadedImg
        };
        if(mode === ADD) {
          await addDoc(collection(db, 'products'), productData);
          message.success(`Created ${values.name} to product list`);
        } else if(mode === EDIT) {
          const { id } = param;
          const productDocRef = doc(db, 'products', id);
          await updateDoc(productDocRef, productData);
          message.success('Product saved');
        }
      } catch (error) {
        console.error('Error saving product: ', error);
        message.error('Failed to save product');
      } finally {
        setSubmitLoading(false);
      }
    }).catch(info => {
      setSubmitLoading(false)
      console.log('info', info)
      message.error('Please enter all required fields');
    });
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          heightUnit: 'cm',
          widthUnit: 'cm',
          weightUnit: 'kg'
        }}
      >
        <PageHeaderAlt className="border-bottom" overlap>
          <div className="container">
            <Flex className="py-2" mobileFlex={false} justifyContent="space-between" alignItems="center">
              <h2 className="mb-3">{mode === 'ADD'? 'Add New Product' : `Edit Product`} </h2>
              <div className="mb-3">
                <Button className="mr-2">Discard</Button>
                <Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
                  {mode === 'ADD'? 'Add' : `Save`}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Tabs 
            defaultActiveKey="1" 
            style={{marginTop: 30}}
            items={[
              {
                label: 'General',
                key: '1',
                children: <GeneralField 
                  uploadedImg={uploadedImg} 
                  uploadLoading={uploadLoading} 
                  handleUploadChange={handleUploadChange}
                />,
              },
              {
                label: 'Variation',
                key: '2',
                children: <VariationField />,
              },
              {
                label: 'Shipping',
                key: '3',
                children: <ShippingField />,
              },
            ]}
          />
        </div>
      </Form>
    </>
  )
}

export default ProductForm
