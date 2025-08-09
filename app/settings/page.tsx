"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { mockFileSystem } from "@/lib/mock-data";

export default function SettingsPage() {
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Settings</h2>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Default view mode
                      </p>
                      <p className="text-sm text-gray-400">
                        Choose how files are displayed
                      </p>
                    </div>
                    <select
                      className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1 text-sm text-white"
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value)}
                    >
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  Storage Info
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total folders:</span>
                    <span className="font-medium text-white">
                      {Object.keys(mockFileSystem).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total files:</span>
                    <span className="font-medium text-white">
                      {Object.values(mockFileSystem).reduce(
                        (acc: number, folder: any) => acc + folder.files.length,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">About</h3>
                <p className="text-sm text-gray-400">
                  PDF Library v1.0.0 - A modern file management system for PDFs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
