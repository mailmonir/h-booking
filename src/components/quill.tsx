import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",

        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });

      quillInstance.current.on("text-change", () => {
        const content = quillInstance.current?.root.innerHTML || "";
        onChange(content);
      });
    }

    // Update the editor content when the `value` changes
    if (quillInstance.current) {
      // Get the current cursor position
      const currentRange = quillInstance.current.getSelection();

      // Check if the content is different before updating
      const editorContent = quillInstance.current.root.innerHTML;
      if (editorContent !== value) {
        // Instead of clearing the editor, just update it correctly
        const delta = quillInstance.current.clipboard.convert({
          html: value || "",
        });
        quillInstance.current.setContents(delta, "silent"); // Use 'silent' to avoid triggering change event

        // Restore the cursor position
        if (currentRange) {
          quillInstance.current.setSelection(
            currentRange.index,
            currentRange.length
          );
        }
      }
    }
  }, [value, onChange]);

  return <div ref={editorRef} style={{ height: "200px" }} />;
};

export default QuillEditor;
