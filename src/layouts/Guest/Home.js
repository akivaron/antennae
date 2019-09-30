import React, { PureComponent }  from 'react';
import { connect } from 'dva';
import { Layout, Menu } from 'antd';
import { IntlProvider } from 'react-intl';
import DocumentTitle from 'react-document-title';
import { enquireScreen } from 'enquire-js';
import BannerHome from './BannerHome';
import HomeSection1 from './HomeSection1';
import HomeSection2 from './HomeSection2';
import HomeSection3 from './HomeSection3';
import MateriYangDipelajari from './MateriYangDipelajari';
import router from 'umi/router';

import styles from './Home.less'
import logo from '@/assets/img/logo.png';
import logoUm from '@/assets/img/logo-um.png';
import logoKepanjen from '@/assets/img/logo-smk1kepanjen.png';




const { Header } = Layout;

@connect(({ publics }) => ({
  publics,
}))

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      currentPath: (window.location.href.split(window.location.host)[1]),
      isHomePage: (window.location.href.split(window.location.host)[1]).split('/')[1] === 'user'
    };
    
    this.materiYangDipelajari = React.createRef()
    this.section2 = React.createRef()
    this.section1 = React.createRef()
  }

  componentDidMount() {
    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });

    this.timeoutId = setTimeout(() => {
      const { dispatch } = this.props

      dispatch({
        type: 'publics/getMateriVideo'
      })

      dispatch({
        type: 'publics/getHowToUse'
      })
    }, 600)
  }
  
  scrollToMateriYangDipelajari = () => {
    window.scrollTo({
      top: this.materiYangDipelajari.current.offsetTop,
      behavior: 'smooth',
    })
  }

  scrollToSection2 = () => {
    window.scrollTo({
      top: this.section2.current.offsetTop,
      behavior: 'smooth',
    })
  }

  scrollToSection1 = () => {
    window.scrollTo({
      top: this.section1.current.offsetTop,
      behavior: 'smooth',
    })
  }

  handleMenu = (path) => {
    router.push(path)
  }

  enquireScreen(b){
    let { isMobile } = this.state;
    isMobile = b;
  };

  render() {
    const { isMobile, currentPath, isHomePage } = this.state;
    const { children } = this.props;

    return (
      <>
        <IntlProvider>
          <div className={`home page-wrapper ${styles.bgUrl}`}>
            <Header className={styles.Header}>
              <img alt="logo" src={logo} className="logo-guest"  />
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={isHomePage? ['home'] : [currentPath.toString()]}
                className={styles.HeaderMenu}
              >
                <Menu.Item className="menu-guest" onClick={()=>this.handleMenu("/")} key="home">Home</Menu.Item>
                <Menu.Item className="menu-guest" onClick={()=>this.handleMenu("/page/videos")} key="page/video">Video</Menu.Item>
                <Menu.Item className="menu-guest" onClick={this.scrollToSection2} key="page/about-us">Tentang Kami</Menu.Item>
                <Menu.Item className="menu-guest" onClick={()=>this.handleMenu("/page/how-to-use")} key="page/how-to-use">Petunjuk Penggunaan</Menu.Item>
                <Menu.Item className="menu-guest" onClick={this.scrollToSection1} key="page/vision">Visi dan Misi</Menu.Item>
                <Menu.Item className="menu-guest" onClick={this.scrollToMateriYangDipelajari} key="page/materiYangDipelajari">Materi Yang Dipelajari</Menu.Item>
              </Menu>

              <div className={styles.logoWrapper}>
                <img alt="logo" src={logoUm} />
                <img alt="logo" src={logoKepanjen} />
              </div>
            </Header>

            {isHomePage ? <BannerHome isMobile={isMobile} child={children} currentPath={currentPath} isHomePage={isHomePage} /> : ''}

            {!isHomePage ? (
              <div style={{marginTop:'20px'}} className="home-page-wrapper page1">
                <div className="page">
                  {children}
                </div>
              </div>
            ):''}
	    <div ref={this.section1}><HomeSection1 isMobile={isMobile}/></div>
            <div ref={this.materiYangDipelajari}>
	      <MateriYangDipelajari isMobile={isMobile} />
	    </div>
	    <div ref={this.section2}>
              <HomeSection2 isMobile={isMobile} />
            </div>
            <DocumentTitle title="Pemrograman Dasar" key="title" />
          </div>
        </IntlProvider>
      </>
    );
  }
}

export default Home;
