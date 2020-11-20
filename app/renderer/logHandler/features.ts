import type { Line, LineBody } from './LogLine';

export type BoxState =
  | 'BOX_AWAKE'
  | 'BOX_CHOOSE_BACON'
  | 'BOX_GAME_START'
  | 'BOX_GAME_OVER'
  | 'BOX_DESTROY';
export type State =
  | 'GAME_START'
  | 'HERO_TOBE_CHOSEN'
  | 'HERO_CHOICES'
  | 'RIVAL_HEROES'
  | 'HERO_TO_FIGHT'
  | 'GAME_RANKING'
  | 'GAME_OVER';
export interface Feature<T = string> {
  state: T;
  sequenceType: Line['sequenceType'];
  level: Line['level'];
  bodyType?: LineBody['type'];
  command?: string | RegExp;
  parameter?: { key?: string | RegExp; value: string | RegExp }[];
  children?: Feature<T>[];
  getResult?: (line: Line) => any;
}

export const boxFeatures: Feature<BoxState>[] = [
  // 酒馆(游戏)打开
  // D 20:58:07.5700000 LoadingScreen.OnSceneLoaded() - prevMode=STARTUP currMode=LOGIN
  {
    state: 'BOX_AWAKE',
    sequenceType: 'LoadingScreen.OnSceneLoaded',
    level: 0,
    bodyType: 'parameter',
    parameter: [
      {
        key: 'prevMode',
        value: 'STARTUP',
      },
      {
        key: 'currMode',
        value: 'LOGIN',
      },
    ],
  },
  // 游戏模式选择为酒馆战棋
  // D 21:03:58.8552226 LoadingScreen.OnSceneLoaded() - prevMode=GAME_MODE currMode=BACON
  {
    state: 'BOX_CHOOSE_BACON',
    sequenceType: 'LoadingScreen.OnSceneLoaded',
    level: 0,
    bodyType: 'parameter',
    parameter: [
      { key: 'prevMode', value: 'GAME_MODE' },
      { key: 'currMode', value: 'BACON' },
    ],
  },
  // 对局开始（Power.log 生成，开始监控）
  // D 21:04:58.5488393 LoadingScreen.OnScenePreUnload() - prevMode=BACON nextMode=GAMEPLAY m_phase=INVALID
  {
    state: 'BOX_GAME_START',
    sequenceType: 'LoadingScreen.OnScenePreUnload',
    level: 0,
    bodyType: 'parameter',
    parameter: [
      { key: 'prevMode', value: 'BACON' },
      { key: 'nextMode', value: 'GAMEPLAY' },
    ],
  },
  // 对局结束（停止 Power.log 监控）
  // D 21:09:21.4353961 Gameplay.OnDestroy()
  {
    state: 'BOX_GAME_OVER',
    sequenceType: 'Gameplay.OnDestroy',
    level: 0,
  },
  // 酒馆关闭 可能是从酒馆进入游戏，也可能是关闭了炉石传说
  // D 21:09:57.0464718 Box.OnDestroy()
  {
    state: 'BOX_DESTROY',
    sequenceType: 'Box.OnDestroy',
    level: 0,
  },
];

