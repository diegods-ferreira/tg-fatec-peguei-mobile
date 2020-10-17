import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

/**
 * Width-Percentage
 * Converts width dimension to percentage
 * 360, 720 - design were made using this scale
 * @param dimension directly taken from design wireframes
 * @returns {number} percentage value
 */
export function parseWidthPercentage(dimension: number): number {
  return widthPercentageToDP(`${(dimension / 360) * 100}%`);
}

/**
 * Height-Percentage
 * Converts height dimension to percentage
 * 360, 720 - design were made using this scale
 * @param dimension directly taken from design wireframes
 * @returns {number} percentage value
 */
export function parseHeightPercentage(dimension: number): number {
  return heightPercentageToDP(`${(dimension / 720) * 100}%`);
}
