const { error, info } = this.state;
    const { fallback, children } = this.props;

    if (error) {
      if (fallback) {
        if (typeof fallback === 'function') {
          return (fallback as FallbackRender)(error, info);
        }
        return fallback;
      }

      return (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
          {error.stack && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Stack Trace</summary>
              {error.stack}
            </details>
          )}
          {info?.componentStack && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Component Stack</summary>
              {info.componentStack}
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;