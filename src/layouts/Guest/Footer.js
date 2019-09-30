import React from 'react';
import { Row, Col } from 'antd';

const Footer = () => (
  <footer id="footer" className="dark">
    <div className="footer-wrap">
      <Row>
        <Col md={6} sm={24} xs={24}>
          <div className="footer-center">
            <h2>Ant Design</h2>
            <div>
              <a target="_blank " href="https://github.com/ant-design/ant-design">
                GitHub
              </a>
            </div>
            <div>
              <a href="http://pro.ant.design">Ant Design Pro</a>
            </div>
            <div>
              <a href="http://mobile.ant.design">Ant Design Mobile</a>
            </div>
            <div>
              <a href="http://ng.ant.design">NG-ZORRO</a>
              <span> - </span>
              Ant Design of Angular
            </div>
            <div>
              <a target="_blank " href="https://github.com/websemantics/awesome-ant-design">
                Keren
              </a>
            </div>
            <div>
              <a target="_blank " href="http://ant-design.gitee.io/">
                Lorem
              </a>
            </div>
          </div>
        </Col>
        <Col md={6} sm={24} xs={24}>
          <div className="footer-center">
            <h2>Resources</h2>
            <div>
              <a href="http://scaffold.ant.design">Scaffolds</a>
              <span> - </span>
              scaffolds
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/dvajs/dva">dva</a> - DVA
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/dvajs/dva-cli">dva-cli</a> -
              Dev Tool
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="http://motion.ant.design">Ant Motion</a>
              <span> - </span>
              Motion
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="http://library.ant.design/">AntD Library</a>
              <span> - </span>
              Library
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="http://ux.ant.design">Ant UX</a>
              <span> - </span>
              Ant UX
            </div>
          </div>
        </Col>
        <Col md={6} sm={24} xs={24}>
          <div className="footer-center">
            <h2>Community</h2>
            <div>
              <a href="/changelog">
                Change Log
              </a>
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/ant-design/ant-design/wiki/FAQ">
                Faq
              </a>
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://gitter.im/ant-design/ant-design">
                Diskusi
              </a>
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://gitter.im/ant-design/ant-design-english">
                Diskusi
              </a>
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="http://new-issue.ant.design/">
                Bug Report
              </a>
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/ant-design/ant-design/issues">
                Issue
              </a>
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="http://stackoverflow.com/questions/tagged/antd">
                stackoverflow
              </a>
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://segmentfault.com/t/antd">
                segmentfault
              </a>
            </div>
          </div>
        </Col>
        <Col md={6} sm={24} xs={24}>
          <div className="footer-center">
            <h2>
              <img className="title-icon" src="https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg" alt="" />
              More Product
            </h2>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://antv.alipay.com/">AntV</a>
              <span> - </span>
              Data Vis
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://eggjs.org/">Egg</a>
              <span> - </span>
              Egg Js
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <Row className="bottom-bar">
      <Col md={4} sm={24} />
      <Col md={20} sm={24}>
        <span
          style={{
            lineHeight: '16px', paddingRight: 12, marginRight: 11, borderRight: '1px solid rgba(255, 255, 255, 0.55)',
          }}
        >
          <a
            href="https://docs.alipay.com/policies/privacy/antfin"
            rel="noopener noreferrer"
            target="_blank"
          >
            privacy
          </a>
        </span>
        <span style={{ marginRight: 24 }}>
          <a
            href="https://render.alipay.com/p/f/fd-izto3cem/index.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            commitment
          </a>
        </span>
        <span style={{ marginRight: 12 }}>ICP 证浙 B2-2-100257</span>
        <span style={{ marginRight: 12 }}>Copyright © Hartanti</span>
      </Col>
    </Row>
  </footer>
);

export default Footer;
