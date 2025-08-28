"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { mockFileSystem } from "@/lib/mock-data";
import { useUser } from "@clerk/nextjs";
import { EditIcon } from "lucide-react";

export default function ProfileSettingsPage() {
  const { user } = useUser();

  const [viewMode, setViewMode] = useState("grid");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    courseType: "",
    course: "",
    session: "",
    resultType: "",
    rollNumber: "",
    semester: "",
    profilePic: "",
  });
  const [editAcademic, setEditAcademic] = useState(false);

  React.useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone:
          typeof user.primaryPhoneNumber === "string"
            ? user.primaryPhoneNumber
            : user.primaryPhoneNumber?.phoneNumber || "",
        courseType: "",
        course: "",
        session: "",
        resultType: "",
        rollNumber: "",
        semester: "",
        profilePic: user.imageUrl || "",
      });
    }
  }, [user]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  function handleSaveAcademic(e: React.FormEvent) {
    e.preventDefault();
    setEditAcademic(false);
    setProfile((prev) => ({ ...prev, ...profile }));

    try {
      fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          courseType: profile.courseType,
          course: profile.course,
          session: profile.session,
          resultType: profile.resultType,
          rollNumber: profile.rollNumber,
          semester: profile.semester,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Profile updated:", data);
        });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  return (
    <div className="p-6">
      <div className="w-full max-w-5xl mx-auto relative">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Profile & Settings
        </h2>
        <Card className="bg-gray-800 border-gray-700 w-full shadow-xl relative">
          <CardContent className="p-10">
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-center">
                <div className="flex flex-col items-center md:col-span-1">
                  <div className="mb-2">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-3xl border-2 border-gray-600">
                        <span>{profile.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Name
                    </label>
                    <div className="text-lg text-white w-full font-semibold">
                      {profile.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Email
                    </label>
                    <div className="text-sm text-white w-full">
                      {profile.email || (
                        <span className="text-gray-500">Not provided</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Phone
                    </label>
                    <div className="text-sm text-white w-full">
                      {profile.phone || (
                        <span className="text-gray-500">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Section */}
              <div className="border-t border-gray-700 pt-8">
                <div className="flex items-center mb-6">
                  <h3 className="text-xl font-semibold text-white mr-2">
                    Academic Details
                  </h3>
                  <button
                    type="button"
                    className={`ml-2 text-gray-400 hover:text-white transition ${
                      editAcademic ? "text-yellow-500" : ""
                    }`}
                    aria-label="Edit Academic Details"
                    onClick={() => setEditAcademic(true)}
                    disabled={editAcademic}
                  >
                    <EditIcon />
                  </button>
                </div>
                <form onSubmit={handleSaveAcademic}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Session <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="session"
                        value={profile.session}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 border ${
                          editAcademic
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                        required
                        disabled={!editAcademic}
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
                        name="courseType"
                        value={profile.courseType}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 border ${
                          editAcademic
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                        required
                        disabled={!editAcademic}
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
                        name="course"
                        value={profile.course}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 border ${
                          editAcademic
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                        required
                        disabled={!editAcademic}
                      >
                        <option value="">Select Course</option>
                        <option value="C000058">
                          Bachelor of Architecture (CGS) ( B.Arch )
                        </option>
                        <option value="C000087">
                          B.COM.(ACCOUNTING &amp; FINANCE) NEP (
                          B.COM(Acc&amp;Fin) )
                        </option>
                        <option value="C000266">
                          B.E in ARTIFICIAL INTELLIGENCE AND DATA SCIENCES
                          (CBCS) ( B.E.(AI&amp;DS) )
                        </option>
                        <option value="C000045">
                          B.E in CHEMICAL ENGINEERING (CGS) ( B.E.(Chem. Engg) )
                        </option>
                        <option value="C000032">
                          B.E in COMPUTER SCIENCE &amp; ENGINEERING (CGS) (
                          B.E.(CSE) )
                        </option>
                        <option value="C000037">
                          B.E in ELECTRONICS &amp; TELECOMMUNICATION ENGG.
                          (NEW)(CGS) ( B.E.(ETC) )
                        </option>
                        <option value="C000015">
                          B.SC.HOME SCIENCE NEP ( B.H.Sc. )
                        </option>
                        <option value="C000055">
                          B.Tech Chemical Technology in PetroChemical Technology
                          NEP ( B.Tech(Chem. Tech.(Petro. Chem.)) )
                        </option>
                        <option value="C000012">
                          BACHELOR OF COMPUTER APPLICATION NEP ( BCA )
                        </option>
                        <option value="C000317">
                          B.E in COMPUTER SCIENCE &amp; ENGINEERING ( DATA
                          SCIENCE ) ( BE IN ( CSE ) DATA SCIENCE )
                        </option>
                        <option value="C000314">
                          (BE in IOT) B.E in Internet Of Things ( BE in IOT )
                        </option>
                        <option value="C000014">
                          (BFD) B.SC.(HOME SCIENCE)(FASHION DESIGNING)CBCS ( BFD
                          )
                        </option>
                        <option value="C000115">
                          BACHELOR OF PHARMACY ( Bpharm )
                        </option>
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
                          B. VOC. (ACCOUNTING &amp; TAXATION) SEM-I (CGS) NEW
                          (FAC OF INTER-DISCIPLINARY) ( Acc&amp;Tax )
                        </option>
                        <option value="C000144">
                          B. VOC. (AUTOMOBILES)SEMESTER-I (CGS NEW) (FACULTY OF
                          INTER-DISCIPLINARY) ( B. VOC. (AUTO.) )
                        </option>
                        <option value="C000146">
                          B. VOC. (COSMETIC TECHNOLOGY)SEMESTER-I (CGS NEW)
                          (FACULTY OF INTER-DISCIPLINARY) ( B. VOC. (COSMETIC
                          TECH.) )
                        </option>
                        <option value="C000150">
                          B. VOC. (FASHION TECH. &amp; APPAREL
                          DESIGNING)SEMESTER-I (CGS NEW) (FACULTY OF
                          INTER-DISCIPLINARY) ( B. VOC. (FASHION TECH. &amp;
                          APP. DESGN.) )
                        </option>
                        <option value="C000153">
                          B. VOC. (FORENSIC SCIENCE)SEMESTER-I (CGS NEW)
                          (FACULTY OF INTER-DISCIPLINARY) ( B. VOC. (FORSC. SC)
                          )
                        </option>
                        <option value="C000256">
                          B. VOC. (IT / ITES / CYBER SECURITY)SEMESTER-I (CGS
                          NEW) (FACULTY OF INTER-DISCIPLINARY) ( B. VOC.(CYBER)
                          )
                        </option>
                        <option value="C000157">
                          B. VOC. (MEDI. EQUIPMENT TECH. &amp; MNGT.)SEMESTER-I
                          (CGS NEW) (FACULTY OF INTER-DISCIPLINARY) ( B. VOC.
                          (MEDI. EQUIP. TECH. &amp; MNGT.) )
                        </option>
                        <option value="C000166">
                          B. VOC. (PHOTOGRAPHY &amp; VIDEOGRAPHY)SEMESTER-I (CGS
                          NEW) (FACULTY OF INTER-DISCIPLINARY) ( B. VOC. (PHOTO.
                          &amp; VIDEO.) )
                        </option>
                        <option value="C000164">
                          B. VOC. (VEHICLE TESTING)SEMESTER-I (CGS NEW) (FACULTY
                          OF INTER-DISCIPLINARY) ( B. VOC. (VEH. TEST.) )
                        </option>
                        <option value="C000048">
                          B.E First Year (NEP) ( B.E.(First Year) )
                        </option>
                        <option value="C000029">
                          B.E in (B.SC HOLDER) ( B.E.(B.SC HOLDER) )
                        </option>
                        <option value="C000030">
                          B.E in BIOMEDICAL ENGINEERING(CGS) ( B.E.(BIOMEDICAL
                          ENGG) )
                        </option>
                        <option value="C000031">
                          B.E in CIVIL ENGINEERING (CGS) ( B.E.(CIVIL ENGG) )
                        </option>
                        <option value="C000027">
                          B.E in COMPUTER ENGINEERING (CGS) ( B.E.(Comp.Engg) )
                        </option>
                        <option value="C000033">
                          B.E in ELECTRICAL &amp; ELECTRONICS ENGINEERING (CGS)
                          ( B.E.(EEE) )
                        </option>
                        <option value="C000034">
                          B.E in ELECTRICAL ENGINEERING (CGS) ( B.E.(EE) )
                        </option>
                        <option value="C000043">
                          B.E in ELECTRONICS &amp; POWER (CGS) ( B.E.(Elec.
                          Pow.) )
                        </option>
                        <option value="C000038">
                          B.E in ELECTRONICS ENGINEERING (CGS) ( B.E.(EC&amp;E)
                          )
                        </option>
                        <option value="C000039">
                          B.E in INFORMATION TECHNOLOGY (CGS) ( B.E.(IT) )
                        </option>
                        <option value="C000040">
                          B.E in INSTRUMENTATION ENGINEERING (CGS) ( B.E.(Instr.
                          Engg) )
                        </option>
                        <option value="C000041">
                          B.E in MECHANICAL ENGINEERING (CGS) ( B.E.(ME) )
                        </option>
                        <option value="C000042">
                          B.E in PRODUCTION ENGINEERING (CGS) ( B.E.(Prod. Engg)
                          )
                        </option>
                        <option value="C000050">
                          B.Tech Chemical Technology First Year NEP (
                          B.Tech(Chem. Tech.(All)) )
                        </option>
                        <option value="C000053">
                          B.Tech Chemical Technology in Food Technology NEP (
                          B.Tech(Chem. Tech.(Food)) )
                        </option>
                        <option value="C000054">
                          B.Tech Chemical Technology in Oil &amp; Paint
                          Technology NEP ( B.Tech(Chem. Tech.(Oil &amp; Paint))
                          )
                        </option>
                        <option value="C000051">
                          B.Tech Chemical Technology in Polymer Plastic Group A
                          ( B.Tech(Chem. Tech.(Polymer)(Group-A)) )
                        </option>
                        <option value="C000056">
                          B.Tech Chemical Technology in Pulp &amp;
                          PaperTechnology NEP ( B.Tech(Chem. Tech.(Pulp&amp;
                          Paper)) )
                        </option>
                        <option value="C000013">
                          B.TECH.(COSMETICS)NEP ( BTECH.COS )
                        </option>
                        <option value="C000001">
                          Bachelor of Arts(B.A.) ( BA )
                        </option>
                        <option value="C000007">
                          BACHELOR OF ARTS IN SOCIAL WORK CBCS ( BASW )
                        </option>
                        <option value="C000008">
                          BACHELOR OF ARTS JOURNALISM &amp; MASS COMMUNICATION
                          NEP ( BAJMC )
                        </option>
                        <option value="C000009">
                          BACHELOR OF BUSINESS ADMINISTRATION (Semester
                          Pattern)CBCS ( BBA )
                        </option>
                        <option value="C000003">
                          Bachelor Of Commerce (Semester Pattern)CGS ( BCOM )
                        </option>
                        <option value="C000353">
                          BACHELOR OF COUNSELLING AND PSYCHOTHERAPY ( Bachelor
                          of Counselling and Psychotherapy )
                        </option>
                        <option value="C000204">
                          BACHELOR OF EDUCATION ( BED )
                        </option>
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
                          Bachelor of Physical Education and Sports CBCS (
                          B.P.E.S. )
                        </option>
                        <option value="C000002">
                          Bachelor Of Science (Semester Pattern)CGS ( BSC )
                        </option>
                        <option value="C000348">
                          BACHELOR OF SCIENCE (DATA SCIENCE AND ANALYTICS) (
                          BSC(DATA SCIENCE AND ANALYTICS) )
                        </option>
                        <option value="C000347">
                          BACHELOR OF SCIENCE(CYBER SECURITY) ( BSC(CYBER
                          SECURITY) )
                        </option>
                        <option value="C000011">
                          BACHELOR OF SOCIAL WORK CBCS ( BSW )
                        </option>
                        <option value="C000057">
                          Bachelor of Textile Engineering (CGS) (
                          B.Tech(Textile) )
                        </option>
                        <option value="C000331">
                          BCOM (in BUSINESS INFORMATION SYSTEM) ( BCOM (in BUSI.
                          INFO. SYS.) )
                        </option>
                        <option value="C000330">
                          BCOM( Bachelor in Management and entrepreneurship
                          Development) ( BCOM (in Mgmt and entre. Dev.) )
                        </option>
                        <option value="C000025">
                          Chemical Processing ( CHP )
                        </option>
                        <option value="C000020">
                          Desk Top Publishing ( DTP )
                        </option>
                        <option value="C000345">
                          DIPLOMA IN APPLIED COMPUTER TECHNOLOGY ( DIPLOMA IN
                          APPLIED COMPUTER TECHNOLOGY )
                        </option>
                        <option value="C000346">
                          DIPLOMA IN CYBER SECURITY NEP ( DIPLOMA IN CYBER
                          SECURITY )
                        </option>
                        <option value="C000349">
                          DIPLOMA IN DISASTER MANAGEMENT ( DIP(DISA MGMT) )
                        </option>
                        <option value="C000326">
                          Diploma IN Tourisn AND Heritage Management ( Diploma
                          In Tourism &amp; Heritage Mgmt. )
                        </option>
                        <option value="C000018">
                          Food and Beverage Service ( FBS )
                        </option>
                        <option value="C000019">House Keeping ( HKP )</option>
                        <option value="C000016">
                          Retail Sales Associate ( RSA )
                        </option>
                        <option value="C000026">Soil Testing ( STG )</option>
                        <option value="C000021">Tally ( TAL )</option>
                        <option value="C000024">
                          Textile Spinning ( TSG )
                        </option>
                        <option value="C000022">Textile Weaving ( TWG )</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Result Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="resultType"
                        value={profile.resultType}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 border ${
                          editAcademic
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                        required
                        disabled={!editAcademic}
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
                      <input
                        name="rollNumber"
                        value={profile.rollNumber}
                        onChange={handleChange}
                        placeholder="Roll No"
                        className={`w-full rounded-md px-3 py-2 border ${
                          editAcademic
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                        required
                        disabled={!editAcademic}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Semester <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="semester"
                        value={profile.semester}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 border ${
                          editAcademic
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                        required
                        disabled={!editAcademic}
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
                  </div>
                  {/* Save button only in edit mode */}
                  {editAcademic && (
                    <div className="flex justify-end mt-8">
                      <button
                        type="submit"
                        className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-white font-semibold px-6 py-2 rounded-md shadow transition disabled:opacity-50 border border-gray-600"
                        aria-label="Save"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Preferences Section */}
              <div className="border-t border-gray-700 pt-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Preferences
                </h3>
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
                    className="bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-sm text-white"
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                  </select>
                </div>
              </div>

              {/* Storage Info Section */}
              <div className="border-t border-gray-700 pt-8">
                <h3 className="text-xl font-semibold text-white mb-6">
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

              {/* About Section */}
              <div className="border-t border-gray-700 pt-8">
                <h3 className="text-xl font-semibold text-white mb-6">About</h3>
                <p className="text-sm text-gray-400">
                  PDF Library v1.0.0 - A modern file management system for PDFs
                </p>
              </div>
              {/* Bottom right edit icon */}
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-white font-semibold px-6 py-2 rounded-md shadow transition disabled:opacity-50 border border-gray-600"
                  aria-label="Save"
                >
                  Save
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
