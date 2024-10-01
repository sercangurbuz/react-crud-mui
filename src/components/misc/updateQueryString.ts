function updateQueryString(uri: string = '', qs: Record<string, string | number> = {}): string {
  for (const key in qs) {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
      uri = uri.replace(re, '$1' + key + '=' + qs[key] + '$2');
    } else {
      uri = uri + separator + key + '=' + qs[key];
    }
  }
  return uri;
}

export default updateQueryString;
