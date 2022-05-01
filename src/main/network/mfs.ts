export const setRootDir = async (node: any) => {
  try {
    await node.files.mkdir('/');
    console.log('Congrats! Directory is created');
  } catch (er) {
    console.log('Local directory already created');
  }
};

export const setDir = async (node: any, dirname: string) => {
  try {
    await node.files.mkdir('/');
    console.log('Congrats! Directory is created');
  } catch (er) {
    console.log('Local directory already created');
  }
};
