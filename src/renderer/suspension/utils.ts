import { remote } from 'electron';

export function getImageUrl(base: string) {
  return `https://hs.chenyueban.com${base}`;
}

const { suspensionManager } = remote.getGlobal('managers');
export function showSuspension() {
  suspensionManager?.show();
}
export function hideSuspension() {
  suspensionManager?.hide();
}
