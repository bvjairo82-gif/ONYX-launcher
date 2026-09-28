import { WidgetBorderStyle, WidgetBgStyle } from '../types/launcher';

export function getWidgetContainerStyle(
  borderStyle: WidgetBorderStyle = 'none',
  bgStyle: WidgetBgStyle = 'black',
  accentColor = '#FFFFFF'
): { className: string; style: React.CSSProperties } {
  let borderClasses = '';
  const inlineStyle: React.CSSProperties = {};

  switch (borderStyle) {
    case 'none':
      borderClasses = 'border-none';
      break;
    case 'subtle':
      borderClasses = 'border border-white/15';
      break;
    case 'glow':
      borderClasses = 'border';
      inlineStyle.borderColor = accentColor;
      inlineStyle.boxShadow = `0 0 12px ${accentColor}25`;
      break;
    case 'dashed':
      borderClasses = 'border border-dashed border-white/20';
      break;
  }

  let bgClasses = 'bg-black';
  switch (bgStyle) {
    case 'black':
      bgClasses = 'bg-black';
      break;
    case 'translucent':
      bgClasses = 'bg-black/75 backdrop-blur-md';
      break;
    case 'transparent':
      bgClasses = 'bg-transparent';
      break;
  }

  return {
    className: `${borderClasses} ${bgClasses}`,
    style: inlineStyle,
  };
}
