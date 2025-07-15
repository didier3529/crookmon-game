const ShareLinkModal: FC<ShareLinkModalProps> = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = Array.prototype.slice.call(
          modal.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey) {
          if (active === first || active === modal) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onClose]);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
      }
      setCopied(true);
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      console.error('Copy to clipboard failed.');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sharelink-title"
        ref={modalRef}
      >
        <h2 id="sharelink-title" className="modal__title">Share Link</h2>
        <div className="modal__body">
          <div className="sharelinkmodal__group">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={link}
              className="sharelinkmodal__input"
              aria-label="Shareable link"
            />
            <button
              type="button"
              className="button button--primary sharelinkmodal__copy"
              onClick={() => copyToClipboard(link)}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              margin: '-1px',
              padding: '0',
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
              border: '0'
            }}
          >
            {copied ? 'Copied!' : ''}
          </div>
        </div>
        <footer className="modal__footer">
          <button type="button" className="button" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ShareLinkModal;