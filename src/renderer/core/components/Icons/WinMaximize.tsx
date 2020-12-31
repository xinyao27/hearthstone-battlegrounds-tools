import React from 'react';
import { SvgIcon } from '@material-ui/core';

export default function WinMaximize() {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.5}
      strokeMiterlimit={2}
    >
      <polyline
        points="11.5,7.5 16.5,7.5 16.5,12.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="7.5,11.5 7.5,16.5 12.5,16.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
