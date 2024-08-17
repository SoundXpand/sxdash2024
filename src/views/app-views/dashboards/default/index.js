import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table, Tag, Steps, message } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import Card from 'components/shared-components/Card';
import { useSelector } from 'react-redux';
import { db } from 'configs/firebaseAuth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const { Step } = Steps;

const tableColumns = [
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName',
    render: (text, record) => (
      <div className="d-flex align-items-center">
        <AvatarStatus shape="square" size={30} src={record.image} name={record.productName} />
        <span className="ml-2">{text}</span>
      </div>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Uploaded On',
    dataIndex: 'uploadedOn',
    key: 'uploadedOn',
  },
];

const AccountCompletion = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([
    { title: 'Account Created', description: 'Account is created and completed.', status: 'wait', path: '/', buttonText: 'Complete Now' },
    { title: 'Distribution Agreement', description: 'User agreement accepted.', status: 'wait', path: '/setting/edit-profile', buttonText: 'Complete Now' },
    { title: 'Account Setup', description: 'Account setup completed.', status: 'wait', path: '/agreement', buttonText: 'Complete Now' },
  ]);

  const userUID = useSelector((state) => state.auth.userUID);

  useEffect(() => {
    if (userUID) {
      handleStepCompletion();
    }
  }, [userUID]);

  const handleStepCompletion = async () => {
    if (!userUID) {
      message.error('No user is logged in.');
      return;
    }
  
    const userDocRef = doc(db, 'users', userUID);
    const userDoc = await getDoc(userDocRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      updateStepStatus(0, 'finish');
  
      if (userData.agreement === 'agreed') {
        updateStepStatus(1, 'finish');
        updateStepStatus(2, 'finish');
  
        if (!userData.setupCompleteMessageShown) {
          message.success('Account setup is complete!');
          await updateDoc(userDocRef, { setupCompleteMessageShown: true });
        }
      } else {
        updateStepStatus(1, 'error');
        message.error('User agreement is not agreed.');
      }
    } else {
      updateStepStatus(0, 'error');
      message.error('Account creation not completed.');
    }
  };

  const updateStepStatus = (stepIndex, status) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[stepIndex].status = status;
      return newSteps;
    });
    setCurrentStep(stepIndex + 1);
  };

  const renderStepButton = (step, index) => {
    if (currentStep === index) {
      return (
        <Button key={index} type="primary" href={step.path}>
          {step.buttonText}
        </Button>
      );
    }
    return null;
  };

  const allStepsCompleted = steps.every(step => step.status === 'finish');

  return (
    <Card title="Account Completion">
      <Steps direction="vertical" current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} description={step.description} status={step.status} />
        ))}
      </Steps>
      <div style={{ marginTop: 20 }}>
        {steps.map((step, index) => renderStepButton(step, index))}
        {allStepsCompleted && (
          <Button type="primary" href="/new-path">
            Add New Release
          </Button>
        )}
      </div>
    </Card>
  );
};

export const DefaultDashboard = () => {
  const [products, setProducts] = useState([]);
  const userUID = useSelector((state) => state.auth.userUID);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userUID) return;

      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('userUID', '==', userUID));
      const querySnapshot = await getDocs(q);

      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, [userUID]);

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={18}>
          <Card title="User Uploaded Products">
            <Table 
              className="no-border-last" 
              columns={tableColumns} 
              dataSource={products} 
              rowKey='id' 
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <AccountCompletion />
        </Col>
      </Row>
    </>
  );
};

export default DefaultDashboard;
