import request from './request';

export interface User {
  bnetId: number;
  bnetSub: string;
  bnetTag: string;
}

export async function getUser(): Promise<User | undefined> {
  const url = `/auth/profile`;
  const { data } = await request.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('hbt_token')}`,
    },
  });
  if (data) {
    return data;
  }
  return undefined;
}
