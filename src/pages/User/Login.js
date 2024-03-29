import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, Nis, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = () => {
    const { login } = this.props;
    let msg = '';

    if (login.data && login.status === "error") {
      const dataMsg = login.data.message;
      if (typeof dataMsg === "string" || dataMsg instanceof String) {
        msg = dataMsg;
      } else {
        for (const key in dataMsg) {
          if (dataMsg.hasOwnProperty(key)) {
            const val = dataMsg[key];
            val.map(item => {
              msg += item + ",";
            });
          }
        }
      }
      return <Alert style={{ marginBottom: 24 }} message={msg.replace(/.$/,"")} type="error" showIcon />
    }
    return 0;
  };


  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <h2>PEMROGRAMAN <b>DASAR</b></h2>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account">
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage()}
            <Nis
              name="nis"
              placeholder="NIS"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.nis.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder="Password"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <Link style={{ float: 'right' }} className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
