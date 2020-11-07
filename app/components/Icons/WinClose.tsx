import React from 'react';
import { SvgIcon } from '@material-ui/core';

export default function WinClose() {
  return (
    <SvgIcon
      width={12}
      height={12}
      viewBox="0 0 12 12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.5}
      strokeMiterlimit={2}
    >
      <line x1="3.8" y1="3.8" x2="8.3" y2="8.3" />
      <line x1="8.3" y1="3.8" x2="3.8" y2="8.3" />
    </SvgIcon>
  );
}
