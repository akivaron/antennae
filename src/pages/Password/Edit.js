import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert, Form, Input, Button, Popover, Progress } from 'antd';
import styles from './PasswordEdit.less';
import {QUERY_UPDATE_PASSWORD_BERHASIL} from '@/constants/status';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/updatePassword'],
}))
@Form.create()
class ProfileEdit extends Component {
  state = {
    passLamaConfirmDirty: false,
    passBaruConfirmDirty: false,
    passLamaVisible: false,
    passBaruVisible: false,
    passBaruHelp: '',
    passLamaHelp: ''
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPasswordStatus = (field) => {
    const { form } = this.props;
    const value = form.getFieldValue(field);
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'user/updatePassword',
          payload: {
            ...values,
          },
        });
        dispatch({
          type: 'user/updatePasswordStatus',
          payload: 'success',
        });
      } else {
        dispatch({
          type: 'user/updatePasswordStatus',
          payload: 'error',
        });
      }
    });
  };

  handleConfirmBlurPassBaru = e => {
    const { value } = e.target;
    const { passBaruConfirmDirty } = this.state;
    this.setState({ passBaruConfirmDirty: passBaruConfirmDirty || !!value });
  };

  handleConfirmBlurPassLama = e => {
    const { value } = e.target;
    const { passLamaConfirmDirty } = this.state;
    this.setState({ passLamaConfirmDirty: passLamaConfirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password_lama')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPasswordBaru = (rule, value, callback) => {
    const { form } = this.props;
    const { passBaruVisible, passBaruConfirmDirty } = this.state;
    if(value && value.length >= 8){
      this.setState({
        passBaruVisible: false,
      });
      callback();

    } else if (!value) {
        this.setState({
          passBaruHelp: "Password wajib diisi",
          passBaruVisible: !!value,
        });
        callback('error');
      } else if (value && value === form.getFieldValue('password_lama')) {
        callback("Password baru tidak boleh sama dengan password lama");
      } else {
        this.setState({
          passBaruHelp: '',
        });
        if (!passBaruVisible) {
          this.setState({
            passBaruVisible: !!value,
          });
        }
        if (value.length < 8) {
          callback('error');
        } else {
          if (value && passBaruConfirmDirty) {
            form.validateFields(['password_lama'], { force: true });
          }
          callback();
        }
      }
  };

  checkPasswordLama = (rule, value, callback) => {
    const { passLamaVisible, passLamaConfirmDirty } = this.state;
    if(value && value.length >= 8){
      this.setState({
        passLamaVisible: false,
      });
      callback();

    } else if (!value) {
      this.setState({
        passLamaHelp: "Password wajib diisi",
        passLamaVisible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        passLamaHelp: '',
      });
      if (!passLamaVisible) {
        this.setState({
          passLamaVisible: !!value,
        });
      }
      if (value.length < 8) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && passLamaConfirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderMessage = () => {
    const { user } = this.props;
    let msg = '';

    const updatePassword = user && user.updatePassword;
    if (updatePassword.data  && updatePassword.status === "error") {
      const dataMsg = updatePassword.data.message;
      if (typeof dataMsg === "string" || dataMsg instanceof String) {
        msg = dataMsg;
      } else {
        for (const key in dataMsg) {
          if (dataMsg.hasOwnProperty(key)) {
            const val = dataMsg[key];
            val.map(item => {
              msg += `${item  },`;
            });
          }
        }
      }
      return <Alert style={{ marginBottom: 24 }} message={msg.replace(/.$/,"")} type="error" showIcon />
    }

    if(updatePassword.data && updatePassword.status === 'success' &&  updatePassword.data.code === QUERY_UPDATE_PASSWORD_BERHASIL) {
      return <Alert style={{ marginBottom: 24 }} message={updatePassword.data.message} type="success" showIcon />
    }

    return ''
  };

  renderPasswordProgress = (field) => {
    const { form } = this.props;
    const value = form.getFieldValue(field);
    const passwordStatus = this.getPasswordStatus(field);
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting , user } = this.props;
    const { getFieldDecorator } = form;
    const { passLamaHelp, passBaruHelp, passLamaVisible, passBaruVisible } = this.state;

    return (
      <div className={styles.main}>
        {user && this.renderMessage()}
        <Form style={{width:'100%'}} onSubmit={this.handleSubmit}>
          <FormItem help={passBaruHelp} style={{ marginBottom:'10px' }}>
            <Popover
              getPopupContainer={node => node.parentNode}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus('password_baru')]}
                  {this.renderPasswordProgress('password_baru')}
                  <div style={{ marginTop: 10 }}>
                  Silahkan masukkan setidaknya 8 karakter. Tolong jangan gunakan kata sandi yang mudah ditebak.
                  </div>
                </div>
            }
              overlayStyle={{ width: 240 }}
              visible={passBaruVisible}
            >
              {getFieldDecorator('password_baru', {
              rules: [
                {
                  validator: this.checkPasswordBaru
                }
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder="Password Baru"
              />
            )}
            </Popover>
          </FormItem>
          <FormItem help={passLamaHelp} style={{ marginBottom:'10px' }}>
            <Popover
              getPopupContainer={node => node.parentNode}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus('password_lama')]}
                  {this.renderPasswordProgress('password_lama')}
                  <div style={{ marginTop: 10 }}>
                  Silakan masukkan setidaknya 8 karakter. Tolong jangan gunakan kata sandi yang mudah ditebak.
                  </div>
                </div>
            }
              overlayStyle={{ width: 240 }}
              visible={passLamaVisible}
            >
              {getFieldDecorator('password_lama', {
              rules: [
                {
                  validator: this.checkPasswordLama,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder="Password Lama"
              />
            )}
            </Popover>
          </FormItem>
          <FormItem style={{ marginBottom:'10px' }}>
            {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: "RePassword Wajib diisi",
              },
              {
                validator: this.checkConfirm,
              },
            ],
          })(
            <Input
              size="large"
              type="password"
              placeholder="Re-Password"
            />
          )}
          </FormItem>
          <FormItem style={{ marginBottom:'10px' }}>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
            Update Password
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default ProfileEdit;
