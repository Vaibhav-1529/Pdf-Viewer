'use server';

import { cookies } from 'next/headers';
import graphqlClient from '@/services/GraphQlClient/gqlclient';
import { GET_USER_BY_TOKEN } from '@/services/gql/queries';

export type UserType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username: string;
};

export async function CheckUser(): Promise<UserType | null> {
  try {
    const cookieStore =await cookies();
    const token = cookieStore.get('Active_user')?.value;

    if (!token) return null;

    const response = await graphqlClient.request(GET_USER_BY_TOKEN, {
      userId: token, 
    });

    return response?.getuserByToken || null;
  } catch (err) {
    console.error('Error fetching user from cookies:', err);
    return null;
  }
}
