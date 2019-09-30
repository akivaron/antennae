import React, { PureComponent } from 'react';
import { Menu, Icon, Modal } from 'antd';
import Link from 'umi/link';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import router from 'umi/router';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';

import { JAWABANSISWAESSAY_KOSONG, JAWABANSISWAPILGAN_KOSONG } from '@/constants/status';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.getSelectedMenuKeys = memoizeOne(this.getSelectedMenuKeys, isEqual);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname =>
    urlToList(pathname).map(itemPath => getMenuMatches(this.flatMenuKeys, itemPath).pop());

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getDataSoal = (listMateri, listBookmark, dispatch) => {
    const { publics } = this.props;
    if (listBookmark && listBookmark instanceof Array && listBookmark.length > 0) {
      return (
        listMateri &&
        listMateri.map(
          item =>
            item &&
            item.sub.map(
              a =>
                listBookmark &&
                listBookmark.map(b => {
                  if (parseInt(a.id, 10) === parseInt(b.id_material_sub, 10)) {
                    if (publics && publics.dashboardCurrentStep === 2) {
                      dispatch({
                        type: 'publics/setTimeoutSoal',
                        payload: a.time,
                      });
                    }
                    dispatch({
                      type: 'publics/getSoal',
                      payload: {
                        id_material_subs: b.id_material_sub,
                      },
                    });
                  }
                  return false;
                })
            )
        )
      );
    }

    dispatch({
      type: 'publics/setTimeoutSoal',
      payload: listMateri[0].sub[0].time,
    });
    dispatch({
      type: 'publics/getSoal',
      payload: {
        id_material_subs: 1,
      },
    });

    return false;
  };

  handleLinkSubMateri = (idMaterial, idMaterialSub) => {
    const { dispatch, publics, user } = this.props;

    dispatch({
      type: 'publics/setBerandaStatus',
      payload: false,
    });

    dispatch({
      type: 'user/updateBookmark',
      payload: {
        id_material: idMaterial,
        id_material_sub: idMaterialSub,
      },
    });

    const listMateri = publics && publics.materi.data && publics.materi.data.message;
    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;

    router.push('/dashboard/workspace/');

    this.getDataSoal(listMateri, listBookmark, dispatch);
  };

  handleDisableLink = (name) => {
    Modal.info({
     title: 'Anda tidak bisa mengakses menu ini',
     content: `Silahkan anda menyelesaikan soal dan materi sebelumnya terlebih dahulu , sebelum anda masuk ke materi ${name}`,
     onOk() {},
   });
  }

  handleLinkMateri = (listMateri, item, sub) => {
    const data = [];
    const { user, publics } = this.props;

    const bookmark =
      user && user.bookmark.data && user.bookmark.data.message && user.bookmark.data.message[0];
    const answerEssay =
      user &&
      user.jawabanEssay.data &&
      user.jawabanEssay.data.code !== JAWABANSISWAESSAY_KOSONG &&
      JSON.parse(user.jawabanEssay.data.message[0].answers);
    const answerMultipleChoices =
      user &&
      user.jawabanMultipleChoices.data &&
      user.jawabanMultipleChoices.data.code !== JAWABANSISWAPILGAN_KOSONG &&
      JSON.parse(user.jawabanMultipleChoices.data.message[0].answers);

    const bookmarkCountEssay =
      (answerEssay &&
        answerEssay.filter(
          i =>
            i &&
            i.isCorrect === true &&
            i.dataValue.id_material_subs === (bookmark && bookmark.id_material_sub)
        ).length) ||
      0;

    const bookmarkCountMultipleChoices =
      (answerMultipleChoices &&
        answerMultipleChoices.filter(
          i =>
            i &&
            i.isCorrect === true &&
            i.dataValue.id_material_subs === (bookmark && bookmark.id_material_sub)
        ).length) ||
      0;

    const totalBookmarkItemAnswer =
      parseInt(bookmarkCountEssay, 10) + parseInt(bookmarkCountMultipleChoices, 10);
    
    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;
    const currentIdSubMateri = listBookmark && listBookmark[0].id_material_sub

    const dataHistory = user && user.timeHistory.data && user.timeHistory.data.code !== 'STATUS::TIME_HISTORY_KOSONG' && JSON.parse(user.timeHistory.data.message[0].data);
    const isTimeOut = dataHistory && dataHistory[currentIdSubMateri]

    let bookmarkItem =
      listMateri &&
      listMateri.filter(
        i => i && i.sub.some(a => a && a.id === (bookmark && bookmark.id_material_sub))
      );

    if ((bookmarkItem && bookmarkItem.length) > 0) {
      bookmarkItem = bookmarkItem[0].sub.filter(
        i => i && i.id === (bookmark && bookmark.id_material_sub)
      );
    }

    // ---------------------
    
    sub.map((a, index) => {
      const countEssay =
        (answerEssay &&
          answerEssay.filter(
            i => i && i.isCorrect === true && i.dataValue.id_material_subs === a.id
          ).length) ||
        0;

      const countMultipleChoices =
        (answerMultipleChoices &&
          answerMultipleChoices.filter(
            i => i && i.isCorrect === true && i.dataValue.id_material_subs === a.id
          ).length) ||
        0;

      const correctAnswer = parseInt(countEssay, 10) + parseInt(countMultipleChoices, 10);
      if (parseInt(correctAnswer, 10) === parseInt(a.total_question, 10)) {
        data.push(
          <Menu.Item key={`${a.id}`}>
            <a onClick={() => this.handleLinkSubMateri(a.id_material, a.id)} href="#">
              {a.name}
            </a>
          </Menu.Item>
        );
      }else if (parseInt(correctAnswer, 10) !== parseInt(a.total_question, 10)) {
        if ((publics && publics.berandaStatus && index === 0) || isTimeOut==="timeout") {
          if ((bookmark && bookmark.id_material) === a.id_material) {
             data.push(
              <Menu.Item key={`${a.id}`}>
                <a onClick={() => this.handleLinkSubMateri(a.id_material, a.id)} href="#">
                  {a.name}
                </a>
              </Menu.Item>
            );
          } else if ((bookmarkItem && bookmarkItem.length) > 0) {
            if (
              bookmarkItem[0].id === bookmark.id_material_sub &&
              parseInt(bookmarkItem[0].total_question, 10) === totalBookmarkItemAnswer
            ) {
              data.push(
                <Menu.Item key={`${a.id}`}>
                  <a onClick={() => this.handleLinkSubMateri(a.id_material, a.id)} href="#">
                    {a.name}
                  </a>
                </Menu.Item>
              );
            }
          } else if (!answerEssay && !answerMultipleChoices) {
            data.push(
              <Menu.Item key={`${a.id}`}>
                <a onClick={() => this.handleLinkSubMateri(a.id_material, a.id)} href="#">
                  {a.name}
                </a>
              </Menu.Item>
            );
          } else {
            data.push(
              <Menu.Item onClick={() => this.handleDisableLink(a.name)} key={`${a.id}`}>
                <span href={a.id}>{a.name}akjdkajdakjds</span>
              </Menu.Item>
            );
          }
        } else if (
          parseInt(a.id, 10) <= (bookmark && parseInt(bookmark.id_material_sub, 10)) &&
          parseInt(a.id_material, 10) <= (bookmark && parseInt(bookmark.id_material, 10))
        ) {
          data.push(
            <Menu.Item key={`${a.id}`}>
              <a onClick={() => this.handleLinkSubMateri(a.id_material, a.id)} href="#">
                {a.name}
              </a>
            </Menu.Item>
          );
        } else {
          data.push(
            <Menu.Item onClick={() => this.handleDisableLink(a.name)} key={`${a.id}`}>
              <span href={a.id}>{a.name}</span>
            </Menu.Item>
          );
        }
      }
      return true;
    });
    return data;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        <span>{name}</span>
      </Link>
    );
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, publics } = this.props;
    const listMateri = publics && publics.materi.data && publics.materi.data.message;
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={mode === 'horizontal' ? 'top-nav-menu' : ''}
        {...props}
      >
        {listMateri &&
          listMateri.map(item => (
            <SubMenu
              key={item.id}
              title={
                item.icon ? (
                  <span>
                    {getIcon(item.icon)}
                    <span>{item.name}</span>
                  </span>
                ) : (
                  item.name
                )
              }
            >
              {this.handleLinkMateri(listMateri, item, item.sub)}
            </SubMenu>
          ))}
      </Menu>
    );
  }
}
