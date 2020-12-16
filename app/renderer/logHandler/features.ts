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
  | 'OPPONENT_HEROES'
  | 'NEXT_OPPONENT'
  | 'GAME_RANKING'
  | 'TURN'
  | 'LINEUP'
  | 'LINEUP2'
  | 'BACK_TO_SHOP'
  | 'ALANNA_TRANSFORMATION'
  | 'OWN_LINEUP'
  | 'OWN_LINEUP2'
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
export interface Minion {
  name: string;
  id: string;
  props: {
    [tag: string]: string;
  };
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
    state: 'OPPONENT_HEROES',
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
        state: 'OPPONENT_HEROES',
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
    getResult: (line): { hero: string; playerId: string }[] | undefined => {
      if (Array.isArray(line.children) && line.children.length >= 2) {
        // @ts-ignore
        return line.children
          .map((c) => {
            const { body, children } = c;
            if (body && children) {
              const { parameter } = body;
              const hero = parameter?.find((v) => v.key === 'entityName')
                ?.value;
              const id = parameter?.find((v) => v.key === 'id')?.value;
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
              if (hero && id && playerId) {
                return {
                  hero,
                  id,
                  playerId,
                };
              }
            }
            return null;
          })
          .filter((v) => !!v);
      }
      return undefined;
    },
  },
  // 阿兰娜变身
  // D 16:26:34.5753062 GameState.DebugPrintPower() - BLOCK_START BlockType=TRIGGER Entity=[entityName=阿兰娜技能监控 id=260 zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=6] EffectCardId=System.Collections.Generic.List`1[System.String] EffectIndex=0 Target=0 SubOption=-1 TriggerKeyword=TAG_NOT_SET
  // D 16:26:34.5753062 GameState.DebugPrintPower() -     SUB_SPELL_START - SpellPrefabGUID=BaconFX_HistoryTileGlow_DemonHunter_Super:a80f8077a6dc1b7469ae6726274a54e8 Source=0 TargetCount=1
  // D 16:26:34.5753062 GameState.DebugPrintPower() -                       Targets[0] = 600
  // D 16:26:34.5753062 GameState.DebugPrintPower() -     SUB_SPELL_END
  // D 16:26:34.5753062 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=阿兰娜技能监控 id=260 zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=6] tag=1068 value=5
  // D 16:26:34.5753062 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=阿兰娜技能监控 id=260 zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=6] tag=1068 value=0
  // D 16:26:34.5753062 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=阿兰娜技能监控 id=260 zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=6] tag=ZONE value=REMOVEDFROMGAME
  // D 16:26:34.5753062 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=阿兰娜技能监控 id=260 zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=6] tag=1234 value=17
  // D 16:26:34.5753062 GameState.DebugPrintPower() -     HIDE_ENTITY - Entity=[entityName=阿兰娜技能监控 id=260 zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=6] tag=ZONE value=REMOVEDFROMGAME
  // D 16:26:34.5753062 GameState.DebugPrintPower() - BLOCK_END
  {
    state: 'ALANNA_TRANSFORMATION',
    sequenceType: 'GameState.DebugPrintPower',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'BLOCK_START',
    parameter: [
      // Entity=[entityName=阿兰娜技能监控 id=260 zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=6] EffectCardId=System.Collections.Generic.List`1[System.String] EffectIndex=0 Target=0 SubOption=-1 TriggerKeyword=TAG_NOT_SET
      {
        key: 'Entity',
        value: /\[entityName=.* id=\d+ zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=\d+\] EffectCardId=System.Collections.Generic.List`1\[System.String\]/,
      },
      {
        key: 'EffectIndex',
        value: '0',
      },
      {
        key: 'Target',
        value: '0',
      },
      {
        key: 'SubOption',
        value: '-1',
      },
      {
        key: 'TriggerKeyword',
        value: 'TAG_NOT_SET',
      },
    ],
    children: [
      {
        state: 'ALANNA_TRANSFORMATION',
        sequenceType: 'GameState.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          // TAG_CHANGE Entity=[entityName=阿兰娜技能监控 id=260 zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=6] tag=ZONE value=REMOVEDFROMGAME
          {
            key: 'Entity',
            value: /\[entityName=.* id=\d+ zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=\d+\]/,
          },
          {
            key: 'tag',
            value: 'ZONE',
          },
          {
            key: 'value',
            value: 'REMOVEDFROMGAME',
          },
        ],
      },
    ],
    getResult: (line) => {
      const oldHero = '阿兰娜·逐星';
      const oldIdRegex = /\[entityName=.* id=(\d+) zone=PLAY zonePos=0 cardId=TB_BaconShop_HP_065pe player=\d+\] EffectCardId=System.Collections.Generic.List`1\[System.String\]/;
      const matched = line.body?.parameter
        ?.find((v) => v.key === 'Entity')
        ?.value.match(oldIdRegex);
      const oldId = matched?.[1];
      // 返回变身后的英雄 ID
      const id = line.children?.[0].children?.[0]?.body?.parameter?.[0]?.value;
      const hero = '释放自我的阿兰娜';
      return {
        oldHero,
        oldId,
        hero,
        id,
      };
    },
  },
  // 下一个对手
  // D 12:04:35.5855977 GameState.DebugPrintPower() - BLOCK_START BlockType=TRIGGER Entity=[entityName=战棋商店8玩家强化 id=47 zone=PLAY zonePos=0 cardId=TB_BaconShop_8P_PlayerE player=2] EffectCardId=System.Collections.Generic.List`1[System.String] EffectIndex=2 Target=0 SubOption=-1 TriggerKeyword=TAG_NOT_SET
  // D 12:04:35.5855977 GameState.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=天空上尉库拉格 id=76 zone=PLAY zonePos=0 cardId=TB_BaconShop_HERO_68 player=2] tag=NEXT_OPPONENT_PLAYER_ID value=4
  // D 12:04:35.5855977 GameState.DebugPrintPower() - BLOCK_END
  {
    state: 'NEXT_OPPONENT',
    sequenceType: 'GameState.DebugPrintPower',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'BLOCK_START',
    parameter: [
      {
        key: 'Entity',
        value: /\[entityName=(.*) id=\d+ zone=PLAY zonePos=0 cardId=TB_BaconShop_8P_PlayerE player=\d+\].*/,
      },
      {
        key: 'EffectIndex',
        value: /\d+/,
      },
      {
        key: 'Target',
        value: /\d+/,
      },
      {
        key: 'SubOption',
        value: '-1',
      },
      {
        key: 'TriggerKeyword',
        value: 'TAG_NOT_SET',
      },
    ],
    children: [
      {
        state: 'NEXT_OPPONENT',
        sequenceType: 'GameState.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: /\[entityName=(.*) id=\d+ zone=PLAY zonePos=0 cardId=TB_BaconShop_HERO_\d+ player=\d+\]/,
          },
          {
            key: 'tag',
            value: 'NEXT_OPPONENT_PLAYER_ID',
          },
          {
            key: 'value',
            value: /\d/,
          },
        ],
      },
    ],
    getResult: (line): string | undefined => {
      const child = line?.children?.[0];
      if (child) {
        return child?.body?.parameter?.find((v) => v.key === 'value')?.value;
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
  // 第几轮
  // D 17:39:27.6654174 GameState.DebugPrintPower() - BLOCK_START BlockType=TRIGGER Entity=GameEntity EffectCardId=System.Collections.Generic.List`1[System.String] EffectIndex=6 Target=0 SubOption=-1 TriggerKeyword=TAG_NOT_SET
  // D 17:39:27.6654174 GameState.DebugPrintPower() -     TAG_CHANGE Entity=鲍勃的酒馆 tag=1292 value=1
  // D 17:39:27.6654174 GameState.DebugPrintPower() -     TAG_CHANGE Entity=鲍勃的酒馆 tag=1292 value=0
  // D 17:39:27.6654174 GameState.DebugPrintPower() -     TAG_CHANGE Entity=走夜路#51810 tag=1292 value=1
  // D 17:39:27.6654174 GameState.DebugPrintPower() -     TAG_CHANGE Entity=鲍勃的酒馆 tag=CURRENT_PLAYER value=0
  // D 17:39:27.6654174 GameState.DebugPrintPower() -     TAG_CHANGE Entity=走夜路#51810 tag=CURRENT_PLAYER value=1
  // D 17:39:27.6654174 GameState.DebugPrintPower() -     TAG_CHANGE Entity=GameEntity tag=TURN value=1
  // D 17:39:27.6654174 GameState.DebugPrintPower() -     TAG_CHANGE Entity=GameEntity tag=NEXT_STEP value=MAIN_READY
  // D 17:39:27.6654174 GameState.DebugPrintPower() - BLOCK_END
  {
    state: 'TURN',
    sequenceType: 'GameState.DebugPrintPower',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'BLOCK_START',
    parameter: [
      {
        key: 'BlockType',
        value: 'TRIGGER',
      },
      {
        key: 'Entity',
        value: /.*/,
      },
      {
        key: 'EffectCardId',
        value: 'System.Collections.Generic.List`1[System.String]',
      },
      {
        key: 'EffectIndex',
        value: '-1',
      },
      {
        key: 'Target',
        value: '0',
      },
      {
        key: 'SubOption',
        value: '-1',
      },
      {
        key: 'TriggerKeyword',
        value: 'TAG_NOT_SET',
      },
    ],
    children: [
      {
        state: 'TURN',
        sequenceType: 'GameState.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: 'GameEntity',
          },
          {
            key: 'tag',
            value: 'NUM_TURNS_IN_PLAY',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
      {
        state: 'TURN',
        sequenceType: 'GameState.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: 'GameEntity',
          },
          {
            key: 'tag',
            value: 'NEXT_STEP',
          },
          {
            key: 'value',
            value: 'MAIN_START_TRIGGERS',
          },
        ],
      },
    ],
    getResult: (line): number | undefined => {
      const child = line.children?.find(
        (v) =>
          !!v.body?.parameter?.find(
            (c) => c.key === 'tag' && c.value === 'NUM_TURNS_IN_PLAY'
          )
      );
      const turn = child?.body?.parameter?.find((v) => v.key === 'value')
        ?.value;
      if (turn) {
        return Math.round(parseInt(turn, 10) / 2);
      }
      return undefined;
    },
  },
  // 阵容 包含对手以及自己(随从实际属性)
  // D 16:43:20.1493759 PowerTaskList.DebugPrintPower() - BLOCK_START BlockType=TRIGGER Entity=[entityName=战棋商店8玩家强化 id=63 zone=PLAY zonePos=0 cardId=TB_BaconShop_8P_PlayerE player=6] EffectCardId=System.Collections.Generic.List`1[System.String] EffectIndex=9 Target=0 SubOption=-1 TriggerKeyword=TAG_NOT_SET
  {
    state: 'LINEUP',
    sequenceType: 'PowerTaskList.DebugPrintPower',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'BLOCK_START',
    parameter: [
      {
        key: 'Entity',
        value: /\[entityName=.* id=\d+ zone=PLAY zonePos=0 cardId=TB_BaconShop_8P_PlayerE player=\d+\] EffectCardId=System.Collections.Generic.List`1\[System.String\]/,
      },
      {
        key: 'EffectIndex',
        // 不能是 -1
        value: /^(?!-1)\d+/,
      },
      {
        key: 'Target',
        value: '0',
      },
      {
        key: 'SubOption',
        value: '-1',
      },
      {
        key: 'TriggerKeyword',
        value: 'TAG_NOT_SET',
      },
    ],
    children: [
      // D 16:43:20.1493759 PowerTaskList.DebugPrintPower() -     FULL_ENTITY - Updating [entityName=雕文护卫者 id=712 zone=PLAY zonePos=1 cardId=BGS_045 player=14] CardID=BGS_045
      {
        state: 'LINEUP',
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
            value: 'PLAY',
          },
          {
            key: 'zonePos',
            value: /\d+/,
          },
          {
            key: 'cardId',
            value: /^TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?/,
          },
          {
            key: 'player',
            value: /\d+/,
          },
          {
            key: 'CardID',
            value: /^TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?/,
          },
        ],
      },
      // D 16:43:20.1493759 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=雕文护卫者 id=712 zone=PLAY zonePos=1 cardId=BGS_045 player=14] tag=479 value=4
      {
        state: 'LINEUP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: /^\[entityName=.* id=\d+ zone=PLAY zonePos=\d+ cardId=(TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?) player=\d+\]/,
          },
          {
            key: 'tag',
            value: /.*/,
          },
          {
            key: 'value',
            value: /.*/,
          },
        ],
      },
      // D 16:43:20.1493759 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=炎魔之王拉格纳罗斯 id=719 zone=PLAY zonePos=0 cardId=TB_BaconShop_HERO_11 player=14] tag=NUM_ATTACKS_THIS_TURN value=1
      {
        state: 'LINEUP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: /\[entityName=.* id=\d+ zone=PLAY zonePos=0 cardId=TB_BaconShop_HERO_\d+ player=\d+\]/,
          },
          {
            key: 'tag',
            value: 'NUM_ATTACKS_THIS_TURN',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
    ],
    getResult: (
      line
    ):
      | {
          opponent: { hero: string; minions: Minion[] };
          own: { hero: string; minions: Minion[] };
        }
      | undefined => {
      let opponentHero = '';
      const opponentMinions: Minion[] = [];
      let ownHero = '';
      const ownMinions: Minion[] = [];
      line?.children?.forEach((v) => {
        const original = v?.body?.original;
        const opponentMinionMatched = original?.match(
          /^ {4}FULL_ENTITY - Updating \[entityName=(.*) id=(\d+) zone=PLAY zonePos=\d+ cardId=(TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?) player=\d+\] CardID=(TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?)/
        );
        const opponentMinionUpdateMatched = original?.match(
          /^ {4}TAG_CHANGE Entity=\[entityName=(.*) id=(\d+) zone=PLAY zonePos=\d+ cardId=.*_\d+[a-z]? player=\d+\] tag=(.*) value=(.*)/
        );
        const opponentHeroMatched = original?.match(
          /^ {4}FULL_ENTITY - Updating \[entityName=(.*) id=(\d+) zone=PLAY zonePos=0 cardId=TB_BaconShop_HERO_\d+[a-z]? player=\d+\] CardID=TB_BaconShop_HERO_\d+[a-z]?/
        );
        if (opponentMinionMatched) {
          const name = opponentMinionMatched[1];
          const id = opponentMinionMatched[2];
          if (name && id) {
            const props =
              v.children?.reduce((pre, cur) => {
                if (cur.body?.parameter) {
                  const prop = cur.body?.parameter.find((c) => c.key === 'tag')
                    ?.value;
                  const value = cur.body?.parameter.find(
                    (c) => c.key === 'value'
                  )?.value;
                  if (prop && value) {
                    return {
                      ...pre,
                      [prop]: value,
                    };
                  }
                  return pre;
                }
                return pre;
              }, {}) ?? {};
            // eslint-disable-next-line prefer-destructuring
            if (
              !opponentMinions.length ||
              !opponentMinions.find((c) => c.name === name && c.id === id)
            ) {
              opponentMinions.push({
                name,
                id,
                props,
              });
            } else {
              opponentMinions.forEach((c) => {
                if (c.name === name && c.id === id) {
                  c.props = props;
                }
              });
            }
          }
        }
        if (opponentMinionUpdateMatched) {
          const name = opponentMinionUpdateMatched[1];
          const id = opponentMinionUpdateMatched[2];
          const prop = opponentMinionUpdateMatched[3];
          const value = opponentMinionUpdateMatched[4];
          const minion = opponentMinions.find(
            (c) => c.name === name && c.id === id
          );
          if (prop && value && minion) {
            minion.props[prop] = value;
          }
        }
        if (opponentHeroMatched) {
          // eslint-disable-next-line prefer-destructuring
          opponentHero = opponentHeroMatched[1];
        }

        const ownMinionMatched = original?.match(
          /^ {4}FULL_ENTITY - Updating \[entityName=(.*) id=(\d+) zone=SETASIDE zonePos=\d+ cardId=(TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?) player=\d+\] CardID=(TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?)/
        );
        const ownMinionUpdateMatched = original?.match(
          /^ {4}TAG_CHANGE Entity=\[entityName=(.*) id=(\d+) zone=SETASIDE zonePos=\d+ cardId=.*_\d+[a-z]? player=\d+\] tag=(.*) value=(.*)/
        );
        const ownHeroMatched = original?.match(
          /^ {4}FULL_ENTITY - Updating \[entityName=(.*) id=(\d+) zone=SETASIDE zonePos=0 cardId=TB_BaconShop_HERO_\d+[a-z]? player=\d+\] CardID=TB_BaconShop_HERO_\d+[a-z]?/
        );
        if (ownMinionMatched) {
          const name = ownMinionMatched[1];
          const id = ownMinionMatched[2];
          if (name && id) {
            const props =
              v.children?.reduce((pre, cur) => {
                if (cur.body?.parameter) {
                  const prop = cur.body?.parameter.find((c) => c.key === 'tag')
                    ?.value;
                  const value = cur.body?.parameter.find(
                    (c) => c.key === 'value'
                  )?.value;
                  if (prop && value) {
                    return {
                      ...pre,
                      [prop]: value,
                    };
                  }
                  return pre;
                }
                return pre;
              }, {}) ?? {};
            // eslint-disable-next-line prefer-destructuring
            if (
              !ownMinions.length ||
              !ownMinions.find((c) => c.name === name && c.id === id)
            ) {
              ownMinions.push({
                name,
                id,
                props,
              });
            } else {
              ownMinions.forEach((c) => {
                if (c.name === name && c.id === id) {
                  c.props = props;
                }
              });
            }
          }
        }
        if (ownMinionUpdateMatched) {
          const name = ownMinionUpdateMatched[1];
          const id = ownMinionUpdateMatched[2];
          const prop = ownMinionUpdateMatched[3];
          const value = ownMinionUpdateMatched[4];
          const minion = ownMinions.find((c) => c.name === name && c.id === id);
          if (prop && value && minion) {
            minion.props[prop] = value;
          }
        }
        if (ownHeroMatched) {
          // eslint-disable-next-line prefer-destructuring
          ownHero = ownHeroMatched[1];
        }
      });

      if (opponentHero) {
        return {
          opponent: {
            hero: opponentHero,
            minions: opponentMinions,
          },
          own: { hero: ownHero, minions: ownMinions },
        };
      }
      return undefined;
    },
  },
  // 阵容 只包含自己的阵容详情。通常作为 LINEUP 的替补
  // D 20:30:07.8524131 PowerTaskList.DebugDump() - Block Start=(null)
  {
    state: 'LINEUP2',
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
      // D 20:30:07.8524131 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=炎魔之王拉格纳罗斯 id=1781 zone=PLAY zonePos=0 cardId=TB_BaconShop_HERO_11 player=15] tag=DAMAGE value=28
      {
        state: 'LINEUP2',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: /\[entityName=.* id=\d+ zone=PLAY zonePos=0 cardId=TB_BaconShop_HERO_\d+ player=\d+\]/,
          },
          {
            key: 'tag',
            value: 'DAMAGE',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
      // D 20:30:07.8524131 PowerTaskList.DebugPrintPower() -     FULL_ENTITY - Updating [entityName=海盗无赖 id=1783 zone=SETASIDE zonePos=0 cardId=BGS_061 player=7] CardID=BGS_061
      {
        state: 'LINEUP2',
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
            value: /\d+/,
          },
          {
            key: 'cardId',
            value: /^TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?/,
          },
          {
            key: 'player',
            value: /\d+/,
          },
          {
            key: 'CardID',
            value: /^TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?/,
          },
        ],
      },
      // D 20:30:07.8524131 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=海盗无赖 id=1783 zone=SETASIDE zonePos=0 cardId=BGS_061 player=7] tag=LAST_AFFECTED_BY value=549
      {
        state: 'LINEUP2',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: /^\[entityName=.* id=\d+ zone=SETASIDE zonePos=\d+ cardId=(TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?) player=\d+\]/,
          },
          {
            key: 'tag',
            value: 'LAST_AFFECTED_BY',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
    ],
    getResult: (line): Minion[] | undefined => {
      const ownMinions: Minion[] = [];
      line?.children?.forEach((v) => {
        const original = v?.body?.original;

        const ownMinionMatched = original?.match(
          /^ {4}FULL_ENTITY - Updating \[entityName=(.*) id=(\d+) zone=SETASIDE zonePos=\d+ cardId=(TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?) player=\d+\] CardID=(TB_BaconShop_HP_033t|((?!TB_BaconShop).)*_\d+[a-z]?)/
        );
        const ownMinionUpdateMatched = original?.match(
          /^ {4}TAG_CHANGE Entity=\[entityName=(.*) id=(\d+) zone=SETASIDE zonePos=\d+ cardId=.*_\d+[a-z]? player=\d+\] tag=(.*) value=(.*)/
        );
        if (ownMinionMatched) {
          const name = ownMinionMatched[1];
          const id = ownMinionMatched[2];
          if (name && id) {
            const props =
              v.children?.reduce((pre, cur) => {
                if (cur.body?.parameter) {
                  const prop = cur.body?.parameter.find((c) => c.key === 'tag')
                    ?.value;
                  const value = cur.body?.parameter.find(
                    (c) => c.key === 'value'
                  )?.value;
                  if (prop && value) {
                    return {
                      ...pre,
                      [prop]: value,
                    };
                  }
                  return pre;
                }
                return pre;
              }, {}) ?? {};
            // eslint-disable-next-line prefer-destructuring
            if (
              !ownMinions.length ||
              !ownMinions.find((c) => c.name === name && c.id === id)
            ) {
              ownMinions.push({
                name,
                id,
                props,
              });
            } else {
              ownMinions.forEach((c) => {
                if (c.name === name && c.id === id) {
                  c.props = props;
                }
              });
            }
          }
        }
        if (ownMinionUpdateMatched) {
          const name = ownMinionUpdateMatched[1];
          const id = ownMinionUpdateMatched[2];
          const prop = ownMinionUpdateMatched[3];
          const value = ownMinionUpdateMatched[4];
          const minion = ownMinions.find((c) => c.name === name && c.id === id);
          if (prop && value && minion) {
            minion.props[prop] = value;
          }
        }
      });

      if (ownMinions) {
        return ownMinions;
      }
      return undefined;
    },
  },
  // 自己阵容（不包含属性 仅为随从种类以及站位）
  {
    state: 'OWN_LINEUP',
    sequenceType: 'GameState.DebugPrintOptions',
    level: 0,
    bodyType: 'parameter',
    parameter: [
      {
        key: 'id',
        value: /\d+/,
      },
    ],
    children: [
      // D 16:01:52.1140146 GameState.DebugPrintOptions() -   option 13 type=POWER mainEntity=[entityName=微型木乃伊 id=220 zone=HAND zonePos=1 cardId=ULD_217 player=2] error=REQ_ATTACKER_CAN_ATTACK errorParam=
      {
        state: 'OWN_LINEUP',
        sequenceType: 'GameState.DebugPrintOptions',
        level: 1,
        bodyType: 'commandWithParameter',
        command: /^option \d+$/,
        parameter: [
          {
            key: 'mainEntity',
            value: /\[entityName=.* id=\d+ zone=(HAND|PLAY) zonePos=\d+ cardId=.* player=\d+\]/,
          },
          {
            key: 'error',
            value: 'REQ_ATTACKER_CAN_ATTACK',
          },
          {
            key: 'errorParam',
            value: '',
          },
        ],
      },
    ],
    getResult: (line) => {
      const reg = /option \d+ type=POWER mainEntity=\[entityName=(.*) id=(\d+) zone=(HAND|PLAY) zonePos=(\d+) cardId=.* player=\d+\] error=REQ_ATTACKER_CAN_ATTACK errorParam=/;
      const result: {
        minion: string;
        id: string;
        zone: string;
        position: string;
      }[] = [];
      line.children?.forEach((item) => {
        const matched = item.original.match(reg);
        if (matched) {
          const minion = matched[1];
          const id = matched[2];
          const zone = matched[3];
          const position = matched[4];
          result.push({
            minion,
            id,
            zone,
            position,
          });
        }
      });
      return result;
    },
  },
  // 自己阵容2（通常表现为手牌到场上 导致站位变化）
  // D 16:01:52.4126408 PowerTaskList.DebugPrintPower() - BLOCK_START BlockType=PLAY Entity=[entityName=微型木乃伊 id=220 zone=HAND zonePos=1 cardId=ULD_217 player=2] EffectCardId=System.Collections.Generic.List`1[System.String] EffectIndex=0 Target=0 SubOption=-1
  {
    state: 'OWN_LINEUP2',
    sequenceType: 'PowerTaskList.DebugPrintPower',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'BLOCK_START',
    parameter: [
      {
        key: 'Entity',
        value: /\[entityName=.* id=\d+ zone=HAND zonePos=\d+ cardId=.* player=\d+\] EffectCardId=System.Collections.Generic.List`1\[System.String\]/,
      },
      {
        key: 'EffectIndex',
        value: '0',
      },
      {
        key: 'Target',
        value: '0',
      },
      {
        key: 'SubOption',
        value: '-1',
      },
    ],
    children: [
      // D 16:01:52.4126408 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=走夜路#51810 tag=NUM_CARDS_PLAYED_THIS_TURN value=1
      {
        state: 'OWN_LINEUP2',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: /.*/,
          },
          {
            key: 'tag',
            value: 'NUM_CARDS_PLAYED_THIS_TURN',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
      // D 16:01:52.4126408 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=走夜路#51810 tag=NUM_MINIONS_PLAYED_THIS_TURN value=1
      {
        state: 'OWN_LINEUP2',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: /.*/,
          },
          {
            key: 'tag',
            value: 'NUM_MINIONS_PLAYED_THIS_TURN',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
      // D 16:01:52.4126408 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=[entityName=微型木乃伊 id=220 zone=HAND zonePos=1 cardId=ULD_217 player=2] tag=1068 value=1
      {
        state: 'OWN_LINEUP2',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: /\[entityName=.* id=\d+ zone=(HAND|PLAY) zonePos=\d+ cardId=.* player=\d+\]/,
          },
          {
            key: 'tag',
            value: /\d+/,
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
    ],
    getResult: (line) => {
      const result: Record<
        string,
        {
          minion: string;
          zone: 'PLAY' | 'HAND';
          position: string;
          data: Record<string, any>;
        }
      > = {};
      const reg = /TAG_CHANGE Entity=\[entityName=(.*) id=(\d+) zone=(HAND|PLAY) zonePos=(\d+) cardId=.*_\d+[a-z]? player=\d+\] tag=(.*) value=(\d+)/;
      line.children?.forEach?.((item) => {
        const matched = item.original.match(reg);
        if (matched) {
          const minion = matched[1];
          const id = matched[2];
          const zone = matched[3] as 'PLAY' | 'HAND';
          const position = matched[4];
          const tag = matched[5];
          const value = matched[6];
          if (result[id]) {
            result[id].data = {
              ...result[id].data,
              [tag]: value,
            };
          } else {
            result[id] = {
              minion,
              zone,
              position,
              data: {
                [tag]: value,
              },
            };
          }
        }
      });
      return result;
    },
  },
  // 回到酒馆（主要用于定位战斗动画完毕的时机）
  {
    state: 'BACK_TO_SHOP',
    sequenceType: 'PowerTaskList.DebugPrintPower',
    level: 0,
    bodyType: 'commandWithParameter',
    command: 'BLOCK_START',
    parameter: [
      {
        key: 'Entity',
        value: /\[entityName=战棋商店8玩家强化 id=\d+ zone=PLAY zonePos=0 cardId=TB_BaconShop_8P_PlayerE player=\d+\] EffectCardId=System.Collections.Generic.List`1\[System.String\]/,
      },
      {
        key: 'EffectIndex',
        value: /\d+/,
      },
      {
        key: 'Target',
        value: '0',
      },
      {
        key: 'SubOption',
        value: '-1',
      },
      {
        key: 'TriggerKeyword',
        value: 'TAG_NOT_SET',
      },
    ],
    children: [
      // D 13:44:36.0831795 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=GameEntity tag=BOARD_VISUAL_STATE value=1
      {
        state: 'BACK_TO_SHOP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: 'GameEntity',
          },
          {
            key: 'tag',
            value: 'BOARD_VISUAL_STATE',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
      // D 13:44:36.0831795 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=GameEntity tag=MISSION_EVENT value=1
      {
        state: 'BACK_TO_SHOP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: 'GameEntity',
          },
          {
            key: 'tag',
            value: 'MISSION_EVENT',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
      // D 11:50:52.0748816 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=GameEntity tag=1488 value=1
      {
        state: 'BACK_TO_SHOP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'TAG_CHANGE',
        parameter: [
          {
            key: 'Entity',
            value: 'GameEntity',
          },
          {
            key: 'tag',
            value: '1488',
          },
          {
            key: 'value',
            value: /\d+/,
          },
        ],
      },
      // D 13:44:36.0831795 PowerTaskList.DebugPrintPower() -     FULL_ENTITY - Updating [entityName=刷新 id=315 zone=PLAY zonePos=0 cardId=TB_BaconShop_8p_Reroll_Button player=2] CardID=TB_BaconShop_8p_Reroll_Button
      {
        state: 'BACK_TO_SHOP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'FULL_ENTITY',
        parameter: [
          {
            key: 'entityName',
            value: '刷新',
          },
          {
            key: 'id',
            value: /\d+/,
          },
          {
            key: 'zone',
            value: 'PLAY',
          },
          {
            key: 'zonePos',
            value: '0',
          },
          {
            key: 'cardId',
            value: 'TB_BaconShop_8p_Reroll_Button',
          },
          {
            key: 'player',
            value: /\d+/,
          },
          {
            key: 'CardID',
            value: 'TB_BaconShop_8p_Reroll_Button',
          },
        ],
      },
      // D 13:44:36.0831795 PowerTaskList.DebugPrintPower() -     FULL_ENTITY - Updating [entityName=冻结 id=316 zone=PLAY zonePos=0 cardId=TB_BaconShopLockAll_Button player=2] CardID=TB_BaconShopLockAll_Button
      {
        state: 'BACK_TO_SHOP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'FULL_ENTITY',
        parameter: [
          {
            key: 'entityName',
            value: '冻结',
          },
          {
            key: 'id',
            value: /\d+/,
          },
          {
            key: 'zone',
            value: 'PLAY',
          },
          {
            key: 'zonePos',
            value: '0',
          },
          {
            key: 'cardId',
            value: 'TB_BaconShopLockAll_Button',
          },
          {
            key: 'player',
            value: /\d+/,
          },
          {
            key: 'CardID',
            value: 'TB_BaconShopLockAll_Button',
          },
        ],
      },
      // D 13:44:36.0831795 PowerTaskList.DebugPrintPower() -     FULL_ENTITY - Updating [entityName=拖动随从将其出售 id=318 zone=PLAY zonePos=0 cardId=TB_BaconShop_DragSell player=2] CardID=TB_BaconShop_DragSell
      {
        state: 'BACK_TO_SHOP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'FULL_ENTITY',
        parameter: [
          {
            key: 'entityName',
            value: '拖动随从将其出售',
          },
          {
            key: 'id',
            value: /\d+/,
          },
          {
            key: 'zone',
            value: 'PLAY',
          },
          {
            key: 'zonePos',
            value: '0',
          },
          {
            key: 'cardId',
            value: 'TB_BaconShop_DragSell',
          },
          {
            key: 'player',
            value: /\d+/,
          },
          {
            key: 'CardID',
            value: 'TB_BaconShop_DragSell',
          },
        ],
      },
      // D 13:44:36.0831795 PowerTaskList.DebugPrintPower() -     FULL_ENTITY - Updating [entityName=拖动随从将其购入 id=319 zone=PLAY zonePos=0 cardId=TB_BaconShop_DragBuy player=2] CardID=TB_BaconShop_DragBuy
      {
        state: 'BACK_TO_SHOP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
        bodyType: 'commandWithParameter',
        command: 'FULL_ENTITY',
        parameter: [
          {
            key: 'entityName',
            value: '拖动随从将其购入',
          },
          {
            key: 'id',
            value: /\d+/,
          },
          {
            key: 'zone',
            value: 'PLAY',
          },
          {
            key: 'zonePos',
            value: '0',
          },
          {
            key: 'cardId',
            value: 'TB_BaconShop_DragBuy',
          },
          {
            key: 'player',
            value: /\d+/,
          },
          {
            key: 'CardID',
            value: 'TB_BaconShop_DragBuy',
          },
        ],
      },
      // D 13:44:36.0831795 PowerTaskList.DebugPrintPower() -     TAG_CHANGE Entity=GameEntity tag=STEP value=MAIN_END
      {
        state: 'BACK_TO_SHOP',
        sequenceType: 'PowerTaskList.DebugPrintPower',
        level: 1,
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
            value: 'MAIN_END',
          },
        ],
      },
    ],
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
