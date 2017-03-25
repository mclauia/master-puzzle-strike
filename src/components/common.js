import { RED, BLUE, PURPLE, BROWN, MULTI, GOLD } from '../colors';

export function chipClass(color) {
  switch (color) {
    case RED:
      return 'danger'
    case BLUE:
      return 'primary'
    case PURPLE:
      return 'purple'
    case BROWN:
      return 'warning'
    case GOLD:
      return 'gold'
    case MULTI:
    default:
      return 'default';
  }
}

export function pluralize(count) {
  return count > 1 ? 's' : ''
}
