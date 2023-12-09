import Cookies from 'js-cookie';

export const userCookieName = 'kjsdnfkjsdnfkjskafldmnaflkasmdfkls';
export const groupCookieName = 'nrbuwuvbqyiebcidnuwnciuqwbcuwncbcheu';

export function getCookie(cookieName) {
  const cookie = Cookies.get(cookieName);

  if (cookie) return cookie;
  return '';
}

export function setCookie(cookieName, cookieData) {
  Cookies.set(cookieName, JSON.stringify(cookieData));
}
