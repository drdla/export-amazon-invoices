const argDefinitions = [
  {
    name: 'email',
    alias: 'e',
    multiple: false,
    type: String,
  },
  {
    name: 'password',
    alias: 'p',
    multiple: false,
    type: String,
  },
  {
    name: 'year',
    alias: 'y',
    defaultValue: new Date().getFullYear(),
    multiple: true,
    type: Number,
  },
];

export default argDefinitions;
