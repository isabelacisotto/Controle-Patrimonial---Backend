export class ErroMovimentacao extends Error {
  constructor(
    public readonly status: 400 | 404 | 409,
    message: string,
  ) {
    super(message);
    this.name = "ErroMovimentacao";
  }
}
