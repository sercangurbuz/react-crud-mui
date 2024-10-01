const accentMap: Record<string, string> = {
  Ü: 'U',
  Ğ: 'G',
  İ: 'I',
  Ş: 'S',
  Ç: 'C',
  Ö: 'O',
  ü: 'U',
  ğ: 'G',
  ı: 'I',
  ş: 'S',
  ç: 'C',
  ö: 'O'
};

export default (term: string) => {
  let ret = '';
  term.split('').forEach((_val, index) => {
    ret += accentMap[term.charAt(index).toString()] || term.charAt(index);
  });
  return ret;
};
