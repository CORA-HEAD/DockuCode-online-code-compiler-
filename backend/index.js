
// // const express = require("express");
// // const cors = require("cors");
// // const fs = require("fs");
// // const path = require("path");
// // const { exec } = require("child_process");
// // const { v4: uuid } = require("uuid");
// // const rateLimit = require('express-rate-limit');

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // // Check if platform is Windows
// // const isWindows = process.platform === "win32";

// // // Create a temporary folder to store files
// // const TEMP_DIR = path.join(__dirname, "temp");
// // if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// // const limiter = rateLimit({
// //     windowMs: 1 * 60 * 1000, // 1 minute
// //     max: 20, // limit each IP to 20 requests per minute
// //     message: "Too many code runs, please wait."
// // });
// // app.use(limiter);

// // app.post("/run", async (req, res) => {
// //     const { code, language } = req.body;
// //     const jobId = uuid();
// //     let fileExt, runCmd;
// //     let filePath = path.join(TEMP_DIR, jobId); // default path

// //     try {
// //         let safeClassName = ""; // used for Java

// //         switch (language) {
// //             case "cpp":
// //                 fileExt = ".cpp";
// //                 fs.writeFileSync(filePath + fileExt, code);

// //                 // Set binary output path
// //                 const outputBinary = isWindows ? `${filePath}.exe` : filePath;
// //                 runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-cpp "g++ /app/${jobId}.cpp -o /app/${jobId} && /app/${jobId}"`;


// //                 break;

// //             case "python":
// //                 fileExt = ".py";
// //                 fs.writeFileSync(filePath + fileExt, code);
// //                 runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-python "python /app/${jobId}.py"
// // `
// //                 break;

// //             case "java":
// //                 fileExt = ".java";
// //                 safeClassName = "Main_" + jobId.replace(/-/g, "");
// //                 filePath = path.join(TEMP_DIR, safeClassName);

// //                 const javaCode = code.replace("public class Main", `public class ${safeClassName}`);
// //                 fs.writeFileSync(filePath + fileExt, javaCode);

// //                 runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-java "javac /app/${safeClassName}.java && java -cp /app ${safeClassName}"`
// //                 break;
// //             default:
// //                 return res.status(400).json({ output: " Unsupported language" });
// //         }
// //         console.log("Running Docker command:", runCmd);

// //         exec(runCmd, { timeout: 5000 }, (err, stdout, stderr) => {
// //             //  Cleanup
// //             try {
// //                 if (language === "cpp") {
// //                     const cppSource = `${filePath}.cpp`;
// //                     const cppBinary = isWindows ? `${filePath}.exe` : filePath;
// //                     if (fs.existsSync(cppSource)) fs.unlinkSync(cppSource);
// //                     if (fs.existsSync(cppBinary)) fs.unlinkSync(cppBinary);
// //                 }

// //                 if (language === "python") {
// //                     if (fs.existsSync(`${filePath}.py`)) fs.unlinkSync(`${filePath}.py`);
// //                 }

// //                 if (language === "java") {
// //                     if (fs.existsSync(`${filePath}.java`)) fs.unlinkSync(`${filePath}.java`);
// //                     if (fs.existsSync(`${filePath}.class`)) fs.unlinkSync(`${filePath}.class`);
// //                 }

// //                 console.log(" Temp files deleted successfully.");
// //             } catch (cleanupErr) {
// //                 console.warn(" File cleanup failed:", cleanupErr.message);
// //             }

// //             if (err) {
// //                 return res.json({ output: stderr || err.message });
// //             }

// //             res.json({ output: stdout });
// //         });
// //     } catch (err) {
// //         res.status(500).json({ output: "Server Error: " + err.message });
// //     }
// // });


// // server.js
// const express = require("express");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const { exec } = require("child_process");
// const { v4: uuid } = require("uuid");
// const rateLimit = require("express-rate-limit");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const isWindows = process.platform === "win32";
// const TEMP_DIR = path.join(__dirname, "temp");
// if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// const limiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 20,
//   message: "Too many code runs. Please wait.",
// });
// app.use(limiter);

// app.post("/run", async (req, res) => {
//   const { code, language, input = "" } = req.body;
//   const jobId = uuid();
//   let filePath = path.join(TEMP_DIR, jobId);
//   let fileExt, runCmd, safeClassName = "";

