import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Carousel} from 'antd';
import ReactPlayer from 'react-player'
import { hostApi } from '@/defaultSettings'
import styles from './Videos.less';


@connect(({ publics, loading }) => ({
  publics,
  loadingGetVideo: loading.effects['publics/getMateriVideo'],
  getCurrentVideo: loading.effects['publics/setCurrentMateriVideo']
}))

class VideoList extends Component {
  state = {
    videoUrl: ''
  };

  constructor(props){
    super(props)
    this.carouselVideo = React.createRef()
  }

  nextVideo = () => {
    this.carouselVideo.current.slick.slickNext()
  }

  previousVideo = () => {
    this.carouselVideo.current.slick.slickPrev()
  }

  handleVideoPlayer = (file) => {
    const { dispatch } = this.props

    dispatch({
      type: 'publics/setCurrentMateriVideo',
      payload: `${hostApi}storage/${file[0].download_link}`
    })
      // this.setState({
      //   videoUrl: `${hostApi}storage/${file[0].download_link}`
      // })
  }

  render() {
    const { videoUrl } = this.state;
    const { publics, loadingGetVideo, getCurrentVideo } = this.props
    const videoCarouselConfig = {
       dots: true,
       infinite: true,
       speed: 500,
       slidesToShow: 3,
       slidesToScroll: 3,
       arrows: true,
       dragable: true
    }

    const dataVideo = publics && publics.materiVideo.data && publics.materiVideo.data.message;
    const loadingVideo = getCurrentVideo ? true : false;

    return (
      <div>
        <h2>List Video Terbaru</h2>
        <Row loading={loadingGetVideo} gutter={24} className={styles.videoAreaWrapper}>
          <Col span={24}>
            {
              dataVideo && dataVideo[0] && <Col loading={loadingVideo.toString()}> <ReactPlayer width="100%" height="100%" url={publics && publics.currentMateriVideo || `${hostApi}storage/${JSON.parse(dataVideo[0].file)[0].download_link}`} pip controls /> </Col>
            }
          </Col>
          <Col span={24}>
            <Icon className={styles.videoLeftNav} type="left-circle" onClick={this.previousVideo} />
            <Carousel ref={this.carouselVideo} {...videoCarouselConfig}>
              {
                dataVideo && dataVideo.map((item) => {
                  if(item){
                    const itemParse = JSON.parse(item.file)
                    return (
                      <div className={styles.videoCarouselItem} key={item.id} onClick={() => this.handleVideoPlayer(itemParse)}>
                        <ReactPlayer width="100%" height="100%" url={`${hostApi}storage/${itemParse[0].download_link}`} />
                      </div>
                    )
                  }
                  return ''
                })
              }
            </Carousel>
            <Icon className={styles.videoRightNav} type="right-circle" onClick={this.nextVideo} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default VideoList;
