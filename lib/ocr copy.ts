import { spawn } from "child_process";
import path from "path";

interface PythonResult {
    success: boolean;
    output?: string;
    error?: string;
    exitCode?: number;
}

export async function runOcrScript(args: string): Promise<PythonResult> {

    return new Promise((resolve) => {
        const pythonProcess = spawn("python", ["C:/Users/mahesh/Documents/Projects/SGBAU/pdfparse/extract.py", args]);

        let output = "";
        let error = "";

        pythonProcess.stdout.on("data", (data: Buffer) => {
            output += data.toString();
        });

        pythonProcess.stderr.on("data", (data: Buffer) => {
            error += data.toString();
        });

        pythonProcess.on("error", (err: Error) => {
            resolve({
                success: false,
                error: `Failed to start process: ${err.message}`,
            });
        });

        pythonProcess.on("close", (code: number) => {
            if (code === 0 && !error) {
                resolve({
                    success: true,
                    output: output.trim(),
                    exitCode: code,
                });
            } else {
                resolve({
                    success: false,
                    error: error.trim() || "Unknown error",
                    output: output.trim(),
                    exitCode: code,
                });
            }
        });
    });
}


export async function processPages(
    inputPdf: string,
    metadata?: any,
    format: string = "doc-repair"
): Promise<any> {
    const args = [
        path.resolve(inputPdf),
        "-f",
        format,
    ];
    if (metadata) {
        args.push(
            "-m",
            typeof metadata === "string" ? metadata : JSON.stringify(metadata)
        );
    }

    return await new Promise((resolve, reject) => {
        const py = spawn("python", [
            path.resolve(__dirname, "../../pdfparse/remove_watermark.py"),
            ...args,
        ]);
        let data = "";
        let err = "";
        py.stdout.on("data", (chunk) => (data += chunk));
        py.stderr.on("data", (chunk) => (err += chunk));
        py.on("close", (code) => {
            if (code === 0) {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            } else {
                reject(new Error(err || `Python exited with code ${code}`));
            }
        });
    });
}


