/** GET /api/users/search 응답 */

export interface UserSearchResponse {
  userId: number;
  name: string;
  email: string;
  alreadySelected: boolean;
}
