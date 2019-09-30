import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Spin, Menu, Icon, Dropdown, Avatar } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

import { BOOKMARK_KOSONG } from '@/constants/status'

import avatar from '../../assets/img/avatar.png';
import styles from './index.less';

@connect(({ publics, user }) => ({
  publics,
  user,
}))

class GlobalHeaderRight extends PureComponent {
  render() {
    const {
      currentUser,
      onMenuClick,
      theme,
      user
    } = this.props

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="editprofile">
          <Icon type="user" />
          <FormattedMessage id="menu.account.editprofile" defaultMessage="Edit Profile" />
        </Menu.Item>
        <Menu.Item key="editpassword">
          <Icon type="key" />
          <FormattedMessage id="menu.account.editprofile" defaultMessage="Edit Password" />
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="Logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <a
          target="_self"
          href="#"
          rel="noopener noreferrer"
          onClick={(e)=>{
          const { dispatch } = this.props
          dispatch({
             type: 'publics/setBerandaStatus',
             payload: true,
           });
          router.push('/dashboard/workspace');
          e.stopPropagation()
        }}
          className={styles.action}
        >
      Beranda
        </a>
        <a
              target="_self"
              href="#"
              rel="noopener noreferrer"
              onClick={(e)=>{
                const { dispatch } = this.props
                 dispatch({
                   type: 'publics/setBerandaStatus',
                   payload: false,
                 });

                 dispatch({
                   type: 'publics/setDashboardCurrentStep',
                   payload: 1
                 })

                router.push('/dashboard/workspace');
                e.stopPropagation()
              }}
              className={styles.action}
            >
            Materi
        </a>
        <a
          target="_self"
          href="#"
          rel="noopener noreferrer"
          onClick={(e)=>{
          router.push('/dashboard/videos');
          e.stopPropagation()
        }}
          className={styles.action}
        >
      Video
        </a>

        <a
          target="_self"
          href="#"
          onClick={(e)=>{
          router.push('/dashboard/how-to-use');
          e.stopPropagation()
        }}
          rel="noopener noreferrer"
          className={styles.action}
        >
      Petunjuk Penggunaan
        </a>

        {currentUser.data && currentUser.data.message && currentUser.data.message[0].nis ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.data.message[0].name}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}

export default GlobalHeaderRight;
