const TOKEN_KEY = 'accessToken';

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('[getToken] 토큰 조회:', {
    exists: !!token,
    length: token?.length,
    preview: token ? `${token.substring(0, 30)}...${token.substring(token.length - 30)}` : null,
    full: token, // 디버깅용 전체 토큰 값
  });
  return token;
};

export const setToken = (token: string): void => {
  console.log('[setToken] 토큰 저장:', {
    tokenLength: token.length,
    tokenPreview: `${token.substring(0, 30)}...${token.substring(token.length - 30)}`,
    tokenFull: token, // 디버깅용 전체 토큰 값
  });
  localStorage.setItem(TOKEN_KEY, token);
  const saved = localStorage.getItem(TOKEN_KEY);
  console.log('[setToken] 토큰 저장 완료, 확인:', {
    saved: !!saved,
    savedLength: saved?.length,
    matches: saved === token,
  });
};

export const removeToken = (): void => {
  console.log('[removeToken] 토큰 제거');
  localStorage.removeItem(TOKEN_KEY);
};

