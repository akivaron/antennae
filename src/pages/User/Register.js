import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Alert, Form, Input, Button, Popover, Progress, Select, InputNumber } from 'antd';
import styles from './Register.less';
import {QUERY_INSERT_SISWA_BERHASIL} from '@/constants/status';

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
  submitting: loading.effects['user/register'],
}))
@Form.create()
class Register extends Component {
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
          type: 'user/register',
          payload: {
            ...values,
          },
        });
        dispatch({
          type: 'user/regStatus',
          payload: 'success',
        });
      } else {
        dispatch({
          type: 'user/regStatus',
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
    if(value && value.length > 8 ) {
      this.setState({
        visible: false,
      });
      callback();
    } else if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
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
      if (value.length < 8) {
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

    const register = user && user.reg;
    if (register.data  && register.status === "error") {
      const dataMsg = register.data.message;
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

    if(register.data && register.status === 'success' &&  register.data.code === QUERY_INSERT_SISWA_BERHASIL) {
      return <Alert style={{ marginBottom: 24 }} message={register.data.message} type="success" showIcon />
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

    return (
      <div className={styles.main}>
        {user && this.renderMessage()}
        <Form onSubmit={this.handleSubmit}>
          <FormItem style={{ marginBottom: '10px' }}>
            {getFieldDecorator('nis', {
                rules: [
                  {
                    required: true,
                    message: "Nis wajib di isi,",
                  },
                  {
                    type: 'number',
                    message: "Nis Harus berupa nomor",
                  },
                ],
              })(
                <InputNumber style={{ width: '100%'}} size="large" min={1} placeholder="Nis" />
              )}
          </FormItem>
          <FormItem style={{ marginBottom:'10px' }}>
            {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: "Nama wajib di isi",
                  }
                ],
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
            })(
              <Input size="large" placeholder="Email" />
            )}
          </FormItem>
          <FormItem style={{ marginBottom:'10px' }}>
            {getFieldDecorator('class', {
              rules: [{ required: true, message: 'Silahkan pilih kelas anda' }],
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
                    Silakan masukkan setidaknya 8 karakter. Tolong jangan gunakan kata sandi yang mudah ditebak.
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
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
              <FormattedMessage id="app.register.register" />
            </Button>
            <Link className={styles.login} to="/user/login">
              <FormattedMessage id="app.register.sing-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
