export type BoxState =
  | 'AWAKE'
  | 'CHOOSE_BACON'
  | 'GAME_START'
  | 'GAME_OVER'
  | 'DESTROY';
export type State =
  | 'GAME_START'
  | 'HERO_TOBE_CHOSEN'
  | 'HERO_CHOICES'
  | 'HERO_TO_FIGHT'
  | 'GAME_RANKING'
  | 'GAME_OVER';
export interface Regex<T = string> {
  state: T;
  fn: RegExp;
  regex?: RegExp;
  index?: number | number[];
}

export const boxRegexes: Regex<BoxState>[] = [
  // 酒馆打开
  {
    state: 'AWAKE',
    fn: /Box.Awake\(\)/,
  },
  // 游戏模式选择为酒馆战棋
  {
    state: 'CHOOSE_BACON',
    fn: /LoadingScreen.OnSceneLoaded\(\)/,
    regex: /prevMode=GAME_MODE currMode=BACON/,
  },
  // 对局开始（Power.log 生成，开始监控）
  {
    state: 'GAME_START',
    fn: /LoadingScreen.OnScenePreUnload\(\)/,
    regex: /prevMode=BACON nextMode=GAMEPLAY/,
  },
  // 对局结束（停止 Power.log 监控）
  {
    state: 'GAME_OVER',
    fn: /Gameplay.OnDestroy\(\)/,
  },
  // 酒馆关闭 可能是从酒馆进入游戏，也可能是关闭了炉石传说
  {
    state: 'DESTROY',
    fn: /Box.OnDestroy\(\)/,
  },
];

export const stateRegexes: Regex<State>[] = [
  // 对局开始
  {
    state: 'GAME_START',
    fn: /GameState.DebugPrintPower\(\)/,
    regex: /CREATE_GAME/,
  },
  // 可选的英雄
  {
    state: 'HERO_TOBE_CHOSEN',
    fn: /GameState.DebugPrintEntityChoices\(\)/,
    regex: /Entities\[\d\]=\[entityName=(\S+).*zone=HAND.*\]/,
    index: 1,
  },
  // 实际选择的英雄
  {
    state: 'HERO_CHOICES',
    fn: /GameState.SendChoices\(\)/,
    regex: /m_chosenEntities\[\d\]=\[entityName=(\S+).*zone=HAND.*\]/,
    index: 1,
  },
  // FULL_ENTITY - Updating [entityName=巫妖王 id=141 zone=SETASIDE zonePos=0 cardId=TB_BaconShop_HERO_22 player=16] CardID=TB_BaconShop_HERO_22
  // 本局对战中对手的英雄 Array
  {
    state: 'HERO_TO_FIGHT',
    fn: /PowerTaskList.DebugPrintPower\(\)/,
    regex: /Updating \[entityName=(\S+).*zone=SETASIDE zonePos=0.*\].*/,
    index: 1,
  },
  // 对局排名
  {
    state: 'GAME_RANKING',
    fn: /GameState.DebugPrintPower\(\)/,
    regex: /TAG_CHANGE Entity=\[entityName=(\S+).*zone=PLAY.*tag=PLAYER_LEADERBOARD_PLACE value=(\d)/,
    index: [1, 2],
  },
  // 对局结束
  {
    state: 'GAME_OVER',
    fn: /GameState.DebugPrintPower\(\)/,
    regex: /TAG_CHANGE Entity=GameEntity tag=STATE value=COMPLETE/,
  },
];

export const mergeRegexes: Regex[] = [
  {
    state: 'FULL_ENTITY',
    fn: /PowerTaskList.DebugPrintPower\(\)/,
    regex: /FULL_ENTITY/,
  },
];
