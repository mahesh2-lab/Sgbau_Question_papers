"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy } from "lucide-react";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";
import useProfile from "@/lib/useGetProfile";

type Profile = {
  rollNumber?: string;
  courseType?: string;
  course?: string;
  semester?: string;
  resultType?: string;
  session?: string;
};
export default function ResultPage() {
  const {
    profile,
    loading: loading2,
    error: error2,
  } = useProfile() as { profile: Profile | null; loading: boolean; error: any };
  const [form, setForm] = useState({
    rollNumber: "",
    courseType: "",
    course: "",
    semester: "",
    resultType: "",
    session: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckResult = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: form.rollNumber,
          courseType: form.courseType,
          course: form.course,
          semester: form.semester,
          resultType: form.resultType,
          session: form.session,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch result. Please check your details.");
      }
      const data = await response.json();

      if (data.html) {
        setResult(data.html);
      } else {
        setError(data.error || "Result not found.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-none text-gray-200 h-full flex flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border border-yellow-500/40">
          <Trophy className="w-6 h-6 text-yellow-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Check Your Result
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Enter your details to view your exam result instantly.
          </p>
        </div>
      </div>
      <Card className="bg-gray-900 border-gray-800 mb-6 w-full">
        <CardContent className="p-6">
          <form
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckResult();
            }}
          >
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Session <span className="text-red-500">*</span>
              </label>
              <select
                value={form.session}
                onChange={(e) => setForm({ ...form, session: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                required
              >
                <option value="">Select Session</option>
                <option value="SE08">Summer 2018</option>
                <option value="SE09">Winter 2018</option>
                <option value="SE10">Summer 2019</option>
                <option value="SE11">Winter 2019</option>
                <option value="SE12">Summer 2020</option>
                <option value="SE13">Winter 2020</option>
                <option value="SE14">Summer 2021</option>
                <option value="SE15">Winter 2021</option>
                <option value="SE16">Summer 2022</option>
                <option value="SE17">Winter 2022</option>
                <option value="SE18">Summer 2023</option>
                <option value="SE19">Winter 2023</option>
                <option value="SE20">Summer 2024</option>
                <option value="SE21">Winter 2024</option>
                <option value="SE22">Summer 2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Course Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.courseType}
                onChange={(e) =>
                  setForm({ ...form, courseType: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                required
              >
                <option value="">Select Course Type</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="PHD">PHD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                required
              >
                <option value="">Select Course</option>
                <option value="C000058">
                  Bachelor of Architecture (CGS) ( B.Arch )
                </option>
                <option value="C000087">
                  B.COM.(ACCOUNTING &amp; FINANCE) NEP ( B.COM(Acc&amp;Fin) )
                </option>
                <option value="C000266">
                  B.E in ARTIFICIAL INTELLIGENCE AND DATA SCIENCES (CBCS) (
                  B.E.(AI&amp;DS) )
                </option>
                <option value="C000045">
                  B.E in CHEMICAL ENGINEERING (CGS) ( B.E.(Chem. Engg) )
                </option>
                <option value="C000032">
                  B.E in COMPUTER SCIENCE &amp; ENGINEERING (CGS) ( B.E.(CSE) )
                </option>
                <option value="C000037">
                  B.E in ELECTRONICS &amp; TELECOMMUNICATION ENGG. (NEW)(CGS) (
                  B.E.(ETC) )
                </option>
                <option value="C000015">
                  B.SC.HOME SCIENCE NEP ( B.H.Sc. )
                </option>
                <option value="C000055">
                  B.Tech Chemical Technology in PetroChemical Technology NEP (
                  B.Tech(Chem. Tech.(Petro. Chem.)) )
                </option>
                <option value="C000012">
                  BACHELOR OF COMPUTER APPLICATION NEP ( BCA )
                </option>
                <option value="C000317">
                  B.E in COMPUTER SCIENCE &amp; ENGINEERING ( DATA SCIENCE ) (
                  BE IN ( CSE ) DATA SCIENCE )
                </option>
                <option value="C000314">
                  (BE in IOT) B.E in Internet Of Things ( BE in IOT )
                </option>
                <option value="C000014">
                  (BFD) B.SC.(HOME SCIENCE)(FASHION DESIGNING)CBCS ( BFD )
                </option>
                <option value="C000115">BACHELOR OF PHARMACY ( Bpharm )</option>
                <option value="C000211">
                  BACHELOR OF SCIENCE ( ANIMATION ) ( BSC( Animation ) )
                </option>
                <option value="C000267">
                  (DYED) DIPLOMA IN YOGA EDUCATION ( DYED )
                </option>
                <option value="C000215">
                  BACHELOR OF LEGISLATIVE LAW (L.L.B - 3 YEARS) ( LLB3 )
                </option>
                <option value="C000005">LL.B(5 YEARS) ( LLB5 )</option>
                <option value="C000227">
                  (Pharm.D) DOCTOR OF PHARMACY ( Pharm.D )
                </option>
                <option value="C000232">
                  B. VOC. (ACCOUNTING &amp; TAXATION) SEM-I (CGS) NEW (FAC OF
                  INTER-DISCIPLINARY) ( Acc&amp;Tax )
                </option>
                <option value="C000144">
                  B. VOC. (AUTOMOBILES)SEMESTER-I (CGS NEW) (FACULTY OF
                  INTER-DISCIPLINARY) ( B. VOC. (AUTO.) )
                </option>
                <option value="C000146">
                  B. VOC. (COSMETIC TECHNOLOGY)SEMESTER-I (CGS NEW) (FACULTY OF
                  INTER-DISCIPLINARY) ( B. VOC. (COSMETIC TECH.) )
                </option>
                <option value="C000150">
                  B. VOC. (FASHION TECH. &amp; APPAREL DESIGNING)SEMESTER-I (CGS
                  NEW) (FACULTY OF INTER-DISCIPLINARY) ( B. VOC. (FASHION TECH.
                  &amp; APP. DESGN.) )
                </option>
                <option value="C000153">
                  B. VOC. (FORENSIC SCIENCE)SEMESTER-I (CGS NEW) (FACULTY OF
                  INTER-DISCIPLINARY) ( B. VOC. (FORSC. SC) )
                </option>
                <option value="C000256">
                  B. VOC. (IT / ITES / CYBER SECURITY)SEMESTER-I (CGS NEW)
                  (FACULTY OF INTER-DISCIPLINARY) ( B. VOC.(CYBER) )
                </option>
                <option value="C000157">
                  B. VOC. (MEDI. EQUIPMENT TECH. &amp; MNGT.)SEMESTER-I (CGS
                  NEW) (FACULTY OF INTER-DISCIPLINARY) ( B. VOC. (MEDI. EQUIP.
                  TECH. &amp; MNGT.) )
                </option>
                <option value="C000166">
                  B. VOC. (PHOTOGRAPHY &amp; VIDEOGRAPHY)SEMESTER-I (CGS NEW)
                  (FACULTY OF INTER-DISCIPLINARY) ( B. VOC. (PHOTO. &amp;
                  VIDEO.) )
                </option>
                <option value="C000164">
                  B. VOC. (VEHICLE TESTING)SEMESTER-I (CGS NEW) (FACULTY OF
                  INTER-DISCIPLINARY) ( B. VOC. (VEH. TEST.) )
                </option>
                <option value="C000048">
                  B.E First Year (NEP) ( B.E.(First Year) )
                </option>
                <option value="C000029">
                  B.E in (B.SC HOLDER) ( B.E.(B.SC HOLDER) )
                </option>
                <option value="C000030">
                  B.E in BIOMEDICAL ENGINEERING(CGS) ( B.E.(BIOMEDICAL ENGG) )
                </option>
                <option value="C000031">
                  B.E in CIVIL ENGINEERING (CGS) ( B.E.(CIVIL ENGG) )
                </option>
                <option value="C000027">
                  B.E in COMPUTER ENGINEERING (CGS) ( B.E.(Comp.Engg) )
                </option>
                <option value="C000033">
                  B.E in ELECTRICAL &amp; ELECTRONICS ENGINEERING (CGS) (
                  B.E.(EEE) )
                </option>
                <option value="C000034">
                  B.E in ELECTRICAL ENGINEERING (CGS) ( B.E.(EE) )
                </option>
                <option value="C000043">
                  B.E in ELECTRONICS &amp; POWER (CGS) ( B.E.(Elec. Pow.) )
                </option>
                <option value="C000038">
                  B.E in ELECTRONICS ENGINEERING (CGS) ( B.E.(EC&amp;E) )
                </option>
                <option value="C000039">
                  B.E in INFORMATION TECHNOLOGY (CGS) ( B.E.(IT) )
                </option>
                <option value="C000040">
                  B.E in INSTRUMENTATION ENGINEERING (CGS) ( B.E.(Instr. Engg) )
                </option>
                <option value="C000041">
                  B.E in MECHANICAL ENGINEERING (CGS) ( B.E.(ME) )
                </option>
                <option value="C000042">
                  B.E in PRODUCTION ENGINEERING (CGS) ( B.E.(Prod. Engg) )
                </option>
                <option value="C000050">
                  B.Tech Chemical Technology First Year NEP ( B.Tech(Chem.
                  Tech.(All)) )
                </option>
                <option value="C000053">
                  B.Tech Chemical Technology in Food Technology NEP (
                  B.Tech(Chem. Tech.(Food)) )
                </option>
                <option value="C000054">
                  B.Tech Chemical Technology in Oil &amp; Paint Technology NEP (
                  B.Tech(Chem. Tech.(Oil &amp; Paint)) )
                </option>
                <option value="C000051">
                  B.Tech Chemical Technology in Polymer Plastic Group A (
                  B.Tech(Chem. Tech.(Polymer)(Group-A)) )
                </option>
                <option value="C000056">
                  B.Tech Chemical Technology in Pulp &amp; PaperTechnology NEP (
                  B.Tech(Chem. Tech.(Pulp&amp; Paper)) )
                </option>
                <option value="C000013">
                  B.TECH.(COSMETICS)NEP ( BTECH.COS )
                </option>
                <option value="C000001">Bachelor of Arts(B.A.) ( BA )</option>
                <option value="C000007">
                  BACHELOR OF ARTS IN SOCIAL WORK CBCS ( BASW )
                </option>
                <option value="C000008">
                  BACHELOR OF ARTS JOURNALISM &amp; MASS COMMUNICATION NEP (
                  BAJMC )
                </option>
                <option value="C000009">
                  BACHELOR OF BUSINESS ADMINISTRATION (Semester Pattern)CBCS (
                  BBA )
                </option>
                <option value="C000003">
                  Bachelor Of Commerce (Semester Pattern)CGS ( BCOM )
                </option>
                <option value="C000353">
                  BACHELOR OF COUNSELLING AND PSYCHOTHERAPY ( Bachelor of
                  Counselling and Psychotherapy )
                </option>
                <option value="C000204">BACHELOR OF EDUCATION ( BED )</option>
                <option value="C000182">
                  BACHELOR OF LIBRARY AND INFORMATION SCIENCE ( B.LIB )
                </option>
                <option value="C000010">
                  BACHELOR OF PERFORMING ARTS NEP ( BPA )
                </option>
                <option value="C000202">
                  BACHELOR OF PHYSICAL EDUCATION ( BPED )
                </option>
                <option value="C000006">
                  Bachelor of Physical Education and Sports CBCS ( B.P.E.S. )
                </option>
                <option value="C000002">
                  Bachelor Of Science (Semester Pattern)CGS ( BSC )
                </option>
                <option value="C000348">
                  BACHELOR OF SCIENCE (DATA SCIENCE AND ANALYTICS) ( BSC(DATA
                  SCIENCE AND ANALYTICS) )
                </option>
                <option value="C000347">
                  BACHELOR OF SCIENCE(CYBER SECURITY) ( BSC(CYBER SECURITY) )
                </option>
                <option value="C000011">
                  BACHELOR OF SOCIAL WORK CBCS ( BSW )
                </option>
                <option value="C000057">
                  Bachelor of Textile Engineering (CGS) ( B.Tech(Textile) )
                </option>
                <option value="C000331">
                  BCOM (in BUSINESS INFORMATION SYSTEM) ( BCOM (in BUSI. INFO.
                  SYS.) )
                </option>
                <option value="C000330">
                  BCOM( Bachelor in Management and entrepreneurship Development)
                  ( BCOM (in Mgmt and entre. Dev.) )
                </option>
                <option value="C000025">Chemical Processing ( CHP )</option>
                <option value="C000020">Desk Top Publishing ( DTP )</option>
                <option value="C000345">
                  DIPLOMA IN APPLIED COMPUTER TECHNOLOGY ( DIPLOMA IN APPLIED
                  COMPUTER TECHNOLOGY )
                </option>
                <option value="C000346">
                  DIPLOMA IN CYBER SECURITY NEP ( DIPLOMA IN CYBER SECURITY )
                </option>
                <option value="C000349">
                  DIPLOMA IN DISASTER MANAGEMENT ( DIP(DISA MGMT) )
                </option>
                <option value="C000326">
                  Diploma IN Tourisn AND Heritage Management ( Diploma In
                  Tourism &amp; Heritage Mgmt. )
                </option>
                <option value="C000018">
                  Food and Beverage Service ( FBS )
                </option>
                <option value="C000019">House Keeping ( HKP )</option>
                <option value="C000016">Retail Sales Associate ( RSA )</option>
                <option value="C000026">Soil Testing ( STG )</option>
                <option value="C000021">Tally ( TAL )</option>
                <option value="C000024">Textile Spinning ( TSG )</option>
                <option value="C000022">Textile Weaving ( TWG )</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Result Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.resultType}
                onChange={(e) =>
                  setForm({ ...form, resultType: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                required
              >
                <option value="">Select Result Type</option>
                <option value="R">Regular</option>
                <option value="B">Back</option>
                <option value="RV">Reval</option>
                <option value="EV">EVS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Roll No <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.rollNumber}
                onChange={(e) =>
                  setForm({ ...form, rollNumber: e.target.value })
                }
                placeholder="Roll No"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                required
              >
                <option value="">Select Semester</option>
                <option value="MN01">Quaterly ( 3RD Month)</option>
                <option value="SM01">First Semester ( Sem - 1)</option>
                <option value="SM02">Second Semester ( Sem - 2)</option>
                <option value="SM03">Third Semester ( Sem - 3)</option>
                <option value="SM04">Fourth Semester ( Sem - 4)</option>
                <option value="SM05">Fifth Semester ( Sem - 5)</option>
                <option value="SM06">Six Semester ( Sem - 6)</option>
                <option value="SM07">Seven Semester ( Sem - 7)</option>
                <option value="SM08">Eight Semester ( Sem - 8)</option>
                <option value="SM09">Nine Semester ( Sem - 9)</option>
                <option value="SM10">Ten Semester ( Sem - 10)</option>
                <option value="SM17">First Year ( First Year)</option>
                <option value="SM18">Second Year ( Second Year)</option>
                <option value="SM19">Third Year ( Third Year)</option>
                <option value="SM20">Fourth Year ( 4th Year)</option>
                <option value="SM21">Fifth Year ( 5th Year)</option>
                <option value="SM22">Course Work ( Course work)</option>
              </select>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="existing-details"
                  id="existing-details"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({
                        rollNumber: profile?.rollNumber || "",
                        courseType: profile?.courseType || "",
                        course: profile?.course || "",
                        semester: profile?.semester || "",
                        resultType: profile?.resultType || "",
                        session: profile?.session || "",
                      });
                    } else {
                      setForm({
                        rollNumber: "",
                        courseType: "",
                        course: "",
                        semester: "",
                        resultType: "",
                        session: "",
                      });
                    }
                  }}
                />
                <label
                  htmlFor="existing-details"
                  className="ml-2 text-sm text-gray-400"
                >
                  Use existing details
                </label>
              </div>
            </div>
            <div className="flex items-end h-full">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white mt-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={30} />
                ) : (
                  "Check Result"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {result && !loading && (
        <div className="w-full flex justify-end mb-2 px-4 gap-2">
          <Button
            type="button"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
            onClick={() => {
              const iframe = document.getElementById(
                "result-iframe"
              ) as HTMLIFrameElement;
              if (iframe && iframe.contentWindow) {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
              }
            }}
          >
            Print Result
          </Button>
          <Button
            type="button"
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => {
              setForm({
                rollNumber: "",
                courseType: "",
                course: "",
                semester: "",
                resultType: "",
                session: "",
              });
              setResult(null);
              setError(null);
            }}
          >
            Clear
          </Button>
        </div>
      )}
      <div className="w-full min-h-[895px] max-h-[1080px] flex flex-col items-center justify-center border border-dashed border-gray-700 bg-gray-900/40 mb-4 overflow-auto">
        {loading ? (
          <div className="text-yellow-400 text-lg w-full text-center">
            <TailChase size="80" speed="1.75" color="white" />
          </div>
        ) : result ? (
          <iframe
            id="result-iframe"
            srcDoc={result}
            className="w-full h-full p-0 m-0 overflow-auto break-words flex justify-center items-center"
          />
        ) : error ? (
          <div className="text-red-300 font-semibold text-lg p-6 w-full text-center">
            {error}
          </div>
        ) : (
          <div className="text-gray-400 text-lg p-6 w-full text-center">
            Fill the form and check your result here.
          </div>
        )}
      </div>
    </div>
  );
}
