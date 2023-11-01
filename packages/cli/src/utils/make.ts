export type MakeType = {
  name: string;
  from?: string;
};

export type MakeProperty = {
  name: string;
  typology: typeof MAKE_PROPERTY_TYPOLOGIES[number]['value'];
  type?: MakeType;
};

export const MAKE_PROPERTY_TYPOLOGIES = [
  {
    name: 'Attribute',
    value: 'attr',
    description: 'An attribute holding a scalar or object value.',
  },
  {
    name: 'Has One',
    value: 'hasOne',
    description: 'A relationship to one model\'s instance.',
  },
  {
    name: 'Has Many',
    value: 'hasMany',
    description: 'A relationship to many model\'s instance.',
  },
] as const;