//   try {
//     switch (language) {
//       case "cpp":
//         fileExt = ".cpp";
//         fs.writeFileSync(filePath + fileExt, code);
//         fs.writeFileSync(filePath + ".txt", input);
//         runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-cpp "g++ /app/${jobId}.cpp -o /app/${jobId} && /app/${jobId} < /app/${jobId}.txt"`;

//         break;

//       case "python":
//         fileExt = ".py";
//         fs.writeFileSync(filePath + fileExt, code);
//         fs.writeFileSync(filePath + ".txt", input);
//         runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-python "python /app/${jobId}.py < /app/${jobId}.txt"`;
//         break;

//       case "java":
//         safeClassName = "Main_" + jobId.replace(/-/g, "");
//         filePath = path.join(TEMP_DIR, safeClassName);
//         const javaCode = code.replace(/public class Main/, `public class ${safeClassName}`);
//         fs.writeFileSync(filePath + ".java", javaCode);
//         fs.writeFileSync(filePath + ".txt", input);
//         runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-java "javac /app/${safeClassName}.java && java -cp /app ${safeClassName} < /app/${safeClassName}.txt"`;
//         break;

//       default:
//         return res.status(400).json({ output: "Unsupported language." });
//     }

//     console.log("Executing:", runCmd);

//     exec(runCmd, { timeout: 5000 }, (err, stdout, stderr) => {
//       // Cleanup
//       try {
//         const filesToRemove = [
//           `${filePath}${fileExt}`,
//           `${filePath}.txt`,
//           `${filePath}.exe`,
//           `${filePath}.class`,
//         ];
//         filesToRemove.forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
//       } catch (e) {
//         console.warn("Cleanup error:", e.message);
//       }

//       if (err) {
//         return res.json({ output: stderr || err.message });
//       }

//       res.json({ output: stdout });
//     });
//   } catch (e) {
//     res.status(500).json({ output: "Server error: " + e.message });
//   }
// });

// app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));

const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const rateLimit = require("express-rate-limit");
const cors=require("cors");
const app = express();
const TEMP_DIR = path.join(__dirname, "temp");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many code runs. Please wait.",
});
app.use(limiter);
app.use(cors());
app.use(express.json());

app.post("/run", async (req, res) => {
  const { code, language, input = "" } = req.body;
  const jobId = uuid();
  let filePath = path.join(TEMP_DIR, jobId);
  let fileExt, runCmd, className;

  try {
    switch (language) {
      case "cpp":
        fileExt = ".cpp";
        fs.writeFileSync(filePath + fileExt, code);
        fs.writeFileSync(filePath + ".txt", input);
        runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-cpp "g++ /app/${jobId}.cpp -o /app/${jobId} && /app/${jobId} < /app/${jobId}.txt"`;
        break;

      case "python":
        fileExt = ".py";
        fs.writeFileSync(filePath + fileExt, code);
        fs.writeFileSync(filePath + ".txt", input);
        runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-python "python /app/${jobId}.py < /app/${jobId}.txt"`;
        break;

      case "java":
        className = "Main_" + jobId.replace(/-/g, "");
        filePath = path.join(TEMP_DIR, className);
        const javaCode = code.replace(/public class Main/, `public class ${className}`);
        fs.writeFileSync(filePath + ".java", javaCode);
        fs.writeFileSync(filePath + ".txt", input);
        runCmd = `docker run --rm -v ${TEMP_DIR}:/app code-runner-java "javac /app/${className}.java && java -cp /app ${className} < /app/${className}.txt"`;
        fileExt = ".java";
        break;

      default:
        return res.status(400).json({ output: "Unsupported language" });
    }

    console.log("Running Docker command:", runCmd);

    exec(runCmd, { timeout: 8000 }, (err, stdout, stderr) => {
      const cleanupFiles = [
        `${filePath}${fileExt}`, // .cpp, .py, or .java
        `${filePath}.txt`,       // input file
        `${filePath}.exe`,       // C++ binary on Windows (if exists)
        `${filePath}.class`,     // Java compiled class
        `${filePath}`            // C++ binary on Linux (no extension)
      ];

      for (const file of cleanupFiles) {
        try {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`✅ Deleted: ${file}`);
          }
        } catch (cleanupErr) {
          console.warn(`⚠️  Failed to delete ${file}:`, cleanupErr.message);
        }
      }

      if (err) {
        return res.json({ output: stderr || err.message });
      }

      res.json({ output: stdout.trim() });
    });

  } catch (err) {
    res.status(500).json({ output: "Server Error: " + err.message });
  }
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
