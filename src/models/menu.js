import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi';
import Authorized from '@/utils/Authorized';
// import api from '@/api';
import _ from 'lodash';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    // .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

function inAuthMenu(menu, menuTree) {
  for (let i = 0; i < menuTree.length; i++) {
    if (menuTree[i].path === menu.path) {
      return true
    }
    if (menuTree[i].children.length > 0) {
      let flag = inAuthMenu(menu, menuTree[i].children);
      if (flag) return flag;
    }
  }
  return false;
}

function filterAuthorizeMenus(menus, menuTree) {
  menus.forEach(menu => {
    let flag = inAuthMenu(menu, menuTree);
    if (!flag) {
      menu.hideInMenu = true
    }
    if (menu.children && menu.children.length > 0) {
      filterAuthorizeMenus(menu.children, menuTree)
    }
  });
}

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload }, { call, put }) {
      const { routes, authority } = payload;
      let menuData = filterMenuData(memoizeOneFormatter(routes, authority));
      // let res = yield call(api.user.queryCurrentMenus);

      let authorizedMenus = _.cloneDeep(menuData);
      // filterAuthorizeMenus(authorizedMenus, res.data.children);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(authorizedMenus);
      yield put({
        type: 'save',
        payload: { menuData: authorizedMenus, breadcrumbNameMap },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        menuData: [],
        breadcrumbNameMap: {}
      }
    }
  },
};
