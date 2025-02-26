function createChalkFunction(str: string) {
  return str;
}

const bold = (str: string) => str;

const chalk = {
  red: createChalkFunction,
  green: createChalkFunction,
  blue: createChalkFunction,
  yellow: createChalkFunction,
};

// Add bold property to each color function
Object.values(chalk).forEach((colorFn: any) => {
  colorFn.bold = bold;
});

export default chalk;
