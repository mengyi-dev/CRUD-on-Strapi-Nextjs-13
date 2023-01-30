// eslint-disable-next-line import/no-anonymous-default-export
export default function (str: string) {
    return str
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[-\s]+/g, '-');
};