let token: string | null = null

export const authToken = {
  get: (): string | null => token,
  set: (value: string | null): void => {
    token = value
  }
}
