export const scheme = `io.showtime${
  process.env.STAGE === "development"
    ? ".development"
    : process.env.STAGE === "staging"
    ? ".staging"
    : ""
}`;
