import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public handleReload = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="my-6 p-6 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center max-w-2xl mx-auto shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-[#E50914] flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {this.props.fallbackTitle || 'Section Display Notice'}
          </h3>
          <p className="text-xs text-zinc-400 mb-4 max-w-md mx-auto">
            This showcase encountered an unexpected issue while rendering media. Click below to refresh the section.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Section</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
