import request from './request';

export interface User {
  _id: string;
  bnetId: number;
  bnetSub: string;
  bnetTag: string;
}

export async function getUser(): Promise<User | undefined> {
  const url = `/auth/profile`;
  const { data } = await request.get(url);
  if (data && data.code === 0) {
    return data.data;
  }
  return undefined;
}
