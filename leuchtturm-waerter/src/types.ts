interface ExtendedError extends Error {
  cause: {
    statusCode: number;
  };
}

export type { ExtendedError };
