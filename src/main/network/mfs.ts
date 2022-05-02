export const setRootDir = async (node: any) => {
  try {
    await node.files.mkdir('/');
    console.log('Congrats! Directory is created');
  } catch (er) {
    console.log('Local directory already created');
  }
};

export const setFile = async (node: any, filename: string) => {
  try {
    await node.files.touch(`/${filename}`);
    console.log('Congrats! Directory is created');
  } catch (er) {
    console.log('Local directory already created');
  }
};

export const saveHistory = async (
  node: any,
  filename: string,
  history: any
) => {
  try {
    await node.files.write(`/${filename}`, history, { create: true });
    console.log('history saved successfuly');
  } catch (er) {
    console.log(er);
  }
};

export const fetchHistory = async (node: any, filename: string) => {
  try {
    const chunks = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of node.files.read(`/${filename}`)) {
      chunks.push(chunk);
    }

    const history = chunks.join('').toString();
    return history;
  } catch (er) {
    console.log(er);
    return -1;
  }
};
