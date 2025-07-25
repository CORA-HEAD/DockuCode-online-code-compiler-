// import React,{useState} from 'react'
// import axios from 'axios';
// import Editor from '@monaco-editor/react';

// function App() {
//   const [code,setCode]=useState("//write your code");
//   const [language,setLanguage]=useState("cpp");
//   const [output,setOutput]=useState("");
  
//   const handleRun= async()=>{
//     const res= await axios.post("http://localhost:5000/run",{
//       code,language
//     });
//     setOutput(res.data.output);
//   }

//    // Monaco uses different language ids
//   const getMonacoLang = () => {
//     switch (language) {
//       case 'cpp': return 'cpp';
//       case 'python': return 'python';
//       case 'java': return 'java';
//       default: return 'cpp';
//     }
//   };

//   return (
//     <>
//      <div style={{padding:20}}>
//       <h2>Online Code Compiler</h2>
//       <select value={language} onChange={(e)=>setLanguage(e.target.value)}>
//         <option value="cpp">C++</option>
//         <option value="python">Python</option>
//         <option value="java">Java</option>
//       </select>

//       <br/>

//       <div style={{ height: '400px', marginTop: 20 }}>
//         <Editor
//           height="100%"
//           theme="vs-dark"
//           language={getMonacoLang()}
//           value={code}
//           onChange={(value) => setCode(value)}
//           options={{
//             fontSize: 16,
//             wordWrap: 'on',
//           }}
//         />
//       </div>

//       <button onClick={handleRun}>Run Code</button>

//       <h3>Output</h3>
//       <pre>{output}</pre>
//      </div>
//     </>
//   )
// }

// export default App