

import React, { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [userInput, setUserInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://dockucode-online-code-compiler-1.onrender.com/run", {
        code,
        language,
        input: userInput,
      });
      setTerminalOutput(`\n${userInput}\n\nOutput:\n${res.data.output}`);
    } catch (err) {
      setTerminalOutput("Error running code.");
    }
    setLoading(false);
  };

  const getMonacoLang = () => {
    switch (language) {
      case "cpp":
        return "cpp";
      case "python":
        return "python";
      case "java":
        return "java";
      default:
        return "cpp";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h2 className="text-center text-3xl mb-4 font-bold">
        <iframe src="https://my.spline.design/dockucode-lEGavTYjsWNxQozwHO7x1mE8-1yK/" frameborder="0" width="100%" height="100%"></iframe>
      </h2>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-4 space-y-4">
            <Tabs defaultValue={language}>
              <TabsList>
                <TabsTrigger value="cpp" onClick={() => setLanguage("cpp")}>
                  C++
                </TabsTrigger>
                <TabsTrigger
                  value="python"
                  onClick={() => setLanguage("python")}
                >
                  Python
                </TabsTrigger>
                <TabsTrigger value="java" onClick={() => setLanguage("java")}>
                  Java
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Editor
              height="500px"
              theme="vs-dark"
              language={getMonacoLang()}
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 16,
                wordWrap: "on",
                minimap: { enabled: false },
              }}
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-sm text-muted-foreground mb-1">🧾 Input</h3>
            <textarea
              className="w-full h-28 p-2 bg-gray-800 text-white font-mono rounded resize-none"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter input here..."
            />

            <h3 className="text-sm text-muted-foreground mt-4">📤 Output</h3>
            <pre className="bg-zinc-900 p-4 h-64 rounded overflow-auto whitespace-pre-wrap text-green-400">
              {loading
                ? "Running..."
                : terminalOutput || "// Output will appear here"}
            </pre>

            <Button className="w-full" onClick={handleRun} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                "Run Code"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
