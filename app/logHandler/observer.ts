function createObserver() {
  return {
    next: (value: any) => {
      console.log(value);
    },
    complete: () => console.log('complete'),
    error: (err: Error) => console.log('error: ', err),
  };
}

export default createObserver;
