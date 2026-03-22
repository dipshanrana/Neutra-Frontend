"use client";

import AdminBulkUpload from "@/components/admin/AdminBulkUpload";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BulkUploadPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/products">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronLeft className="w-5 h-5 text-neutral-500" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Bulk Product Import</h1>
                <p className="text-xs text-neutral-500">Back to Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-bold">i</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-900">How bulk import works</h3>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                Upload a spreadsheet to add multiple products at once. The system will automatically create categories if they don't exist. 
                Images for bulk-imported products are set to a default placeholder; you can update them individually later from the product list.
              </p>
            </div>
          </div>
        </div>

        <AdminBulkUpload />
      </div>
    </div>
  );
}
