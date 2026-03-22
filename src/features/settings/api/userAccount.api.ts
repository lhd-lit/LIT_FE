import apiClient from '../../../api/client';

/**
 * DELETE /api/users/{userId} — 회원 탈퇴
 */
export async function deleteUserAccount(userId: number): Promise<void> {
  await apiClient.delete(`/api/users/${userId}`);
}
