import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Icon, notification } from 'antd';
import Countdown from 'react-countdown-now';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

@connect(({ publics, user }) => ({
  publics,
  user
}))
class GlobalHeader extends PureComponent {
  constructor(props){
    super(props)
    this.countDown = React.createRef()
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

    // Random component
  Completionist = () => <span>You are good to go!</span>;

  // Renderer callback with condition
  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      notification['warning']({
        message: 'Waktu Habis',
        description: 'Waktu anda habis, masih belum memahami materi? Silahkan baca lagi materi yang tersedia',
        duration: 0,
      });

      const { dispatch, user } = this.props;

      const listBookmark = user && user.bookmark.data && user.bookmark.data.message;
      const currentIdSubMateri = listBookmark && listBookmark[0].id_material_sub

      let data = user && user.timeHistory.data && user.timeHistory.data.message.data || []
      data[currentIdSubMateri] = `timeout`
      dispatch({
        type: 'user/updateTimeHistory',
        payload: {
          data: JSON.stringify(data),
        },
      });

      sessionStorage.removeItem('soalCountDown');
      return true;
    } else {
      // Render a countdown
      const { publics } =  this.props

      if(publics && publics.pauseCountDownSoal && publics.pauseCountDownSoal.status !== ''){
        if(publics && !publics.pauseCountDownSoal.status){
          sessionStorage.setItem('soalCountDown', `${hours}:${minutes}:${seconds}`);
          return <span>{hours}:{minutes}:{seconds}</span>;
        } else {
          sessionStorage.getItem('soalCountDown');
          return <span>{hours}:{minutes}:{seconds}</span>;
        }
      }else {
        sessionStorage.getItem('soalCountDown');
        return <span>{hours}:{minutes}:{seconds}</span>;
      }
    }
  };

  render() {
    let deadline = '';
    const { collapsed, isMobile, logo, publics } = this.props;

    deadline = publics && publics.timeout ? Date.now() + moment(sessionStorage.getItem('soalCountDown') || publics && publics.timeout, 'hh:mm:ss').diff(moment().startOf('day'), 'miliseconds') : 0 ;

    if(publics && publics.pauseCountDownSoal && publics.pauseCountDownSoal.status !== ''){
      if(publics && publics.pauseCountDownSoal.status){
        this.countDown && this.countDown.current && this.countDown.current.api.pause()
      } else {
        this.countDown && this.countDown.current && this.countDown.current.api.start()
      }
    } else {
      this.countDown && this.countDown.current && this.countDown.current.api.pause()
    }

    const { dispatch, user } = this.props;

    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;
    const currentIdSubMateri = listBookmark && listBookmark[0].id_material_sub

    let data = user && user.timeHistory.data && user.timeHistory.data.code !== 'STATUS::TIME_HISTORY_KOSONG' && JSON.parse(user.timeHistory.data.message[0].data)
    const isTimeOut = data && data[currentIdSubMateri]

    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.countdown}>
          {
            publics && publics.timeout && !(publics && publics.questionFinish.payload) && isTimeOut!=='timeout'? (
              <Countdown
                ref={this.countDown}
                key={'Countdown1'}
                date={deadline}
                intervalDelay={0}
                precision={3}
                renderer={this.renderer}
              />
            ) : ''
          }
        </div>
        <RightContent {...this.props} />
      </div>
    );
  }
}

export default GlobalHeader;
