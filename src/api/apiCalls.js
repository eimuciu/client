import { apiURL } from '../helpers/constants';

export async function getGroupsList() {
  const resp = await fetch(`${apiURL}/api/group`);
  const data = await resp.json();
  return data;
}
