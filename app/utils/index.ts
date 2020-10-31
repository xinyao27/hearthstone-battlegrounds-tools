export enum Platform {
  MACOS = 'macOS',
  WINDOWS = 'windows',
  LINUX = 'Linux',
}
export function getPlatform() {
  const { platform } = process;
  switch (platform) {
    case 'darwin':
      return Platform.MACOS;
    case 'win32':
      return Platform.WINDOWS;
    case 'linux':
      return Platform.LINUX;
    default:
      return platform;
  }
}
