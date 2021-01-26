import { remote } from 'electron'

type CardType = 'original' | 'minion' | 'hero'
export function getImageUrl(cardId: string, type: CardType = 'original') {
  if (type === 'minion') {
    return `https://hs.chenyueban.com/hearthstone/images/minions/${cardId}.png`
  }
  if (type === 'hero') {
    return `https://hs.chenyueban.com/hearthstone/images/heroes/${cardId}.png`
  }
  return `https://hs.chenyueban.com/hearthstone/images/original/${cardId}.jpg`
}

const { suspensionManager } = remote.getGlobal('managers')
export function showSuspension() {
  suspensionManager?.show()
}
export function hideSuspension() {
  suspensionManager?.hide()
}
