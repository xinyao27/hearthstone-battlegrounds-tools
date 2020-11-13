import { is } from 'electron-util';

const template = is.windows
  ? `[Achievements]
LogLevel=1
FilePrinting=True
ConsolePrinting=False
ScreenPrinting=False
Verbose=False
[Arena]
LogLevel=1
FilePrinting=True
ConsolePrinting=False
ScreenPrinting=False
Verbose=False
[FullScreenFX]
LogLevel=1
FilePrinting=True
ConsolePrinting=False
ScreenPrinting=False
Verbose=False
[LoadingScreen]
LogLevel=1
FilePrinting=True
ConsolePrinting=False
ScreenPrinting=False
Verbose=False
[Power]
LogLevel=1
FilePrinting=True
ConsolePrinting=False
ScreenPrinting=False
Verbose=True
[Gameplay]
LogLevel=1
FilePrinting=True
ConsolePrinting=False
ScreenPrinting=False
Verbose=False
[Decks]
LogLevel=1
FilePrinting=True
ScreenPrinting=False
Verbose=False
ConsolePrinting=False
`
  : is.macos
  ? `[Power]
LogLevel=1
FilePrinting=true
ConsolePrinting=false
ScreenPrinting=false
Verbose=true
[Rachelle]
LogLevel=1
FilePrinting=true
ConsolePrinting=false
ScreenPrinting=false
[Arena]
LogLevel=1
FilePrinting=true
ConsolePrinting=false
ScreenPrinting=false
[LoadingScreen]
LogLevel=1
FilePrinting=true
ConsolePrinting=false
ScreenPrinting=false
[Decks]
LogLevel=1
FilePrinting=true
ConsolePrinting=false
ScreenPrinting=false`
  : '';

export default template;
