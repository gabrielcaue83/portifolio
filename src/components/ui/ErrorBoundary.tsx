import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Recebe o erro; sem fallback, mostra uma tela de erro cartoon com a mensagem. */
  fallback?: (error: Error) => ReactNode
}

type State = { error: Error | null }

/** Impede que um erro em uma parte (ex.: WebGL indisponível) deixe a página inteira em branco. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback(error)

    return (
      <div className="grid min-h-svh place-items-center bg-pop-yellow p-4">
        <div className="cartoon-box max-w-lg space-y-3 rounded-3xl bg-white p-6">
          <h1 className="text-3xl">Ops! Algo quebrou 💥</h1>
          <p className="font-bold">Recarregue a página. Se continuar, este é o erro:</p>
          <pre className="overflow-auto rounded-xl border-4 border-black bg-black p-3 text-sm whitespace-pre-wrap text-pop-green">
            {error.message}
          </pre>
        </div>
      </div>
    )
  }
}
