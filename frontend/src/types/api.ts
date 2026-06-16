export interface ServerToken {
  get: (key: string) => { value: string | undefined };
}
