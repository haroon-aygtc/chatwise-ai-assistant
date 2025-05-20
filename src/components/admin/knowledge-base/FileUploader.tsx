import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilePlus, X, FileUp, Loader2 } from "lucide-react";

interface FileUploaderProps {
    onFileSelected: (file: File) => void;
    selectedFile: File | null;
    accept?: string;
    maxSize?: number; // in MB
    isUploading?: boolean;
}

export function FileUploader({
    onFileSelected,
    selectedFile,
    accept = ".pdf,.docx,.xlsx,.txt,.csv,.json,.html,.md",
    maxSize = 10, // default 10MB
    isUploading = false,
}: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        // Check file size (convert maxSize from MB to bytes)
        if (file.size > maxSize * 1024 * 1024) {
            setError(`File size exceeds the maximum allowed size (${maxSize}MB)`);
            return;
        }

        setError(null);
        onFileSelected(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemove = () => {
        onFileSelected(null as unknown as File);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <div className="w-full">
            {!selectedFile ? (
                <div
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors",
                        dragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50",
                        error && "border-destructive/50 bg-destructive/5"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept={accept}
                    />

                    <div className="flex flex-col items-center justify-center text-center">
                        <FilePlus className="w-10 h-10 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm font-medium">
                            Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Supported formats: PDF, DOCX, XLSX, TXT, CSV, JSON, HTML, MD
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Max file size: {maxSize}MB
                        </p>
                        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                        >
                            <FileUp className="w-4 h-4 mr-2" />
                            Select File
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className={cn(
                        "flex items-center justify-between w-full p-4 border rounded-lg",
                        isUploading && "bg-muted"
                    )}
                >
                    <div className="flex items-center space-x-4">
                        <div className="min-w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                            <FileUp className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium truncate max-w-[250px]">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isUploading ? (
                            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={handleRemove}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 