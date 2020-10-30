export interface StateRegex {
  state: string;
  fn: string;
  regex: RegExp;
  index?: number | number[];
}
export const stateRegexes: StateRegex[] = [
  // 对局开始
  {
    state: 'GAME_START',
    fn: 'GameState.DebugPrintPower()',
    regex: /CREATE_GAME/,
  },
  // 可选的英雄
  {
    state: 'HERO_TOBE_CHOSEN',
    fn: 'GameState.DebugPrintEntityChoices()',
    regex: /Entities\[\d\]=\[entityName=(\S+) .*\]/,
    index: 1,
  },
  // 实际选择的英雄
  {
    state: 'HERO_CHOICES',
    fn: 'GameState.SendChoices()',
    regex: /m_chosenEntities\[\d\]=\[entityName=(\S+) .*\]/,
    index: 1,
  },
  // 对局排名
  {
    state: 'GAME_RANKING',
    fn: 'GameState.DebugPrintPower()',
    regex: /TAG_CHANGE Entity=\[entityName=(\S+).*zone=PLAY.*tag=PLAYER_LEADERBOARD_PLACE value=(\d)/,
    index: [1, 2],
  },
  // 对局结束
  {
    state: 'GAME_OVER',
    fn: 'GameState.DebugPrintPower()',
    regex: /TAG_CHANGE Entity=GameEntity tag=STATE value=COMPLETE/,
  },
];
