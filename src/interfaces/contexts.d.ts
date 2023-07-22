declare namespace WuContextProvider {
  type ErrorType = { code: 200, message: '' } | null

  type ReducerAction<T, P = any> = { type: T; payload?: P; }

  type CreateContextType<S, A> = { store: S, actions: A }
}