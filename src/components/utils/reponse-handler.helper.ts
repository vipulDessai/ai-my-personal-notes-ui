export const errorHandler = (error: any) => {
  console.error(error);
  if (error.message) {
    return {
      message: error.message,
      title: "Fatal Error",
    };
  } else {
    return {
      message: "Something went wrong, please try again!!",
      title: "Fatal Error",
    };
  }
};
