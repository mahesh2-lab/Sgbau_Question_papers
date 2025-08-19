"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import HowItWorksSection from "@/components/how-it-works";

export default function ContributePage() {
  const [uploadCode, setUploadCode] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [paperType, setPaperType] = useState("");
  const [solveType, setSolveType] = useState("");
  const [unitOrYear, setUnitOrYear] = useState("");
  const [uploading, setUploading] = useState(false);

  // Set program to Engineering by default
  const program = "Bachelor of Engineering";

  // SGBAU exam data
  const examData = {
    university: "Sant Gadge Baba Amravati University",
    examination_session: "Winter-2024",
    programs: [
      {
        program_name: "Bachelor of Engineering",
        semesters: [
          {
            semester_number: "Semester_IV",
            branches: [
              {
                branch_name: "Civil Engineering",
                subjects: [
                  "Building Planning Designing & CAD",
                  "Hydrology & Water Resource Engineering",
                  "Surveying",
                  "Geotechnical Engineering-1",
                  "Structural Analysis-1",
                ],
              },
              {
                branch_name: "Mechanical Engineering",
                subjects: [
                  "Material Science",
                  "Energy Conversion-I",
                  "Manufacturing Technology",
                  "Basic Electrical Drives & Control",
                  "Hydraulic Machines",
                ],
              },
              {
                branch_name: "Electrical Engineering",
                subjects: [
                  "Electromagnetic Fields",
                  "Electrical Measurements & Instrumentation",
                  "Power Systems-I / Control Systems",
                  "Power Systems-I",
                  "Analog & Digital Circuits",
                  "Signals & Systems",
                ],
              },
              {
                branch_name: "Electronics and Telecommunication Engineering",
                subjects: [
                  "Analog and Digital Communication",
                  "Analog Circuits",
                  "Network Theory",
                  "Signals and Systems",
                  "Values and Ethics (HS)",
                ],
              },
              {
                branch_name: "Computer Science and Engineering",
                subjects: [
                  "Artificial Intelligence",
                  "Data Communication & Networking",
                  "Operating System",
                  "Microprocessor & Assembly Lang. Prog",
                  "Theory of Computation",
                ],
              },
              {
                branch_name: "Information Technology",
                subjects: [
                  "Computer Organization & Architecture",
                  "Data Communication & Networking",
                  "Operating System",
                  "Data Structures",
                  "Social Science & Engg. Economics",
                ],
              },
              {
                branch_name: "Artificial Intelligence & Data Science",
                subjects: [
                  "Artificial Intelligence",
                  "Statistical Methods",
                  "Computer Architecture & Operating System",
                  "Microcontroller. Sensors & Actuators",
                  "Theory of Computation",
                ],
              },
              {
                branch_name: "Industrial IoT",
                subjects: [
                  "Transducers and Data Acquisition System",
                  "Introduction to Signal Processing",
                  "GNU-Linux Operating System",
                  "Wireless Communication",
                  "Social Science",
                ],
              },
              {
                branch_name: "Computer Science and Engineering (Data Science)",
                subjects: [
                  "Artificial Intelligence",
                  "Data Communication & Networking",
                  "Operating System",
                  "Probability & Statistical Modelling",
                  "Theory of Computation",
                ],
              },
              {
                branch_name: "Common To All Branches",
                subjects: ["Environmental Studies"],
              },
            ],
          },
          {
            semester_number: "Semester_V",
            branches: [
              {
                branch_name: "Civil Engineering",
                subjects: [
                  "Design of Reinforced & Prestressed Concrete Structures",
                  "Surveying & Geomatics",
                  "Numerical Methods & Computer Programming",
                  "Electives: Highway Construction & Management",
                  "Electives: Basic of Building Construction",
                ],
              },
              {
                branch_name: "Mechanical Engineering",
                subjects: [
                  "Heat Transfer",
                  "Metrology & Quality Control",
                  "Kinematics of Machines",
                  "Measurement Systems",
                  "Electives: Industrial Robotics & Applications",
                ],
              },
              {
                branch_name: "Electrical Engineering",
                subjects: [
                  "Control Systems",
                  "Microprocessor & Microcontroller",
                  "Electrical Machines-II",
                  "Multiple Electives",
                  "Electives: Electrical Drives",
                ],
              },
              {
                branch_name: "Electronics & Telecommunication Engineering",
                subjects: [
                  "Microcontroller",
                  "Control System",
                  "Digital Signal Processing",
                  "Electives: Power Electronics",
                  "Electives: Sensors and Transducers",
                ],
              },
              {
                branch_name: "Computer Science and Engineering",
                subjects: [
                  "Database Management Systems",
                  "Compiler Design",
                  "Computer Architecture & Organization",
                  "Multiple Electives",
                  "Electives: Data Structure & Algorithms",
                ],
              },
              {
                branch_name: "Information Technology",
                subjects: [
                  "Database Management Systems",
                  "Theory of Computation",
                  "Software Engineering",
                  "Electives: Information Security Systems",
                  "Data Structure & Algorithms",
                ],
              },
              {
                branch_name: "Artificial Intelligence & Data Science",
                subjects: [
                  "Data Science",
                  "Machine Learning Techniques",
                  "Computer Networks",
                  "Electives: Internet of Things",
                  "Electives: Data Structure and Algorithm",
                ],
              },
              {
                branch_name: "Industrial IoT",
                subjects: [
                  "Communication Network",
                  "Microcontrollers and Applications",
                  "Python Programming",
                  "Electives: Power Electronics",
                  "Electives: Introduction to IoT",
                ],
              },
              {
                branch_name: "Computer Science and Engineering (Data Science)",
                subjects: [
                  "Database Management Systems",
                  "Business Intelligence & Analytics",
                  "Computer Architecture & Organization",
                  "Electives: Data Storage & Network",
                  "Data Structure & Algorithms",
                ],
              },
            ],
          },
          {
            semester_number: "Semester_VI",
            branches: [
              {
                branch_name: "Civil Engineering",
                subjects: [
                  "Design of Steel Structures",
                  "Environmental Engineering - 1",
                  "Fluid Mechanics",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Mechanical Engineering",
                subjects: [
                  "Design of Machine Elements",
                  "Dynamics of Machines",
                  "Control System Engineering",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Electrical Engineering",
                subjects: [
                  "Power Electronics",
                  "Power Systems II / Electrical Energy Distribution & Utilization",
                  "Computer Aided Electrical Machine Design",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Electronics & Telecommunication Engineering",
                subjects: [
                  "Communication Network",
                  "Computer Architecture",
                  "Economics for Engineers (HS)",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Computer Science & Engineering",
                subjects: [
                  "Software Engineering",
                  "Design & Analysis of Algorithms",
                  "Security Policy & Governance",
                  "Multiple Electives",
                  "Electives: Cyber Law & Ethics",
                ],
              },
              {
                branch_name: "Information Technology",
                subjects: [
                  "Compiler Design",
                  "Design & Analysis of Algorithms",
                  "Artificial Intelligence",
                  "Multiple Electives",
                  "Electives: Cyber Law & Ethics",
                ],
              },
              {
                branch_name: "Artificial Intelligence & Data Science",
                subjects: [
                  "Data Analytics",
                  "Artificial Neural Network & Fuzzy Logic",
                  "Database Management System for Data Science",
                  "Electives: Data Warehousing",
                  "Electives: Software Project Management",
                ],
              },
            ],
          },
          {
            semester_number: "Semester_VII",
            branches: [
              {
                branch_name: "Civil Engineering",
                subjects: [
                  "Structural Analysis II",
                  "Geotechnical Engineering II",
                  "Hydraulic Engineering",
                  "Environmental Engineering -II",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Mechanical Engineering",
                subjects: [
                  "Mechatronics",
                  "Productivity Techniques",
                  "Industrial Management & Costing",
                  "Energy Conversion - II",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Electrical Engineering",
                subjects: [
                  "Electrical Energy Distribution & Utilization",
                  "Digital Signal Processing",
                  "Entrepreneurship & Project Management",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Electronics & Telecommunication Engineering",
                subjects: [
                  "Cryptography & Network security",
                  "Digital Image and Video Processing",
                  "Project Management and Entrepreneurship",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Computer Science and Engineering",
                subjects: [
                  "Social Science & Engineering Economics",
                  "Computer Graphics",
                  "Cloud Computing",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Information Technology",
                subjects: [
                  "Mobile Computing",
                  "Embedded Systems",
                  "Cloud Computing",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Artificial Intelligence & Data Science",
                subjects: [
                  "Social Science & Engineering Economics",
                  "Deep Learning",
                  "Big Data Analytics & Hadoop",
                  "Blockchian With Al",
                  "Multiple Electives",
                ],
              },
            ],
          },
          {
            semester_number: "Semester_VIII",
            branches: [
              {
                branch_name: "Civil Engineering",
                subjects: [
                  "Construction Project Management",
                  "Construction Economics & Estimating - Costing",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Mechanical Engineering",
                subjects: [
                  "Operation Research Techniques",
                  "I.C. Engines",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Electrical Engineering",
                subjects: [
                  "Embedded Systems",
                  "Power Systems Protection",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Electronics & Telecommunication Engineering",
                subjects: [
                  "Embedded Systems",
                  "Microwave Theory and Techniques",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Computer Science and Engineering",
                subjects: [
                  "Object Oriented Analysis & Design",
                  "Professional Ethics & Management",
                  "Multiple Electives",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Information Technology",
                subjects: [
                  "Object Oriented Analysis & Design",
                  "Professional Ethics & Management",
                  "Entrepreneurship & Project Management",
                  "Multiple Electives",
                ],
              },
              {
                branch_name: "Artificial Intelligence & Data Science",
                subjects: [
                  "Data Modeling & Visualization",
                  "Ethics in Data Science",
                  "Cognitive Technology",
                  "Electives: Virtual & Augmented Reality",
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  // Helper to sanitize select option values (replace spaces with underscores)
  const sanitizeValue = (str: string) =>
    str
      .trim()
      .replace(/\s+/g, "_")
      .replace(/^_+|_+$/g, "");

  // Helper functions to get data based on selections
  const getAvailablePrograms = () => {
    return examData.programs;
  };

  const getAvailableSemesters = () => {
    if (!program) return [];
    const selectedProgram = examData.programs.find(
      (p) => p.program_name === program
    );
    return selectedProgram ? selectedProgram.semesters : [];
  };

  const getAvailableBranches = () => {
    if (!program || !semester) return [];
    const selectedProgram = examData.programs.find(
      (p) => p.program_name === program
    );
    if (!selectedProgram) return [];
    const selectedSemester = selectedProgram.semesters.find(
      (s) => s.semester_number === semester
    );
    return selectedSemester ? selectedSemester.branches : [];
  };

  const getAvailableSubjects = () => {
    if (!program || !semester || !branch) return [];
    const selectedProgram = examData.programs.find(
      (p) => p.program_name === program
    );
    if (!selectedProgram) return [];
    const selectedSemester = selectedProgram.semesters.find(
      (s) => s.semester_number === semester
    );
    if (!selectedSemester) return [];
    const selectedBranch = selectedSemester.branches.find(
      (b) => sanitizeValue(b.branch_name) === branch
    );
    return selectedBranch ? selectedBranch.subjects : [];
  };

  const handleUpload = async () => {
    if (uploading) return;
    if (uploadCode) {
      const baseFieldsFilled = semester && branch && subject && paperType;
      const solveFieldsFilled =
        paperType !== "solve-question-paper" || (solveType && unitOrYear);

      if (baseFieldsFilled && solveFieldsFilled) {
        setUploading(true);
        // Prepare data for API
        const data = {
          code: uploadCode,
          metadata: {
            semester,
            branch,
            subject,
            paperType,
            solveType,
            unitOrYear,
          },
        };
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("API error");

          toast.success(
            "Information submitted successfully! +10 points added."
          );
          setUploadCode("");
          setSemester("");
          setBranch("");
          setSubject("");
          setPaperType("");
          setSolveType("");
          setUnitOrYear("");
        } catch (err) {
          toast.error("Failed to submit. Please try again.");
        } finally {
          setUploading(false);
        }
      } else {
        toast.error("Please fill all required fields.");
      }
    } else {
      toast.error("Invalid upload code. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-semibold text-white mb-2">
          Contribute Files
        </h2>
        <p className="text-gray-400">Upload PDFs and earn 10 points per file</p>
      </div>

      {/* 2-Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - How it Works Section */}
        <div>
          <HowItWorksSection />
        </div>

        {/* Right Column - Upload Form */}
        <div>
          <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto w-full">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Code
                </label>
                <Input
                  placeholder="Enter upload code"
                  value={uploadCode}
                  onChange={(e) => setUploadCode(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use code: UPLOAD123 (demo)
                </p>
              </div>

              {/* First Row - Responsive Grid for Semester and Branch */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Semester Select - Smaller width since content is short */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Semester
                  </label>
                  <Select
                    value={semester}
                    onValueChange={(value) => {
                      setSemester(value);
                      setBranch("");
                      setSubject("");
                    }}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white [&[data-state=open]]:border-blue-500">
                      <SelectValue placeholder="Select semester">
                        <span className="truncate">
                          {semester ? `${semester}` : "Select semester"}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-600 text-white max-w-[200px]">
                      {getAvailableSemesters().map((s) => (
                        <SelectItem
                          key={s.semester_number}
                          value={s.semester_number}
                          className="text-white hover:bg-gray-800 focus:bg-gray-800"
                        >
                          <span className="truncate">
                            {s.semester_number.replace(/_/g, " ")}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch Select - Larger width for longer branch names */}
                <div className="md:col-span-9">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Branch
                  </label>
                  <Select
                    value={branch}
                    onValueChange={(value) => {
                      setBranch(value);
                      setSubject("");
                    }}
                  >
                    <SelectTrigger
                      className="bg-gray-900 border-gray-600 text-white [&[data-state=open]]:border-blue-500"
                      disabled={!semester}
                    >
                      <SelectValue placeholder="Select branch">
                        <span className="truncate">
                          {branch || "Select branch"}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-600 text-white max-w-[500px]">
                      {getAvailableBranches().map((b) => {
                        const value = sanitizeValue(b.branch_name);
                        return (
                          <SelectItem
                            key={b.branch_name}
                            value={value}
                            className="text-white hover:bg-gray-800 focus:bg-gray-800"
                          >
                            <span className="truncate" title={b.branch_name}>
                              {b.branch_name}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject Row */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger
                      className="bg-gray-900 border-gray-600 text-white [&[data-state=open]]:border-blue-500"
                      disabled={!branch}
                    >
                      <SelectValue placeholder="Select subject">
                        <span className="truncate">
                          {(() => {
                            if (!subject) return "Select subject";
                            const original = getAvailableSubjects().find(
                              (s) => sanitizeValue(s) === subject
                            );
                            return original || subject;
                          })()}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-600 text-white max-w-[600px]">
                      {getAvailableSubjects().map((s, index) => {
                        const value = sanitizeValue(s);
                        return (
                          <SelectItem
                            key={`${s}-${index}`}
                            value={value}
                            className="text-white hover:bg-gray-800 focus:bg-gray-800"
                          >
                            <span className="truncate" title={s}>
                              {s}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Paper Type Row (separate to avoid overlap) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paper Type
                </label>
                <Select
                  value={paperType}
                  onValueChange={(value) => {
                    setPaperType(value);
                    setSolveType("");
                    setUnitOrYear("");
                  }}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white [&[data-state=open]]:border-blue-500 max-w-xs">
                    <SelectValue
                      placeholder="Select paper type"
                      className="text-white"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-600 text-white max-w-[250px]">
                    <SelectItem
                      value="syllabus"
                      className="text-white hover:bg-gray-800 focus:bg-gray-100"
                    >
                      <span className="truncate">Syllabus</span>
                    </SelectItem>
                    <SelectItem
                      value="question-paper"
                      className="text-white hover:bg-gray-800 focus:bg-gray-100"
                    >
                      <span className="truncate">Question Paper</span>
                    </SelectItem>
                    <SelectItem
                      value="solve-question-paper"
                      className="text-white hover:bg-gray-800 focus:bg-gray-100"
                    >
                      <span className="truncate">Solve Question Paper</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional fields for Solve Question Paper */}
              {paperType === "solve-question-paper" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Solve By
                    </label>
                    <Select
                      value={solveType}
                      onValueChange={(value) => {
                        setSolveType(value);
                        setUnitOrYear("");
                      }}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-600 text-white [&[data-state=open]]:border-blue-500">
                        <SelectValue
                          placeholder="Select solve type"
                          className="text-white"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-600 text-white max-w-[200px]">
                        <SelectItem
                          value="by-units"
                          className="text-white hover:bg-gray-800 focus:bg-gray-100"
                        >
                          <span className="truncate">By Units</span>
                        </SelectItem>
                        <SelectItem
                          value="by-year"
                          className="text-white hover:bg-gray-800 focus:bg-gray-100"
                        >
                          <span className="truncate">By Year</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {solveType === "by-units" && (
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Unit
                      </label>
                      <Select value={unitOrYear} onValueChange={setUnitOrYear}>
                        <SelectTrigger className="bg-gray-900 border-gray-600 text-white [&[data-state=open]]:border-blue-500">
                          <SelectValue
                            placeholder="Select unit"
                            className="text-white"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-600 text-white max-w-[150px]">
                          <SelectItem
                            value="unit-1"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Unit 1</span>
                          </SelectItem>
                          <SelectItem
                            value="unit-2"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Unit 2</span>
                          </SelectItem>
                          <SelectItem
                            value="unit-3"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Unit 3</span>
                          </SelectItem>
                          <SelectItem
                            value="unit-4"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Unit 4</span>
                          </SelectItem>
                          <SelectItem
                            value="unit-5"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Unit 5</span>
                          </SelectItem>
                          <SelectItem
                            value="unit-6"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Unit 6</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {solveType === "by-year" && (
                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Year
                      </label>
                      <Select value={unitOrYear} onValueChange={setUnitOrYear}>
                        <SelectTrigger className="bg-gray-900 border-gray-600 text-white [&[data-state=open]]:border-blue-500">
                          <SelectValue
                            placeholder="Select year"
                            className="text-white"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-600 text-white max-w-[200px]">
                          <SelectItem
                            value="summer-22"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Summer 2022</span>
                          </SelectItem>
                          <SelectItem
                            value="winter-22"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Winter 2022</span>
                          </SelectItem>
                          <SelectItem
                            value="summer-23"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Summer 2023</span>
                          </SelectItem>
                          <SelectItem
                            value="winter-23"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Winter 2023</span>
                          </SelectItem>
                          <SelectItem
                            value="summer-24"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Summer 2024</span>
                          </SelectItem>
                          <SelectItem
                            value="winter-24"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Winter 2024</span>
                          </SelectItem>
                          <SelectItem
                            value="summer-25"
                            className="text-white hover:bg-gray-800 focus:bg-gray-100"
                          >
                            <span className="truncate">Summer 2025</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleUpload}
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                disabled={uploading}
              >
                {uploading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-blue-500 rounded-full animate-spin" />
                ) : null}
                {uploading ? "Uploading..." : "Submit Information (+10 points)"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
