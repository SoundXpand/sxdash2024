import React, { Component } from 'react'
import { UserOutlined, CreditCardOutlined} from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, Route, Navigate, useLocation, Routes } from 'react-router-dom';
import InnerAppLayout from 'layouts/inner-app-layout';
import EditProfile from './EditProfile';
import TransferMethods from './TransferMethods';

const url = '/setting'

const MenuItem = ({icon, path, label}) => {

	return (
		<>
			{icon}
			<span>{label}</span>
			<Link to={`${url}/${path}`} />
		</>
	)
}

const SettingOption = () => {

	const location = useLocation();

	const locationPath = location.pathname.split('/')

	const currentpath = locationPath[locationPath.length - 1]

	return (
		<Menu
			mode="inline"
			selectedKeys={[currentpath]}
			items={[
				{
					key: 'edit-profile',
					label: <MenuItem label="Edit Profile" icon={<UserOutlined />} path="edit-profile" />
				},
				{
					key: 'transfer-methods',
					label: <MenuItem label="Transfer Methods" icon={<CreditCardOutlined />} path="transfer-methods" />
				},
			]}
		/>
	);
};

const SettingContent = () => {

	return (
		<Routes>
			<Route path="edit-profile" element={<EditProfile />} />
			<Route path="transfer-methods" element={<TransferMethods />} />
			<Route path="*" element={<Navigate to="edit-profile" replace />} />
		</Routes>
	)
}

export class Setting extends Component {
	render() {
		return (
			<InnerAppLayout 
				sideContentWidth={320}
				sideContent={<SettingOption />}
				mainContent={<SettingContent />}
			/>
    	);
	}
}

export default Setting
