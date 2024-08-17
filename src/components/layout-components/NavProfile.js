import React, { useEffect, useState } from 'react';
import { Dropdown, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  EditOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import { signOut } from 'store/slices/authSlice';
import { getDoc, doc } from 'firebase/firestore';
import { db } from 'configs/firebase';
import styled from '@emotion/styled';
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER, FONT_SIZES } from 'constants/ThemeConstant';

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG
}));

const Profile = styled.div(() => ({
  display: 'flex',
  alignItems: 'center'
}));

const UserInfo = styled('div')`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD
}));

const MenuItem = (props) => (
  <Flex as="a" href={props.path} target={props.target} alignItems="center" gap={SPACER[2]}>
    <Icon>{props.icon}</Icon>
    <span>{props.label}</span>
  </Flex>
);

const MenuItemSignOut = (props) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

const items = [
  {
    key: 'Setting',
    label: <MenuItem path="/setting" target="" label="Setting" icon={<EditOutlined />} />,
  },
  {
    key: 'Help Center',
    label: <MenuItem path="https://soundxpand.freshdesk.com/support/home" target="_blank" label="Help Center" icon={<QuestionCircleOutlined />} />,
  },
  {
    key: 'Sign Out',
    label: <MenuItemSignOut label="Sign Out" />,
  }
];

const NavProfile = ({ mode }) => {
  const [user, setUser] = useState(null);
  const userUID = useSelector((state) => state.auth.userUID);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDocRef = doc(db, 'users', userUID);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setUser(userDocSnapshot.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, [userUID]);

  return (
    <Dropdown placement="bottomRight" menu={{ items }} trigger={['click']}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar size={35} icon={<UserOutlined />} />
          <UserInfo className="profile-text">
            {user ? (
              <>
                <Name>{user.name}</Name>
              </>
            ) : (
              <span>{userUID}</span>
            )}
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;
