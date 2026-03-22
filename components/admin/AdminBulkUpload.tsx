"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  Download,
  Eye,
  Trash2
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface BulkProduct {
  name: string;
  category: { name: string };
  description: string;
  singleProductMp: number;
  singleProductSp: number;
  twoProductMp: number;
  twoProductSp: number;
  threeProductMp: number;
  threeProductSp: number;
  badge?: string;
  link?: string;
  benefitsParagraph?: string;
  featuredImages?: string[];
}

interface ValidationResult {
  row: number;
  isValid: boolean;
  errors: string[];
}

export default function AdminBulkUpload() {
  const [data, setData] = useState<BulkProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      const bstr = e.target?.result;
      const extension = file.name.split('.').pop()?.toLowerCase();

      try {
        let jsonData: any[] = [];

        if (extension === 'csv') {
          const content = bstr as string;
          const result = Papa.parse(content, { header: true, skipEmptyLines: true });
          jsonData = result.data;
        } else {
          const workbook = XLSX.read(bstr, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
        }

        processData(jsonData);
      } catch (err) {
        setError("Failed to parse file. Please ensure it is a valid CSV or Excel file.");
        setLoading(false);
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const processData = (jsonData: any[]) => {
    const mappedData: BulkProduct[] = jsonData.map((row) => {
      const singleSp = parseFloat(row.singleProductSp) || 0;
      const singleMp = parseFloat(row.singleProductMp) || 0;

      return {
        name: row.name || "",
        category: { name: row.category || "" },
        description: row.description || "",
        singleProductMp: singleMp,
        singleProductSp: singleSp,
        twoProductMp: parseFloat(row.twoProductMp) || singleMp * 2,
        twoProductSp: parseFloat(row.twoProductSp) || singleSp * 2,
        threeProductMp: parseFloat(row.threeProductMp) || singleMp * 3,
        threeProductSp: parseFloat(row.threeProductSp) || singleSp * 3,
        badge: row.badge || "",
        link: row.link || "",
        benefitsParagraph: row.benefitsParagraph || "",
        singleProductImage: '/images/default-product.jpg',
        twoProductImage: '/images/default-product.jpg',
        threeProductImage: '/images/default-product.jpg',
        featuredImages: ['/images/default-product.jpg', '/images/default-product.jpg']
      };
    });

    const validationResults = mappedData.map((item, index) => {
      const errors: string[] = [];
      if (!item.name) errors.push("Name is required");
      if (!item.category.name) errors.push("Category is required");
      if (item.singleProductSp <= 0) errors.push("Price must be greater than 0");
      return {
        row: index + 1,
        isValid: errors.length === 0,
        errors
      };
    });

    setData(mappedData);
    setValidation(validationResults);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (data.length === 0) return;

    const invalidRows = validation.filter(v => !v.isValid);
    if (invalidRows.length > 0) {
      setError(`Please fix validation errors in ${invalidRows.length} row(s) before uploading.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await api.products.bulkCreate(data);
      setSuccess(`Successfully imported ${data.length} products.`);
      setData([]);
      setValidation([]);
      setFileName(null);
    } catch (err: any) {
      setError(err.message || "Failed to upload products. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const downloadSample = () => {
    const sampleRows = [
      {
        name: "Whey Protein",
        category: "Supplements",
        description: "Premium isolate",
        singleProductMp: 35.00,
        singleProductSp: 28.00,
        badge: "HOT",
        link: "https://example.com/whey",
        benefitsParagraph: "Great for muscle recovery"
      },
      {
        name: "Vitamin D",
        category: "Vitamins",
        description: "Bone health",
        singleProductMp: 12.00,
        singleProductSp: 9.50,
        badge: "NEW",
        link: "https://example.com/vit-d",
        benefitsParagraph: "Essential for bone strength"
      }
    ];

    const csv = Papa.unparse(sampleRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_products.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveFile = () => {
    setData([]);
    setValidation([]);
    setFileName(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Bulk Product Import</h2>
          <p className="text-sm text-neutral-500">Upload CSV or Excel files to import multiple products at once.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={downloadSample}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Sample CSV
        </Button>
      </div>

      <div className="p-6">
        {!fileName ? (
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-neutral-400">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-lg font-medium text-neutral-900">
              {isDragActive ? "Drop the file here" : "Click or drag file to upload"}
            </p>
            <p className="text-sm text-neutral-500 mt-1">Supports .csv, .xlsx, .xls</p>
          </div>
        ) : (
          <div className="bg-neutral-50 rounded-xl p-4 flex items-center justify-between border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">{fileName}</p>
                <p className="text-xs text-neutral-500">{data.length} products detected</p>
              </div>
            </div>
            <button 
              onClick={handleRemoveFile}
              className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        {data.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Data Preview (First 10 Rows)
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-500">
                  {validation.filter(v => v.isValid).length} / {data.length} Valid Rows
                </span>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading || validation.some(v => !v.isValid)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Confirm & Upload All"
                  )}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-700 font-medium">
                  <tr>
                    <th className="px-4 py-3">Row</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price (Single)</th>
                    <th className="px-4 py-3">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {data.slice(0, 10).map((item, idx) => {
                    const rowValidation = validation[idx];
                    return (
                      <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 text-neutral-500 font-medium">{idx + 1}</td>
                        <td className="px-4 py-3">
                          {rowValidation?.isValid ? (
                            <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
                              <AlertCircle className="w-3 h-3" /> Invalid
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-neutral-900 font-medium">{item.name || "—"}</td>
                        <td className="px-4 py-3 text-neutral-600">{item.category.name || "—"}</td>
                        <td className="px-4 py-3 text-neutral-900 font-semibold">
                          ${item.singleProductSp.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          {rowValidation?.errors.length > 0 ? (
                            <div className="text-red-500 text-xs">
                              {rowValidation.errors.map((e, i) => (
                                <div key={i}>{e}</div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {data.length > 10 && (
              <p className="text-xs text-neutral-500 mt-2 italic text-center">
                Showing first 10 rows. {data.length - 10} more rows hidden.
              </p>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-neutral-700">Parsing file...</p>
          </div>
        </div>
      )}
    </div>
  );
}
