import React from 'react';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';

const Authority = getAuthority();
export default ({ children }) =>
  Authority[0] !== 'guest' && Authority[0] ? <Redirect to="/dashboard/workspace" /> : children;
