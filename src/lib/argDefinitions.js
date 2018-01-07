const argDefinitions = [
  {
    name: 'email',
    alias: 'e',
    multiple: false,
    description: 'The email of the Amazon account.',
    type: String,
    typeLabel: '[italic]{string}',
  },
  {
    name: 'password',
    alias: 'p',
    multiple: false,
    description: 'The password of the Amazon account.',
    type: String,
    typeLabel: '[italic]{string}',
  },
  {
    name: 'year',
    alias: 'y',
    multiple: true,
    defaultValue: new Date().getFullYear(),
    description:
      'The four digit year or list of years for which to export the invoices.\nDefaults to the current year.',
    type: Number,
    typeLabel: '[italic]{integer}',
  },
];

export default argDefinitions;
