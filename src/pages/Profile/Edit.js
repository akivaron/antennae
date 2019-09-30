import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert, Form, Input, Button, Popover, Progress, Select } from 'antd';
import styles from './ProfileEdit.less';
import {QUERY_UPDATE_SISWA_BERHASIL} from '@/constants/status';

const { Option } = Select;
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

@connect(({ user, publics, loading }) => ({
  user,
  publics,
  submitting: loading.effects['user/updateProfile'],
}))
@Form.create()
class ProfileEdit extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'publics/getKelas'
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
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
          type: 'user/updateProfile',
          payload: {
            ...values,
          },
        });
        dispatch({
          type: 'user/updateProfileStatus',
          payload: 'success',
        });
      } else {
        dispatch({
          type: 'user/updateProfileStatus',
          payload: 'error',
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: "Password wajib diisi",
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderMessage = () => {
    const { user } = this.props;
    let msg = '';

    const updateProfile = user && user.updateProfile;
    if (updateProfile.data  && updateProfile.status === "error") {
      const dataMsg = updateProfile.data.message;
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

    if(updateProfile.data && updateProfile.status === 'success' &&  updateProfile.data.code === QUERY_UPDATE_SISWA_BERHASIL) {
      return <Alert style={{ marginBottom: 24 }} message={updateProfile.data.message} type="success" showIcon />
    }

    return ''
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
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
    const { form, submitting , user, publics} = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;
    const currentUser = user && user.currentUser.data && user.currentUser.data.message[0];

    return (
      <div className={styles.main}>
          {user && this.renderMessage()}
          <Form style={{width:'100%'}} onSubmit={this.handleSubmit}>
            <FormItem style={{ marginBottom:'10px' }}>
              {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: "Nama wajib di isi",
                }
              ],
              initialValue: currentUser && currentUser.name
            })(
              <Input size="large" placeholder="Nama" />
            )}
            </FormItem>
            <FormItem style={{ marginBottom:'10px' }}>
              {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: "Email wajib di isi",
              },
              {
                type: 'email',
                message: "Format email salah",
              },
            ],
            initialValue: currentUser && currentUser.email
          })(
            <Input size="large" placeholder="Email" />
          )}
            </FormItem>
            <FormItem style={{ marginBottom:'10px' }}>
              {getFieldDecorator('class', {
            rules: [{ required: true, message: 'Silahkan pilih kelas anda' }],
            initialValue: currentUser && currentUser.class
          })(
            <Select size="large" placeholder="Kelas">
              {
                publics &&
                publics.kelas &&
                publics.kelas.data &&
                publics.kelas.data.message.length > 0 &&
                publics.kelas.data.message.map((item) =>
                  <Option key={item.id} value={item.id}>{item.class}</Option>)
              }
            </Select>
          )}
            </FormItem>
            <FormItem help={help} style={{ marginBottom:'10px' }}>
              <Popover
                getPopupContainer={node => node.parentNode}
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                  Silakan masukkan setidaknya 6 karakter. Tolong jangan gunakan kata sandi yang mudah ditebak.
                    </div>
                  </div>
            }
                overlayStyle={{ width: 240 }}
                visible={visible}
              >
                {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.checkPassword,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder="Password"
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
            Update Profile
              </Button>
            </FormItem>
          </Form>
      </div>
    );
  }
}

export default ProfileEdit;