export const stateFeatures: Feature<State>[] = [
  // 对局开始
  // D 21:22:49.3084520 GameState.DebugPrintPower() - CREATE_GAME
  {
    state: 'GAME_START',
    sequenceType: 'GameState.DebugPrintPower',
    level: 0,
    bodyType: 'command',
    command: 'CREATE_GAME',
  },
  // 可选的英雄
  // D 18:41:53.5389622 GameState.DebugPrintEntityChoices() - id=1 Player=走夜路#51810 TaskList=6 ChoiceType=MULLIGAN CountMin=1 CountMax=1
  // D 18:41:53.5389622 GameState.DebugPrintEntityChoices() -   Source=GameEntity
  // D 18:41:53.5389622 GameState.DebugPrintEntityChoices() -   Entities[0]=[entityName=凯尔萨斯·逐日者 id=77 zone=HAND zonePos=1 cardId=TB_BaconShop_HERO_60 player=3]
  // D 18:41:53.5389622 GameState.DebugPrintEntityChoices() -   Entities[1]=[entityName=伊利丹·怒风 id=78 zone=HAND zonePos=2 cardId=TB_BaconShop_HERO_08 player=3]
  {
    state: 'HERO_TOBE_CHOSEN',
    sequenceType: 'GameState.DebugPrintEntityChoices',
    level: 0,
    bodyType: 'parameter',
    parameter: [
      { key: 'id', value: /\d+/ },
      { key: 'Player', value: /.+/ },
      { key: 'TaskList', value: /\d+/ },
      { key: 'ChoiceType', value: 'MULLIGAN' },
      { key: 'CountMin', value: /\d+/ },
      { key: 'CountMax', value: /\d+/ },
    ],
    children: [
      {
        state: 'HERO_TOBE_CHOSEN',
        sequenceType: 'GameState.DebugPrintEntityChoices',
        level: 1,
        bodyType: 'parameter',
        parameter: [
          {
            key: /Entities\[\d\]/,
            value: /\[entityName=(.*) id=\d+ zone=HAND.*\]/,
          },
        ],
      },
    ],
    getResult: (line): string[] | undefined => {
      return line.children
        ?.map((child) => {
          if (
            Array.isArray(child.body?.parameter) &&
            child.body?.parameter.length
          ) {
            const { value } = child.body.parameter[0];
            const regex = /\[entityName=(.*) id=\d+ zone=HAND.*\]/;
            const matched = value.match(regex);
            if (matched) {
              return matched[1];
            }
          }
          return null;
        })
        .filter((v) => !!v) as string[];
    },
  },
  // 实际选择的英雄
  // D 21:10:08.4912836 GameState.SendChoices() -   m_chosenEntities[0]=[entityName=恐龙大师布莱恩 id=88 zone=HAND zonePos=2 cardId=TB_BaconShop_HERO_43 player=6]
  {
    state: 'HERO_CHOICES',
    sequenceType: 'GameState.SendChoices',
    level: 0,
    bodyType: 'parameter',
    parameter: [
      { key: 'id', value: /\d+/ },
      { key: 'ChoiceType', value: 'MULLIGAN' },
    ],
    children: [
      {
        state: 'HERO_CHOICES',
        sequenceType: 'GameState.SendChoices',
        level: 1,
        bodyType: 'parameter',
        parameter: [
          {
            key: /m_chosenEntities\[\d\]/,
            value: /\[entityName=(.*) id=\d+ zone=HAND.*\]/,
          },
        ],
      },
    ],
    getResult: (line): string[] | undefined => {
      return line.children
        ?.map((child) => {
          if (
            Array.isArray(child.body?.parameter) &&
            child.body?.parameter.length
          ) {
            const { value } = child.body.parameter[0];
            const regex = /\[entityName=(.*) id=\d+ zone=HAND.*\]/;
            const matched = value.match(regex);
            if (matched) {
              return matched[1];
            }
          }
          return null;
        })
        .filter((v) => !!v) as string[];
    },
  },
  // 本局对战中对手的英雄
  // FULL_ENTITY - Updating [entityName=巫妖王 id=141 zone=SETASIDE zonePos=0 cardId=TB_BaconShop_HERO_22 player=16] CardID=TB_BaconShop_HERO_22
  {
    state: 'RIVAL_HEROES',
    sequenceType: 'PowerTaskList.DebugDump',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'Block',
    parameter: [
      {
        key: 'Start',
        value: '(null)',
      },
    ],
    children: [
      {
        state: 'RIVAL_HEROES',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'FULL_ENTITY',
        parameter: [
          {
            key: 'entityName',
            value: /.*/,
          },
          {
            key: 'id',
            value: /\d+/,
          },
          {
            key: 'zone',
            value: 'SETASIDE',
          },
          {
            key: 'zonePos',
            value: '0',
          },
          {
            key: 'cardId',
            value: /TB_BaconShop_HERO_\d+/,
          },
          {
            key: 'player',
            value: /\d+/,
          },
          {
            key: 'CardID',
            value: /TB_BaconShop_HERO_\d+/,
          },
        ],
      },
    ],
    getResult: (line): { hero: string; playerId: string } | undefined => {
      if (Array.isArray(line.children) && line.children.length >= 2) {
        const { body, children } = line.children[1];
        if (body && children) {
          const { parameter } = body;
          const hero = parameter?.find((v) => v.key === 'entityName')?.value;
          // @ts-ignore
          const playerId = children.find((child) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { parameter: childParameter } = child.body!;
            if (Array.isArray(childParameter)) {
              if (
                childParameter[0].key === 'tag' &&
                childParameter[0].value === 'PLAYER_ID' &&
                childParameter[1].key === 'value'
              ) {
                return true;
              }
            }
            return false;
          })?.body?.parameter[1]?.value;
          if (hero && playerId) {
            return {
              hero,
              playerId,
            };
          }
        }
      }
      return undefined;
    },
  },
  // 对局排名
  // D 21:34:58.4100975 GameState.DebugPrintPower() - TAG_CHANGE Entity=[entityName=尤格-萨隆 id=74 zone=PLAY zonePos=0 cardId=TB_BaconShop_HERO_35 player=1] tag=PLAYER_LEADERBOARD_PLACE value=3
  {
    state: 'GAME_RANKING',
    sequenceType: 'GameState.DebugPrintPower',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'TAG_CHANGE',
    parameter: [
      {
        key: 'Entity',
        value: /\[entityName=(.*) id=\d+ zone=PLAY.*\]/,
      },
      {
        key: 'tag',
        value: 'PLAYER_LEADERBOARD_PLACE',
      },
      {
        key: 'value',
        value: /\d/,
      },
    ],
    getResult: (line): string | undefined => {
      return line.body?.parameter?.find((item) => item.key === 'value')?.value;
    },
  },
  // 对局结束
  // D 21:21:43.7370339 GameState.DebugPrintPower() - TAG_CHANGE Entity=GameEntity tag=STEP value=FINAL_GAMEOVER
  {
    state: 'GAME_OVER',
    sequenceType: 'GameState.DebugPrintPower',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'TAG_CHANGE',
    parameter: [
      {
        key: 'Entity',
        value: 'GameEntity',
      },
      {
        key: 'tag',
        value: 'STEP',
      },
      {
        key: 'value',
        value: 'FINAL_GAMEOVER',
      },
    ],
  },
];
