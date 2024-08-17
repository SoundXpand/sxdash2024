import React, { Component } from 'react';
import { Table, Button, Tooltip, Form, Modal, Input, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { db, auth } from 'configs/firebaseAuth';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const { Column } = Table;

const AddNewBankAccountForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const validateAccountNumbers = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('accountNumber') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The account numbers do not match!'));
    },
  });

  return (
    <Modal
      title="Add new beneficiary bank account"
      visible={visible}
      okText="Save account"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <span>We only process royalties in INR. Please provide Indian banks only.</span>
      <Form
        form={form}
        name="addBankAccountForm"
        layout="vertical"
        className="pt-4"
      >
        <Form.Item
          label="Account Holder Name"
          name="accountHolderName"
          rules={[{ required: true, message: 'Please enter account holder name!' }]}
        >
          <Input placeholder="Account holder name" />
        </Form.Item>
        <Form.Item
          label="Account Number"
          name="accountNumber"
          rules={[{ required: true, message: 'Please enter account number!' }]}
        >
          <Input.Password placeholder="Account number" />
        </Form.Item>
        <Form.Item
          label="Confirm Account Number"
          name="confirmAccountNumber"
          rules={[{ required: true, message: 'Please confirm account number!' },
            validateAccountNumbers
          ]}
        >
          <Input placeholder="Confirm Account number" />
        </Form.Item>
        <Form.Item
          label="Bank Name"
          name="bankName"
          rules={[{ required: true, message: 'Please enter bank name!' }]}
        >
          <Input placeholder="Bank name" />
        </Form.Item>
        <Form.Item
          label="IFSC Code"
          name="IFSCCode"
          rules={[{ required: true, message: 'Please enter IFSC Code!' }]}
        >
          <Input placeholder="IFSC Code" />
        </Form.Item>
        <Form.Item
          label="Address"
          name="fullAddress"
          rules={[{ required: true, message: 'Please enter address!' }]}
        >
          <Input placeholder="House/Door No, Street Name, Locality, City, State, Pincode" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

class TransferMethods extends Component {
  state = {
    selectedRowKeys: [],
    bankAccounts: [],
    modalVisible: false,
  };

  componentDidMount() {
    this.fetchBankAccounts();
  }

  fetchBankAccounts = async () => {
    const user = auth.currentUser;
    if (user) {
      const userUID = user.uid;
      const q = query(collection(db, 'user-trsfr-met'), where('userUID', '==', userUID));
      const querySnapshot = await getDocs(q);
      const bankAccounts = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        key: doc.id,
      }));
      const activeAccount = bankAccounts.find(account => account.active);
      this.setState({
        bankAccounts,
        selectedRowKeys: activeAccount ? [activeAccount.key] : [],
      });
    }
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys }, () => {
      this.setActiveMethod(selectedRowKeys[0]);
    });
  };

  setActiveMethod = async (activeKey) => {
    const { bankAccounts } = this.state;
    const user = auth.currentUser;
    if (user) {
      const userUID = user.uid;
      const q = query(collection(db, 'user-trsfr-met'), where('userUID', '==', userUID));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { active: doc.id === activeKey });
      });
      this.fetchBankAccounts();
    }
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  addBankAccount = async (values) => {
    const user = auth.currentUser;
    if (user) {
      const userUID = user.uid;
      const q = query(collection(db, 'user-trsfr-met'), where('userUID', '==', userUID));
      const querySnapshot = await getDocs(q);
      const isFirstAccount = querySnapshot.empty;

      await addDoc(collection(db, 'user-trsfr-met'), {
        ...values,
        userUID,
        active: isFirstAccount, // Set the first account as active
      });

      this.fetchBankAccounts();
      this.setState({
        modalVisible: false,
      });
    }
  };

  removeBankAccount = async (key) => {
    try {
      await deleteDoc(doc(db, 'user-trsfr-met', key));
      this.setState({
        bankAccounts: this.state.bankAccounts.filter(account => account.key !== key),
        selectedRowKeys: this.state.selectedRowKeys.filter(selectedKey => selectedKey !== key),
      });
      this.fetchBankAccounts();
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  render() {
    const { selectedRowKeys, bankAccounts, modalVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: this.onSelectChange,
    };

    const locale = {
      emptyText: (
        <div className="text-center my-4">
          <img src="/img/others/img-7.png" alt="Add bank account" style={{ maxWidth: '90px' }} />
          <h3 className="mt-3 font-weight-light">Please add a bank account!</h3>
        </div>
      ),
    };

    return (
      <>
        <h2 className="mb-4">Bank Account Details</h2>
        <Table locale={locale} dataSource={bankAccounts} rowSelection={rowSelection} pagination={false}>
          <Column title="Account Holder Name" dataIndex="accountHolderName" key="accountHolderName" />
          <Column title="Account Number" dataIndex="accountNumber" key="accountNumber" />
          <Column title="Bank Name" dataIndex="bankName" key="bankName" />
          <Column title="IFSC Code" dataIndex="IFSCCode" key="IFSCCode" />
          <Column title="Address" dataIndex="fullAddress" key="fullAddress" />
          <Column
            title=""
            key="actions"
            className="text-right"
            render={(text, record) => (
              <Tooltip title="Remove account">
                <Button
                  type="text"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={() => this.removeBankAccount(record.key)}
                />
              </Tooltip>
            )}
          />
        </Table>
        <div className="mt-3 text-right">
          <Button type="primary" onClick={this.showModal}>Add new account</Button>
        </div>
        <AddNewBankAccountForm visible={modalVisible} onCreate={this.addBankAccount} onCancel={this.closeModal} />
      </>
    );
  }
}

export default TransferMethods;
