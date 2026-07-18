import { BASE_URL } from '../core/http-transport.ts';

export function getResourceLink(path?: string): string {
  if (!path) {
    return '';
  }

  return `${BASE_URL}/resources${path}`;
}
