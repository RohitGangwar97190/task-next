"use client";
import { useState } from "react";

const isBrowser = typeof window !== "undefined";
const DOMPurify = isBrowser ? require("dompurify") : null;

export default function DiscordTextGenerator() {
  const [text, setText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [styledText, setStyledText] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const applyStyles = (bold = isBold, underline = isUnderline) => {
    if (!selectedText || !text.includes(selectedText)) return;

    const escapedSelectedText = selectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedSelectedText})`, "gi");

    setStyledText(
      text.replace(regex, (match) => 
        `<span style="color: ${fgColor}; background-color: ${bgColor}; 
        padding: 3px; border-radius: 3px;
        font-weight: ${bold ? "bold" : "normal"}; 
        text-decoration: ${underline ? "underline" : "none"};">${match}</span>`
      )
    );
  };

  const toggleBold = () => setIsBold((prev) => { 
    applyStyles(!prev, isUnderline); 
    return !prev;
   });
  const toggleUnderline = () => setIsUnderline((prev) => { 
    applyStyles(isBold, !prev);
     return !prev;
     });

  const resetText = () => {
    setText("");
     setSelectedText(""); 
     setFgColor("#000000"); 
     setBgColor("#ffffff");
    setIsBold(false);
     setIsUnderline(false);
      setStyledText("");
       setCopySuccess(false);
  };

  const copyToClipboard = async () => {
    if (!styledText) return;
    try {
      await navigator.clipboard.writeText(styledText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">VideoDubber Task </h1>

      <textarea className="w-full max-w-lg p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
        rows="5" value={text} onChange={(e) => 
        setText(e.target.value)} placeholder="Type your message here...">

        </textarea>

      <input type="text" className="p-2 rounded bg-gray-700 text-white border border-gray-600 mt-3 w-full max-w-lg"
        value={selectedText} onChange={(e) => 
        setSelectedText(e.target.value)} 
        placeholder="Enter text to style" />

      <div className="mt-3 flex space-x-4 items-center">
        <label className="text-sm">Foreground Color:</label>
        <input type="color" className="w-10 h-10" value={fgColor} onChange={(e) =>
           setFgColor(e.target.value)} />
        <label className="text-sm">Background Color:</label>
        <input type="color" className="w-10 h-10" value={bgColor} onChange={(e) => 
          setBgColor(e.target.value)} />
      </div>

      <div className="mt-4 flex space-x-3">
        <button onClick={() =>
           applyStyles()} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg">Apply</button>
        <button onClick={toggleBold} className={`px-6 py-2 rounded-lg ${isBold ? "bg-yellow-600" : "bg-yellow-500 hover:bg-yellow-600"}`}>Bold</button>
        <button onClick={toggleUnderline} className={`px-6 py-2 rounded-lg ${isUnderline ? "bg-purple-600" : "bg-purple-500 hover:bg-purple-600"}`}>Underline</button>
        <button onClick={resetText} className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg">Reset</button>
      </div>

      <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded-lg w-full max-w-lg">
        <p className="text-green-400 font-mono whitespace-pre-wrap" dangerouslySetInnerHTML={{
          __html: DOMPurify ? DOMPurify.sanitize(styledText || "Your formatted text will appear here...") : "Your formatted text will appear here..."
        }}></p>
      </div>

      <button onClick={copyToClipboard} className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg">Copy to Clipboard</button>

      {copySuccess && <p className="mt-2 text-sm text-green-400">Copied colored text</p>}
    </div>
  );
}
