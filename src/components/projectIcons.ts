// Icon data for the project registry.
//
// These 14 icons are copied from Lucide (https://lucide.dev), licensed under
// the ISC licence: https://github.com/lucide-icons/lucide/blob/main/LICENSE
// (Copyright (c) Lucide Contributors; portions Copyright (c) 2013-2022 Cole
// Bemis, MIT/Feather). All are 24x24, stroke currentColor, stroke width 2.
//
// Each icon is a list of [tag, attributes] descriptors rendered by
// ProjectIcon as React elements (no innerHTML). To use a new icon, copy its
// elements from the Lucide SVG into this map (docs/NEW_PROJECT.md).

export type IconElement = readonly [tag: 'path' | 'circle' | 'line' | 'rect', attrs: Record<string, string>]

export const projectIcons: Record<string, readonly IconElement[]> = {
  link: [
    ['path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }],
    ['path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }],
  ],
  'folder-sync': [
    [
      'path',
      {
        d: 'M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5',
      },
    ],
    ['path', { d: 'M12 10v4h4' }],
    ['path', { d: 'm12 14 1.535-1.605a5 5 0 0 1 8 1.5' }],
    ['path', { d: 'M22 22v-4h-4' }],
    ['path', { d: 'm22 18-1.535 1.605a5 5 0 0 1-8-1.5' }],
  ],
  'share-2': [
    ['circle', { cx: '18', cy: '5', r: '3' }],
    ['circle', { cx: '6', cy: '12', r: '3' }],
    ['circle', { cx: '18', cy: '19', r: '3' }],
    ['line', { x1: '8.59', x2: '15.42', y1: '13.51', y2: '17.49' }],
    ['line', { x1: '15.41', x2: '8.59', y1: '6.51', y2: '10.49' }],
  ],
  settings: [
    [
      'path',
      {
        d: 'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915',
      },
    ],
    ['circle', { cx: '12', cy: '12', r: '3' }],
  ],
  'shopping-cart': [
    [
      'path',
      {
        d: 'm2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18',
      },
    ],
    [
      'path',
      {
        d: 'M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25',
      },
    ],
    ['circle', { cx: '18', cy: '20', r: '2' }],
    ['circle', { cx: '8', cy: '20', r: '2' }],
  ],
  apple: [
    ['path', { d: 'M12 6.528V3a1 1 0 0 1 1-1h0' }],
    [
      'path',
      {
        d: 'M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21',
      },
    ],
  ],
  'list-checks': [
    ['path', { d: 'M13 5h8' }],
    ['path', { d: 'M13 12h8' }],
    ['path', { d: 'M13 19h8' }],
    ['path', { d: 'm3 17 2 2 4-4' }],
    ['path', { d: 'm3 7 2 2 4-4' }],
  ],
  flame: [
    [
      'path',
      {
        d: 'M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4',
      },
    ],
  ],
  compass: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    [
      'path',
      {
        d: 'm16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z',
      },
    ],
  ],
  'mountain-snow': [
    ['path', { d: 'm8 3 4 8 5-5 5 15H2L8 3z' }],
    ['path', { d: 'M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19' }],
  ],
  plane: [
    [
      'path',
      {
        d: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
      },
    ],
  ],
  'map-pin': [
    [
      'path',
      {
        d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
      },
    ],
    ['circle', { cx: '12', cy: '10', r: '3' }],
  ],
  'book-open': [
    ['path', { d: 'M12 5v16' }],
    [
      'path',
      {
        d: 'M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z',
      },
    ],
  ],
  'dice-5': [
    ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', ry: '2' }],
    ['path', { d: 'M16 8h.01' }],
    ['path', { d: 'M8 8h.01' }],
    ['path', { d: 'M8 16h.01' }],
    ['path', { d: 'M16 16h.01' }],
    ['path', { d: 'M12 12h.01' }],
  ],
}
