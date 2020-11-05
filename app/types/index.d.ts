export interface WatchState {
  state: 'next' | 'complete' | 'error';
  message: string;
}
