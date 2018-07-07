export interface IUserInputOptions {
  confirmButtonText?: string;
  cancelButtonText?: string;
  promptText: string;
}

export interface ISingleUserInput {
  promptUser(options: IUserInputOptions): Promise<string>;
}
