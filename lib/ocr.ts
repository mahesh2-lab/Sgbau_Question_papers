import { spawn } from "child_process";
import path from "path";
import axios from "axios";
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import FormData from 'form-data';


interface PythonResult {
    success: boolean;
    output?: string;
    error?: string;
    exitCode?: number;
}

export async function runOcrScript(filepath: string): Promise<PythonResult> {
    try {
        const formData = new FormData();
        formData.append("file", createReadStream(filepath), path.basename(filepath));

        const response = await axios.post("https://pdfprocess.onrender.com/ocr", formData, {
            headers: formData.getHeaders()
        });

        return {
            success: true,
            output: response.data,
            exitCode: 0
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.response?.data || error.message,
            exitCode: error?.response?.status
        };
    }
}


export async function processPages(
    inputPdf: string,
    metadata?: any,
    outputpath?: string
): Promise<any> {
    const formData = new FormData();
    formData.append("file", createReadStream(inputPdf), path.basename(inputPdf));
    if (metadata) {
        formData.append("metadata", typeof metadata === "string" ? metadata : JSON.stringify(metadata));
    }
    if (outputpath) {
        formData.append("outputpath", outputpath + '.pdf');
    }
    try {
        const response = await axios.post("https://pdfprocess.onrender.com/process", formData, {
            headers: formData.getHeaders()
        });
        return {
            success: true,
            data: response.data
        };
        } catch (error: any) {
        return {
            success: false,
            error: error?.response?.data || error.message
        };
        
    }
}

