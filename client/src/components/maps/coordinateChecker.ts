import Coordinates from 'coordinate-parser';

export const coordinateChecker = (position: string): any => {
  let isValid;
  try {
    isValid = true;
    const coordinates = new Coordinates(position);
    return coordinates;
  } catch (error) {
    isValid = false;
    return isValid;
  }
};

export default coordinateChecker;
