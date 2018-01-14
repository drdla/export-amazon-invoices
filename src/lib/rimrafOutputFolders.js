import fs from 'fs-extra';

const rimrafOutputFolders = args => args.year.forEach(year => fs.remove(`./output/${year}`));

export default rimrafOutputFolders;
