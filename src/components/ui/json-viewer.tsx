import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Button } from "./button";
import { Copy, Check, Code, FileJson } from "lucide-react";

interface JsonViewerProps {
  data: any;
  height?: string;
  title?: string;
  showCopyButton?: boolean;
  showRawToggle?: boolean;
  className?: string;
}

export function JsonViewer({
  data,
  height = "300px",
  title,
  showCopyButton = true,
  showRawToggle = true,
  className = "",
}: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isRaw, setIsRaw] = useState(false);

  // Format the data as a string
  const formattedData =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-md border bg-muted/20 ${className}`}>
      {(title || showCopyButton || showRawToggle) && (
        <div className="flex items-center justify-between p-2 border-b bg-muted/30">
          {title && (
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              <span className="text-sm font-medium">{title}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {showRawToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRaw(!isRaw)}
                className="h-8 px-2 text-xs"
              >
                <Code className="h-3.5 w-3.5 mr-1" />
                {isRaw ? "Formatted" : "Raw"}
              </Button>
            )}
            {showCopyButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-xs"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
        </div>
      )}
      <div style={{ height }}>
        <CodeMirror
          value={
            isRaw
              ? typeof data === "string"
                ? data
                : JSON.stringify(data)
              : formattedData
          }
          height={height}
          extensions={[json(), EditorView.lineWrapping]}
          theme={vscodeDark}
          editable={false}
          basicSetup={{
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
            highlightActiveLine: false,
            highlightSelectionMatches: true,
          }}
          className="h-full overflow-auto"
        />
      </div>
    </div>
  );
}
