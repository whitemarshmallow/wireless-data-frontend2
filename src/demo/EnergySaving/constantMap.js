import CONSTANT from './constant';

const constantMap = {};
Object.entries(CONSTANT).forEach(([code, list]) => {
  const mapTemp = {};
  list.forEach((v) => {
    const { key, value } = v;
    mapTemp[key] = value;
  });
  constantMap[code] = mapTemp;
});

export default constantMap;